"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const messages = [
  "🎉 Gifaa just launched on Product Hunt — India's first royal gift registry is going global!",
  "🏆 We're celebrating our global debut — come show us some love on Product Hunt!",
  "🚀 Big news! Gifaa is live on Product Hunt — the world's best discovery platform!",
  "✨ We made it to Product Hunt! Join thousands celebrating life's biggest moments with Gifaa!",
];

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-50 overflow-hidden" style={{ background: "linear-gradient(90deg, hsl(213 52% 18%) 0%, hsl(25 80% 35%) 50%, hsl(213 52% 18%) 100%)" }}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

      <div className="relative flex items-center justify-between px-4 py-2.5 max-w-screen-2xl mx-auto">
        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3">
            {/* PH Logo badge */}
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 border border-white/20">
              <span className="text-sm">🐱</span>
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">Product Hunt</span>
            </div>

            {/* Animated message */}
            <div className="relative overflow-hidden h-5 flex-1">
              {messages.map((msg, i) => (
                <p
                  key={i}
                  className="absolute inset-0 text-xs sm:text-sm text-white/90 font-medium transition-all duration-700 whitespace-nowrap"
                  style={{
                    transform: i === messageIndex ? "translateY(0)" : i < messageIndex ? "translateY(-100%)" : "translateY(100%)",
                    opacity: i === messageIndex ? 1 : 0,
                  }}
                >
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* CTA + close */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <a
            href="https://www.producthunt.com/products/gifaa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition-all duration-200 hover:scale-105"
          >
            <span>👆</span> Upvote us
          </a>
          <button
            onClick={() => setVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Animated sparkle dots */}
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/60 animate-pulse-subtle pointer-events-none" />
      <div className="absolute left-[45%] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/40 animate-pulse-subtle pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/40 animate-pulse-subtle pointer-events-none" style={{ animationDelay: "2s" }} />
    </div>
  );
}
