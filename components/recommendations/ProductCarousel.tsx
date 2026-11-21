"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { RecommendedProduct } from "@/lib/recommendations/product";
import RecommendationCard from "./RecommendationCard";

/**
 * Swipeable on phones (with a peek of the next card so it's obviously scrollable);
 * arrow buttons appear on larger screens.
 */
export default function ProductCarousel({ products, label }: { products: RecommendedProduct[]; label: string }) {
  return (
    <Carousel opts={{ align: "start", dragFree: true }} aria-label={label} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.url} className="basis-[62%] sm:basis-1/3 lg:basis-1/4 xl:basis-1/5">
            <RecommendationCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 hidden bg-white shadow-md md:flex" />
      <CarouselNext className="right-2 hidden bg-white shadow-md md:flex" />
    </Carousel>
  );
}
