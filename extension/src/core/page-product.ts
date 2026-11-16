import { scrapeProduct } from "@shared/scrape-product";
import { config } from "./config";
import type { ExtractedProduct } from "./extract";

export interface PageProduct extends ExtractedProduct {
  url: string | null;
}

const isWebUrl = (url?: string) => !!url && /^https?:/.test(url);

/** Reads the product from the active tab. Never throws: restricted pages just yield an empty product. */
export async function readActiveTabProduct(): Promise<PageProduct> {
  const empty: PageProduct = { title: null, price: null, image: null, description: null, url: null };
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !isWebUrl(tab.url)) return empty;

  try {
    const [injection] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["/content-scripts/extract.js"],
    });
    return { ...empty, url: tab.url ?? null, ...(injection?.result as Partial<PageProduct>) };
  } catch {
    return { ...empty, title: tab.title ?? null, url: tab.url ?? null };
  }
}

/** Server-side scrape as a gap-filler for pages the on-page extractor couldn't fully read. */
export async function scrapeMissing(url: string): Promise<ExtractedProduct | null> {
  const result = await scrapeProduct(config.supabase, url);
  return result.success && result.data ? result.data : null;
}
