"use client";

import { useState } from "react";
import { Gift, Check, User, ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/types";

type GiftItem = Database["public"]["Tables"]["registry_gifts"]["Row"];

interface GiftCardProps {
  gift: GiftItem;
  onGiftClick: (gift: GiftItem) => void;
}

// Extract product name from URL as fallback
function extractNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Get all path segments
    let segments = pathname.split('/').filter(Boolean);
    
    // For Amazon: get text before /dp/
    const dpIndex = segments.findIndex(s => s.toLowerCase() === 'dp');
    if (dpIndex > 0) {
      segments = segments.slice(0, dpIndex);
    }
    
    // For Flipkart: remove /p/ segments  
    segments = segments.filter(s => s.toLowerCase() !== 'p');
    
    // Get the last meaningful segment
    let name = segments.pop() || '';
    
    // Clean up the name
    name = name
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .trim();
    
    if (name.length < 3) return 'Gift Item';
    
    // Capitalize first letter of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .slice(0, 60);
  } catch {
    return 'Gift Item';
  }
}

export default function GiftCard({ gift, onGiftClick }: GiftCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Use product name or extract from URL
  const displayName = gift.product_name || 
    (gift.product_url ? extractNameFromUrl(gift.product_url) : 'Gift Item');

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gift.product_url) {
      window.open(gift.product_url, "_blank", "noopener,noreferrer");
    }
  };

  const showImage = gift.product_image_url && !imageError;

  return (
    <div
      className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        gift.is_purchased 
          ? "border-charcoal/10 opacity-70" 
          : "border-gold/20 hover:shadow-elevated hover:border-gold/40 hover:-translate-y-1"
      }`}
    >
      {/* Gift Image */}
      <div className="relative aspect-square bg-gradient-to-br from-ivory to-ivory-warm overflow-hidden">
        {showImage ? (
          <img
            src={gift.product_image_url ?? undefined}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              console.debug("[GiftCard] Image failed to load:", gift.product_image_url);
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
              <Gift className="w-10 h-10 text-gold" />
            </div>
          </div>
        )}
        
        {/* Purchased Overlay */}
        {gift.is_purchased && (
          <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-full p-4 shadow-elevated animate-scale-in">
              <Check className="w-8 h-8 text-success" />
            </div>
          </div>
        )}

        {/* Price Badge */}
        {gift.price && !gift.is_purchased && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft">
            <span className="text-royal font-semibold text-sm">
              {formatPrice(gift.price)}
            </span>
          </div>
        )}
      </div>

      {/* Gift Details */}
      <div className="p-5">
        <h3 className="font-semibold text-charcoal mb-2 line-clamp-2 min-h-[2.5rem]">
          {displayName}
        </h3>
        
        {gift.notes && !gift.is_purchased && (
          <p className="text-sm text-charcoal-light mb-3 line-clamp-2">
            {gift.notes}
          </p>
        )}
        
        {gift.is_purchased && gift.purchased_by_name && (
          <div className="flex items-center gap-2 text-sm text-success mb-3">
            <User className="w-4 h-4" />
            <span>Gifted by {gift.purchased_by_name}</span>
          </div>
        )}
        
        {!gift.is_purchased && (
          <div className="flex flex-col gap-2">
            {/* View Product Button */}
            {gift.product_url && (
              <Button 
                variant="gold-outline" 
                className="w-full"
                onClick={handleViewProduct}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Product
              </Button>
            )}
            
            {/* Gift This Item Button */}
            <Button 
              variant="royal" 
              className="w-full group/btn"
              onClick={(e) => {
                e.stopPropagation();
                onGiftClick(gift);
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Gift This Item
            </Button>
          </div>
        )}

        {gift.is_purchased && gift.price && (
          <p className="text-center text-charcoal-light text-sm">
            {formatPrice(gift.price)}
          </p>
        )}
      </div>
    </div>
  );
}
