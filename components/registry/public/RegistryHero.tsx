import { Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];

const occasionImages: Record<string, string> = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop",
  baby_shower: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=600&fit=crop",
  housewarming: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop",
  birthday: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&h=600&fit=crop",
  anniversary: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&h=600&fit=crop",
  other: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=600&fit=crop",
};

const occasionLabels: Record<string, string> = {
  wedding: "Wedding Registry",
  baby_shower: "Baby Shower Registry",
  housewarming: "Housewarming Registry",
  birthday: "Birthday Registry",
  anniversary: "Anniversary Registry",
  other: "Gift Registry",
};

const occasionEmojis: Record<string, string> = {
  wedding: "💒",
  baby_shower: "👶",
  housewarming: "🏡",
  birthday: "🎂",
  anniversary: "💍",
  other: "🎁",
};

interface RegistryHeroProps {
  registry: Registry;
  isOwner: boolean;
  shareToken: string;
}

export default function RegistryHero({ registry, isOwner, shareToken }: RegistryHeroProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Hero Header */}
      <div className="relative h-72 md:h-96 lg:h-[28rem] overflow-hidden">
        <img
          src={registry.header_image_url || occasionImages[registry.occasion]}
          alt={registry.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/20" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
          <div className="container mx-auto max-w-5xl">
            {/* Occasion Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-charcoal text-sm font-medium rounded-full mb-4 shadow-gold">
              <span>{occasionEmojis[registry.occasion]}</span>
              {occasionLabels[registry.occasion]}
            </span>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              {registry.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
              {registry.event_date && (
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  <span>{formatDate(registry.event_date)}</span>
                </div>
              )}
              {registry.event_location && (
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                  <span>{registry.event_location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Owner Edit Link */}
        {isOwner && (
          <Link
            href={`/registry/${shareToken}/edit`}
            className="absolute top-24 right-6"
          >
            <Button variant="outline" className="bg-white/95 hover:bg-white shadow-soft">
              Edit Registry
            </Button>
          </Link>
        )}
      </div>

      {/* Personal Message */}
      {registry.personal_message && (
        <div className="bg-gradient-to-b from-white to-ivory border-b border-gold/10">
          <div className="container mx-auto max-w-3xl px-6 py-8 md:py-10 text-center">
            <Heart className="w-6 h-6 mx-auto text-gold mb-3" />
            <p className="text-lg md:text-xl text-charcoal leading-relaxed italic font-serif">
              "{registry.personal_message}"
            </p>
          </div>
        </div>
      )}
    </>
  );
}
