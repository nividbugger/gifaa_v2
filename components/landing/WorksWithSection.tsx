"use client";

import { useEffect, useRef } from "react";

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
  { name: "Gucci", domain: "gucci.com" },
  { name: "Louis Vuitton", domain: "louisvuitton.com" },
  { name: "Chanel", domain: "chanel.com" },
  { name: "Starbucks", domain: "starbucks.in" },
  { name: "Hamleys", domain: "hamleys.in" },
  { name: "Ferns N Petals", domain: "fnp.com" },
  { name: "Sony", domain: "sony.co.in" },
  { name: "Bose", domain: "bose.com" },
];

export default function WorksWithSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const animate = () => {
      if (!scrollContainer) return;
      scrollPos += speed;
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPos >= halfWidth) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animationId); };
  }, []);

  return (
    <section className="py-12 md:py-16 bg-ivory overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-center text-charcoal-light text-sm md:text-base">
          Works with stores you already love
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={`${brand.name}-${index}`}
            className="flex-shrink-0 px-6 md:px-10 flex flex-col items-center justify-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`}
              alt={brand.name}
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg opacity-70 hover:opacity-100 transition-all duration-300"
              loading="lazy"
            />
            <span className="text-xs text-charcoal-light/60 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
