"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProductImageFallback from "@/components/registry/ProductImageFallback";
import { isPlaceholderImage } from "@/shared/retailers";
import type { RecommendedProduct } from "@/lib/recommendations/product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function RecommendationCard({ product }: { product: RecommendedProduct }) {
  const [imageError, setImageError] = useState(false);
  const showImage = product.image && !isPlaceholderImage(product.image) && !imageError;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-elegant"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image ?? undefined}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <ProductImageFallback productUrl={product.url} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-gold/10 p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-charcoal">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-royal">{product.price ? formatPrice(product.price) : ""}</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-charcoal-light transition-colors group-hover:text-royal">
            {product.store} <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
