import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";

export const metadata: Metadata = {
  title: { absolute: "Birthday Gift Registry India – Create Yours Free | Gifaa" },
  description:
    "Create a beautiful birthday gift registry and let friends & family buy exactly what you want. No duplicates, no unwanted gifts. Free to create on Gifaa.",
  alternates: { canonical: "https://gifaa.in/birthday-gift-registry" },
  openGraph: {
    title: "Birthday Gift Registry India – Create Yours Free | Gifaa",
    description:
      "Create a beautiful birthday gift registry and let friends & family buy exactly what you want. No duplicates, no unwanted gifts.",
    url: "https://gifaa.in/birthday-gift-registry",
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
  name: "Birthday Gift Registry India",
  description:
    "Create a beautiful birthday gift registry with Gifaa. Share with friends and family and receive exactly the gifts you want.",
  url: "https://gifaa.in/birthday-gift-registry",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gifaa.in" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Birthday Gift Registry",
        item: "https://gifaa.in/birthday-gift-registry",
      },
    ],
  },
};

const stories = [
  {
    name: "Riya Kapoor",
    location: "Pune, Maharashtra",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&h=600&fit=crop&q=80",
    story:
      "I was turning 30 and wanted to make it meaningful — not another pile of scented candles and gift cards. I built a Gifaa registry with things I actually needed: a Kindle Paperwhite, a set of high-quality chef's knives, and a subscription to my favourite pottery class. My friends were relieved. No guessing, no wandering malls. My best friend in Singapore found something perfect within five minutes of opening the link. Best birthday haul of my life.",
    highlight: "Zero unwanted gifts for the first time ever",
  },
  {
    name: "Karan Mehta",
    location: "Hyderabad, Telangana",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop&q=80",
    story:
      "My parents always ask 'what do you want for your birthday?' and I always say 'nothing.' This year I made a Gifaa registry. I added a specific camera lens from Amazon, a Pepperfry coffee table, and a skincare kit from Nykaa. My mother, who doesn't shop online, just called my sister who walked her through it in minutes. The lens arrived the day before my birthday. I've never felt more seen.",
    highlight: "Parents, siblings, friends — everyone nailed it",
  },
  {
    name: "Tanvi & Her Circle",
    location: "Chennai, Tamil Nadu",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop&q=80",
    story:
      "Our friend group does a big collective birthday gift every year. But coordinating via WhatsApp was chaotic — screenshots, bank transfers, confusion about who bought what. This year, Tanvi made a Gifaa registry and we all just picked items at different price points. No group chat drama. No duplicate gifts. Four of us chipped in for a standing desk she'd been eyeing for months. She cried when it arrived. We all cried a little.",
    highlight: "4 friends, 1 dream desk, zero drama",
  },
];

const faqs = [
  {
    q: "Can I create a birthday gift registry on Gifaa for free?",
    a: "Yes, completely free. No setup fees, no service charges. Your friends buy directly from the store, and the gift comes straight to you.",
  },
  {
    q: "Can I add items from any Indian or international store?",
    a: "Absolutely. Add products from Amazon, Nykaa, Pepperfry, Flipkart, Myntra, or any website worldwide — just paste the product link.",
  },
  {
    q: "Will my friends know if someone else already bought a gift?",
    a: "Yes. Gifaa marks gifts as purchased in real-time so no two friends accidentally buy the same item.",
  },
  {
    q: "Do my friends need to create a Gifaa account to buy me a gift?",
    a: "No account needed. Just share your registry link and your friends can browse and buy directly from the stores — no sign-up, no friction.",
  },
];

export default function BirthdayGiftRegistryPage() {
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
                "url('https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1600&h=900&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093a6f]/85 via-[#093a6f]/60 to-transparent" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-8 py-32">
            <div className="max-w-2xl">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Birthday Gift Registry
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                Your Birthday,
                <br />
                <span className="italic text-[#d4a855]">Your Wishlist</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 max-w-xl">
                Stop saying "nothing" when people ask what you want. Build a birthday gift registry in
                minutes — add items from any store and share one link with everyone who cares.
              </p>
              <Link
                href="/create-registry?occasion=birthday"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-10 py-4 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Birthday Registry
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
                  Birthdays Done Right
                </h2>
                <p className="text-on-surface-variant font-sans max-w-xl mx-auto">
                  Real people. Real wishlists. Real smiles on their special day.
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
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <img
                        src={s.image}
                        alt={`${s.name}'s birthday registry story`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3">
                        <p className="font-serif font-bold text-sm text-[#093a6f]">
                          {s.highlight}
                        </p>
                      </div>
                    </div>

                    {/* Text */}
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
                    step: "1. Wishlist",
                    desc: "Add anything you actually want — from any store, at any price. A book, a gadget, a luxury skincare set. Mix and match freely.",
                  },
                  {
                    icon: "share",
                    color: "#79590f",
                    step: "2. Share",
                    desc: "Send your registry link on WhatsApp or Instagram. No one needs to create an account. They just click and shop.",
                  },
                  {
                    icon: "celebration",
                    color: "#093a6f",
                    step: "3. Celebrate",
                    desc: "Gifts ship straight from the store to your door. No duplicate presents. No awkward exchanges. Just things you love.",
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
          <RegistryCrossLinks currentHref="/birthday-gift-registry" />
        </RevealWrapper>

        {/* ── CTA Banner ── */}
        <RevealWrapper delay={0}>
          <section className="py-28 px-6 md:px-8 bg-[#093a6f]">
            <div className="max-w-screen-md mx-auto text-center">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Start Today
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                You Deserve Gifts You{" "}
                <span className="italic text-[#d4a855]">Actually Want</span>
              </h2>
              <p className="text-white/70 font-sans text-lg mb-10 max-w-lg mx-auto">
                Free to create. Beautiful to share. Your people will thank you for making it easy.
              </p>
              <Link
                href="/create-registry?occasion=birthday"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-12 py-5 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Birthday Registry — Free
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
