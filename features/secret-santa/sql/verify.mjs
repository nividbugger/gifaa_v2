// Runs up.sql / down.sql against an in-process Postgres (PGlite) and tries to break the secrecy rules
// as the organiser, an anonymous visitor and other users. Supabase's auth schema is stubbed.
//   npm i --no-save @electric-sql/pglite && node features/secret-santa/sql/verify.mjs
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const db = new PGlite();
const up = readFileSync(new URL("./up.sql", import.meta.url), "utf8");
const down = readFileSync(new URL("./down.sql", import.meta.url), "utf8");

// --- minimal Supabase stand-ins -------------------------------------------------------------
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.profiles (id uuid primary key, display_name text);
  grant usage on schema public, auth to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`);
const U1 = "11111111-1111-1111-1111-111111111111", U2 = "22222222-2222-2222-2222-222222222222";
await db.exec(`insert into auth.users values ('${U1}'), ('${U2}'); insert into public.profiles values ('${U1}', 'Olivia Organiser');`);
await db.exec(up);
console.log("up.sql applied cleanly");

// run a statement as a given role/user, then reset
async function as(role, uid, sql, params = []) {
  await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false);`);
  try { return await db.query(sql, params); } finally { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`); }
}
const fails = async (p, re, label) => { await assert.rejects(p, re, label); console.log("  ✓ blocked:", label); };
const ok = (label) => console.log("  ✓", label);

// --- organiser creates a group -----------------------------------------------------------------
const { rows: [g] } = await as("authenticated", U1, `insert into santa_groups (organizer_id, name, budget_amount) values ('${U1}', 'Family 2026', 1000) returning id, code`);
ok(`organiser created group (code ${g.code}, ${g.code.length} chars)`);
await fails(as("authenticated", U2, `insert into santa_groups (organizer_id, name) values ('${U1}', 'spoof')`), /row-level security/, "user cannot create a group on someone else's behalf");
assert.equal((await as("authenticated", U2, `select * from santa_groups`)).rows.length, 0); ok("other users can't see the group");

// --- joining -------------------------------------------------------------------------------------
const join = async (name, email, uid = null, role = "anon") =>
  (await as(role, uid, `select santa_join($1,$2,$3,null) as t`, [g.code, name, email])).rows[0].t;
const t = {};
t.olivia = await join("Olivia", "olivia@x.in", U1, "authenticated");
t.asha = await join("Asha", "asha@x.in");
t.ben = await join("Ben", "ben@x.in");
t.chen = await join("Chen", "chen@x.in");
ok("4 people joined without accounts (organiser signed in)");
await fails(join("Asha clone", "ASHA@x.in"), /already_joined/, "same email (any case) can't re-join to steal a personal link");
assert.equal(await join("Olivia again", "other@x.in", U1, "authenticated"), t.olivia); ok("signed-in organiser re-joining gets their own token back");
await fails(as("anon", null, `select santa_join('nope','a','a@b.co',null)`), /not_found/, "bad invite code");
await fails(as("anon", null, `select santa_join($1,'x','not-an-email',null)`, [g.code]), /check constraint/, "invalid email rejected");

// --- secrecy: what can each role read? ----------------------------------------------------------
const people = (await as("authenticated", U1, `select id, name, email from santa_participants order by created_at`)).rows;
assert.equal(people.length, 4); ok("organiser can list names & emails");
await fails(as("authenticated", U1, `select token from santa_participants`), /permission denied/, "organiser cannot read participant tokens");
await fails(as("authenticated", U1, `select * from santa_participants`), /permission denied/, "organiser cannot SELECT * (would include token)");
await fails(as("authenticated", U1, `select * from santa_assignments`), /permission denied/, "organiser cannot read assignments");
await fails(as("authenticated", U1, `select * from santa_wishes`), /permission denied/, "organiser cannot read wishes directly");
await fails(as("anon", null, `select * from santa_participants`), /permission denied/, "anonymous cannot read participants");
await fails(as("anon", null, `select * from santa_groups`), /row-level security|permission denied/, "anonymous cannot read groups");
assert.equal((await as("authenticated", U2, `select id from santa_participants`)).rows.length, 0); ok("a different signed-in user sees no participants");

// --- exclusions + wishes ------------------------------------------------------------------------
const id = Object.fromEntries(people.map((p) => [p.name, p.id]));
await as("authenticated", U1, `insert into santa_exclusions values ($1,$2,$3)`, [id.Asha, id.Ben, g.id]);
await fails(as("authenticated", U2, `insert into santa_exclusions values ($1,$2,$3)`, [id.Asha, id.Chen, g.id]), /row-level security/, "other users can't add exclusions");
for (let i = 0; i < 10; i++) await as("anon", null, `select santa_add_wish($1,$2)`, [t.ben, `Gift ${i}`]);
await fails(as("anon", null, `select santa_add_wish($1,'one too many')`, [t.ben]), /too_many_wishes/, "11th wish");
await fails(as("anon", null, `select santa_add_wish($1,'x','javascript:alert(1)')`, [t.asha]), /check constraint/, "non-http product link rejected");
await as("anon", null, `select santa_add_wish($1,'Teapot','https://shop.in/teapot',1299,null,'blue')`, [t.chen]);
ok("wishes added; limits and URL checks enforced");

// --- the draw (what the edge function does with the service role) -------------------------------
// service_role bypasses RLS; superuser here stands in for it.
const matches = [[id.Olivia, id.Asha], [id.Asha, id.Chen], [id.Chen, id.Ben], [id.Ben, id.Olivia]];
for (const [giver, receiver] of matches) await db.query(`insert into santa_assignments values ($1,$2,$3)`, [giver, receiver, g.id]);
await db.query(`update santa_groups set status='drawn', drawn_at=now() where id=$1`, [g.id]);

const viewOf = async (token) => (await as("anon", null, `select santa_view($1) as v`, [token])).rows[0].v;
const asha = await viewOf(t.asha);
assert.equal(asha.match.name, "Chen"); assert.equal(asha.match.wishes[0].name, "Teapot"); ok("Asha sees Chen and Chen's wishlist");
assert.equal((await viewOf(t.ben)).match.name, "Olivia"); ok("Ben sees Olivia");
assert.deepEqual(asha.participants.map((p) => Object.keys(p).sort().join()), Array(4).fill("id,is_me,name")); ok("participant list exposes only id/name/is_me (no emails or tokens)");
assert.ok(!JSON.stringify(asha).includes("ben@x.in") && !JSON.stringify(asha).includes(t.ben)); ok("view never leaks other people's email or token");
await fails(as("anon", null, `select santa_view('00000000-0000-0000-0000-000000000000')`), /not_found/, "unknown token");

// --- after the draw: locked -----------------------------------------------------------------------
await fails(join("Late Larry", "larry@x.in"), /group_closed/, "can't join after the draw");
assert.equal(await join("Olivia", "olivia@x.in", U1, "authenticated"), t.olivia); ok("organiser can still re-open their own link after the draw");
const del = await as("authenticated", U1, `delete from santa_participants where id=$1 returning id`, [id.Ben]);
assert.equal(del.rows.length, 0); ok("organiser can't remove people after the draw");
const delEx = await as("authenticated", U1, `delete from santa_exclusions where participant_a=$1 returning 1`, [id.Asha]);
assert.equal(delEx.rows.length, 0); ok("exclusions locked after the draw");
const teapotId = (await db.query(`select id from santa_wishes where name='Teapot'`)).rows[0].id;
await as("anon", null, `select santa_delete_wish($1, $2)`, [t.ben, teapotId]);
assert.equal((await db.query(`select count(*)::int c from santa_wishes where name='Teapot'`)).rows[0].c, 1); ok("someone else's token can't delete a wish");
await as("anon", null, `select santa_delete_wish($1, $2)`, [t.chen, teapotId]);
assert.equal((await db.query(`select count(*)::int c from santa_wishes where name='Teapot'`)).rows[0].c, 0); ok("owner's token can delete their wish");

// --- preview ------------------------------------------------------------------------------------
const pv = (await as("anon", null, `select santa_group_preview($1) as p`, [g.code])).rows[0].p;
assert.deepEqual(Object.keys(pv).sort(), ["budget_amount","exchange_date","name","note","organizer_name","participant_count","status"]);
assert.equal(pv.organizer_name, "Olivia Organiser"); assert.equal(pv.participant_count, 4); ok("public preview exposes only safe fields");

// --- removal script ---------------------------------------------------------------------------------
await db.exec(down); await db.exec(down);
const left = (await db.query(`select count(*)::int c from pg_tables where tablename like 'santa_%'`)).rows[0].c
          + (await db.query(`select count(*)::int c from pg_proc where proname like 'santa_%'`)).rows[0].c;
assert.equal(left, 0); ok("down.sql removes every santa_ table and function (and is re-runnable)");
console.log("\nALL SQL CHECKS PASSED");
