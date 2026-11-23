import type { GiftTone } from "../covers";

const TONES: Record<GiftTone, { body: string; shade: string; lid: string; ribbon: string; ribbonShade: string }> = {
  gold: { body: "#c9a15f", shade: "#a98443", lid: "#dcb878", ribbon: "#0a3566", ribbonShade: "#072a52" },
  midnight: { body: "#154078", shade: "#0f2f5c", lid: "#1d4f93", ribbon: "#e6c995", ribbonShade: "#c9a15f" },
  ivory: { body: "#f3ead6", shade: "#dccfae", lid: "#fffaf0", ribbon: "#bb9558", ribbonShade: "#9c7a40" },
  rose: { body: "#8a2f45", shade: "#6b2236", lid: "#a03a52", ribbon: "#f0d9a0", ribbonShade: "#d3b46a" },
};

interface Props {
  tone?: GiftTone;
  className?: string;
  /** Lifts the lid and bow off the box (used in the reveal). */
  lidOpen?: boolean;
}

/** A hand-drawn gift box. Pure SVG so it stays sharp at any size and weighs almost nothing. */
export default function GiftBox({ tone = "gold", className, lidOpen = false }: Props) {
  const c = TONES[tone];
  return (
    <svg viewBox="0 0 120 124" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="118" rx="38" ry="5" fill="#000" opacity="0.2" />
      {/* box */}
      <rect x="16" y="56" width="88" height="58" rx="7" fill={c.body} />
      <rect x="16" y="56" width="30" height="58" rx="7" fill={c.shade} opacity="0.35" />
      <rect x="52" y="56" width="16" height="58" fill={c.ribbon} />
      <rect x="52" y="56" width="6" height="58" fill={c.ribbonShade} opacity="0.35" />
      {/* lid and bow, lifted together when opened */}
      <g
        style={{
          transformOrigin: "60px 52px",
          transform: lidOpen ? "translate(26px,-44px) rotate(18deg)" : "none",
          transition: "transform 0.7s cubic-bezier(0.2, 1.4, 0.4, 1)",
        }}
      >
        <rect x="10" y="42" width="100" height="22" rx="6" fill={c.lid} />
        <rect x="10" y="57" width="100" height="7" rx="3.5" fill={c.shade} opacity="0.25" />
        <rect x="52" y="42" width="16" height="22" fill={c.ribbon} />
        <path d="M60 42 C 38 8, 8 24, 30 40 C 42 49, 56 44, 60 42 Z" fill={c.ribbon} />
        <path d="M60 42 C 82 8, 112 24, 90 40 C 78 49, 64 44, 60 42 Z" fill={c.ribbon} />
        <path d="M60 42 C 46 22, 26 28, 36 38" fill="none" stroke={c.ribbonShade} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        <path d="M60 42 C 74 22, 94 28, 84 38" fill="none" stroke={c.ribbonShade} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        <circle cx="60" cy="42" r="7" fill={c.ribbonShade} />
        <circle cx="58" cy="40" r="2.2" fill="#fff" opacity="0.35" />
      </g>
    </svg>
  );
}
