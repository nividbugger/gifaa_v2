import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { occasionLabels, occasionIcons, type OccasionType } from "@/lib/registry-templates";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Amazon Gift Recommendations",
  description: "Browse Amazon gift ideas picked by real Gifaa registries, organized by occasion.",
  alternates: { canonical: "https://gifaa.in/recommendations" },
};

interface RawGiftRow {
  id: string;
  product_name: string;
  product_url: string | null;
  product_image_url: string | null;
  price: number | null;
  registries: {
    occasion: OccasionType;
    is_public: boolean;
  } | null;
}

async function getAmazonGiftsByOccasion() {
  const supabase = await createServerSupabaseClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await supabase
    .from("registry_gifts")
    .select("id, product_name, product_url, product_image_url, price, registries!inner(occasion, is_public)")
    .eq("registries.is_public", true)
    .or("product_url.ilike.%amazon.%,product_url.ilike.%amzn.%")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching Amazon recommendations:", error);
    return {} as Record<OccasionType, RawGiftRow[]>;
  }

  const grouped: Record<string, RawGiftRow[]> = {};
  for (const gift of data as unknown as RawGiftRow[]) {
    if (!gift.product_url) continue;
    const occasion = gift.registries?.occasion ?? "other";
    if (!grouped[occasion]) grouped[occasion] = [];
    grouped[occasion].push(gift);
  }

  return grouped as Record<OccasionType, RawGiftRow[]>;
}

const OCCASION_ORDER: OccasionType[] = ["wedding", "baby_shower", "housewarming", "birthday", "anniversary", "other"];

export default async function RecommendationsPage() {
  const giftsByOccasion = await getAmazonGiftsByOccasion();
  const occasionsWithGifts = OCCASION_ORDER.filter((occasion) => giftsByOccasion[occasion]?.length > 0);
  const totalCount = occasionsWithGifts.reduce((sum, occasion) => sum + giftsByOccasion[occasion].length, 0);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-3">
              Gift Recommendations
            </h1>
            <p className="text-charcoal-light max-w-lg mx-auto">
              Gift ideas real couples, parents, and hosts have added to their Gifaa registries — organized by occasion for easy browsing.
            </p>
          </div>

          {totalCount === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gold/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal/5 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-charcoal/30" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">No recommendations yet</h3>
              <p className="text-charcoal-light text-sm max-w-sm mx-auto">
                Once public registries add Amazon links, they&apos;ll show up here as gift ideas.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {occasionsWithGifts.map((occasion) => (
                <section key={occasion}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-lg">{occasionIcons[occasion]}</span>
                    <h2 className="text-2xl font-serif font-bold text-royal">
                      {occasionLabels[occasion]}
                    </h2>
                    <span className="text-gold text-lg">❈</span>
                    <span className="text-sm text-charcoal-light">
                      {giftsByOccasion[occasion].length} {giftsByOccasion[occasion].length === 1 ? "idea" : "ideas"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {giftsByOccasion[occasion].map((gift) => (
                      <RecommendationCard
                        key={gift.id}
                        gift={{
                          id: gift.id,
                          product_name: gift.product_name,
                          product_url: gift.product_url as string,
                          product_image_url: gift.product_image_url,
                          price: gift.price,
                        }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
