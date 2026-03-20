"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  { text: "Gifaa made our wedding registry so easy. No duplicate gifts and everyone loved the simplicity!", author: "Ananya", rating: 5 },
  { text: "The UPI gifting feature was perfect for our family abroad. They could contribute without any hassle.", author: "Rahul", rating: 5 },
  { text: "I created my baby shower registry in 10 minutes. My guests found it so intuitive!", author: "Priya", rating: 5 },
  { text: "Finally, a gift registry that understands Indian families. The cash fund option is brilliant!", author: "Vikram", rating: 5 },
  { text: "Beautiful design and so easy to use. Our housewarming gifts were exactly what we needed.", author: "Sneha", rating: 5 },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => { nextSlide(); }, 5000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused]);

  return (
    <section className="py-20 md:py-24 bg-ivory relative overflow-hidden">
      <div className="absolute top-20 -right-20 w-60 h-60 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-60 h-60 rounded-full bg-royal/5 blur-3xl" />

      <div className="container mx-auto max-w-4xl px-6 relative">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal">
            Loved by Families Across India
          </h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl p-8 md:p-10 border-2 border-gold/20 shadow-soft text-center">
                    <div className="flex justify-center gap-1 mb-5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gold" fill="hsl(37, 42%, 54%)" strokeWidth={0} />
                      ))}
                    </div>
                    <blockquote className="text-lg md:text-xl text-charcoal leading-relaxed mb-6 font-serif italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    <p className="text-charcoal-light font-medium">— {testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 w-10 h-10 rounded-full bg-white border border-gold/20 shadow-soft flex items-center justify-center text-royal hover:border-gold hover:bg-gold/5 transition-all z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 w-10 h-10 rounded-full bg-white border border-gold/20 shadow-soft flex items-center justify-center text-royal hover:border-gold hover:bg-gold/5 transition-all z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-gold w-6" : "bg-gold/30 hover:bg-gold/50 w-2"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
