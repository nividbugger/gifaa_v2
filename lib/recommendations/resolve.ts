// Server-only: reads server env and uses the Next data cache. Import it from server components only.
import { unstable_cache } from "next/cache";
import { getRetailerInfo, isAmazonUrl } from "@/shared/retailers";
import { scrapeProduct, type ProductData } from "@/shared/scrape-product";
import type { CatalogItem, CatalogSection } from "./catalog";
import { findCatalogProblems } from "./catalog-rules";
import { nameFromUrl, storeLabel, tidyTitle, usableScrape, type RecommendedProduct } from "./product";

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;
// The scraper can take up to 45s when a site fights back; never let that stall page generation.
const SCRAPE_TIMEOUT_MS = 20_000;

// Throwing on failure keeps failed scrapes OUT of the cache (unstable_cache only stores returned values),
// so a temporary outage retries on the next request instead of being remembered for a week.
const scrapeCached = unstable_cache(
  async (url: string): Promise<ProductData> => {
    const result = await Promise.race([
      scrapeProduct(
        { url: process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
        url
      ),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("scrape timed out")), SCRAPE_TIMEOUT_MS)),
    ]);
    const data = usableScrape(result);
    if (!data) throw new Error(result.error ?? "scraper returned no usable details");
    return data;
  },
  ["recommendation-scrape"],
  { revalidate: ONE_WEEK_SECONDS }
);

async function resolveItem(item: CatalogItem): Promise<RecommendedProduct> {
  // With a name and image set by hand nothing is fetched, so a price only shows if you set one (prices go stale).
  const needsLookup = !item.name || !item.image;
  const scraped = needsLookup ? await scrapeCached(item.url).catch(() => null) : null;

  return {
    url: item.url,
    name: item.name ?? (scraped?.title ? tidyTitle(scraped.title) : nameFromUrl(item.url)),
    image: item.image ?? scraped?.image ?? null,
    price: item.price ?? scraped?.price ?? null,
    store: item.store ?? storeLabel(item.url, getRetailerInfo(item.url)?.name),
  };
}

export interface ResolvedSection extends Omit<CatalogSection, "items"> {
  products: RecommendedProduct[];
}

export async function resolveSections(sections: CatalogSection[]): Promise<ResolvedSection[]> {
  // Fail the build rather than ship an untagged Amazon link (or other catalog mistake).
  const problems = findCatalogProblems(sections, isAmazonUrl);
  if (problems.length) throw new Error(`Invalid recommendations catalog:\n - ${problems.join("\n - ")}`);

  return Promise.all(
    sections.map(async ({ items, ...section }) => ({ ...section, products: await Promise.all(items.map(resolveItem)) }))
  );
}
