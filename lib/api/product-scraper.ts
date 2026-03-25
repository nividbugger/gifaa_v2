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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/scrape-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "apikey": supabaseAnonKey,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function error:", response.status, errorText);
      return { success: false, error: `Edge function returned ${response.status}` };
    }

    const data = await response.json();
    return data as ScrapeResponse;
  } catch (err) {
    console.error("Error calling scrape function:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch product details",
    };
  }
}

