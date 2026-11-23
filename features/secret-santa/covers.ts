// Every group gets one of a few "covers", picked from its code, so each exchange looks personal
// without storing anything extra in the database.

export type GiftTone = "midnight" | "gold" | "ivory" | "rose";

export interface Cover {
  id: string;
  /** CSS background for the invitation card / hero. */
  background: string;
  /** Soft accent used for glows and highlights. */
  glow: string;
  /** Colour of the gift illustration that sits on this cover. */
  tone: GiftTone;
}

export const COVERS: readonly Cover[] = [
  { id: "midnight", background: "linear-gradient(135deg,#050d24 0%,#0a2a5e 55%,#0a3566 100%)", glow: "#e0c08f", tone: "gold" },
  { id: "aurora", background: "linear-gradient(135deg,#06182f 0%,#0b3b5c 50%,#14606b 100%)", glow: "#9ee7e0", tone: "ivory" },
  { id: "plum", background: "linear-gradient(135deg,#120a2e 0%,#2b1b63 55%,#4b2a7d 100%)", glow: "#e9c9ff", tone: "gold" },
  { id: "evergreen", background: "linear-gradient(135deg,#041a17 0%,#0b3b32 55%,#12503f 100%)", glow: "#f0d9a0", tone: "gold" },
  { id: "ember", background: "linear-gradient(135deg,#1a0b1f 0%,#4a1530 55%,#7a2a3a 100%)", glow: "#ffd9a8", tone: "gold" },
];

export const DEFAULT_COVER = COVERS[0]!;

export function coverFor(code: string | null | undefined): Cover {
  if (!code) return DEFAULT_COVER;
  let hash = 0;
  for (const char of code) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COVERS[hash % COVERS.length]!;
}
