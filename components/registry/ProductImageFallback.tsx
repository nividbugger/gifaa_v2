"use client";

import { getRetailerInfo } from "@/lib/retailer-fallback";

interface ProductImageFallbackProps {
  productUrl: string | null;
  variant?: "card" | "thumb";
}

export default function ProductImageFallback({ productUrl, variant = "card" }: ProductImageFallbackProps) {
  const retailer = getRetailerInfo(productUrl);

  if (variant === "thumb") {
    return (
      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-ivory to-gold/10 border border-gold/10">
        {retailer ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-serif font-semibold text-xs shadow-sm"
            style={{ backgroundColor: retailer.color }}
          >
            {retailer.initial}
          </div>
        ) : (
          <img src="/gifaa-logo.png" alt="Gifaa" className="w-8 object-contain opacity-60" />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ivory via-ivory-warm to-gold/5">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 rounded-full border border-gold/20 animate-pulse" />
        <div className="absolute w-14 h-14 rounded-full border border-gold/15" />
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          {retailer ? (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif font-semibold text-sm shadow-sm"
              style={{ backgroundColor: retailer.color }}
            >
              {retailer.initial}
            </div>
          ) : (
            <img src="/gifaa-logo.png" alt="Gifaa" className="w-14 object-contain opacity-60" />
          )}
          <span className="text-[9px] font-medium text-charcoal-light/70 tracking-wide uppercase">
            {retailer ? retailer.name : "Gifaa"}
          </span>
        </div>
      </div>
    </div>
  );
}
