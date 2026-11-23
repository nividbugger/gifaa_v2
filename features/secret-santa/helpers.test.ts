import { test } from "node:test";
import assert from "node:assert/strict";
import { COVERS, coverFor, DEFAULT_COVER } from "./covers.ts";
import { countdownLabel, daysUntil, daysUntilChristmas, parseLocalDate, quickDates } from "./countdown.ts";
import { parseInviteCode } from "./invite-input.ts";
import { avatarTone, initialsOf } from "./avatar.ts";

// ---- covers
test("a group's cover is stable, and different codes spread across the covers", () => {
  assert.equal(coverFor("fa87618ed4"), coverFor("fa87618ed4"));
  assert.equal(coverFor(null), DEFAULT_COVER);
  assert.equal(coverFor(""), DEFAULT_COVER);
  const seen = new Set<string>();
  for (let i = 0; i < 400; i++) seen.add(coverFor(`code${i}x${i * 7}`).id);
  assert.equal(seen.size, COVERS.length, "every cover gets used");
});

// ---- countdown
const at = (y: number, m: number, d: number, h = 15) => new Date(y, m - 1, d, h, 30);

test("parseLocalDate accepts real dates only", () => {
  assert.ok(parseLocalDate("2026-12-25"));
  for (const bad of ["2026-02-30", "2026-13-01", "25-12-2026", "", "2026-1-5", "abc"]) assert.equal(parseLocalDate(bad), null, bad);
});

test("daysUntil counts calendar days regardless of the time of day", () => {
  assert.deepEqual(daysUntil("2026-12-25", at(2026, 12, 19, 23)), { kind: "future", days: 6 });
  assert.deepEqual(daysUntil("2026-12-25", at(2026, 12, 19, 0)), { kind: "future", days: 6 });
  assert.deepEqual(daysUntil("2026-12-25", at(2026, 12, 24)), { kind: "future", days: 1 });
  assert.deepEqual(daysUntil("2026-12-25", at(2026, 12, 25, 23)), { kind: "today" });
  assert.deepEqual(daysUntil("2026-12-25", at(2026, 12, 28)), { kind: "past", days: 3 });
  assert.deepEqual(daysUntil(null), { kind: "none" });
  assert.deepEqual(daysUntil("nonsense"), { kind: "none" });
});

test("countdown labels read naturally", () => {
  assert.equal(countdownLabel({ kind: "future", days: 6 }), "6 days to go");
  assert.equal(countdownLabel({ kind: "future", days: 1 }), "Tomorrow!");
  assert.equal(countdownLabel({ kind: "today" }), "Today's the day!");
  assert.equal(countdownLabel({ kind: "past", days: 1 }), "Yesterday");
  assert.equal(countdownLabel({ kind: "past", days: 4 }), "4 days ago");
  assert.equal(countdownLabel({ kind: "none" }), null);
});

test("days until Christmas rolls over to next year after the 25th", () => {
  assert.equal(daysUntilChristmas(at(2026, 11, 21)), 34);
  assert.equal(daysUntilChristmas(at(2026, 12, 25)), 0);
  assert.equal(daysUntilChristmas(at(2026, 12, 26)), 364);
});

test("quick dates are the next Dec 24, 25 and 31", () => {
  assert.deepEqual(quickDates(at(2026, 11, 21)).map((d) => d.value), ["2026-12-24", "2026-12-25", "2026-12-31"]);
  assert.deepEqual(quickDates(at(2026, 12, 25)).map((d) => d.value), ["2027-12-24", "2026-12-25", "2026-12-31"], "a past date moves to next year");
  assert.deepEqual(quickDates(at(2026, 11, 21)).map((d) => d.label), ["Dec 24", "Dec 25", "Dec 31"]);
});

// ---- invite input
test("parseInviteCode takes a code or a pasted link, and rejects junk", () => {
  assert.equal(parseInviteCode("fa87618ed4"), "fa87618ed4");
  assert.equal(parseInviteCode("  FA87618ED4  "), "fa87618ed4");
  assert.equal(parseInviteCode("https://gifaa.in/santa/join/fa87618ed4"), "fa87618ed4");
  assert.equal(parseInviteCode("https://www.gifaa.in/santa/join/fa87618ed4?utm_source=wa"), "fa87618ed4");
  assert.equal(parseInviteCode("Join my Secret Santa! http://localhost:3000/santa/join/b3c51e019b see you"), "b3c51e019b");
  for (const bad of ["", "   ", "abc", "has space", "https://gifaa.in/santa/me/token", "<script>", "a".repeat(40)]) assert.equal(parseInviteCode(bad), null, JSON.stringify(bad));
});

// ---- avatars
test("initials and colours are stable and sensible", () => {
  assert.equal(initialsOf("Asha"), "A");
  assert.equal(initialsOf("Asha Rao"), "AR");
  assert.equal(initialsOf("  asha   m  rao "), "AR");
  assert.equal(initialsOf(""), "?");
  assert.equal(initialsOf("   "), "?");
  assert.deepEqual(avatarTone("Asha"), avatarTone("  asha "));
  const tones = new Set(["Asha", "Ben", "Chen", "Divya", "Eli", "Farah", "Gus", "Hana", "Ira", "Jo"].map((n) => avatarTone(n).bg));
  assert.ok(tones.size >= 4, "names spread over several colours");
});
