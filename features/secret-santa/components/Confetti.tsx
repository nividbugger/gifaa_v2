"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#e0c08f", "#bb9558", "#f6e6bd", "#ffffff", "#2f6fc0", "#9ee7e0", "#c0577a"];
const DURATION_MS = 3600;

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; color: string; round: boolean;
}

/** A single celebratory burst from the bottom of the screen. Set `run` true to fire it. */
export default function Confetti({ run, onDone }: { run: boolean; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles: Particle[] = Array.from({ length: 150 }, () => {
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.5;
      const speed = 9 + Math.random() * 11;
      return {
        x: w / 2 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.78,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        round: Math.random() < 0.3,
      };
    });

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const fade = Math.max(0, Math.min(1, (DURATION_MS - elapsed) / 800));
      for (const p of particles) {
        p.vx *= 0.992;
        p.vy = p.vy * 0.992 + 0.34;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.6);
        }
        ctx.restore();
      }
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, w, h);
        onDone?.();
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, w, h);
    };
    // onDone is intentionally not a dependency: a new callback identity must not restart the burst.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]" />;
}
