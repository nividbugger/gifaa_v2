import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface ProductData {
  title: string | null;
  price: number | null;
  image: string | null;
  description: string | null;
}

interface ScrapeResponse {
  success: boolean;
  error?: string;
  data?: ProductData;
}

export async function scrapeProductUrl(url: string): Promise<ScrapeResponse> {
  const supabase = getSupabaseBrowserClient();
  try {
    const { data, error } = await supabase.functions.invoke("scrape-product", {
      body: { url },
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      return { success: false, error: error.message };
    }

    return data as ScrapeResponse;
  } catch (err) {
    console.error("Error calling scrape function:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch product details",
    };
  }
}
