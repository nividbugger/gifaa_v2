interface Props {
  count?: number;
  className?: string;
}

// A tiny seeded generator keeps server and client output identical (no hydration mismatch)
// while still looking random.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** Gently falling snow. Decorative only; hidden for reduced-motion users via CSS. */
export default function Snowfall({ count = 26, className = "" }: Props) {
  const rand = seeded(42);
  const flakes = Array.from({ length: count }, (_, i) => {
    const size = 2 + Math.round(rand() * 4);
    return {
      i,
      left: Math.round(rand() * 100),
      size,
      duration: 9 + Math.round(rand() * 10),
      delay: -Math.round(rand() * 18),
      drift: Math.round(rand() * 60) - 30,
      opacity: (0.35 + rand() * 0.5).toFixed(2),
    };
  });

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {flakes.map((f) => (
        <span
          key={f.i}
          className="santa-flake"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`,
              "--o": f.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
