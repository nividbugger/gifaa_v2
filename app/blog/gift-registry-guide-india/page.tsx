import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle, Star, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Best Gift Registry Platforms in India (2026): A Complete Guide for Modern Couples | Gifaa Blog" },
  description:
    "Compare the top gift registry platforms in India for 2026 — Gifaa, Hazlnut, Kiki, MyRegistry, and Amazon. Find out which platform is right for your wedding, housewarming, or baby shower.",
  alternates: { canonical: "https://gifaa.in/blog/gift-registry-guide-india" },
  openGraph: {
    title: "Best Gift Registry Platforms in India (2026): A Complete Guide for Modern Couples",
    description:
      "Compare the top gift registry platforms in India for 2026 — Gifaa, Hazlnut, Kiki, MyRegistry, and Amazon.",
    url: "https://gifaa.in/blog/gift-registry-guide-india",
    type: "article",
    images: [
      {
        url: "https://gifaa.in/indian-wedding-couple.png",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Best Gift Registry Platforms in India (2026): A Complete Guide for Modern Couples",
  description:
    "Compare the top gift registry platforms in India for 2026 — Gifaa, Hazlnut, Kiki, MyRegistry, and Amazon.",
  url: "https://gifaa.in/blog/gift-registry-guide-india",
  datePublished: "2026-06-21",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

const platforms = [
  {
    name: "Gifaa",
    tagline: "India's most complete gift registry — built for every milestone",
    badge: "Our Top Pick",
    badgeColor: "bg-gold text-white",
    highlight: true,
    description:
      "Gifaa is one of India's fastest-growing gift registry platforms and has quickly become a popular choice for couples, families, and individuals celebrating life's major milestones. Unlike many registry platforms that focus primarily on weddings, Gifaa supports a wide range of occasions — including housewarmings, anniversaries, birthdays, baby showers, and more.",
    features: [
      "Wedding, housewarming, birthday, baby shower & anniversary registries",
      "Cash contribution funds with UPI address",
      "Group gifting",
      "Universal gift additions from any website",
    ],
    pros: [
      "Fast setup — live in minutes",
      "Multiple occasion support",
      "Guest-friendly experience",
      "Cash and gift contributions",
      "Built specifically for Indian users",
    ],
    cons: ["Newer platform compared to international alternatives"],
    bestFor: "Couples and families who want a simple, beautifully designed registry for any occasion",
  },
  {
    name: "Hazlnut",
    tagline: "Wedding-focused registry with group gifting",
    badge: "Wedding Focused",
    badgeColor: "bg-royal/10 text-royal",
    highlight: false,
    description:
      "Hazlnut is a wedding-focused registry platform designed primarily for Indian couples. The platform focuses on helping couples receive meaningful gifts while enabling collaborative gifting experiences for guests.",
    features: [
      "Wedding registries",
      "Group gifting",
      "Cash contributions",
      "Universal wishlist support",
    ],
    pros: [
      "Wedding-focused experience",
      "Group gifting support",
      "Modern interface",
    ],
    cons: [
      "Primarily focused on weddings only",
      "May require more setup and configuration before the registry is ready to share",
    ],
    bestFor: "Couples looking specifically for a wedding registry",
  },
  {
    name: "Kiki",
    tagline: "Flexible registry combining gifts, experiences & contributions",
    badge: "Experience Gifting",
    badgeColor: "bg-rose-50 text-rose-600",
    highlight: false,
    description:
      "Kiki offers a modern registry platform that combines gifts, experiences, and contributions into one solution. The platform aims to provide flexibility for users who want more than a traditional gift registry.",
    features: [
      "Multi-occasion registries",
      "Experience gifting",
      "Cash contributions",
      "Universal gift additions",
    ],
    pros: [
      "Supports multiple occasions",
      "Modern user experience",
    ],
    cons: [
      "Feature-rich experience may require additional setup decisions",
    ],
    bestFor: "Flexible gifting preferences and modern celebrations",
  },
  {
    name: "MyRegistry",
    tagline: "Global universal registry with multi-retailer support",
    badge: "Global Platform",
    badgeColor: "bg-slate-100 text-slate-600",
    highlight: false,
    description:
      "MyRegistry is one of the oldest and most established registry platforms globally. The platform allows users to combine gifts from multiple retailers into a single registry.",
    features: [
      "Universal registry",
      "International retailer support",
      "Wedding registries",
      "Baby registries",
    ],
    pros: [
      "Established platform",
      "Global reach",
      "Universal registry functionality",
    ],
    cons: [
      "Not specifically designed for Indian users",
      "Payment and gifting experience may feel less familiar for Indian guests",
      "Setup process can be more involved compared to India-focused alternatives",
    ],
    bestFor: "International weddings or users with guests across multiple countries",
  },
  {
    name: "Amazon Registry",
    tagline: "Marketplace registry for Amazon shoppers",
    badge: "Marketplace",
    badgeColor: "bg-amber-50 text-amber-700",
    highlight: false,
    description:
      "Amazon offers registry functionality through its marketplace ecosystem. It works well for users who already shop heavily on Amazon and want to create a product-focused list.",
    features: [
      "Product registries",
      "Large product catalogue",
      "Marketplace integration",
    ],
    pros: [
      "Easy product selection",
      "Trusted platform",
      "Extensive catalogue",
    ],
    cons: [
      "Limited to Amazon products only",
      "Not ideal for cash contributions",
      "Less flexibility compared to dedicated registry platforms",
    ],
    bestFor: "Users who primarily shop on Amazon",
  },
];

const chooseFactors = [
  {
    icon: "⚡",
    title: "Ease of Setup",
    question: "Can you create and share your registry quickly?",
  },
  {
    icon: "🎊",
    title: "Occasion Support",
    question: "Will the platform still be useful after your wedding?",
  },
  {
    icon: "🤝",
    title: "Guest Experience",
    question: "Can guests contribute easily without unnecessary complexity?",
  },
  {
    icon: "🎁",
    title: "Flexibility",
    question: "Can you receive both gifts and contributions?",
  },
  {
    icon: "🇮🇳",
    title: "India-Focused Features",
    question: "Does the platform support how Indian families prefer to gift?",
  },
];

export default function BestGiftRegistryPlatformsIndia() {
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

          {/* Article header */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium mb-4">
              Platform Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              Best Gift Registry Platforms in India (2026) — A Complete Guide
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              The registry landscape in India has changed — here&apos;s what you need to know before you choose.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> June 21, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 7 min read
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/indian-wedding-couple.png"
              alt="Modern Indian wedding couple in traditional attire"
              className="w-full h-64 md:h-80 object-cover object-top"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <p className="text-charcoal leading-relaxed text-lg">
              Gone are the days when couples received three pressure cookers, five dinner sets, and a dozen photo frames at their wedding. Modern gift registries are changing how Indians celebrate life&apos;s biggest milestones — helping people receive gifts they actually want, while making gifting easier for guests.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Whether you&apos;re planning a wedding, housewarming, baby shower, birthday, or anniversary, choosing the right gift registry platform can make a huge difference. Here&apos;s a detailed look at the leading platforms available in India today.
            </p>

            {/* Platform cards */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-12 mb-6">
              The Top 5 Gift Registry Platforms in India
            </h2>

            <div className="space-y-8 not-prose">
              {platforms.map((platform, index) => (
                <div
                  key={platform.name}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    platform.highlight
                      ? "border-gold/40 shadow-[0_4px_24px_rgba(190,150,80,0.12)]"
                      : "border-gold/10"
                  } bg-white`}
                >
                  {/* Card header */}
                  <div
                    className={`px-6 pt-6 pb-4 ${
                      platform.highlight ? "bg-gradient-to-r from-gold/5 to-transparent" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-royal/10 text-royal flex items-center justify-center font-serif font-bold text-sm shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-royal">
                            {platform.name}
                            {platform.highlight && (
                              <Trophy className="inline w-4 h-4 text-gold ml-2 -mt-0.5" />
                            )}
                          </h3>
                          <p className="text-sm text-charcoal-light">{platform.tagline}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${platform.badgeColor}`}
                      >
                        {platform.highlight && <Star className="w-3 h-3 fill-current" />}
                        {platform.badge}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <p className="text-charcoal leading-relaxed text-sm mb-5">
                      {platform.description}
                    </p>

                    {/* Key features */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">
                        Key Features
                      </p>
                      <ul className="space-y-1.5">
                        {platform.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-charcoal">
                            <span className="text-gold mt-0.5 shrink-0">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pros and cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                          Pros
                        </p>
                        <ul className="space-y-1.5">
                          {platform.pros.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-sm text-charcoal">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">
                          Cons
                        </p>
                        <ul className="space-y-1.5">
                          {platform.cons.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm text-charcoal">
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Best for */}
                    <div className="mt-4 flex items-start gap-2 text-sm">
                      <span className="text-gold font-semibold shrink-0">Best For:</span>
                      <span className="text-charcoal">{platform.bestFor}</span>
                    </div>

                    {platform.highlight && (
                      <div className="mt-5">
                        <Link
                          href="/signup"
                          className="inline-block bg-royal text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-royal-light transition-colors"
                        >
                          Create Your Registry on Gifaa — Free
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* How to choose */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-14 mb-4">
              How to Choose the Right Gift Registry Platform
            </h2>
            <p className="text-charcoal leading-relaxed">
              When evaluating any registry platform, there are five questions worth asking before you commit:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
              {chooseFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="bg-white border border-gold/10 rounded-xl p-5 flex gap-4 items-start"
                >
                  <span className="text-2xl shrink-0">{factor.icon}</span>
                  <div>
                    <h4 className="font-serif font-semibold text-royal text-sm">{factor.title}</h4>
                    <p className="text-charcoal-light text-sm mt-0.5">{factor.question}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary image */}
            <div className="rounded-2xl overflow-hidden my-10 not-prose">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/indian-wedding-haldi.png"
                alt="Indian couple celebrating haldi ceremony"
                className="w-full h-72 object-cover object-center"
              />
            </div>

            {/* Recommendation */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Our Recommendation
            </h2>
            <p className="text-charcoal leading-relaxed">
              Every platform on this list solves the problem of unwanted gifts. But for most Indian users,{" "}
              <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">
                Gifaa
              </Link>{" "}
              offers the most balanced experience.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              It combines the simplicity of a modern registry, support for multiple life occasions, flexible gifting options, and an experience specifically designed for Indian users.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Rather than being a platform you&apos;ll use once for your wedding, Gifaa is designed to be your gifting companion for every major milestone — from your wedding day to your first home, growing family, anniversaries, and beyond.
            </p>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 my-6 not-prose">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Why Gifaa Stands Out</p>
              <ul className="space-y-2.5">
                {[
                  "Fast setup — most users are live in under 5 minutes",
                  "Multi-occasion support: weddings, housewarmings, baby showers, birthdays, anniversaries",
                  "UPI-integrated cash contributions — familiar for every Indian guest",
                  "Group gifting for high-value items",
                  "Built and optimised for Indian users from day one",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-charcoal leading-relaxed">
              If you&apos;re looking for a registry platform that&apos;s simple to set up, easy to share, and relevant throughout life&apos;s biggest celebrations, Gifaa is our top recommendation for 2026.
            </p>

            {/* CTA */}
            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center not-prose">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Ready to create your registry?
              </h3>
              <p className="text-charcoal-light mb-6">
                Join modern Indian couples who use Gifaa to receive gifts they actually love — across every milestone.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-royal text-white px-8 py-3 rounded-lg font-medium hover:bg-royal-light transition-colors"
              >
                Get Started — It&apos;s Free
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
