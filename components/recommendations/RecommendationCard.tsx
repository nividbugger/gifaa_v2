"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import ProductImageFallback from "@/components/registry/ProductImageFallback";
import { isPlaceholderImage } from "@/lib/retailer-fallback";

export interface RecommendedGift {
  id: string;
  product_name: string;
  product_url: string;
  product_image_url: string | null;
  price: number | null;
}

interface RecommendationCardProps {
  gift: RecommendedGift;
}

const CORNER_ORNAMENT = "❋";

export default function RecommendationCard({ gift }: RecommendationCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = gift.product_image_url && !isPlaceholderImage(gift.product_image_url) && !imageError;

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  };

  return (
    <a
      href={gift.product_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group relative bg-white overflow-hidden transition-all duration-300 block hover:-translate-y-1.5 hover:shadow-[0_8px_30px_-4px_hsl(37_42%_54%_/_0.25)]"
      style={{ borderRadius: "1px", boxShadow: "0 2px 12px -2px hsl(213 52% 24% / 0.08)" }}
    >
      <span className="absolute top-1.5 left-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
      <span className="absolute top-1.5 right-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
      <span className="absolute bottom-1.5 left-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
      <span className="absolute bottom-1.5 right-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent z-10" />

      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {showImage ? (
          <img
            src={gift.product_image_url ?? undefined}
            alt={gift.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <ProductImageFallback productUrl={gift.product_url} />
        )}

        {gift.price && (
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-soft border border-gold/20">
            <span className="text-royal font-bold text-xs">{formatPrice(gift.price)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 px-4 py-1.5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
        <span className="text-gold/30 text-[8px]">✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
      </div>

      <div className="px-4 pb-4">
        <h3 className="font-semibold text-charcoal text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
          {gift.product_name}
        </h3>
        <div className="flex items-center justify-center gap-1.5 h-8 text-xs text-charcoal-light border border-gold/20 rounded-full group-hover:border-gold/40 group-hover:bg-gold/5 transition-colors">
          <ExternalLink className="w-3 h-3" />
          View on Amazon
        </div>
      </div>
    </a>
  );
}
