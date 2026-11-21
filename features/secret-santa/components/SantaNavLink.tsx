"use client";

import Link from "next/link";
import { useSantaPromoVisible } from "../useSantaPromoVisible";

interface Props {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

/** Seasonal top-nav entry. Renders nothing outside the seasonal window, so it can stay mounted year-round. */
export default function SantaNavLink({ variant, onNavigate }: Props) {
  if (!useSantaPromoVisible()) return null;

  const badge = (
    <span className="ml-1.5 rounded-full bg-[#c0392b] px-1.5 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wide text-white align-middle">
      New
    </span>
  );

  return variant === "desktop" ? (
    <Link href="/santa" className="text-[#c0392b] hover:text-[#962d22] transition-colors duration-300 text-sm font-medium">
      🎅 Secret Santa{badge}
    </Link>
  ) : (
    <Link href="/santa" onClick={onNavigate} className="block text-[#c0392b] text-sm font-medium">
      🎅 Secret Santa{badge}
    </Link>
  );
}
