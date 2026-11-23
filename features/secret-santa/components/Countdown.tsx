"use client";

import { useEffect, useState } from "react";
import { countdownLabel, daysUntil } from "../countdown";

/** "6 days to go" pill. Computed after mount because the answer depends on the visitor's clock. */
export default function Countdown({ date, tone = "dark", className = "" }: { date: string | null; tone?: "dark" | "light"; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);
  const [today, setToday] = useState(false);

  useEffect(() => {
    const c = daysUntil(date);
    setLabel(countdownLabel(c));
    setToday(c.kind === "today");
  }, [date]);

  if (!label) return null;
  const style = tone === "dark" ? "bg-white/[0.12] text-[#f6e6bd] ring-1 ring-white/15 backdrop-blur" : "bg-gold/15 text-royal ring-1 ring-gold/30";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style} ${className}`}>
      <span aria-hidden>{today ? "🎁" : "🎄"}</span>
      {label}
    </span>
  );
}
