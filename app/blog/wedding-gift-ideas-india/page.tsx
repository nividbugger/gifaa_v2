import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "101 Wedding Gift Ideas for Indian Couples (2026) | Gifaa Blog" },
  description:
    "Stuck on what to gift an Indian couple in 2026? From practical appliances to luxury experiences, here are 101 thoughtful wedding gift ideas across every budget.",
  alternates: { canonical: "https://gifaa.in/blog/wedding-gift-ideas-india" },
  openGraph: {
    title: "101 Wedding Gift Ideas for Indian Couples (2026)",
    description:
      "From practical appliances to luxury experiences — 101 thoughtful wedding gift ideas for Indian couples across every budget.",
    url: "https://gifaa.in/blog/wedding-gift-ideas-india",
    type: "article",
    images: [{ url: "https://gifaa.in/indian-wedding-gifts-couple.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "101 Wedding Gift Ideas for Indian Couples (2026)",
  description:
    "From practical appliances to luxury experiences — 101 thoughtful wedding gift ideas for Indian couples across every budget.",
  url: "https://gifaa.in/blog/wedding-gift-ideas-india",
  datePublished: "2026-06-21",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

const giftCategories = [
  {
    emoji: "🏠",
    title: "Practical Gifts for Everyday Life",
    subtitle: "Gifts couples will actually use after the celebrations are over",
    color: "bg-blue-50 border-blue-100",
    labelColor: "text-blue-700",
    gifts: [
      "Air Fryer",
      "Microwave Oven",
      "Coffee Machine",
      "Mixer Grinder",
      "Vacuum Cleaner",
      "Water Purifier",
      "Premium Cookware Set",
      "Bed Linen Set",
      "Dinnerware Set",
      "Smart Speaker",
    ],
  },
  {
    emoji: "✈️",
    title: "Gifts for Couples Who Love Travel",
    subtitle: "Travel is becoming one of the most popular wedding gift categories",
    color: "bg-teal-50 border-teal-100",
    labelColor: "text-teal-700",
    gifts: [
      "Flight Vouchers",
      "Hotel Stay Vouchers",
      "Luggage Set",
      "Travel Backpacks",
      "Travel Organisers",
      "International SIM Cards",
      "Travel Camera",
      "Noise-Cancelling Headphones",
      "Honeymoon Fund Contribution",
      "Experience Vouchers",
    ],
  },
  {
    emoji: "💡",
    title: "Smart Home Gifts",
    subtitle: "Technology-focused gifts popular among newly married couples",
    color: "bg-violet-50 border-violet-100",
    labelColor: "text-violet-700",
    gifts: [
      "Smart Lights",
      "Video Doorbell",
      "Smart Lock",
      "Robot Vacuum Cleaner",
      "Smart Display",
      "Home Security Camera",
      "Smart Thermostat",
      "Smart Plugs",
    ],
  },
  {
    emoji: "🪴",
    title: "Home Decor Gifts",
    subtitle: "Perfect for couples moving into a new home",
    color: "bg-emerald-50 border-emerald-100",
    labelColor: "text-emerald-700",
    gifts: [
      "Indoor Plants",
      "Wall Art",
      "Decorative Mirrors",
      "Designer Lamps",
      "Rugs",
      "Bookshelves",
      "Scented Candle Collection",
      "Photo Frames",
      "Planters",
    ],
  },
  {
    emoji: "👑",
    title: "Luxury Wedding Gifts",
    subtitle: "For close friends and family who want to go all out",
    color: "bg-amber-50 border-amber-100",
    labelColor: "text-amber-700",
    gifts: [
      "Premium Watch Set",
      "Luxury Luggage",
      "Designer Home Decor",
      "Fine Dining Experience",
      "Resort Stay",
      "Spa Membership",
      "High-End Kitchen Appliances",
    ],
  },
];

const budgetTiers = [
  {
    budget: "Under ₹1,000",
    color: "bg-rose-50 border-rose-100",
    labelColor: "text-rose-600",
    gifts: [
      "Personalised Mugs",
      "Indoor Plants",
      "Photo Frames",
      "Journals",
      "Gift Cards",
      "Custom Illustrations",
      "Scented Candles",
    ],
  },
  {
    budget: "Under ₹5,000",
    color: "bg-indigo-50 border-indigo-100",
    labelColor: "text-indigo-700",
    gifts: [
      "Air Fryer",
      "Smart Speaker",
      "Luxury Bedding",
      "Cookware Set",
      "Dinnerware Collection",
      "Premium Luggage Accessories",
      "Restaurant Vouchers",
    ],
  },
];

export default function WeddingGiftIdeasIndia() {
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
              Gift Ideas
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              101 Wedding Gift Ideas for Indian Couples (2026)
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              Thoughtful, useful, and memorable — for every budget and every kind of couple.
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
              src="/indian-wedding-gifts-couple.png"
              alt="Indian couple opening wedding gifts"
              className="w-full h-64 md:h-80 object-cover object-center"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <p className="text-charcoal leading-relaxed text-lg">
              Finding the perfect wedding gift can be surprisingly difficult. You want something thoughtful, useful, and memorable — but you also don&apos;t want to give the couple their third dinner set or another decorative showpiece that ends up collecting dust.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Whether you&apos;re attending a close friend&apos;s wedding, a cousin&apos;s celebration, or a colleague&apos;s big day, here are some of the best wedding gift ideas for Indian couples in 2026.
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
            <h2 className="text-2xl font-serif font-semibold text-royal mt-12 mb-6">
              Gifts by Budget
            </h2>
            <p className="text-charcoal leading-relaxed">
              Not every thoughtful gift needs a large budget. Here are ideas organised by price range:
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
                src="/indian-wedding-gift-flatlay.png"
                alt="Beautiful Indian wedding gift arrangement"
                className="w-full h-72 object-cover object-center"
              />
            </div>

            {/* Problem with traditional gifts */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              The Problem with Traditional Wedding Gifts
            </h2>
            <p className="text-charcoal leading-relaxed">
              Despite the best intentions, many couples end up receiving:
            </p>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 my-6 not-prose">
              <ul className="space-y-2.5">
                {[
                  "Duplicate gifts from multiple guests",
                  "Unwanted items that don't match their style",
                  "Incorrect sizes or colours",
                  "Gifts that don't match their actual lifestyle or needs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                    <span className="text-rose-400 font-bold mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-charcoal leading-relaxed">
              This is exactly why wedding gift registries are becoming increasingly popular in India — instead of guessing, guests can simply choose from a list of gifts the couple actually wants.
            </p>

            {/* Why registries */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Why More Indian Couples Are Creating Gift Registries
            </h2>
            <p className="text-charcoal leading-relaxed">
              A gift registry allows couples to:
            </p>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 my-6 not-prose">
              <ul className="space-y-3">
                {[
                  "Avoid duplicate gifts entirely",
                  "Receive items they genuinely need",
                  "Collect contributions towards larger purchases or experiences",
                  "Simplify gifting for guests — no more guessing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                    <span className="text-gold font-bold mt-0.5">✓</span>
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
              make it easy to create a registry for weddings, housewarmings, birthdays, and other milestones — ensuring every gift is meaningful and useful.
            </p>

            {/* Final thoughts */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Final Thoughts
            </h2>
            <p className="text-charcoal leading-relaxed">
              The best wedding gifts are the ones that make a couple&apos;s life easier, more enjoyable, or more memorable. Whether it&apos;s a practical appliance, a travel experience, or a contribution towards a larger goal, thoughtful gifting will always be appreciated more than buying something for the sake of it.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              And when in doubt? A gift registry ensures you&apos;re giving the couple exactly what they want.
            </p>

            {/* CTA */}
            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center not-prose">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Getting married? Build your wish list.
              </h3>
              <p className="text-charcoal-light mb-6">
                Create your free gift registry on Gifaa and share one link with all your guests — no duplicates, no guesswork.
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
