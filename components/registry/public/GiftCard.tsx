"use client";

import { useState } from "react";
import { Gift, Check, ExternalLink, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/types";

type GiftItem = Database["public"]["Tables"]["registry_gifts"]["Row"];

interface GiftCardProps {
  gift: GiftItem;
  onGiftClick: (gift: GiftItem) => void;
}

function extractNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let segments = pathname.split("/").filter(Boolean);
    const dpIndex = segments.findIndex((s) => s.toLowerCase() === "dp");
    if (dpIndex > 0) segments = segments.slice(0, dpIndex);
    segments = segments.filter((s) => s.toLowerCase() !== "p");
    let name = segments.pop() || "";
    name = name.replace(/[-_]/g, " ").replace(/\s+/g, " ").replace(/\.(html|php|aspx?)$/i, "").trim();
    if (name.length < 3) return "Gift Item";
    return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ").slice(0, 60);
  } catch {
    return "Gift Item";
  }
}

const CORNER_ORNAMENT = "❋";

export default function GiftCard({ gift, onGiftClick }: GiftCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  };

  const displayName = gift.product_name || (gift.product_url ? extractNameFromUrl(gift.product_url) : "Gift Item");
  const showImage = gift.product_image_url && !imageError;

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gift.product_url) window.open(gift.product_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`group relative bg-white overflow-hidden transition-all duration-300 ${
      gift.is_purchased
        ? "opacity-75 shadow-none"
        : "hover:-translate-y-1.5 hover:shadow-[0_8px_30px_-4px_hsl(37_42%_54%_/_0.25)]"
    }`}
    style={{ borderRadius: "1px", boxShadow: gift.is_purchased ? "none" : "0 2px 12px -2px hsl(213 52% 24% / 0.08)" }}
    >
      {/* Ornate corner accents */}
      {!gift.is_purchased && (
        <>
          <span className="absolute top-1.5 left-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
          <span className="absolute top-1.5 right-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
          <span className="absolute bottom-1.5 left-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
          <span className="absolute bottom-1.5 right-1.5 text-gold/40 text-xs leading-none z-10 group-hover:text-gold/70 transition-colors">{CORNER_ORNAMENT}</span>
        </>
      )}

      {/* Top gold border line */}
      {!gift.is_purchased && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent z-10" />
      )}

      {/* Image Area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {showImage ? (
          <img
            src={gift.product_image_url ?? undefined}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ivory via-ivory-warm to-gold/5">
            {/* Decorative mandala placeholder */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border border-gold/20 animate-pulse" />
              <div className="absolute w-14 h-14 rounded-full border border-gold/15" />
              <Gift className="w-8 h-8 text-gold/50 relative z-10" />
            </div>
          </div>
        )}

        {/* Purchased overlay */}
        {gift.is_purchased && (
          <div className="absolute inset-0 bg-royal/70 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="bg-white/95 rounded-full p-3 shadow-lg mb-2">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-white/90 text-xs font-medium tracking-wide">Gifted with Love ♥</span>
          </div>
        )}

        {/* Wishlist heart (top left) */}
        {!gift.is_purchased && (
          <button
            className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-red-400 text-red-400" : "text-charcoal/40"}`} />
          </button>
        )}

        {/* Price badge */}
        {gift.price && !gift.is_purchased && (
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-soft border border-gold/20">
            <span className="text-royal font-bold text-xs">{formatPrice(gift.price)}</span>
          </div>
        )}
      </div>

      {/* Decorative divider */}
      {!gift.is_purchased && (
        <div className="flex items-center gap-1.5 px-4 py-1.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
          <span className="text-gold/30 text-[8px]">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
        </div>
      )}

      {/* Content */}
      <div className={`px-4 pb-4 ${gift.is_purchased ? "pt-3" : "pt-0"}`}>
        <h3 className="font-semibold text-charcoal text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
          {displayName}
        </h3>

        {gift.is_purchased ? (
          <div className="space-y-1">
            {gift.purchased_by_name && (
              <p className="text-xs text-charcoal-light text-center">
                <span className="text-gold font-medium">{gift.purchased_by_name}</span>
                {" "}is gifting this 🎁
              </p>
            )}
            {gift.price && (
              <p className="text-xs text-charcoal/40 text-center">{formatPrice(gift.price)}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {gift.product_url && (
              <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-charcoal-light border border-gold/20 hover:border-gold/40 hover:bg-gold/5 rounded-full" onClick={handleViewProduct}>
                <ExternalLink className="w-3 h-3 mr-1.5" />
                View Item
              </Button>
            )}
            <Button
              variant="royal"
              size="sm"
              className="w-full h-9 text-xs rounded-full font-medium tracking-wide"
              onClick={(e) => { e.stopPropagation(); onGiftClick(gift); }}
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
              Gift This ✦
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
