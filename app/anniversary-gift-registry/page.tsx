import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";

export const metadata: Metadata = {
  title: "Anniversary Gift Registry India – Create Yours Free | Gifaa",
  description:
    "Celebrate your anniversary with gifts you both truly want. Create a beautiful anniversary gift registry on Gifaa — free, elegant, and loved by couples across India.",
  alternates: { canonical: "https://gifaa.in/anniversary-gift-registry" },
  openGraph: {
    title: "Anniversary Gift Registry India – Create Yours Free | Gifaa",
    description:
      "Celebrate your anniversary with gifts you both truly want. Create a beautiful anniversary gift registry on Gifaa — free, elegant, and loved by couples across India.",
    url: "https://gifaa.in/anniversary-gift-registry",
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
  name: "Anniversary Gift Registry India",
  description:
    "Create a beautiful anniversary gift registry with Gifaa. Share with loved ones and celebrate your milestone with gifts that truly matter.",
  url: "https://gifaa.in/anniversary-gift-registry",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gifaa.in" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Anniversary Gift Registry",
        item: "https://gifaa.in/anniversary-gift-registry",
      },
    ],
  },
};

const stories = [
  {
    couple: "Meera & Vikram",
    location: "Mumbai, Maharashtra",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=600&fit=crop&q=80",
    story:
      "We don't believe in gifting each other things we'll forget by next year. For our fifth anniversary, we made a Gifaa registry together — a weekend stay at a heritage hotel, a fine dining experience, and a Kindle for me that Vikram had been hinting about for months. Our families wanted to contribute to something meaningful and this gave them the perfect canvas. The hotel sent us a bottle of wine with a note from Vikram's parents. We still have the note.",
    highlight: "One registry, a lifetime of memories",
  },
  {
    couple: "Priya & Aditya",
    location: "New Delhi",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&h=600&fit=crop&q=80",
    story:
      "Ten years of marriage, and we still couldn't agree on what to get each other. This time, Priya built a Gifaa registry with things we both wanted for our home — a vintage-style record player from Amazon, a hand-knotted rug from a Delhi artisan, and a gorgeous linen bedding set from Westside. Our closest friends and siblings pitched in. Everything arrived within a week of our anniversary. Our living room finally looks like the home we always imagined.",
    highlight: "10 years in, still building our dream home",
  },
  {
    couple: "Sonal & Rahul",
    location: "Ahmedabad, Gujarat",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop&q=80",
    story:
      "We were celebrating our first anniversary long-distance — Rahul was posted in Bangalore for work. I added a few things to our Gifaa registry: a coffee subscription for him, a Nykaa Beauty set for me, and a shared experience voucher for when he'd be back. His colleagues in Bangalore found the link and got him the coffee subscription with a card that read 'From all of us, to both of you.' I cried reading it. Distance doesn't shrink love. Gifaa made that feel real.",
    highlight: "Long distance, close at heart",
  },
];

const faqs = [
  {
    q: "Can I create an anniversary gift registry on Gifaa for free?",
    a: "Yes, completely free. No setup fees, no service charges. Your loved ones buy directly from the store, and the gift arrives at your door.",
  },
  {
    q: "What kinds of gifts can I add to an anniversary registry?",
    a: "Anything — experiences, home décor, travel vouchers, jewellery, tech gadgets, or beauty sets. If it has a product URL, it goes on your registry.",
  },
  {
    q: "Can our families chip in together for a single big gift?",
    a: "Gifaa shows all gifts as available or purchased, making it easy for multiple people to coordinate. For group gifting, add a single higher-value item and let your network claim it together.",
  },
  {
    q: "Do guests need to sign up to buy from our anniversary registry?",
    a: "No account needed. Just share your registry link and everyone can browse and buy directly from the stores — no friction, no sign-ups.",
  },
];

export default function AnniversaryGiftRegistryPage() {
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
                "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=900&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093a6f]/85 via-[#093a6f]/60 to-transparent" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-8 py-32">
            <div className="max-w-2xl">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Anniversary Gift Registry
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                Celebrate Together,
                <br />
                <span className="italic text-[#d4a855]">Gift Meaningfully</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 max-w-xl">
                Mark your anniversary with gifts that mean something. Build a registry from any store
                and share one link with the people who want to celebrate you both.
              </p>
              <Link
                href="/create-registry?occasion=anniversary"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-10 py-4 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Anniversary Registry
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
                  Love Worth Celebrating
                </h2>
                <p className="text-on-surface-variant font-sans max-w-xl mx-auto">
                  Real couples. Real milestones. Real gifts that told the right story.
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
                        alt={`${s.couple}'s anniversary registry story`}
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
                        <h3 className="font-bold font-serif text-[#093a6f] text-lg">{s.couple}</h3>
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
                    icon: "favorite",
                    color: "#093a6f",
                    step: "1. Curate",
                    desc: "Add gifts you both love — from experiences and getaways to home décor and keepsakes. Any store, any price point.",
                  },
                  {
                    icon: "share",
                    color: "#79590f",
                    step: "2. Share",
                    desc: "Send your registry link to family and friends on WhatsApp or email. No one needs an account to browse and buy.",
                  },
                  {
                    icon: "celebration",
                    color: "#093a6f",
                    step: "3. Celebrate",
                    desc: "Gifts arrive directly from the store. No duplicates, no returns, no guessing games — just joy on your anniversary.",
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

        {/* ── CTA Banner ── */}
        <RevealWrapper delay={0}>
          <section className="py-28 px-6 md:px-8 bg-[#093a6f]">
            <div className="max-w-screen-md mx-auto text-center">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Start Today
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Your Anniversary Deserves{" "}
                <span className="italic text-[#d4a855]">More Than Guesswork</span>
              </h2>
              <p className="text-white/70 font-sans text-lg mb-10 max-w-lg mx-auto">
                Free to create. Beautiful to share. Let the people who love you celebrate you right.
              </p>
              <Link
                href="/create-registry?occasion=anniversary"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-12 py-5 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Anniversary Registry — Free
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
