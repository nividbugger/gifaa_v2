import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "7 Reasons Why Gift Registries Are Replacing Traditional Gifting in India | Gifaa Blog" },
  description:
    "Discover why modern Indian families are switching from traditional gifting to curated gift registries. From UPI to WhatsApp sharing, the shift is real.",
  alternates: { canonical: "https://gifaa.in/blog/gift-registries-replacing-traditional-gifting" },
  openGraph: {
    title: "7 Reasons Why Gift Registries Are Replacing Traditional Gifting in India",
    description:
      "From UPI to WhatsApp sharing, discover why gift registries are the new normal in India.",
    url: "https://gifaa.in/blog/gift-registries-replacing-traditional-gifting",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1200&h=630&fit=crop&q=80",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "7 Reasons Why Gift Registries Are Replacing Traditional Gifting in India",
  description:
    "Discover why modern Indian families are switching from traditional gifting to curated gift registries.",
  url: "https://gifaa.in/blog/gift-registries-replacing-traditional-gifting",
  datePublished: "2026-04-10",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

export default function GiftRegistriesReplacingTraditionalGiftingBlog() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <article className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-charcoal-light hover:text-royal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-4">
              Trends
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              7 Reasons Why Gift Registries Are Replacing Traditional Gifting in India
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              The cultural shift from obligation-based gifting to intentional gifting is here.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> April 10, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 4 min read
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1200&h=500&fit=crop&q=80"
              alt="Gift boxes arranged beautifully"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal leading-relaxed text-lg">
              For decades, gifting in India has followed a familiar pattern — boxed items, cash envelopes, and a lot of guesswork. But things are changing fast. Here&apos;s why gift registries in India are becoming the new normal.
            </p>

            {/* Reason 1 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">1</span>
                <h2 className="text-xl font-serif font-semibold text-royal">People Want Useful Gifts</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                Modern consumers value practicality over tradition. Registries ensure every gift serves a purpose — no more unwanted dinner sets gathering dust in a cupboard.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">2</span>
                <h2 className="text-xl font-serif font-semibold text-royal">Digital Payments Have Changed Everything</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                With UPI adoption exploding across India, sending money is easier than ever — making registry-based contributions feel completely natural.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">3</span>
                <h2 className="text-xl font-serif font-semibold text-royal">E-commerce Has Made Choice Infinite</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                Platforms like <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">Gifaa</Link> allow users to add products from any store, removing limitations of traditional single-brand registries.
              </p>
            </div>

            {/* Reason 4 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">4</span>
                <h2 className="text-xl font-serif font-semibold text-royal">Millennials Prefer Experiences</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                Instead of physical gifts, couples now prefer:
              </p>
              <ul className="space-y-2 mt-3 ml-4">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Travel funds & honeymoon contributions</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Home down payments</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>Experience gifts like cooking classes or spa days</span>
                </li>
              </ul>
            </div>

            {/* Reason 5 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">5</span>
                <h2 className="text-xl font-serif font-semibold text-royal">Social Sharing is Easy</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                Registries can be shared via WhatsApp with a single tap, making adoption completely frictionless in the Indian context where WhatsApp is king.
              </p>
            </div>

            {/* Reason 6 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">6</span>
                <h2 className="text-xl font-serif font-semibold text-royal">Transparency Builds Trust</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                Guests know exactly what the couple wants — no second guessing, no awkward returns. Everyone wins.
              </p>
            </div>

            {/* Reason 7 */}
            <div className="bg-white rounded-xl border border-gold/10 p-6 my-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold text-lg">7</span>
                <h2 className="text-xl font-serif font-semibold text-royal">It Reduces Waste</h2>
              </div>
              <p className="text-charcoal leading-relaxed">
                No unwanted items means less clutter and more sustainability. It&apos;s gifting that&apos;s better for everyone — and the planet.
              </p>
            </div>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              The Cultural Shift
            </h2>
            <p className="text-charcoal leading-relaxed">
              India is moving from:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="bg-charcoal/5 rounded-xl p-5 text-center">
                <p className="text-sm text-charcoal-light mb-1">From</p>
                <p className="font-serif font-semibold text-charcoal">Obligation-based gifting</p>
                <p className="font-serif font-semibold text-charcoal">Physical items only</p>
              </div>
              <div className="bg-royal/5 rounded-xl p-5 text-center">
                <p className="text-sm text-royal mb-1">To</p>
                <p className="font-serif font-semibold text-royal">Intentional gifting</p>
                <p className="font-serif font-semibold text-royal">Flexible contributions</p>
              </div>
            </div>

            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Be part of the shift
              </h3>
              <p className="text-charcoal-light mb-6">
                Create your free gift registry on Gifaa and experience the future of gifting in India.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-royal text-white px-8 py-3 rounded-lg font-medium hover:bg-royal-light transition-colors"
              >
                Create Your Registry — Free
              </Link>
            </div>
          </div>
        </article>

        <RegistryCrossLinks />
      </main>

      <Footer />
    </div>
  );
}
