// Client for the `scrape-product` Supabase edge function. Environment-agnostic:
// callers pass the Supabase config (Next.js reads process.env, the extension reads import.meta.env).

export interface ProductData {
  title: string | null;
  price: number | null;
  image: string | null;
  description: string | null;
}

export interface ScrapeResponse {
  success: boolean;
  error?: string;
  data?: ProductData;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export async function scrapeProduct(config: SupabaseConfig, productUrl: string): Promise<ScrapeResponse> {
  try {
    const response = await fetch(`${config.url}/functions/v1/scrape-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.anonKey}`,
        apikey: config.anonKey,
      },
      body: JSON.stringify({ url: productUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function error:", response.status, errorText);
      return { success: false, error: `Edge function returned ${response.status}` };
    }

    return (await response.json()) as ScrapeResponse;
  } catch (err) {
    console.error("Error calling scrape function:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch product details",
    };
  }
}
