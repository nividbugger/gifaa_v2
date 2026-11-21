import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMatchEmail } from "./match-email.ts";

const base = { to: "a@x.co", participantName: "Asha", groupName: "Family 2026", link: "https://www.gifaa.in/santa/me/tok", budget: 1500, exchangeDate: "24 Dec 2026" };

test("addresses the right person, links to their page, includes details", () => {
  const m = buildMatchEmail(base);
  assert.equal(m.to, "a@x.co");
  assert.match(m.subject, /Family 2026/);
  assert.ok(m.html.includes("https://www.gifaa.in/santa/me/tok") && m.text!.includes("https://www.gifaa.in/santa/me/tok"));
  assert.ok(m.html.includes("₹1,500") && m.html.includes("24 Dec 2026"));
});

test("never contains anything that could reveal the match", () => {
  const m = buildMatchEmail(base);
  assert.ok(!/gifting\s+\w+\s*$/i.test(m.text!.split("\n")[2] ?? ""));
  assert.ok(!/you(?:'|’)re the secret santa for/i.test(m.html + m.text));
});

test("escapes hostile names and omits empty details", () => {
  const m = buildMatchEmail({ ...base, participantName: "<img src=x onerror=1>", groupName: `A&"B`, budget: null, exchangeDate: null });
  assert.ok(!m.html.includes("<img"));
  assert.ok(!m.html.includes("Budget"));
});
