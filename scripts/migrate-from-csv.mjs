/**
 * CSV → New Supabase Migration
 *
 * Reads the 5 CSV backups and inserts all data into the new Supabase project.
 * Matches old user IDs → new user IDs via avatar_url (primary) and display_name (fallback).
 *
 * USAGE:
 *   NEW_SERVICE_ROLE=<key> node scripts/migrate-from-csv.mjs
 *
 * Safe to re-run — skips registries whose share_token already exists.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { homedir } from "os";

// ── Config ─────────────────────────────────────────────────────────────────
const NEW_URL          = "https://bxaycjwuexauhroemfzb.supabase.co";
const NEW_SERVICE_ROLE = process.env.NEW_SERVICE_ROLE;

if (!NEW_SERVICE_ROLE) {
  console.error("❌  Missing NEW_SERVICE_ROLE env var.\n    Run with: NEW_SERVICE_ROLE=<key> node scripts/migrate-from-csv.mjs");
  process.exit(1);
}

const db = createClient(NEW_URL, NEW_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Schema discovery via Supabase OpenAPI spec ──────────────────────────────
// Fetches the live OpenAPI spec to get actual column names — no DB changes needed.
async function fetchTableColumns(tableName) {
  const resp = await fetch(`${NEW_URL}/rest/v1/`, {
    headers: {
      apikey: NEW_SERVICE_ROLE,
      Authorization: `Bearer ${NEW_SERVICE_ROLE}`,
    },
  });
  if (!resp.ok) throw new Error(`OpenAPI fetch failed: ${resp.status}`);
  const spec = await resp.json();
  const def = spec.definitions?.[tableName];
  if (!def) throw new Error(`Table "${tableName}" not found in OpenAPI spec`);
  return new Set(Object.keys(def.properties || {}));
}

// Strip any keys from obj that aren't in the live schema for that table
function pick(obj, allowedCols) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => allowedCols.has(k)));
}

const DOWNLOADS = resolve(homedir(), "Downloads");
const CSV = {
  profiles:      resolve(DOWNLOADS, "backup_profiles.csv"),
  registries:    resolve(DOWNLOADS, "backup_registries.csv"),
  gifts:         resolve(DOWNLOADS, "backup_registry_gifts.csv"),
  cashFunds:     resolve(DOWNLOADS, "backup_cash_funds.csv"),
  contributions: resolve(DOWNLOADS, "backup_contributions.csv"),
};

// ── Built-in CSV parser (handles quoted fields with commas/newlines) ────────
function parseCsv(filePath) {
  const text = readFileSync(filePath, "utf8");
  const lines = [];
  let cur = "", inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { inQuote = !inQuote; cur += ch; }
    else if (ch === "\n" && !inQuote) { lines.push(cur.replace(/\r$/, "")); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) lines.push(cur);

  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const vals = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (vals[i] ?? "").trim()]));
  });
}

function splitCsvLine(line) {
  const result = [];
  let cur = "", inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur); cur = "";
    } else cur += ch;
  }
  result.push(cur);
  return result;
}

// ── Logging ────────────────────────────────────────────────────────────────
const ok      = (m) => console.log(`  ✅ ${m}`);
const warn    = (m) => console.log(`  ⚠️  ${m}`);
const fail    = (m) => console.log(`  ❌ ${m}`);
const info    = (m) => console.log(`  ℹ️  ${m}`);
const section = (t) => console.log(`\n${"─".repeat(64)}\n  ${t}\n${"─".repeat(64)}`);

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀  Gifaa CSV Migration → New Supabase\n");

  // ── 1. Parse all CSVs ────────────────────────────────────────────────────
  section("STEP 1 — Parsing CSV files");
  const profiles      = parseCsv(CSV.profiles);
  const registries    = parseCsv(CSV.registries);
  const gifts         = parseCsv(CSV.gifts);
  const cashFunds     = parseCsv(CSV.cashFunds);
  const contributions = parseCsv(CSV.contributions);
  ok(`Profiles:      ${profiles.length} rows`);
  ok(`Registries:    ${registries.length} rows`);
  ok(`Gifts:         ${gifts.length} rows`);
  ok(`Cash funds:    ${cashFunds.length} rows`);
  ok(`Contributions: ${contributions.length} rows`);

  // ── 2. Fetch new Supabase users ──────────────────────────────────────────
  section("STEP 2 — Loading users from new Supabase");
  const newUsers = [];
  let page = 1;
  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) { fail(`listUsers: ${error.message}`); break; }
    if (!data.users.length) break;
    newUsers.push(...data.users);
    if (data.users.length < 1000) break;
    page++;
  }
  ok(`Found ${newUsers.length} users in new project`);

  // Build lookup maps from new users
  const byAvatarUrl    = new Map(); // avatar_url → new user id
  const byDisplayName  = new Map(); // display_name → new user id (last wins on dupe)

  for (const u of newUsers) {
    const avatar = u.user_metadata?.avatar_url || u.raw_user_meta_data?.avatar_url;
    const name   = u.user_metadata?.full_name   || u.raw_user_meta_data?.full_name || u.email;
    if (avatar) byAvatarUrl.set(avatar.trim(), u.id);
    if (name)   byDisplayName.set(name.trim().toLowerCase(), u.id);
  }

  // ── 3. Build old→new user ID map + claim keys for unmapped ──────────────
  section("STEP 3 — Mapping old user IDs → new user IDs");

  // oldUserId → { newId?, avatar?, name }
  const userMap = new Map(); // old_user_id → { newId, claimAvatar, claimName }

  for (const p of profiles) {
    const oldId  = p.id;
    const avatar = (p.avatar_url || "").trim();
    const name   = (p.display_name || "").trim();

    let newId = null;

    // Primary: match by avatar_url (unique per Google account)
    if (avatar && byAvatarUrl.has(avatar)) {
      newId = byAvatarUrl.get(avatar);
      ok(`Mapped "${p.display_name}" via avatar_url`);
    }
    // Fallback: match by display_name
    else if (name && byDisplayName.has(name.toLowerCase())) {
      newId = byDisplayName.get(name.toLowerCase());
      warn(`Mapped "${p.display_name}" via display_name (verify manually)`);
    }
    else {
      info(`"${p.display_name}" not yet in new project — will insert as pending`);
    }

    userMap.set(oldId, {
      newId,
      claimAvatar: newId ? null : (avatar || null),
      claimName:   newId ? null : (name  || null),
    });
  }

  const mappedCount   = [...userMap.values()].filter(v => v.newId).length;
  const pendingCount  = [...userMap.values()].filter(v => !v.newId).length;
  info(`Mapped: ${mappedCount} | Pending (will auto-claim on sign-in): ${pendingCount}`);

  // ── 4. Load existing share_tokens (idempotency) + discover live schema ──────
  section("STEP 4 — Checking existing registries & discovering schema");
  const { data: existing, error: existErr } = await db.from("registries").select("share_token");
  if (existErr) { fail(`Could not load existing registries: ${existErr.message}`); process.exit(1); }
  const existingTokens = new Set(existing.map((r) => r.share_token));
  info(`${existingTokens.size} registries already in new project`);

  // Fetch real column sets from the live OpenAPI spec — source of truth
  const regCols     = await fetchTableColumns("registries");
  const giftCols    = await fetchTableColumns("registry_gifts");
  const fundCols    = await fetchTableColumns("cash_funds");
  const contribCols = await fetchTableColumns("contributions");
  info(`registries columns:     ${[...regCols].sort().join(", ")}`);
  info(`registry_gifts columns: ${[...giftCols].sort().join(", ")}`);
  info(`cash_funds columns:     ${[...fundCols].sort().join(", ")}`);
  info(`contributions columns:  ${[...contribCols].sort().join(", ")}`);

  // ── 5. Migrate registries ────────────────────────────────────────────────
  section("STEP 5 — Migrating registries");

  // oldRegistryId → newRegistryId (needed for gifts / cash funds)
  const oldRegToNew = new Map();

  const stats = {
    registriesInserted: 0, registriesPending: 0, registriesSkipped: 0,
    giftsInserted: 0,      giftsFailed: 0,
    fundsInserted: 0,      fundsFailed: 0,
    contribsInserted: 0,   contribsFailed: 0,
    errors: [],
  };

  // Build lookup tables from CSVs
  const giftsByReg    = groupBy(gifts,         "registry_id");
  const fundsByReg    = groupBy(cashFunds,      "registry_id");
  const contribByFund = groupBy(contributions,  "cash_fund_id");

  for (const reg of registries) {
    // Skip if already migrated
    if (existingTokens.has(reg.share_token)) {
      info(`Registry "${reg.title}" already exists — skipping`);
      stats.registriesSkipped++;
      continue;
    }

    const userInfo = userMap.get(reg.user_id) || {};

    // Build payload — include everything the new DB might accept, pick() will strip unknowns
    const insertPayload = pick({
      title:                reg.title,
      occasion:             reg.occasion,
      is_public:            reg.is_public === "t" || reg.is_public === "true",
      share_token:          reg.share_token || null,
      event_date:           reg.event_date || null,
      event_location:       reg.event_location || null,
      personal_message:     reg.personal_message || null,
      thank_you_note:       reg.thank_you_note || null,
      header_image_url:     reg.header_image_url || null,
      upi_id:               reg.upi_id || null,
      description:          reg.description || null,
      shipping_address:     reg.shipping_address || null,
      user_id:              userInfo.newId ?? null,
      pending_claim_avatar: userInfo.claimAvatar ?? null,
      pending_claim_name:   userInfo.claimName   ?? null,
    }, regCols);

    const { data: newReg, error: regErr } = await db
      .from("registries")
      .insert(insertPayload)
      .select()
      .single();

    if (regErr) {
      fail(`Registry "${reg.title}": ${regErr.message}`);
      stats.errors.push({ type: "registry", title: reg.title, error: regErr.message });
      continue;
    }

    if (userInfo.newId) {
      ok(`Registry "${reg.title}" → ${newReg.id}`);
      stats.registriesInserted++;
    } else {
      warn(`Registry "${reg.title}" → pending claim (avatar: ${userInfo.claimAvatar ? "yes" : "no"}, name: ${userInfo.claimName || "—"})`);
      stats.registriesPending++;
    }
    oldRegToNew.set(reg.id, newReg.id);

    // ── Gifts ──────────────────────────────────────────────────────────────
    const regGifts = giftsByReg[reg.id] || [];
    if (regGifts.length) {
      const toInsert = regGifts.map((g) => pick({
        registry_id:          newReg.id,
        product_name:         g.product_name,
        product_url:          g.product_url || null,
        product_image_url:    g.product_image_url || null,
        price:                g.price ? parseFloat(g.price) : null,
        notes:                g.notes || null,
        is_purchased:         g.is_purchased === "t" || g.is_purchased === "true",
        purchased_at:         g.purchased_at || null,
        // Old user IDs are invalid in the new project — null them out to avoid FK violation.
        // purchased_by_name preserves the purchaser identity as a display string.
        purchased_by_user_id: null,
        purchase_message:     g.purchase_message || null,
        purchased_by_name:    g.purchased_by_name || null,
      }, giftCols));
      const { error: gErr } = await db.from("registry_gifts").insert(toInsert);
      if (gErr) {
        fail(`  Gifts for "${reg.title}": ${gErr.message}`);
        stats.errors.push({ type: "gifts", registry: reg.title, error: gErr.message });
        stats.giftsFailed += regGifts.length;
      } else {
        info(`  → ${regGifts.length} gift(s)`);
        stats.giftsInserted += regGifts.length;
      }
    }

    // ── Cash Funds ─────────────────────────────────────────────────────────
    const regFunds = fundsByReg[reg.id] || [];
    for (const fund of regFunds) {
      const { data: newFund, error: fErr } = await db
        .from("cash_funds")
        .insert(pick({
          registry_id:   newReg.id,
          name:          fund.name,
          description:   fund.description || null,
          target_amount: fund.target_amount ? parseFloat(fund.target_amount) : null,
        }, fundCols))
        .select()
        .single();

      if (fErr) {
        fail(`  Cash fund "${fund.name}": ${fErr.message}`);
        stats.errors.push({ type: "cash_fund", name: fund.name, error: fErr.message });
        stats.fundsFailed++;
        continue;
      }

      stats.fundsInserted++;

      // ── Contributions ────────────────────────────────────────────────────
      const fundContribs = contribByFund[fund.id] || [];
      if (fundContribs.length) {
        const cToInsert = fundContribs.map((c) => pick({
          cash_fund_id:     newFund.id,
          registry_id:      newReg.id,
          amount:           parseFloat(c.amount),
          contributor_name: c.contributor_name,
          message:          c.message || null,
        }, contribCols));
        const { error: cErr } = await db.from("contributions").insert(cToInsert);
        if (cErr) {
          fail(`    Contributions for fund "${fund.name}": ${cErr.message}`);
          stats.contribsFailed += fundContribs.length;
        } else {
          stats.contribsInserted += fundContribs.length;
        }
      }
    }
    if (regFunds.length) info(`  → ${regFunds.length} cash fund(s)`);
  }

  // ── 6. Summary ───────────────────────────────────────────────────────────
  section("MIGRATION SUMMARY");
  console.log(`  Users mapped now:               ${mappedCount} / ${profiles.length}`);
  console.log(`  Users pending (auto-claim):     ${pendingCount}`);
  console.log(`  Registries inserted (live):     ${stats.registriesInserted}`);
  console.log(`  Registries inserted (pending):  ${stats.registriesPending}`);
  console.log(`  Registries skipped (duplicate): ${stats.registriesSkipped}`);
  console.log(`  Gifts inserted:                 ${stats.giftsInserted}`);
  console.log(`  Cash funds inserted:            ${stats.fundsInserted}`);
  console.log(`  Contributions inserted:         ${stats.contribsInserted}`);

  if (stats.errors.length) {
    console.log(`\n  ⚠️  ${stats.errors.length} error(s):`);
    stats.errors.forEach((e) => console.log(`     • ${JSON.stringify(e)}`));
  } else {
    console.log(`\n  ✅ No errors.`);
  }

  console.log(`\n  ℹ️  Pending registries will be auto-claimed the moment each user`);
  console.log(`     signs into gifaa.vercel.app — no action needed from them.`);
}

// ── Utils ──────────────────────────────────────────────────────────────────
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

main().catch((e) => { console.error(e); process.exit(1); });
