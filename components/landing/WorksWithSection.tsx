"use client";

import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const featuredPayments = [
  { name: "UPI", emoji: "💸", desc: "Instant payments", highlight: true },
  { name: "PhonePe", emoji: "📱", desc: "via UPI" },
  { name: "GPay", emoji: "🟢", desc: "via UPI" },
  { name: "Paytm", emoji: "🔵", desc: "via UPI" },
];

const brands = [
  { name: "Amazon", domain: "amazon.in" },
  { name: "Flipkart", domain: "flipkart.com" },
  { name: "Myntra", domain: "myntra.com" },
  { name: "Nykaa", domain: "nykaa.com" },
  { name: "IKEA", domain: "ikea.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Pepperfry", domain: "pepperfry.com" },
  { name: "Tanishq", domain: "tanishq.co.in" },
  { name: "MakeMyTrip", domain: "makemytrip.com" },
  { name: "Ajio", domain: "ajio.com" },
  { name: "Tata CLiQ", domain: "tatacliq.com" },
  { name: "Sephora", domain: "sephora.com" },
  { name: "Dyson", domain: "dyson.in" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Zomato", domain: "zomato.com" },
  { name: "Sony", domain: "sony.co.in" },
  { name: "Bose", domain: "bose.com" },
  { name: "Hamleys", domain: "hamleys.in" },
  { name: "Ferns N Petals", domain: "fnp.com" },
];

export default function WorksWithSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;
    const animate = () => {
      pos += 0.4;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="reveal-section py-16 md:py-24 bg-ivory overflow-hidden"
    >
      {/* Section header */}
      <div className="container mx-auto max-w-4xl px-6 text-center mb-10">
        <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-wider uppercase mb-3">
          <span>✦</span> Works With <span>✦</span>
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-royal mb-3">
          Gift from anywhere. Pay any way.
        </h2>
        <p className="text-charcoal-light">
          Add gifts from your favourite stores and let guests pay via UPI — no bank transfers, no hassle.
        </p>
      </div>

      {/* UPI Highlight Strip */}
      <div className="container mx-auto max-w-3xl px-6 mb-10">
        <div className="bg-gradient-to-r from-royal/5 via-gold/10 to-royal/5 border border-gold/25 rounded-2xl p-5 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇮🇳</span>
            <div>
              <p className="text-xs font-bold text-royal tracking-wide uppercase">UPI Native</p>
              <p className="text-xs text-charcoal-light">Guests gift with one tap</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gold/20 hidden sm:block" />
          {featuredPayments.map((p) => (
            <div key={p.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${p.highlight ? "border-gold/40 bg-gold/10" : "border-gold/15 bg-white/60"}`}>
              <span className="text-base">{p.emoji}</span>
              <div>
                <p className={`text-xs font-semibold ${p.highlight ? "text-royal" : "text-charcoal"}`}>{p.name}</p>
                <p className="text-[10px] text-charcoal-light">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 container mx-auto max-w-3xl px-6 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
        <span className="text-xs text-charcoal-light/60 uppercase tracking-widest">+ 500 more stores</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
      </div>

      {/* Auto-scrolling brand strip */}
      <div
        ref={scrollRef}
        className="flex overflow-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[...brands, ...brands].map((brand, i) => (
          <div key={`${brand.name}-${i}`} className="flex-shrink-0 px-6 md:px-8 flex flex-col items-center justify-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`}
              alt={brand.name}
              className="h-9 w-9 md:h-11 md:w-11 object-contain rounded-xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-soft"
              loading="lazy"
            />
            <span className="text-[10px] text-charcoal-light/50 group-hover:text-charcoal-light whitespace-nowrap transition-colors">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
