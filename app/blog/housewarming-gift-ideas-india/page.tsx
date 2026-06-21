import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "75 Housewarming Gift Ideas in India: Thoughtful Gifts for Every Budget (2026) | Gifaa Blog" },
  description:
    "Looking for the perfect housewarming gift in India? From Griha Pravesh essentials to smart home gadgets, here are 75 thoughtful ideas across every budget.",
  alternates: { canonical: "https://gifaa.in/blog/housewarming-gift-ideas-india" },
  openGraph: {
    title: "75 Housewarming Gift Ideas in India: Thoughtful Gifts for Every Budget",
    description:
      "From Griha Pravesh essentials to smart home gadgets — 75 thoughtful housewarming gift ideas for every budget.",
    url: "https://gifaa.in/blog/housewarming-gift-ideas-india",
    type: "article",
    images: [{ url: "https://gifaa.in/housewarming-gifts-flatlay.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "75 Housewarming Gift Ideas in India: Thoughtful Gifts for Every Budget",
  description:
    "From Griha Pravesh essentials to smart home gadgets — 75 thoughtful housewarming gift ideas for every budget.",
  url: "https://gifaa.in/blog/housewarming-gift-ideas-india",
  datePublished: "2026-06-21",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

const giftCategories = [
  {
    emoji: "🔧",
    title: "Practical Housewarming Gifts",
    subtitle: "Useful from day one — things every new home needs",
    color: "bg-blue-50 border-blue-100",
    labelColor: "text-blue-700",
    gifts: [
      "Air Fryer",
      "Coffee Machine",
      "Vacuum Cleaner",
      "Water Purifier",
      "Storage Organisers",
      "Tool Kit",
      "Smart Speaker",
      "Extension Boards",
      "Laundry Basket",
      "Shoe Rack",
    ],
  },
  {
    emoji: "🪔",
    title: "Traditional Griha Pravesh Gifts",
    subtitle: "Popular choices for Indian housewarming ceremonies",
    color: "bg-amber-50 border-amber-100",
    labelColor: "text-amber-700",
    gifts: [
      "Silver Idols",
      "Brass Lamps",
      "Puja Thali Set",
      "Ganesha Idol",
      "Indoor Tulsi Plant",
      "Religious Wall Art",
      "Decorative Diyas",
      "Temple Bells",
    ],
  },
  {
    emoji: "🪴",
    title: "Home Decor Gifts",
    subtitle: "Beautiful additions to make any space feel like home",
    color: "bg-emerald-50 border-emerald-100",
    labelColor: "text-emerald-700",
    gifts: [
      "Indoor Plants",
      "Wall Clocks",
      "Decorative Mirrors",
      "Canvas Art",
      "Rugs",
      "Designer Lamps",
      "Candle Holders",
      "Photo Frames",
      "Planters",
    ],
  },
  {
    emoji: "💡",
    title: "Smart Home Gifts",
    subtitle: "Tech gifts for the modern Indian homeowner",
    color: "bg-violet-50 border-violet-100",
    labelColor: "text-violet-700",
    gifts: [
      "Smart Bulbs",
      "Video Doorbell",
      "Smart Plugs",
      "Home Security Camera",
      "Smart Display",
      "Smart Lock",
    ],
  },
  {
    emoji: "🏠",
    title: "Gifts for First-Time Homeowners",
    subtitle: "First-time homeowners often appreciate the essentials most",
    color: "bg-rose-50 border-rose-100",
    labelColor: "text-rose-700",
    gifts: [
      "Storage Solutions",
      "Kitchen Essentials",
      "Cleaning Equipment",
      "Smart Home Devices",
      "Furniture Vouchers",
      "Appliance Contributions",
    ],
  },
];

const budgetTiers = [
  {
    budget: "Under ₹1,000",
    color: "bg-teal-50 border-teal-100",
    labelColor: "text-teal-700",
    gifts: [
      "Plants",
      "Scented Candles",
      "Decorative Trays",
      "Photo Frames",
      "Gift Cards",
      "Coffee Mugs",
      "Wall Hangings",
    ],
  },
  {
    budget: "Under ₹5,000",
    color: "bg-indigo-50 border-indigo-100",
    labelColor: "text-indigo-700",
    gifts: [
      "Air Fryer",
      "Smart Speaker",
      "Cookware Set",
      "Premium Bedding",
      "Home Fragrance Kit",
      "Designer Planters",
      "Decorative Lighting",
    ],
  },
];

const registryBenefits = [
  "Avoid duplicate gifts entirely",
  "Make gifting easier for guests",
  "Prioritise items actually needed for the new home",
  "Enable group gifting for larger purchases",
];

export default function HousewarmingGiftIdeasIndia() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <article className="container mx-auto px-6 max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-charcoal-light hover:text-royal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-4">
              Housewarming
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              75 Housewarming Gift Ideas in India: Thoughtful Gifts for Every Budget
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              From Griha Pravesh traditions to smart home essentials — gifts that help a house become a home.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> June 21, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 6 min read
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/housewarming-gifts-flatlay.png"
              alt="Beautiful housewarming gift arrangement with Indian decor"
              className="w-full h-64 md:h-80 object-cover object-center"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <p className="text-charcoal leading-relaxed text-lg">
              Moving into a new home is one of life&apos;s biggest milestones. Whether it&apos;s a first apartment, a dream home, or a fresh start in a new city, housewarming celebrations are a chance to help homeowners begin their next chapter in the best way possible.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              If you&apos;re wondering what to bring to a housewarming party or Griha Pravesh ceremony, this guide has you covered — with 75 ideas across every category and budget.
            </p>

            {/* Gift categories */}
            <div className="space-y-8 my-10 not-prose">
              {giftCategories.map((cat) => (
                <div key={cat.title} className={`rounded-2xl border p-6 ${cat.color}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h2 className="text-xl font-serif font-bold text-royal">{cat.title}</h2>
                  </div>
                  <p className={`text-sm font-medium mb-4 ml-10 ${cat.labelColor}`}>
                    {cat.subtitle}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ml-1">
                    {cat.gifts.map((gift) => (
                      <div
                        key={gift}
                        className="bg-white/70 rounded-lg px-3 py-2 text-sm text-charcoal font-medium border border-white/80"
                      >
                        {gift}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Budget tiers */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-12 mb-4">
              Gifts by Budget
            </h2>
            <p className="text-charcoal leading-relaxed">
              Great housewarming gifts don&apos;t have to break the bank. Here are ideas across two popular price points:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 not-prose">
              {budgetTiers.map((tier) => (
                <div key={tier.budget} className={`rounded-2xl border p-6 ${tier.color}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${tier.labelColor}`}>
                    {tier.budget}
                  </p>
                  <ul className="space-y-2">
                    {tier.gifts.map((g) => (
                      <li key={g} className="flex items-center gap-2 text-sm text-charcoal">
                        <span className={`font-bold ${tier.labelColor}`}>•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mid-article image */}
            <div className="rounded-2xl overflow-hidden my-10 not-prose">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/housewarming-gifts-garden.png"
                alt="Housewarming gifts in a beautiful garden setting"
                className="w-full h-72 object-cover object-center"
              />
            </div>

            {/* Why registries */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Why Housewarming Registries Are Growing in India
            </h2>
            <p className="text-charcoal leading-relaxed">
              Traditionally, guests choose gifts based on what they think the homeowner needs. The result is often duplicate gifts, unused decor items, or appliances the family already purchased on their own.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Many homeowners now create gift registries so friends and family can contribute towards things they genuinely need — making the whole experience better for everyone.
            </p>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 my-6 not-prose">
              <p className="text-xs font-bold text-gold uppercase tracking-wider mb-4">
                Benefits of a Housewarming Registry
              </p>
              <ul className="space-y-3">
                {registryBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-charcoal leading-relaxed">
              Platforms like{" "}
              <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">
                Gifaa
              </Link>{" "}
              allow homeowners to create a housewarming registry and share it with guests in minutes — no complicated setup, no fees.
            </p>

            {/* Final thoughts */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Final Thoughts
            </h2>
            <p className="text-charcoal leading-relaxed">
              The best housewarming gifts are practical, thoughtful, and genuinely useful. Whether you&apos;re gifting a simple indoor plant or contributing towards a larger purchase, helping someone build their new home is always deeply appreciated.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              And if you&apos;re the homeowner, creating a registry can help ensure every gift serves a real purpose in your new space.
            </p>

            {/* CTA */}
            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center not-prose">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Moving into a new home?
              </h3>
              <p className="text-charcoal-light mb-6">
                Create your free housewarming registry on Gifaa and share one link with family and friends — so every gift counts.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-royal text-white px-8 py-3 rounded-lg font-medium hover:bg-royal-light transition-colors"
              >
                Create Your Housewarming Registry — Free
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
