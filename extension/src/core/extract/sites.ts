import type { Extractor } from "./types";
import { parsePriceText } from "./price";

const text = (doc: Document, selector: string) => doc.querySelector(selector)?.textContent?.trim() || null;

interface SiteExtractor {
  matches: (hostname: string) => boolean;
  extract: Extractor;
}

// Add a retailer here when generic JSON-LD / meta extraction proves unreliable for it.
const SITES: SiteExtractor[] = [
  {
    matches: (host) => /(^|\.)amazon\./.test(host),
    extract: (doc) => {
      const image = doc.querySelector<HTMLImageElement>("#landingImage, #imgBlkFront");
      return {
        title: text(doc, "#productTitle"),
        price: parsePriceText(text(doc, "#corePrice_feature_div .a-offscreen, .a-price .a-offscreen")),
        image: image?.getAttribute("data-old-hires") || image?.src || null,
      };
    },
  },
];

export const extractSiteSpecific: Extractor = (doc, pageUrl) => {
  const hostname = new URL(pageUrl).hostname;
  return SITES.find((s) => s.matches(hostname))?.extract(doc, pageUrl) ?? {};
};
