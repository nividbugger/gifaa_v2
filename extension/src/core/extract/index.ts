import type { ExtractedProduct, Extractor } from "./types";
import { extractJsonLd } from "./json-ld";
import { extractMeta } from "./meta";
import { extractSiteSpecific } from "./sites";

export type { ExtractedProduct } from "./types";

/** Highest priority first: structured data beats site selectors beats generic meta tags. */
const LAYERS: Extractor[] = [extractJsonLd, extractSiteSpecific, extractMeta];

const FIELDS: (keyof ExtractedProduct)[] = ["title", "price", "image", "description"];

export function extractProduct(doc: Document, pageUrl: string): ExtractedProduct {
  const result: ExtractedProduct = { title: null, price: null, image: null, description: null };

  for (const layer of LAYERS) {
    let found: Partial<ExtractedProduct> = {};
    try {
      found = layer(doc, pageUrl);
    } catch {
      continue; // one broken layer must never block the others
    }
    for (const field of FIELDS) {
      if (result[field] === null && found[field]) (result as any)[field] = found[field];
    }
  }
  return result;
}
