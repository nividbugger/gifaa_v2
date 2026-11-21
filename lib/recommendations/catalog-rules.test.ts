import { test } from "node:test";
import assert from "node:assert/strict";
import { findCatalogProblems } from "./catalog-rules.ts";
import { RECOMMENDATION_SECTIONS } from "./catalog.ts";
import { isAmazonUrl } from "../../shared/retailers.ts";

const GOOD = "https://www.amazon.in/dp/B0D9WWB3WX/ref=cm_sw_r_as_gl_api_gl_i_dl_93C69C8YSMCT99V1TBHB?linkCode=ml1&tag=gifaa04-21&linkId=f18439e518bc27f9b6d139f5bef242a0";
const section = (id: string, ...urls: string[]) => ({ id, title: id, subtitle: "", items: urls.map((url) => ({ url })) });
const problems = (...sections: ReturnType<typeof section>[]) => findCatalogProblems(sections, isAmazonUrl);

test("the real catalog is valid (this is what protects production)", () => {
  assert.deepEqual(findCatalogProblems(RECOMMENDATION_SECTIONS, isAmazonUrl), []);
});

test("accepts a properly tagged Amazon link and a normal store link", () => {
  assert.deepEqual(problems(section("amazon", GOOD), section("other-stores", "https://www.ikea.com/in/en/p/vase-1/")), []);
});

test("rejects Amazon links without the tag, with a different tag, or without linkId", () => {
  assert.match(problems(section("amazon", "https://www.amazon.in/dp/B0D9WWB3WX"))[0]!, /tag=gifaa04-21/);
  assert.match(problems(section("amazon", GOOD.replace("tag=gifaa04-21", "tag=someoneelse-21")))[0]!, /tag=gifaa04-21/);
  assert.match(problems(section("amazon", GOOD.replace(/&linkId=\w+/, "")))[0]!, /linkId/);
  assert.match(problems(section("amazon", GOOD.replace(/linkId=\w+/, "linkId=")))[0]!, /linkId/);
});

test("short amzn.to links can't be verified, so they're rejected", () => {
  assert.ok(problems(section("amazon", "https://amzn.to/3abcxyz")).length >= 1);
});

test("a tag only in the path or fragment doesn't count", () => {
  assert.ok(problems(section("amazon", "https://www.amazon.in/dp/B0D9WWB3WX#tag=gifaa04-21&linkId=abc")).length >= 1);
});

test("keeps Amazon links and other stores in their own sections", () => {
  assert.match(problems(section("other-stores", GOOD))[0]!, /belong in the "amazon" section/);
  assert.match(problems(section("amazon", "https://www.ikea.com/in/en/p/vase-1/"))[0]!, /only Amazon links/);
});

test("rejects duplicates, bad URLs and non-https links", () => {
  assert.ok(problems(section("amazon", GOOD, GOOD)).some((p) => /more than once/.test(p)));
  assert.ok(problems(section("other-stores", "not a url")).some((p) => /valid URL/.test(p)));
  assert.ok(problems(section("other-stores", "http://shop.example.com/x")).some((p) => /https/.test(p)));
});
