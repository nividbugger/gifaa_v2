"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const HERO_IMAGES = [
  "/hero-1.png",
  "/hero-2.png",
  "/hero-3.png",
  "/hero-4.png",
];

const TYPEWRITER_TEXT =
  "Create beautiful registries for weddings, baby showers, housewarmings, and more. No duplicates. No confusion. Just joy.";

function useTypewriter(text: string, speed = 28, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

const HeroSection = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRegistry = () => {
    router.push(user ? "/dashboard" : "/signup");
  };

  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden px-6 md:px-8 max-w-screen-2xl mx-auto py-20 pt-32">
      <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left column */}
        <div className="lg:col-span-6 z-10">
          <div className="animate-fade-up mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal/5 text-royal text-sm font-medium border border-royal/10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              India&apos;s Premier Gift Registry
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#093a6f] leading-[1.1] mb-8 tracking-tight">
            Gift Thoughtfully For
            <br />
            <span className="italic text-[#79590f]">Life&apos;s Biggest Moments</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-lg mb-12 font-sans leading-relaxed min-h-[4rem]">
            {displayed}
            {!done && (
              <span className="inline-block w-0.5 h-5 bg-[#79590f] ml-0.5 animate-pulse align-middle" />
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCreateRegistry}
              className="bg-[#093a6f] text-white px-10 py-5 rounded-md font-semibold text-lg hover:bg-[#0d4a8a] transition-colors shadow-xl"
            >
              Start Your Registry
            </button>
            <button
              onClick={() => router.push("/registry/sample")}
              className="border-2 border-[#79590f] text-[#79590f] px-10 py-5 rounded-md font-semibold text-lg hover:bg-[#79590f]/5 transition-colors"
            >
              View Sample Registry
            </button>
          </div>
        </div>

        {/* Right column: tilted image + floating card */}
        <div className="lg:col-span-6 relative h-[500px] lg:h-[600px] hidden lg:block">
          {/* Background rotated container */}
          <div className="absolute inset-0 bg-surface-container rounded-[2rem] -rotate-3 transform translate-x-12 translate-y-8" />

          {/* Hero images — crossfade rotation */}
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Gift registry inspiration"
              className="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl z-0 transform rotate-2 transition-opacity duration-[800ms]"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            />
          ))}

          {/* Floating registry progress card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs z-20 border border-outline-variant/15">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#79590f]/10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#79590f]">payments</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#093a6f] text-sm">Ananya &amp; Rahul</h4>
                <p className="text-xs text-on-surface-variant font-sans">Wedding Registry · Direct UPI Active</p>
              </div>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-[#79590f] rounded-full" />
            </div>
            <p className="text-[10px] mt-2 text-on-surface-variant uppercase tracking-widest font-medium font-sans">
              65% of Goal Reached
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
