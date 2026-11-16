// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { extractProduct } from "./index";
import { parsePriceText } from "./price";

const page = (html: string) => new DOMParser().parseFromString(html, "text/html");

describe("parsePriceText", () => {
  it.each([
    ["₹1,29,999.00", 129999],
    ["Rs. 499", 499],
    ["1299", 1299],
  ])("%s -> %d", (input, expected) => expect(parsePriceText(input)).toBe(expected));

  it("returns null for junk", () => {
    expect(parsePriceText("Free")).toBeNull();
    expect(parsePriceText(null)).toBeNull();
  });
});

describe("extractProduct", () => {
  it("prefers JSON-LD, including @graph and array offers", () => {
    const doc = page(`<head><title>Fallback</title>
      <script type="application/ld+json">{"@graph":[{"@type":"Product","name":"Dutch Oven",
      "image":["https://x.test/a.jpg"],"offers":[{"@type":"Offer","price":"8,999"}]}]}</script></head>`);
    expect(extractProduct(doc, "https://shop.test/p/1")).toMatchObject({
      title: "Dutch Oven",
      image: "https://x.test/a.jpg",
      price: 8999,
    });
  });

  it("falls back to OpenGraph and resolves relative images", () => {
    const doc = page(`<head><meta property="og:title" content="Lamp"><meta property="og:image" content="/img/l.png">
      <meta property="product:price:amount" content="1500"></head>`);
    expect(extractProduct(doc, "https://shop.test/p/2")).toMatchObject({
      title: "Lamp",
      image: "https://shop.test/img/l.png",
      price: 1500,
    });
  });

  it("uses Amazon selectors and fills gaps from meta", () => {
    const doc = page(`<head><meta property="og:image" content="https://m.test/i.jpg"></head><body>
      <span id="productTitle"> Kettle </span><div id="corePrice_feature_div"><span class="a-offscreen">₹2,499.00</span></div></body>`);
    expect(extractProduct(doc, "https://www.amazon.in/dp/B0")).toMatchObject({
      title: "Kettle",
      price: 2499,
      image: "https://m.test/i.jpg",
    });
  });

  it("survives malformed JSON-LD", () => {
    const doc = page(`<head><title>Only Title</title><script type="application/ld+json">{oops</script></head>`);
    expect(extractProduct(doc, "https://shop.test/").title).toBe("Only Title");
  });
});

import { productUrl } from "./url";

describe("productUrl", () => {
  it("uses same-site canonical, ignores cross-site canonical, drops hash", () => {
    const same = page(`<head><link rel="canonical" href="https://shop.test/dp/1"></head>`);
    expect(productUrl(same, "https://shop.test/dp/1?ref=x#reviews")).toBe("https://shop.test/dp/1");
    const cross = page(`<head><link rel="canonical" href="https://evil.test/dp/1"></head>`);
    expect(productUrl(cross, "https://shop.test/dp/1?a=1#h")).toBe("https://shop.test/dp/1?a=1");
  });
});
