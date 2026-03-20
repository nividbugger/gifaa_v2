import { useRef, useEffect, useCallback } from "react";

interface UseAutoScrollOptions {
  interval?: number; // ms between scrolls
  scrollAmount?: number; // pixels to scroll
  enabled?: boolean;
}

export function useAutoScroll<T extends HTMLElement>({
  interval = 4000,
  scrollAmount = 300,
  enabled = true,
}: UseAutoScrollOptions = {}) {
  const scrollRef = useRef<T>(null);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const scroll = useCallback(() => {
    if (!scrollRef.current || isPausedRef.current) return;

    const container = scrollRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    // If at or near the end, smoothly reset to start
    if (container.scrollLeft >= maxScrollLeft - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [scrollAmount]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = window.setInterval(scroll, interval);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [scroll, interval, enabled]);

  // Touch handlers
  const handleTouchStart = useCallback(() => {
    pause();
  }, [pause]);

  const handleTouchEnd = useCallback(() => {
    // Resume after a short delay to allow for natural scrolling to finish
    setTimeout(resume, 3000);
  }, [resume]);

  return {
    scrollRef,
    handleTouchStart,
    handleTouchEnd,
    pause,
    resume,
  };
}
