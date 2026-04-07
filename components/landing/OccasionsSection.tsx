"use client";

import { useRouter } from "next/navigation";

const occasions = [
  {
    id: "wedding",
    title: "Weddings",
    subtitle: "Direct registries for your big day.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "baby-shower",
    title: "Baby Showers",
    subtitle: "Get exactly what you need for the little one.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "anniversary",
    title: "Anniversaries",
    subtitle: "The simple way to celebrate years of love.",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "housewarming",
    title: "Housewarming",
    subtitle: "Direct contributions for your new home.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop&q=80",
  },
];

const OccasionsSection = () => {
  const router = useRouter();

  const handleOccasionClick = (id: string) => {
    const occasionParam = id.replace("-", "_");
    router.push(`/create-registry?occasion=${occasionParam}`);
  };

  return (
    <section id="occasions" className="py-24 px-6 md:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif text-[#093a6f] mb-4">For Every Celebration</h2>
            <p className="text-on-surface-variant font-sans">Direct-to-user tools for life&apos;s biggest milestones.</p>
          </div>
          <a
            href="/create-registry"
            className="text-[#79590f] font-medium font-sans uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-3 transition-all"
          >
            View All
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>trending_flat</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((occasion) => (
            <button
              key={occasion.id}
              onClick={() => handleOccasionClick(occasion.id)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container text-left"
            >
              <img
                src={occasion.image}
                alt={occasion.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#093a6f]/90 via-[#093a6f]/20 to-transparent" />
              <div className="absolute bottom-0 p-8 w-full">
                <h3 className="text-2xl font-serif text-white mb-2">{occasion.title}</h3>
                <p className="text-white/80 text-sm font-sans">{occasion.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionsSection;
