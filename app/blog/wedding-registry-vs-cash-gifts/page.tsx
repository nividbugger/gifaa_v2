import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Wedding Registry vs Cash Gifts: What Do Modern Indian Couples Prefer? (2026) | Gifaa Blog" },
  description:
    "Cash gifts vs wedding registry — which do modern Indian couples actually prefer in 2026? We break down the pros, cons, and the smarter middle ground.",
  alternates: { canonical: "https://gifaa.in/blog/wedding-registry-vs-cash-gifts" },
  openGraph: {
    title: "Wedding Registry vs Cash Gifts: What Do Modern Indian Couples Prefer?",
    description:
      "Cash gifts vs wedding registry — which do modern Indian couples actually prefer in 2026? We break down the pros, cons, and the smarter middle ground.",
    url: "https://gifaa.in/blog/wedding-registry-vs-cash-gifts",
    type: "article",
    images: [{ url: "https://gifaa.in/registry-vs-cash-flatlay.png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Wedding Registry vs Cash Gifts: What Do Modern Indian Couples Prefer?",
  description:
    "Cash gifts vs wedding registry — which do modern Indian couples actually prefer in 2026?",
  url: "https://gifaa.in/blog/wedding-registry-vs-cash-gifts",
  datePublished: "2026-06-22",
  author: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
  publisher: { "@type": "Organization", name: "Gifaa", url: "https://gifaa.in" },
};

const cashAdvantages = [
  "Couples can use the money for anything",
  "No risk of duplicate gifts",
  "Easy for guests to organise",
  "Suitable for all budgets",
];
const cashChallenges = [
  "Can feel impersonal",
  "Guests don't know how much is appropriate",
  "Contributions often get mixed into general expenses",
  "No connection to a specific goal or milestone",
];

const giftAdvantages = [
  "Personal and memorable",
  "Tangible keepsakes",
  "Feels more thoughtful",
];
const giftChallenges = [
  "Duplicate gifts are very common",
  "Items the couple doesn't need",
  "Different tastes and preferences",
  "Storage issues",
];

const registryBenefits = [
  "No duplicate gifts",
  "Guests know exactly what's needed",
  "Couples receive genuinely useful gifts",
  "Easier decision-making for everyone",
];

const experienceGifts = [
  "Honeymoons & travel",
  "Home down payments",
  "Furniture",
  "Future investments",
  "Large appliances",
];

export default function WeddingRegistryVsCashGifts() {
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
              Wedding Planning
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal leading-tight mb-4">
              Wedding Registry vs Cash Gifts: What Do Modern Indian Couples Prefer?
            </h1>
            <p className="text-lg text-charcoal-light mb-4">
              The rules of gifting are changing — here&apos;s what couples actually want in 2026.
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> June 22, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 5 min read
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/registry-vs-cash-flatlay.png"
              alt="Wedding registry vs cash gifts — Indian gifting comparison"
              className="w-full h-64 md:h-80 object-cover object-center"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Intro */}
            <p className="text-charcoal leading-relaxed text-lg">
              For generations, wedding gifting in India followed a simple formula — guests either brought physical gifts or handed over an envelope containing cash. But as weddings evolve and couples become more independent before marriage, gifting preferences are changing too.
            </p>
            <p className="text-charcoal leading-relaxed mt-4">
              Today, many couples are asking a new question: would we rather receive cash, physical gifts, or something in between? Let&apos;s break it down.
            </p>

            {/* Mid-article comparison image */}
            <div className="rounded-2xl overflow-hidden my-10 not-prose">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/registry-vs-cash-comparison.png"
                alt="Wedding Registry vs Cash Gifts comparison"
                className="w-full h-72 md:h-96 object-cover object-center"
              />
            </div>

            {/* Head-to-head comparison cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 not-prose">
              {/* Cash gifts */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 overflow-hidden">
                <div className="bg-amber-100/70 px-5 py-4 border-b border-amber-100">
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">💰 Cash Gifts</p>
                  <p className="text-xs text-amber-700 mt-0.5">The traditional Indian favourite</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Advantages</p>
                    <ul className="space-y-1.5">
                      {cashAdvantages.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm text-charcoal">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">Challenges</p>
                    <ul className="space-y-1.5">
                      {cashChallenges.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-charcoal">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Physical gifts */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 overflow-hidden">
                <div className="bg-blue-100/70 px-5 py-4 border-b border-blue-100">
                  <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">🎁 Physical Gifts</p>
                  <p className="text-xs text-blue-700 mt-0.5">The personal touch approach</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Advantages</p>
                    <ul className="space-y-1.5">
                      {giftAdvantages.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-sm text-charcoal">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">Challenges</p>
                    <ul className="space-y-1.5">
                      {giftChallenges.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-charcoal">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-charcoal leading-relaxed text-sm italic">
              Many couples end up receiving multiple dinner sets, pressure cookers, or decorative pieces — despite the best intentions.
            </p>

            {/* Registries */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-12 mb-4">
              Why Wedding Registries Are Growing
            </h2>
            <p className="text-charcoal leading-relaxed">
              Wedding registries combine the best aspects of both approaches. Instead of guessing what the couple wants, guests can choose from a curated list of gifts the couple has personally selected — or contribute towards a larger goal.
            </p>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 my-6 not-prose">
              <p className="text-xs font-bold text-gold uppercase tracking-wider mb-4">Registry Benefits</p>
              <ul className="space-y-2.5">
                {registryBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience gifting */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              The Rise of Experience-Based Gifting
            </h2>
            <p className="text-charcoal leading-relaxed">
              A growing number of couples aren&apos;t asking for household items at all. Instead, they prefer contributions towards experiences and bigger goals:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 not-prose">
              {experienceGifts.map((item) => (
                <div key={item} className="bg-white border border-gold/10 rounded-xl px-4 py-3 text-sm text-charcoal font-medium text-center">
                  {item}
                </div>
              ))}
            </div>

            <p className="text-charcoal leading-relaxed">
              This shift has created demand for more flexible gifting solutions — ones that let guests choose between physical items and cash contributions to specific goals.
            </p>

            {/* What couples prefer */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              What Modern Indian Couples Prefer
            </h2>
            <p className="text-charcoal leading-relaxed">
              Based on changing consumer behaviour, most couples want a mix of:
            </p>
            <ul className="space-y-2 my-4 ml-6">
              {["Physical gifts they genuinely need", "Contributions towards larger goals", "Flexibility for guests at every budget"].map((item) => (
                <li key={item} className="text-charcoal flex items-start gap-2">
                  <span className="text-gold font-bold mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-charcoal leading-relaxed">
              They want gifting to feel personal — without creating inconvenience for anyone.
            </p>

            {/* Best of both */}
            <h2 className="text-2xl font-serif font-semibold text-royal mt-10 mb-4">
              Why Registries Offer the Best of Both Worlds
            </h2>
            <p className="text-charcoal leading-relaxed">
              A registry built on{" "}
              <Link href="/" className="text-royal underline underline-offset-2 hover:text-gold transition-colors">
                Gifaa
              </Link>{" "}
              lets couples add the products they need, include contribution funds for larger goals, avoid duplicates, and simplify gifting for every guest — all in one shared link.
            </p>

            {/* Final verdict */}
            <div className="bg-royal/5 border border-royal/20 rounded-2xl p-7 my-10 not-prose">
              <p className="text-xs font-bold text-royal uppercase tracking-wider mb-4">The Final Verdict</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {[
                  { label: "Cash Gifts", value: "Flexible", sub: "but impersonal" },
                  { label: "Physical Gifts", value: "Personal", sub: "but unpredictable" },
                  { label: "Gift Registry", value: "Both ✓", sub: "flexible & personal", highlight: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl p-4 ${item.highlight ? "bg-royal text-white" : "bg-white border border-gold/10"}`}
                  >
                    <p className={`text-xs uppercase tracking-wider mb-1 ${item.highlight ? "text-gold" : "text-charcoal-light"}`}>
                      {item.label}
                    </p>
                    <p className={`text-xl font-serif font-bold ${item.highlight ? "text-white" : "text-royal"}`}>
                      {item.value}
                    </p>
                    <p className={`text-xs mt-1 ${item.highlight ? "text-white/70" : "text-charcoal-light"}`}>
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-charcoal leading-relaxed">
              For couples planning a wedding in 2026, a registry is often the simplest way to ensure gifts are meaningful, useful, and aligned with their future plans. Rather than leaving guests guessing, a registry helps everyone celebrate with confidence.
            </p>

            {/* CTA */}
            <div className="bg-royal/5 border border-royal/10 rounded-2xl p-8 mt-12 text-center not-prose">
              <h3 className="text-xl font-serif font-semibold text-royal mb-2">
                Get the best of both — build your registry.
              </h3>
              <p className="text-charcoal-light mb-6">
                Add gifts and cash contribution funds in one place. Share one link. Let guests choose.
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
