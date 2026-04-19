import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedding Gift Registry in India: The Ultimate Guide for Modern Couples (2026) | Gifaa Blog",
  description:
    "Everything you need to know about creating a wedding gift registry in India. Avoid duplicates, accept UPI contributions, and share via WhatsApp.",
  alternates: { canonical: "https://gifaa.in/blog/wedding-gift-registry-india-guide" },
  openGraph: {
    title: "Wedding Gift Registry in India: The Ultimate Guide for Modern Couples (2026)",
    description:
      "Everything you need to know about creating a wedding gift registry in India.",
    url: "https://gifaa.in/blog/wedding-gift-registry-india-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop&q=80",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Wedding Gift Registry in India: The Ultimate Guide for Modern Couples (2026)",
  description:
    "Everything you need to know about creating a wedding gift registry in India.",
  url: "https://gifaa.in/blog/wedding-gift-registry-india-guide",
  datePublished: "2026-04-05",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

export default function WeddingGiftRegistryIndiaGuideBlog() {
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
              Wedding
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              Wedding Gift Registry in India: The Ultimate Guide for Modern Couples
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              The 2026 edition — everything Indian couples need to know.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> April 5, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 6 min read
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=500&fit=crop&q=80"
              alt="Indian wedding celebration"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal leading-relaxed text-lg">
              Planning a wedding in India comes with a long list of decisions — but one of the most overlooked is gifting. Traditionally, couples end up with duplicate items, unused appliances, or envelopes that are hard to track. That&apos;s exactly why the concept of a wedding gift registry in India is gaining traction.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              What is a Wedding Gift Registry?
            </h2>
            <p className="text-charcoal leading-relaxed">
              A wedding gift registry is a curated list of gifts that a couple actually wants or needs. Instead of guests guessing what to buy, they simply pick something from the list.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Platforms like <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">Gifaa</Link> make this process seamless by allowing couples to:
            </p>
            <ul className="space-y-2 my-4 ml-6">
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Add products from <strong>any website</strong></span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Accept cash contributions via <strong>UPI</strong></span>
              </li>
              <li className="text-charcoal flex items-start gap-2">
                <span className="text-gold font-bold mt-1">•</span>
                <span>Avoid <strong>duplicate gifts</strong> automatically</span>
              </li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Why Indian Couples Are Switching to Gift Registries
            </h2>

            <div className="space-y-6 my-6">
              <div className="flex gap-4 items-start bg-white rounded-xl border border-gold/10 p-5">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-serif font-bold text-sm shrink-0">1</span>
                <div>
                  <h3 className="font-serif font-semibold text-royal">No More Duplicate Gifts</h3>
                  <p className="text-charcoal text-sm mt-1">Receiving five dinner sets is no longer a problem. Registries track purchases in real time.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white rounded-xl border border-gold/10 p-5">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-serif font-bold text-sm shrink-0">2</span>
                <div>
                  <h3 className="font-serif font-semibold text-royal">Flexibility Across Budgets</h3>
                  <p className="text-charcoal text-sm mt-1">Guests can choose gifts that fit their budget — or contribute to bigger items collectively.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-white rounded-xl border border-gold/10 p-5">
                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-serif font-bold text-sm shrink-0">3</span>
                <div>
                  <h3 className="font-serif font-semibold text-royal">UPI Makes Cash Gifting Seamless</h3>
                  <p className="text-charcoal text-sm mt-1">Instead of awkward envelopes, guests can send money digitally with personalized notes.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              How to Create a Wedding Registry (Step-by-Step)
            </h2>
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold shrink-0">1</div>
                <div>
                  <h3 className="font-serif font-semibold text-royal">Choose your occasion</h3>
                  <p className="text-charcoal text-sm">Wedding, engagement, reception — pick what fits.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold shrink-0">2</div>
                <div>
                  <h3 className="font-serif font-semibold text-royal">Add products or cash funds</h3>
                  <p className="text-charcoal text-sm">Mix physical gifts with monetary contributions for flexibility.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold shrink-0">3</div>
                <div>
                  <h3 className="font-serif font-semibold text-royal">Share the link</h3>
                  <p className="text-charcoal text-sm">Send via WhatsApp, embed in your e-invite, or share in family groups.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-royal text-white flex items-center justify-center font-serif font-bold shrink-0">4</div>
                <div>
                  <h3 className="font-serif font-semibold text-royal">Track gifts and send thank-you notes</h3>
                  <p className="text-charcoal text-sm">See who gave what and express gratitude easily.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Pro Tips for Indian Weddings
            </h2>
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 my-6">
              <ul className="space-y-3">
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">&#10003;</span>
                  <span>Include a mix of price points (<strong>₹500 to ₹50,000+</strong>)</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">&#10003;</span>
                  <span>Add &ldquo;experience gifts&rdquo; like honeymoon, travel, or spa</span>
                </li>
                <li className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">&#10003;</span>
                  <span>Keep the registry simple and <strong>mobile-friendly</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Planning your wedding?
              </h3>
              <p className="text-charcoal-light mb-6">
                Create your wedding gift registry on Gifaa in minutes — free, beautiful, and made for India.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-royal text-white px-8 py-3 rounded-lg font-medium hover:bg-royal-light transition-colors"
              >
                Create Your Wedding Registry
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
