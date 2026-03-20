"use client";

import { Gift, ShoppingBag, Wallet, Heart } from "lucide-react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useIsMobile } from "@/hooks/use-mobile";

const valueProps = [
  {
    icon: Gift,
    title: "No duplicate gifts — ever",
    description: "Real-time tracking ensures every gift is unique and appreciated.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop&q=80",
  },
  {
    icon: ShoppingBag,
    title: "Works with any store",
    description: "Add products from Amazon, Flipkart, Nykaa, or any online store.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop&q=80",
  },
  {
    icon: Wallet,
    title: "Easy UPI cash gifting",
    description: "Let guests contribute with heartfelt notes via UPI payments.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&q=80",
  },
  {
    icon: Heart,
    title: "Simple & stress-free",
    description: "Beautiful registries that take minutes to create and share.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&q=80",
  },
];

export default function WhyGifaaSection() {
  const isMobile = useIsMobile();
  const { scrollRef, handleTouchStart, handleTouchEnd } = useAutoScroll<HTMLDivElement>({
    interval: 4000,
    scrollAmount: 300,
    enabled: isMobile,
  });

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-ivory-warm to-ivory relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            Why Gifaa?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-royal mb-4">
            Thoughtful Gifting, Simplified
          </h2>
          <p className="text-lg text-charcoal-light max-w-xl mx-auto">
            Because every celebration deserves thoughtful gifting — without confusion.
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="flex-shrink-0 w-[280px] snap-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-soft transition-all group h-full">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                    <prop.icon className="w-5 h-5 text-royal" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-charcoal mb-2">{prop.title}</h3>
                  <p className="text-sm text-charcoal-light leading-relaxed">{prop.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="bg-white rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-soft transition-all group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                  <prop.icon className="w-5 h-5 text-royal" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-charcoal mb-2">{prop.title}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
