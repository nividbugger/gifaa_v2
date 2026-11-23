"use client";

import Link from "next/link";
import "../styles/santa.css";
import { useSantaPromoVisible } from "../useSantaPromoVisible";

interface Props {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

/** Seasonal top-nav entry. Renders nothing outside the seasonal window, so it can stay mounted year-round. */
export default function SantaNavLink({ variant, onNavigate }: Props) {
  if (!useSantaPromoVisible()) return null;

  const badge = (
    <span className="ml-1.5 rounded-full bg-[#0a3566] px-1.5 py-0.5 align-middle font-sans text-[10px] font-semibold uppercase tracking-wide text-[#f6e6bd]">New</span>
  );

  return variant === "desktop" ? (
    <Link href="/santa" className="text-sm font-semibold text-[#0a3566] transition-colors duration-300 hover:text-[#79590f]">
      <span aria-hidden>🎅</span> Secret Santa{badge}
    </Link>
  ) : (
    <Link href="/santa" onClick={onNavigate} className="block text-sm font-semibold text-[#0a3566]">
      <span aria-hidden>🎅</span> Secret Santa{badge}
    </Link>
  );
}
