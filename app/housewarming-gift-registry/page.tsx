import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";
import RegistryCrossLinks from "@/components/landing/RegistryCrossLinks";

export const metadata: Metadata = {
  title: { absolute: "Housewarming Registry India – Create Yours Free | Gifaa" },
  description:
    "Create a housewarming gift registry and let guests gift exactly what your new home needs. Add items from any store or accept UPI contributions. Free on Gifaa.",
  alternates: { canonical: "https://gifaa.in/housewarming-gift-registry" },
  openGraph: {
    title: "Housewarming Registry India – Create Yours Free | Gifaa",
    description:
      "Create a housewarming gift registry and let guests gift exactly what your new home needs. Add items from any store or accept UPI contributions.",
    url: "https://gifaa.in/housewarming-gift-registry",
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
  name: "Housewarming Registry India",
  description:
    "Create a beautiful housewarming registry with Gifaa. Share with guests and receive exactly the gifts your new home needs.",
  url: "https://gifaa.in/housewarming-gift-registry",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gifaa.in" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Housewarming Registry",
        item: "https://gifaa.in/housewarming-gift-registry",
      },
    ],
  },
};

const stories = [
  {
    name: "Nikhil & Sreya",
    location: "Hyderabad, Telangana",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80",
    story:
      "Moving into our first home, we kept getting asked what we needed for the griha pravesh. Instead of repeating ourselves on twenty WhatsApp chats, we sent one Gifaa link. Guests picked everything from a dinner set to a robot vacuum, and a few pooled together for a sofa we'd been saving for. Our new home filled up with things we actually chose.",
    highlight: "84 guests, one shared link",
  },
  {
    name: "Farhan & Zoya",
    location: "Mumbai, Maharashtra",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop&q=80",
    story:
      "We didn't want clutter — we wanted a few good things. Gifaa let us be specific: a quality cookware set, smart lighting, and a fund toward curtains. Guests appreciated knowing exactly what we'd love, and we avoided ending up with five wall clocks. Every gift had a place in our home from day one.",
    highlight: "Intentional gifts, zero clutter",
  },
];

const faqs = [
  {
    q: "Is Gifaa's housewarming registry free to create?",
    a: "Yes, completely free. No setup fees and no commission on gifts. Guests buy directly from the store or send funds via UPI, and you receive everything in full.",
  },
  {
    q: "What should I add to a housewarming registry?",
    a: "Think about what makes a house a home — cookware, dinnerware, home décor, appliances, smart-home devices, or a cash fund toward bigger purchases like a sofa or curtains. Add items from Amazon, Pepperfry, Urban Ladder, or any store.",
  },
  {
    q: "Can guests contribute towards a single big item?",
    a: "Absolutely. Add a cash fund for a larger purchase and multiple guests can each contribute any amount via UPI until the goal is reached.",
  },
  {
    q: "How does Gifaa avoid duplicate housewarming gifts?",
    a: "Each gift is marked as reserved in real-time. Once a guest claims an item, it's hidden from everyone else — so no two guests gift the same wall clock.",
  },
];

export default function HousewarmingGiftRegistryPage() {
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
                "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&h=900&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093a6f]/85 via-[#093a6f]/60 to-transparent" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-8 py-32">
            <div className="max-w-2xl">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Housewarming Registry
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                A New Home,
                <br />
                <span className="italic text-[#d4a855]">Furnished with Love</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 max-w-xl">
                Create a beautiful housewarming registry in minutes. Add what your new home needs
                from any store, share one link, and let guests gift with purpose.
              </p>
              <Link
                href="/create-registry?occasion=housewarming"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-10 py-4 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Housewarming Registry
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
                  New Beginnings, Beautifully Gifted
                </h2>
                <p className="text-on-surface-variant font-sans max-w-xl mx-auto">
                  Real homeowners. Real registries. A house that became a home.
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
                        alt={`${s.name}'s housewarming registry story`}
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
                    desc: "Add cookware, décor, appliances, or a cash fund by pasting links from Pepperfry, Urban Ladder, Amazon, or any store.",
                  },
                  {
                    icon: "send",
                    color: "#79590f",
                    step: "2. Share",
                    desc: "Send your registry link on WhatsApp or with your housewarming invite. Guests browse instantly — no account required.",
                  },
                  {
                    icon: "favorite",
                    color: "#093a6f",
                    step: "3. Receive",
                    desc: "Gifts ship directly to your new address, or funds arrive instantly via UPI. Everything updates in real-time.",
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
          <RegistryCrossLinks currentHref="/housewarming-gift-registry" />
        </RevealWrapper>

        {/* ── CTA Banner ── */}
        <RevealWrapper delay={0}>
          <section className="py-28 px-6 md:px-8 bg-[#093a6f]">
            <div className="max-w-screen-md mx-auto text-center">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Start Today
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Make Your New House{" "}
                <span className="italic text-[#d4a855]">a Home</span>
              </h2>
              <p className="text-white/70 font-sans text-lg mb-10 max-w-lg mx-auto">
                Free to create. Beautiful to share. Gifts your new home will actually use.
              </p>
              <Link
                href="/create-registry?occasion=housewarming"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-12 py-5 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Housewarming Registry — Free
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
