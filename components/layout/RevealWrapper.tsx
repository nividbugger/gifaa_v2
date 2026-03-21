"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: 0 | 100 | 200 | 300;
}

export default function RevealWrapper({ children, delay = 0 }: RevealWrapperProps) {
  const ref = useScrollReveal();
  const delayClass = delay > 0 ? `delay-${delay}` : "";

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-section ${delayClass}`.trim()}
    >
      {children}
    </div>
  );
}
