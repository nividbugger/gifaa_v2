import { ExternalLink, Trash2 } from "lucide-react";
import ProductImageFallback from "@/components/registry/ProductImageFallback";
import { isPlaceholderImage } from "@/lib/retailer-fallback";
import { formatInr } from "../links";
import type { SantaWish } from "../types";

interface Props {
  wish: SantaWish;
  onRemove?: () => void;
}

export default function WishCard({ wish, onRemove }: Props) {
  const showImage = wish.image_url && !isPlaceholderImage(wish.image_url);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gold/10 bg-ivory/60 p-3">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={wish.image_url!} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
      ) : (
        <ProductImageFallback productUrl={wish.url} variant="thumb" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-charcoal truncate">{wish.name}</p>
        <p className="text-xs text-charcoal-light truncate">{[formatInr(wish.price), wish.notes].filter(Boolean).join(" · ")}</p>
      </div>
      {wish.url && (
        <a href={wish.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${wish.name}`} className="p-2 text-royal hover:text-gold">
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${wish.name}`} className="p-2 text-charcoal-light hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
