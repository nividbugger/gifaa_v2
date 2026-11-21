// Pure helpers for turning a catalog entry into something displayable. No framework imports,
// so they're unit-tested directly.

import type { ProductData, ScrapeResponse } from "../../shared/scrape-product";

export interface RecommendedProduct {
  url: string;
  name: string;
  image: string | null;
  price: number | null;
  /** Shown on the button, e.g. "Amazon". */
  store: string;
}

/**
 * Last-resort product name from the URL when we have neither an override nor scraped details.
 * Amazon-style links carry the title in the path (`/Copper-Water-Bottle-1L/dp/B0…`).
 */
export function nameFromUrl(url: string): string {
  try {
    const { pathname, hostname } = new URL(url);
    const slug = pathname
      .split("/")
      .map((segment) => decodeURIComponent(segment))
      .filter((segment) => /^[A-Za-z0-9-_%]+$/.test(segment) && segment.includes("-") && !/^[A-Z0-9]{10}$/.test(segment))
      .sort((a, b) => b.length - a.length)[0];
    if (slug) {
      return slug
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return `Gift idea from ${hostname.replace(/^www\./, "")}`;
  } catch {
    return "Gift idea";
  }
}

/** Store label for the button: a known retailer's name, else the bare hostname. */
export function storeLabel(url: string, knownName: string | null | undefined): string {
  if (knownName) return knownName;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the store";
  }
}

const MAX_TITLE_LENGTH = 80;

/**
 * Retail titles are often SEO-stuffed ("Brand Product | Feature | Feature - Feature …"). Keep the part
 * before the first "|" and cap the length at a word boundary. Only used on scraped titles, never overrides.
 */
export function tidyTitle(title: string): string {
  const head = (title.split("|")[0] ?? title).replace(/\s+/g, " ").trim().replace(/[-–—,:;\s]+$/, "");
  if (head.length <= MAX_TITLE_LENGTH) return head || title.trim();
  const cut = head.slice(0, MAX_TITLE_LENGTH);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).replace(/[-–—,:;\s]+$/, "")}…`;
}

/**
 * The scraper's last tier reports success while only guessing a title from the URL (`fallback: true`,
 * no image or price). That is not real data, so treat it as a miss and let nameFromUrl/overrides decide.
 */
export function usableScrape(response: ScrapeResponse): ProductData | null {
  if (!response.success || !response.data || response.fallback) return null;
  const { title, image, price } = response.data;
  return title || image || price ? response.data : null;
}
