/**
 * Full migration: OLD Supabase project → NEW Supabase project
 *
 * Reads ALL users + registries from the old project using the service role key
 * (bypasses RLS), then writes them to the new project, mapping user IDs by email.
 *
 * USAGE:
 *   OLD_SERVICE_ROLE=<old_service_role_key> \
 *   NEW_SERVICE_ROLE=<new_service_role_key> \
 *   node scripts/migrate-all-users.mjs
 *
 * Safe to re-run — skips registries whose share_token already exists in the new project.
 */

import { createClient } from "@supabase/supabase-js";

// ── Config ─────────────────────────────────────────────────────────────────
const OLD_URL = "https://kxuifxszpmvowpplhske.supabase.co";
const NEW_URL = "https://bxaycjwuexauhroemfzb.supabase.co";

const OLD_SERVICE_ROLE = process.env.OLD_SERVICE_ROLE;
const NEW_SERVICE_ROLE = process.env.NEW_SERVICE_ROLE;

if (!OLD_SERVICE_ROLE || !NEW_SERVICE_ROLE) {
  console.error(
    "❌  Missing env vars.\n" +
    "    Run with:\n" +
    "    OLD_SERVICE_ROLE=<key> NEW_SERVICE_ROLE=<key> node scripts/migrate-all-users.mjs"
  );
  process.exit(1);
}

const oldDb = createClient(OLD_URL, OLD_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const newDb = createClient(NEW_URL, NEW_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ────────────────────────────────────────────────────────────────
const log   = (msg) => console.log(`  ${msg}`);
const ok    = (msg) => console.log(`  ✅ ${msg}`);
const warn  = (msg) => console.log(`  ⚠️  ${msg}`);
const fail  = (msg) => console.log(`  ❌ ${msg}`);
const section = (title) => console.log(`\n${"─".repeat(60)}\n  ${title}\n${"─".repeat(60)}`);

// ── Step 1: Load all old users ─────────────────────────────────────────────
async function loadOldUsers() {
  section("STEP 1 — Loading users from OLD project");

  const allUsers = [];
  let page = 1;
  while (true) {
    const { data, error } = await oldDb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) { fail(`listUsers page ${page}: ${error.message}`); break; }
    if (!data.users.length) break;
    allUsers.push(...data.users);
    log(`  Loaded ${data.users.length} users (page ${page})`);
    if (data.users.length < 1000) break;
    page++;
  }

  ok(`Total old users: ${allUsers.length}`);
  return allUsers;
}

// ── Step 2: Load all new users (for email → new_id mapping) ────────────────
async function loadNewUsers() {
  section("STEP 2 — Loading users from NEW project");

  const allUsers = [];
  let page = 1;
  while (true) {
    const { data, error } = await newDb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) { fail(`listUsers page ${page}: ${error.message}`); break; }
    if (!data.users.length) break;
    allUsers.push(...data.users);
    if (data.users.length < 1000) break;
    page++;
  }

  // email → new user id map
  const emailToNewId = {};
  for (const u of allUsers) {
    if (u.email) emailToNewId[u.email.toLowerCase()] = u.id;
  }

  ok(`Total new users: ${allUsers.length}`);
  return emailToNewId;
}

// ── Step 3: Load existing share_tokens in new project (idempotency) ─────────
async function loadExistingShareTokens() {
  const { data, error } = await newDb.from("registries").select("share_token");
  if (error) { fail(`Could not load existing tokens: ${error.message}`); return new Set(); }
  return new Set(data.map((r) => r.share_token));
}

// ── Step 4: Migrate registries ─────────────────────────────────────────────
async function migrateRegistries(oldUsers, emailToNewId, existingTokens) {
  section("STEP 3 — Migrating registries, gifts, cash funds & contributions");

  const stats = {
    usersSkipped: 0,      // old user has no matching new account yet
    usersProcessed: 0,
    registriesSkipped: 0, // already migrated
    registriesMigrated: 0,
    giftsMigrated: 0,
    cashFundsMigrated: 0,
    contributionsMigrated: 0,
    errors: [],
  };

  for (const oldUser of oldUsers) {
    const email = oldUser.email?.toLowerCase();
    const newUserId = email ? emailToNewId[email] : null;

    if (!newUserId) {
      warn(`No new account for ${email || oldUser.id} — skipping (they haven't signed in yet)`);
      stats.usersSkipped++;
      continue;
    }

    log(`\n  👤 ${email}  (old: ${oldUser.id} → new: ${newUserId})`);
    stats.usersProcessed++;

    // Load this user's registries from old project
    const { data: registries, error: regErr } = await oldDb
      .from("registries")
      .select("*")
      .eq("user_id", oldUser.id);

    if (regErr) {
      fail(`  Registries for ${email}: ${regErr.message}`);
      stats.errors.push({ email, step: "registries", error: regErr.message });
      continue;
    }

    for (const reg of registries) {
      if (existingTokens.has(reg.share_token)) {
        log(`    Registry "${reg.title}" already migrated — skipping`);
        stats.registriesSkipped++;
        continue;
      }

      // Insert registry with new user_id
      const { id: _oldId, ...regFields } = reg;
      const { data: newReg, error: insertErr } = await newDb
        .from("registries")
        .insert({ ...regFields, user_id: newUserId })
        .select()
        .single();

      if (insertErr) {
        fail(`    Registry "${reg.title}": ${insertErr.message}`);
        stats.errors.push({ email, step: "registry", title: reg.title, error: insertErr.message });
        continue;
      }

      ok(`    Registry "${reg.title}" → new id: ${newReg.id}`);
      stats.registriesMigrated++;
      existingTokens.add(reg.share_token);

      // ── Gifts ──────────────────────────────────────────────────────────
      const { data: gifts, error: giftsErr } = await oldDb
        .from("registry_gifts")
        .select("*")
        .eq("registry_id", reg.id);

      if (giftsErr) {
        fail(`    Gifts for "${reg.title}": ${giftsErr.message}`);
      } else if (gifts.length) {
        const giftsToInsert = gifts.map(({ id: _id, registry_id: _rid, ...g }) => ({
          ...g,
          registry_id: newReg.id,
        }));
        const { error: giftInsertErr } = await newDb.from("registry_gifts").insert(giftsToInsert);
        if (giftInsertErr) {
          fail(`    Inserting gifts: ${giftInsertErr.message}`);
          stats.errors.push({ email, step: "gifts", title: reg.title, error: giftInsertErr.message });
        } else {
          log(`    → ${gifts.length} gift(s) migrated`);
          stats.giftsMigrated += gifts.length;
        }
      }

      // ── Cash Funds ─────────────────────────────────────────────────────
      const { data: funds, error: fundsErr } = await oldDb
        .from("cash_funds")
        .select("*")
        .eq("registry_id", reg.id);

      if (fundsErr) {
        fail(`    Cash funds for "${reg.title}": ${fundsErr.message}`);
      } else if (funds.length) {
        for (const fund of funds) {
          const { id: oldFundId, registry_id: _rid, ...fundFields } = fund;

          const { data: newFund, error: fundInsertErr } = await newDb
            .from("cash_funds")
            .insert({ ...fundFields, registry_id: newReg.id })
            .select()
            .single();

          if (fundInsertErr) {
            fail(`    Cash fund "${fund.name}": ${fundInsertErr.message}`);
            stats.errors.push({ email, step: "cash_fund", name: fund.name, error: fundInsertErr.message });
            continue;
          }

          stats.cashFundsMigrated++;

          // ── Contributions for this fund ───────────────────────────────
          const { data: contribs, error: contribErr } = await oldDb
            .from("contributions")
            .select("*")
            .eq("cash_fund_id", oldFundId);

          if (contribErr) {
            fail(`    Contributions for fund "${fund.name}": ${contribErr.message}`);
          } else if (contribs.length) {
            const contribsToInsert = contribs.map(({ id: _id, cash_fund_id: _cid, ...c }) => ({
              ...c,
              cash_fund_id: newFund.id,
            }));
            const { error: contribInsertErr } = await newDb.from("contributions").insert(contribsToInsert);
            if (contribInsertErr) {
              fail(`    Inserting contributions: ${contribInsertErr.message}`);
            } else {
              stats.contributionsMigrated += contribs.length;
            }
          }
        }
        log(`    → ${funds.length} cash fund(s) migrated`);
      }
    }
  }

  return stats;
}

// ── Step 5: Print summary ──────────────────────────────────────────────────
function printSummary(stats) {
  section("MIGRATION SUMMARY");
  console.log(`  Users with no new account yet (haven't signed in):  ${stats.usersSkipped}`);
  console.log(`  Users fully processed:                               ${stats.usersProcessed}`);
  console.log(`  Registries already migrated (skipped):               ${stats.registriesSkipped}`);
  console.log(`  Registries migrated this run:                        ${stats.registriesMigrated}`);
  console.log(`  Gifts migrated:                                      ${stats.giftsMigrated}`);
  console.log(`  Cash funds migrated:                                 ${stats.cashFundsMigrated}`);
  console.log(`  Contributions migrated:                              ${stats.contributionsMigrated}`);

  if (stats.errors.length) {
    console.log(`\n  ⚠️  ${stats.errors.length} error(s):`);
    stats.errors.forEach((e) => console.log(`     • ${JSON.stringify(e)}`));
  } else {
    console.log(`\n  ✅ No errors.`);
  }

  if (stats.usersSkipped > 0) {
    console.log(
      `\n  ℹ️  ${stats.usersSkipped} user(s) haven't signed into the new site yet.` +
      `\n     Re-run this script after they sign in once and their data will be migrated.`
    );
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀  Gifaa Full Migration — OLD → NEW Supabase\n");

  const oldUsers      = await loadOldUsers();
  const emailToNewId  = await loadNewUsers();
  const existingTokens = await loadExistingShareTokens();
  const stats         = await migrateRegistries(oldUsers, emailToNewId, existingTokens);

  printSummary(stats);
}

main().catch((e) => { console.error(e); process.exit(1); });
