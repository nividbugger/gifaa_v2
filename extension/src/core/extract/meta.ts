import type { Extractor } from "./types";
import { parsePriceText } from "./price";

function meta(doc: Document, ...names: string[]): string | null {
  for (const name of names) {
    const el = doc.querySelector<HTMLMetaElement>(`meta[property="${name}"], meta[name="${name}"], meta[itemprop="${name}"]`);
    const content = el?.content?.trim();
    if (content) return content;
  }
  return null;
}

/** OpenGraph / Twitter / product meta tags, with `<title>` as a last resort. */
export const extractMeta: Extractor = (doc, pageUrl) => {
  const image = meta(doc, "og:image", "twitter:image");
  return {
    title: meta(doc, "og:title", "twitter:title") ?? (doc.title.trim() || null),
    description: meta(doc, "og:description", "description", "twitter:description"),
    image: image ? new URL(image, pageUrl).href : null,
    price: parsePriceText(meta(doc, "product:price:amount", "og:price:amount", "price")),
  };
};
