"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface GiftFiltersProps {
  priceRange: [number, number];
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  showPurchased: boolean;
  showAvailable: boolean;
  onShowPurchasedChange: (show: boolean) => void;
  onShowAvailableChange: (show: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function GiftFilters({
  priceRange,
  maxPrice,
  onPriceRangeChange,
  showPurchased,
  showAvailable,
  onShowPurchasedChange,
  onShowAvailableChange,
  onClearFilters,
  hasActiveFilters,
}: GiftFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl border border-gold/20 p-4 mb-6 shadow-soft">
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-charcoal font-medium"
        >
          <Filter className="w-4 h-4 text-gold" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 bg-gold/20 text-royal text-xs">
              Active
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-charcoal-light hover:text-royal"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Content - Always visible on desktop, toggleable on mobile */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-charcoal-light whitespace-nowrap">Show:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onShowAvailableChange(!showAvailable)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  showAvailable 
                    ? 'bg-royal text-white border-royal' 
                    : 'bg-transparent text-charcoal border-charcoal/20 hover:border-gold'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => onShowPurchasedChange(!showPurchased)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  showPurchased 
                    ? 'bg-royal text-white border-royal' 
                    : 'bg-transparent text-charcoal border-charcoal/20 hover:border-gold'
                }`}
              >
                Purchased
              </button>
            </div>
          </div>

          {/* Price Range */}
          {maxPrice > 0 && (
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-charcoal-light">Price range:</span>
                <span className="text-royal font-medium">
                  {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={maxPrice}
                step={100}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                className="w-full"
              />
            </div>
          )}

          {/* Clear Filters - Desktop */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="hidden md:flex text-charcoal-light hover:text-royal"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
