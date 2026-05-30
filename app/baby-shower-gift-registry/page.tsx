import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";

export const metadata: Metadata = {
  title: { absolute: "Baby Shower Registry India – Create Yours Free | Gifaa" },
  description:
    "Create a beautiful baby shower registry and let family & friends gift exactly what your little one needs. Add items from any store, share one link. Free on Gifaa.",
  alternates: { canonical: "https://gifaa.in/baby-shower-gift-registry" },
  openGraph: {
    title: "Baby Shower Registry India – Create Yours Free | Gifaa",
    description:
      "Create a beautiful baby shower registry and let family & friends gift exactly what your little one needs. Add items from any store, share one link.",
    url: "https://gifaa.in/baby-shower-gift-registry",
    images: [
      {
        url: "https://gifaa.in/lovable-uploads/2906e693-4dd1-4514-8524-e5acfd185f93.png",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Baby Shower Registry India",
  description:
    "Create a beautiful baby shower registry with Gifaa. Share with family and friends and receive exactly the gifts your baby needs.",
  url: "https://gifaa.in/baby-shower-gift-registry",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gifaa.in" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Baby Shower Registry",
        item: "https://gifaa.in/baby-shower-gift-registry",
      },
    ],
  },
};

const stories = [
  {
    name: "Meghna & Karthik",
    location: "Chennai, Tamil Nadu",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop&q=80",
    story:
      "We had no idea how much a newborn actually needs. My sister in the US, my colleagues, my mom's friends — everyone wanted to help, but kept asking 'what do you need?'. Gifaa let us list everything from a baby monitor to organic cotton onesies in one place. Relatives abroad gifted the bigger items, friends nearby chipped into a stroller fund. Nothing was duplicated, nothing was wasted.",
    highlight: "62 guests, zero duplicate gifts",
  },
  {
    name: "Aishwarya & Dev",
    location: "Pune, Maharashtra",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop&q=80",
    story:
      "A surprise baby shower meant our friends planned everything — including the registry. They added a mix of practical essentials and a fund toward a crib we'd been eyeing. By the time the shower ended, half the nursery was sorted. The best part was reading the little messages each person left with their gift.",
    highlight: "Whole nursery, sorted in one afternoon",
  },
];

const faqs = [
  {
    q: "Is Gifaa's baby shower registry free to create?",
    a: "Yes, completely free. No setup fees and no commission. Guests buy directly from the store, or contribute to a fund via UPI, and you receive the gift or money in full.",
  },
  {
    q: "What should I add to a baby shower registry?",
    a: "Anything you'll genuinely use — diapers, onesies, a baby monitor, a stroller, a crib, feeding bottles, or even a fund toward a bigger item. You can add products from Amazon, FirstCry, Flipkart, or any store by pasting the link.",
  },
  {
    q: "Can relatives abroad gift to my registry?",
    a: "Yes. Guests anywhere can open your link, see what's needed, and either buy directly from the store or contribute to a cash fund. No account needed on their end.",
  },
  {
    q: "How do you prevent two people gifting the same item?",
    a: "Gifaa marks each gift as reserved in real-time, so once someone claims an item it disappears for everyone else. No duplicate strollers, ever.",
  },
];

export default function BabyShowerGiftRegistryPage() {
  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1600&h=900&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093a6f]/85 via-[#093a6f]/60 to-transparent" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-8 py-32">
            <div className="max-w-2xl">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Baby Shower Registry
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                Everything Baby Needs,
                <br />
                <span className="italic text-[#d4a855]">Nothing You Don&apos;t</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 max-w-xl">
                Create a beautiful baby shower registry in minutes. Add essentials from any store,
                share one link, and let loved ones gift exactly what your little one needs.
              </p>
              <Link
                href="/create-registry?occasion=baby_shower"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-10 py-4 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Baby Shower Registry
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stories ── */}
        <RevealWrapper delay={0}>
          <section className="py-28 px-6 md:px-8 bg-surface">
            <div className="max-w-screen-xl mx-auto">
              <div className="text-center mb-20">
                <span className="inline-block text-[#79590f] font-semibold uppercase tracking-[0.2em] mb-4 text-xs font-sans">
                  Real Stories
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#093a6f] mb-6">
                  Tiny Feet, Big Celebrations
                </h2>
                <p className="text-on-surface-variant font-sans max-w-xl mx-auto">
                  Real parents-to-be. Real registries. A welcome made easy.
                </p>
              </div>

              <div className="space-y-24">
                {stories.map((s, i) => (
                  <div
                    key={i}
                    className={`grid md:grid-cols-2 gap-12 items-center ${
                      i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <img
                        src={s.image}
                        alt={`${s.name}'s baby shower registry story`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3">
                        <p className="font-serif font-bold text-sm text-[#093a6f]">
                          {s.highlight}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="text-[#79590f] opacity-50">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "48px", fontVariationSettings: "'FILL' 1" }}
                        >
                          format_quote
                        </span>
                      </div>
                      <p className="text-xl font-serif italic text-[#093a6f] leading-relaxed">
                        &ldquo;{s.story}&rdquo;
                      </p>
                      <div className="pt-2 border-t border-outline-variant/20">
                        <h3 className="font-bold font-serif text-[#093a6f] text-lg">{s.name}</h3>
                        <p className="text-xs text-on-surface-variant font-sans uppercase tracking-widest mt-1">
                          {s.location} &middot; {s.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealWrapper>

        {/* ── How it works ── */}
        <RevealWrapper delay={0}>
          <section className="py-24 px-6 md:px-8 bg-surface-container-low">
            <div className="max-w-screen-xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block text-[#79590f] font-semibold uppercase tracking-[0.2em] mb-4 text-xs font-sans">
                  Simple Process
                </span>
                <h2 className="text-4xl font-serif text-[#093a6f]">
                  Your Registry in 3 Steps
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "add_shopping_cart",
                    color: "#093a6f",
                    step: "1. Build",
                    desc: "Add nursery essentials, clothing, gear, or a cash fund by pasting links from FirstCry, Amazon, or any store you love.",
                  },
                  {
                    icon: "send",
                    color: "#79590f",
                    step: "2. Share",
                    desc: "Send your registry link on WhatsApp or with your shower invite. Guests browse instantly — no account required.",
                  },
                  {
                    icon: "favorite",
                    color: "#093a6f",
                    step: "3. Receive",
                    desc: "Gifts ship directly to your door, or funds arrive instantly via UPI. Everything updates in real-time.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white p-10 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                      style={{ backgroundColor: `${item.color}0d` }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "32px", color: item.color }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-[#093a6f] mb-4">{item.step}</h3>
                    <p className="text-on-surface-variant font-sans leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealWrapper>

        {/* ── FAQ ── */}
        <RevealWrapper delay={0}>
          <section className="py-24 px-6 md:px-8 bg-surface">
            <div className="max-w-screen-md mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-[#093a6f]">Common Questions</h2>
              </div>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-outline-variant/20 rounded-xl p-8 bg-surface-container-lowest hover:border-[#093a6f]/20 transition-colors"
                  >
                    <h3 className="font-serif font-bold text-[#093a6f] text-lg mb-3">{faq.q}</h3>
                    <p className="text-on-surface-variant font-sans leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealWrapper>

        {/* ── Cross-links ── */}
        <RevealWrapper delay={0}>
          <RegistryCrossLinks currentHref="/baby-shower-gift-registry" />
        </RevealWrapper>

        {/* ── CTA Banner ── */}
        <RevealWrapper delay={0}>
          <section className="py-28 px-6 md:px-8 bg-[#093a6f]">
            <div className="max-w-screen-md mx-auto text-center">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Start Today
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Welcome Your Little One{" "}
                <span className="italic text-[#d4a855]">the Easy Way</span>
              </h2>
              <p className="text-white/70 font-sans text-lg mb-10 max-w-lg mx-auto">
                Free to create. Beautiful to share. Everything baby needs, in one link.
              </p>
              <Link
                href="/create-registry?occasion=baby_shower"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-12 py-5 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Baby Shower Registry — Free
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          </section>
        </RevealWrapper>
      </main>
      <Footer />
    </div>
  );
}
