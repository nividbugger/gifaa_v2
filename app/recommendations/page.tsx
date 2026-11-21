import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCarousel from "@/components/recommendations/ProductCarousel";
import { RECOMMENDATION_SECTIONS } from "@/lib/recommendations/catalog";
import { resolveSections } from "@/lib/recommendations/resolve";

// Curated content: render statically and refresh hourly. (Product details are cached longer inside resolveSections.)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gift Recommendations",
  description: "Hand-picked gift ideas from Amazon and other popular stores.",
  alternates: { canonical: "https://gifaa.in/recommendations" },
};

export default async function RecommendationsPage() {
  const sections = await resolveSections(RECOMMENDATION_SECTIONS);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-3">Gift Recommendations</h1>
            <p className="text-charcoal-light max-w-md mx-auto">Hand-picked ideas to inspire your registry or your next gift.</p>
          </div>

          <div className="space-y-12 md:space-y-14">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                <div className="mb-4 md:mb-5">
                  <h2 id={`${section.id}-heading`} className="text-xl md:text-2xl font-serif font-bold text-royal">
                    {section.title}
                  </h2>
                  <p className="text-sm text-charcoal-light mt-0.5">{section.subtitle}</p>
                </div>

                {section.products.length > 0 ? (
                  <ProductCarousel products={section.products} label={section.title} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-gold/30 bg-white/60 px-6 py-10 text-center">
                    <p className="text-sm text-charcoal-light">Fresh picks are on their way. Check back soon.</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-charcoal-light max-w-xl mx-auto">
            Some links may be affiliate links. If you buy through them, Gifaa may earn a small commission at no extra cost to you.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
