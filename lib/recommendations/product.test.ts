import { test } from "node:test";
import assert from "node:assert/strict";
import { nameFromUrl, storeLabel, tidyTitle, usableScrape } from "./product.ts";

test("pulls a readable title out of an Amazon-style path", () => {
  assert.equal(nameFromUrl("https://www.amazon.in/Copper-Water-Bottle-1L/dp/B0ABCDEFGH?ref=x"), "Copper Water Bottle 1L");
  assert.equal(nameFromUrl("https://www.amazon.in/dp/B0ABCDEFGH"), "Gift idea from amazon.in");
});

test("works for other stores' slugs, decoding escapes", () => {
  assert.equal(nameFromUrl("https://www.ikea.com/in/en/p/glass-vase-clear-glass-20-cm-80488385/"), "Glass Vase Clear Glass 20 Cm 80488385");
  assert.equal(nameFromUrl("https://shop.example.com/products/handmade%2Dceramic-mug"), "Handmade Ceramic Mug");
});

test("falls back to the store name, never throws on bad input", () => {
  assert.equal(nameFromUrl("https://www.nykaa.com/"), "Gift idea from nykaa.com");
  assert.equal(nameFromUrl("not a url"), "Gift idea");
  assert.equal(nameFromUrl(""), "Gift idea");
});

test("store label prefers the known retailer, else the hostname", () => {
  assert.equal(storeLabel("https://www.amazon.in/x", "Amazon"), "Amazon");
  assert.equal(storeLabel("https://www.ikea.com/in/en/", null), "ikea.com");
  assert.equal(storeLabel("garbage", undefined), "the store");
});

test("tidyTitle keeps the part before the first pipe", () => {
  assert.equal(
    tidyTitle("OURA Ring 4 - Silver - Size 9 - Smart Ring | Size First Ring 4 Sizing Kit | Sleep Tracking Wearable - Heart Rate - Fitness Tracker - Up to 8 Days Battery Life Ring 4"),
    "OURA Ring 4 - Silver - Size 9 - Smart Ring"
  );
});

test("tidyTitle caps long pipe-less titles at a word boundary, and leaves short ones alone", () => {
  const long = "Handcrafted Solid Wood Serving Tray With Brass Handles For Tea Coffee Snacks And Everyday Entertaining At Home";
  const tidy = tidyTitle(long);
  assert.ok(tidy.length <= 81 && tidy.endsWith("…") && !tidy.slice(0, -1).endsWith(" "), tidy);
  assert.ok(long.startsWith(tidy.slice(0, -1)), "cut falls on a word boundary of the original");
  assert.equal(tidyTitle("Copper Water Bottle"), "Copper Water Bottle");
  assert.equal(tidyTitle("  Spaced   out   title  "), "Spaced out title");
});

test("tidyTitle never returns an empty name", () => {
  assert.equal(tidyTitle("| only after the pipe"), "| only after the pipe");
  assert.equal(tidyTitle("Good Name |"), "Good Name");
});

test("usableScrape trusts real details but not the scraper's URL-guess fallback", () => {
  const real = { title: "Ring", price: 100, image: "https://i/x.jpg", description: null };
  assert.deepEqual(usableScrape({ success: true, data: real }), real);
  assert.equal(usableScrape({ success: true, fallback: true, data: { title: "Ref=cm Sw R As", price: null, image: null, description: null } }), null);
  assert.equal(usableScrape({ success: false, error: "access_denied" }), null);
  assert.equal(usableScrape({ success: true }), null);
  assert.equal(usableScrape({ success: true, data: { title: null, price: null, image: null, description: null } }), null);
  assert.ok(usableScrape({ success: true, data: { title: null, price: 99, image: null, description: null } }), "a price alone is still useful");
});
