import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealWrapper from "@/components/layout/RevealWrapper";

export const metadata: Metadata = {
  title: "Wedding Gift Registry India – Create Yours Free | Gifaa",
  description:
    "Create a beautiful wedding gift registry and let guests buy gifts directly from any store. No middlemen, no fees. India's most loved wedding registry platform.",
  alternates: { canonical: "https://gifaa.in/wedding-gift-registry" },
  openGraph: {
    title: "Wedding Gift Registry India – Create Yours Free | Gifaa",
    description:
      "Create a beautiful wedding gift registry and let guests buy gifts directly from any store. No middlemen, no fees.",
    url: "https://gifaa.in/wedding-gift-registry",
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
  name: "Wedding Gift Registry India",
  description:
    "Create a beautiful wedding gift registry with Gifaa. Share with guests and receive gifts directly from any store.",
  url: "https://gifaa.in/wedding-gift-registry",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gifaa.in" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Wedding Gift Registry",
        item: "https://gifaa.in/wedding-gift-registry",
      },
    ],
  },
};

const stories = [
  {
    couple: "Ananya & Rohan",
    location: "Jaipur, Rajasthan",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80",
    story:
      "Planning a palace wedding in Jaipur felt overwhelming — until we found Gifaa. We added everything from hand-painted dinnerware by a local potter to a KitchenAid from Amazon, all in one registry. Our guests in Delhi, Mumbai, and even London could see exactly what we wanted and buy directly. No duplicate toasters. No awkward returns. Just the most beautiful gifts, arriving right at our door.",
    highlight: "127 guests, zero duplicate gifts",
  },
  {
    couple: "Divya & Siddharth",
    location: "Goa",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&q=80",
    story:
      "We had a small beach wedding with 40 close family members. We didn't want to seem greedy asking for gifts, but we also genuinely needed things for our new home. Gifaa made it feel natural — the registry page looked so elegant that guests actually thanked us for making it easy. Three months on, every time we use our new coffee machine, we think of Siddharth's aunt in Coimbatore who sent it.",
    highlight: "40 guests, every gift cherished",
  },
  {
    couple: "Pooja & Arjun",
    location: "Bengaluru, Karnataka",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop&q=80",
    story:
      "Tech-savvy couple, traditional wedding. We added items from Fabindia, Pepperfry, and Nykaa Beauty all in one place. My mother-in-law, who isn't very online, just clicked the link and chose a saree set from Fabindia she knew we'd love. It was shipped to our apartment in Indiranagar in three days. Gifaa bridged the gap between our generation and theirs beautifully.",
    highlight: "3 generations of givers, 1 seamless registry",
  },
];

const faqs = [
  {
    q: "Is Gifaa's wedding gift registry free to create?",
    a: "Yes, completely free. No setup fees, no commission on gifts. Guests buy directly from the store and you receive the gift or funds.",
  },
  {
    q: "Can I add items from any Indian online store?",
    a: "Absolutely. Add items from Amazon, Flipkart, Nykaa, Pepperfry, Fabindia, Tata Cliq, or any website — simply paste the product link.",
  },
  {
    q: "How do guests buy gifts from my wedding registry?",
    a: "Share your private registry link. Guests see your wishlist and click directly to the store to purchase — no account needed on their end.",
  },
  {
    q: "What happens if two guests want to buy the same gift?",
    a: "Gifaa marks gifts as purchased in real-time so no two guests accidentally buy the same item.",
  },
];

export default function WeddingGiftRegistryPage() {
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
                "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&h=900&fit=crop&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#093a6f]/85 via-[#093a6f]/60 to-transparent" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-8 py-32">
            <div className="max-w-2xl">
              <span className="inline-block text-[#d4a855] font-semibold uppercase tracking-[0.2em] mb-6 text-xs font-sans">
                Wedding Gift Registry
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                Your Wedding,
                <br />
                <span className="italic text-[#d4a855]">Your Registry</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed mb-10 max-w-xl">
                Create a beautiful wedding gift registry in minutes. Add items from any store, share
                one link, and let guests shop directly — no middlemen, no fees.
              </p>
              <Link
                href="/create-registry?occasion=wedding"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-10 py-4 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Wedding Registry
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
                  Love, Gifts &amp; Happy Endings
                </h2>
                <p className="text-on-surface-variant font-sans max-w-xl mx-auto">
                  Real couples. Real registries. Real joy on their wedding day.
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
                        alt={`${s.couple}'s wedding registry story`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3">
                        <p className="text-[#079590f] font-serif font-bold text-sm text-[#093a6f]">
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
                    icon: "add_shopping_cart",
                    color: "#093a6f",
                    step: "1. Build",
                    desc: "Add any item from any store by pasting its link. Mix boutique finds with Amazon favourites — all in one registry.",
                  },
                  {
                    icon: "send",
                    color: "#79590f",
                    step: "2. Share",
                    desc: "Send your personal registry link on WhatsApp, email, or your wedding invite. Guests need no account to browse.",
                  },
                  {
                    icon: "favorite",
                    color: "#093a6f",
                    step: "3. Receive",
                    desc: "Gifts ship directly to your door from the store, or funds arrive instantly via UPI. No delays, no handling.",
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
                Ready to Build Your <span className="italic text-[#d4a855]">Dream Registry?</span>
              </h2>
              <p className="text-white/70 font-sans text-lg mb-10 max-w-lg mx-auto">
                Free to create. Beautiful to share. Your guests will thank you.
              </p>
              <Link
                href="/create-registry?occasion=wedding"
                className="inline-flex items-center gap-3 bg-[#d4a855] hover:bg-[#c49a45] text-white font-semibold font-sans px-12 py-5 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Your Wedding Registry — Free
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
