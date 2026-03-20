"use client";

import { MousePointer, Gift, Share2, Heart } from "lucide-react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useIsMobile } from "@/hooks/use-mobile";

const steps = [
  {
    number: "01",
    icon: MousePointer,
    title: "Choose Your Occasion",
    description: "Select from weddings, baby showers, house warmings, or any celebration.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&q=80",
  },
  {
    number: "02",
    icon: Gift,
    title: "Add Your Wishes",
    description: "Paste product links from any store or add cash funds. We handle the rest.",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop&q=80",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share with Loved Ones",
    description: "Send your registry link via WhatsApp, email, or wedding invite.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&q=80",
  },
  {
    number: "04",
    icon: Heart,
    title: "Receive with Gratitude",
    description: "Track contributions, avoid duplicates, and send thank-you notes.",
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&h=300&fit=crop&q=80",
  },
];

const HowItWorksSection = () => {
  const isMobile = useIsMobile();
  const { scrollRef, handleTouchStart, handleTouchEnd } = useAutoScroll<HTMLDivElement>({
    interval: 4500,
    scrollAmount: 300,
    enabled: isMobile,
  });

  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-ivory">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Effortlessly Elegant
          </h2>
          <p className="text-charcoal-light text-lg">
            Create your registry in under a minute. No complexity, no confusion.
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
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex-shrink-0 w-[280px] snap-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-soft transition-all group h-full">
                <div className="relative h-40 overflow-hidden">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-royal flex items-center justify-center">
                    <span className="text-gold font-mono text-sm font-bold">{step.number}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                    <step.icon className="w-5 h-5 text-gold" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">{step.title}</h3>
                  <p className="text-sm text-charcoal-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Timeline */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-gold via-gold/50 to-gold" />
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex items-center gap-8 animate-fade-up ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className={`flex-1 p-6 rounded-2xl bg-card shadow-soft border border-gold/10 hover:shadow-elevated hover:border-gold/20 transition-all duration-300 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <span className="inline-block text-gold/60 font-mono text-sm mb-2">{step.number}</span>
                    <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{step.title}</h3>
                    <p className="text-charcoal-light leading-relaxed text-sm">{step.description}</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-royal flex items-center justify-center shadow-elevated">
                      <step.icon className="w-7 h-7 text-gold" />
                    </div>
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
