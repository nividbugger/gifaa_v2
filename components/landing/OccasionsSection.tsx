"use client";

import { useRouter } from "next/navigation";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useIsMobile } from "@/hooks/use-mobile";

const occasions = [
  {
    id: "wedding",
    title: "Wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "baby-shower",
    title: "Baby Shower",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "housewarming",
    title: "House Warming",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "birthday",
    title: "Birthday",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "anniversary",
    title: "Anniversary",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=800&fit=crop&q=80",
  },
];

const OccasionsSection = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { scrollRef, handleTouchStart, handleTouchEnd } = useAutoScroll<HTMLDivElement>({
    interval: 3500,
    scrollAmount: 280,
    enabled: isMobile,
  });

  const handleOccasionClick = (id: string) => {
    const occasionParam = id.replace("-", "_");
    router.push(`/create-registry?occasion=${occasionParam}`);
  };

  return (
    <section id="occasions" className="py-20 md:py-24 bg-ivory-warm">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            Occasions
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal mb-4">
            Every Celebration, Curated
          </h2>
          <p className="text-charcoal-light text-lg">
            Choose your occasion and let us prepare a beautiful template for you.
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
          {occasions.map((occasion, index) => (
            <button
              key={occasion.id}
              onClick={() => handleOccasionClick(occasion.id)}
              className="flex-shrink-0 w-[260px] snap-center animate-fade-up text-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-[340px] rounded-2xl overflow-hidden group cursor-pointer shadow-soft hover:shadow-elevated transition-all">
                <img
                  src={occasion.image}
                  alt={occasion.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-semibold text-ivory">
                    {occasion.title}
                  </h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {occasions.map((occasion, index) => (
            <button
              key={occasion.id}
              onClick={() => handleOccasionClick(occasion.id)}
              className="animate-fade-up text-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-[300px] lg:h-[360px] rounded-2xl overflow-hidden group cursor-pointer shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <img
                  src={occasion.image}
                  alt={occasion.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-ivory">
                    {occasion.title}
                  </h3>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold-light transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionsSection;
