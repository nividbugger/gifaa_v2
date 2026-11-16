import type { Extractor } from "./types";
import { parsePriceText } from "./price";

type Node = Record<string, any>;

function collectNodes(value: unknown, out: Node[] = []): Node[] {
  if (Array.isArray(value)) value.forEach((v) => collectNodes(v, out));
  else if (value && typeof value === "object") {
    out.push(value as Node);
    collectNodes((value as Node)["@graph"], out);
  }
  return out;
}

const isProduct = (node: Node) => [node["@type"]].flat().includes("Product");

const firstString = (value: unknown): string | null => {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v === "string") return v;
  if (v && typeof v === "object") return firstString((v as Node).url ?? (v as Node).contentUrl);
  return null;
};

function priceFromOffers(offers: unknown): number | null {
  for (const offer of [offers].flat() as Node[]) {
    if (!offer) continue;
    const raw = offer.price ?? offer.lowPrice ?? offer.priceSpecification?.price;
    const price = parsePriceText(raw === undefined ? null : String(raw));
    if (price) return price;
    const nested = priceFromOffers(offer.offers);
    if (nested) return nested;
  }
  return null;
}

/** schema.org Product markup: the most reliable source, present on most large retailers. */
export const extractJsonLd: Extractor = (doc) => {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of Array.from(scripts)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(script.textContent ?? "");
    } catch {
      continue;
    }
    const product = collectNodes(parsed).find(isProduct);
    if (product) {
      return {
        title: firstString(product.name),
        image: firstString(product.image),
        description: firstString(product.description),
        price: priceFromOffers(product.offers),
      };
    }
  }
  return {};
};
