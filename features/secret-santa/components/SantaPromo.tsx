"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../styles/santa.css";
import GiftBox from "../art/GiftBox";
import Ornament from "../art/Ornament";
import Snowfall from "../art/Snowfall";
import Sparkle from "../art/Sparkle";
import { daysUntilChristmas } from "../countdown";
import { useSantaPromoVisible } from "../useSantaPromoVisible";

const MIDNIGHT = "linear-gradient(135deg,#050d24 0%,#0a2a5e 58%,#0a3566 100%)";

interface Props {
  className?: string;
  /** `bold` is the homepage banner; `slim` is a compact strip for in-app pages. */
  variant?: "bold" | "slim";
}

/**
 * Seasonal banner (see also SantaNavLink in the header). Renders nothing outside the seasonal window, so it
 * can stay mounted all year and disappears by itself after New Year. Layout is the caller's job: pass
 * spacing/container classes via `className`.
 */
export default function SantaPromo({ className = "", variant = "bold" }: Props) {
  const visible = useSantaPromoVisible();
  const [daysToChristmas, setDaysToChristmas] = useState<number | null>(null);
  useEffect(() => setDaysToChristmas(daysUntilChristmas()), []);
  if (!visible) return null;

  if (variant === "slim") {
    return (
      <div className={className}>
        <Link href="/santa" className="relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 text-ivory shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: MIDNIGHT }}>
          <div className="santa-stars absolute inset-0" aria-hidden />
          <GiftBox tone="gold" className="relative h-12 w-12 shrink-0" />
          <span className="relative flex-1 text-sm">
            <strong className="font-serif text-base text-[#f6e6bd]">Secret Santa is here.</strong>{" "}
            <span className="text-ivory/75">Draw names with friends, no spoilers.</span>
          </span>
          <span className="relative whitespace-nowrap text-sm font-semibold text-[#e0c08f]">Start a group →</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="santa-rise relative overflow-hidden rounded-[32px] px-7 py-10 text-ivory shadow-[0_28px_70px_-28px_rgba(5,13,36,0.8)] sm:px-12 sm:py-12" style={{ background: MIDNIGHT }}>
        <div className="santa-stars absolute inset-0" aria-hidden />
        <Snowfall count={22} />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e0c08f]">The Holiday Edit ✳</p>
              {daysToChristmas !== null && (
                <span className="rounded-full bg-white/[0.12] px-3 py-1 text-xs font-semibold text-[#f6e6bd] ring-1 ring-white/15">
                  🎄 {daysToChristmas === 0 ? "It's Christmas!" : `${daysToChristmas} days to Christmas`}
                </span>
              )}
            </div>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.08] sm:text-5xl">
              Secret Santa is here.{" "}
              <em className="santa-shimmer-text font-serif font-bold italic">Shhh.</em>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/80">Draw names with friends, family or the office. Everyone shares a wishlist, and nobody finds out who has who.</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/santa" className="inline-flex items-center gap-2 rounded-full bg-[#e0c08f] px-6 py-3.5 text-base font-semibold text-[#0a1f44] shadow-[0_10px_28px_-8px_rgba(224,192,143,0.6)] transition-transform hover:-translate-y-0.5">
                Start a group <span aria-hidden>→</span>
              </Link>
              <Link href="/santa#join" className="text-sm font-semibold text-ivory/80 underline decoration-[#e0c08f]/60 underline-offset-4 hover:text-ivory">
                Have an invite? Join with a code
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden h-52 w-full max-w-[260px] md:block" aria-hidden>
            <GiftBox tone="gold" className="santa-float absolute bottom-0 left-[10%] h-36 w-36 [--r:-4deg]" />
            <GiftBox tone="ivory" className="santa-float absolute bottom-1 right-0 h-24 w-24 [--r:6deg] [animation-delay:1s]" />
            <Ornament className="santa-float absolute -top-3 left-[30%] h-20 w-12 text-[#2f6fc0] [--r:2deg]" />
            <Sparkle className="santa-twinkle absolute right-3 top-4 h-5 w-5 text-[#f6e6bd]" />
          </div>
        </div>
      </div>
    </div>
  );
}
