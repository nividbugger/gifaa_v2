import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "How to Create the Perfect Gift Registry for Any Occasion | Gifaa Blog" },
  description:
    "Learn how to build a gift registry for weddings, baby showers, housewarmings and more. Step-by-step guide with tips on gift lists, cash funds, and sharing.",
  alternates: { canonical: "https://gifaa.in/blog/perfect-gift-registry" },
  openGraph: {
    title: "How to Create the Perfect Gift Registry for Any Occasion",
    description:
      "Step-by-step guide to building gift registries for weddings, baby showers, housewarmings and more.",
    url: "https://gifaa.in/blog/perfect-gift-registry",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=630&fit=crop&q=80",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Create the Perfect Gift Registry for Any Occasion (Wedding, Baby Shower, Housewarming)",
  description:
    "Step-by-step guide to building gift registries for weddings, baby showers, housewarmings and more.",
  url: "https://gifaa.in/blog/perfect-gift-registry",
  datePublished: "2026-04-15",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

export default function PerfectGiftRegistryBlog() {
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
              Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              How to Create the Perfect Gift Registry for Any Occasion
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              Wedding, Baby Shower, Housewarming — one guide to rule them all.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> April 15, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 5 min read
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=500&fit=crop&q=80"
              alt="Beautifully wrapped gifts"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal leading-relaxed text-lg">
              Gift registries aren&apos;t just for weddings anymore. From baby showers to housewarmings, they&apos;re becoming essential for every major life event. Here&apos;s how to build one that actually works.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 1: Define Your Occasion
            </h2>
            <p className="text-charcoal leading-relaxed">
              Different occasions require different registries:
            </p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span><strong>Weddings</strong> → Mix of home essentials + experiences</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span><strong>Baby showers</strong> → Essentials + future funds</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span><strong>Housewarming</strong> → Furniture + decor</span>
              </li>
            </ul>
            <p className="text-charcoal leading-relaxed">
              Platforms like <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">Gifaa</Link> let you customize based on occasion.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 2: Add a Balanced Gift List
            </h2>
            <p className="text-charcoal leading-relaxed">A good registry includes gifts at every price point:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="bg-white rounded-xl p-5 border border-gold/10 text-center">
                <p className="text-2xl font-serif font-bold text-gold">₹500–₹2K</p>
                <p className="text-sm text-charcoal-light mt-1">Budget-friendly</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gold/10 text-center">
                <p className="text-2xl font-serif font-bold text-gold">₹2K–₹10K</p>
                <p className="text-sm text-charcoal-light mt-1">Mid-range</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gold/10 text-center">
                <p className="text-2xl font-serif font-bold text-gold">₹10K+</p>
                <p className="text-sm text-charcoal-light mt-1">Premium</p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 3: Include Cash Funds
            </h2>
            <p className="text-charcoal leading-relaxed">
              Not everything needs to be a product. Add funds for:
            </p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Travel & Honeymoon</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Education</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Home upgrades</span>
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 4: Keep It Simple
            </h2>
            <p className="text-charcoal leading-relaxed">The best registries:</p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Are easy to navigate</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Work seamlessly on mobile</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Don&apos;t overwhelm guests with too many choices</span>
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 5: Share Smartly
            </h2>
            <p className="text-charcoal leading-relaxed">Distribute your registry via:</p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>WhatsApp groups & individual messages</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>E-invites and digital invitations</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Close family groups</span>
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Step 6: Track and Thank
            </h2>
            <p className="text-charcoal leading-relaxed">A good registry helps you:</p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Track contributions in real time</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Avoid duplicate gifts automatically</span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Send thank-you notes easily</span>
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Common Mistakes to Avoid
            </h2>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 my-6">
              <ul className="space-y-3">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-1">✗</span>
                  <span>Adding too many expensive items</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-1">✗</span>
                  <span>Not updating the registry as items get purchased</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-1">✗</span>
                  <span>Making it hard to access or share</span>
                </li>
              </ul>
            </div>

            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Ready to create your perfect registry?
              </h3>
              <p className="text-charcoal-light mb-6">
                Join thousands of couples across India who use Gifaa to receive gifts they actually love.
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
