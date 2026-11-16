import { scrapeProduct, type ScrapeResponse } from "@/shared/scrape-product";

export type { ProductData, ScrapeResponse } from "@/shared/scrape-product";

export function scrapeProductUrl(url: string): Promise<ScrapeResponse> {
  return scrapeProduct(
    {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    url
  );
}
