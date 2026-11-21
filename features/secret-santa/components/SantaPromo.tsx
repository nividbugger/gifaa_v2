"use client";

import Link from "next/link";
import { useSantaPromoVisible } from "../useSantaPromoVisible";

/**
 * Seasonal homepage/dashboard banner (see also SantaNavLink in the header). It renders nothing outside the
 * seasonal window, so it can be mounted permanently and disappears by itself after New Year.
 * Layout is the caller's job (pass spacing/container classes via `className`).
 */
export default function SantaPromo({ className = "" }: { className?: string }) {
  if (!useSantaPromoVisible()) return null;

  return (
    <div className={className}>
      <Link
        href="/santa"
        className="flex items-center gap-3 rounded-2xl border border-[#c0392b]/20 bg-gradient-to-r from-[#fff5f3] to-[#f3faf5] px-4 py-3 hover:shadow-md transition-shadow"
      >
        <span className="text-2xl" aria-hidden>🎅</span>
        <span className="flex-1 text-sm text-charcoal">
          <strong className="font-serif text-royal">Secret Santa is here.</strong>{" "}
          <span className="text-charcoal-light">Draw names with friends or family — no spoilers.</span>
        </span>
        <span className="text-sm font-medium text-[#c0392b] whitespace-nowrap">Start a group →</span>
      </Link>
    </div>
  );
}
