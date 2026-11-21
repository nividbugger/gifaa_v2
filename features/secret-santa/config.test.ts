import { test } from "node:test";
import assert from "node:assert/strict";
import { SANTA_PROMO_UNTIL, isSantaPromoVisible } from "./config.ts";

test("visible through the festive season, hidden from 6 Jan 2027 IST", () => {
  assert.equal(isSantaPromoVisible(new Date("2026-11-20T10:00:00+05:30")), true);
  assert.equal(isSantaPromoVisible(new Date("2026-12-25T00:00:00+05:30")), true);
  assert.equal(isSantaPromoVisible(new Date("2027-01-05T23:59:59+05:30")), true, "last second before the cutoff");
  assert.equal(isSantaPromoVisible(new Date("2027-01-06T00:00:00+05:30")), false, "cutoff instant");
  assert.equal(isSantaPromoVisible(new Date("2027-03-01T00:00:00+05:30")), false);
  assert.equal(SANTA_PROMO_UNTIL.toISOString(), "2027-01-05T18:30:00.000Z");
});

test("the env flag hides it immediately, even mid-season", async () => {
  process.env.NEXT_PUBLIC_SECRET_SANTA = "off";
  const off = await import(`./config.ts?off=${Date.now()}`);
  assert.equal(off.isSantaPromoVisible(new Date("2026-12-01T00:00:00+05:30")), false);
  delete process.env.NEXT_PUBLIC_SECRET_SANTA;
});
