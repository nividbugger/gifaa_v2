"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Search, Eye, Gift, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleCreateRegistry = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleFindRegistry = () => {
    router.push("/search");
  };

  const handlePreviewSample = () => {
    router.push("/registry/sample");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory-warm to-ivory" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-royal/5 blur-3xl" />

      {/* Floating decorative icons */}
      <div className="absolute top-1/3 left-[10%] animate-float opacity-15 hidden md:block">
        <Gift className="w-10 h-10 text-gold" />
      </div>
      <div className="absolute bottom-1/3 right-[15%] animate-float-delayed opacity-10 hidden md:block">
        <Heart className="w-8 h-8 text-royal" />
      </div>

      {/* Gold decorative line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container relative mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="animate-fade-up mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal/5 text-royal text-sm font-medium border border-royal/10 hover-lift">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              India&apos;s Premier Gift Registry
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-charcoal mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Gift Thoughtfully For
            <br />
            <span className="text-gradient-gold">Life&apos;s Biggest Moments</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-charcoal-light max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-0.5 h-5 bg-gold ml-0.5 animate-pulse align-middle" />
            )}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col items-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full sm:w-auto min-w-[280px] text-lg py-6 group animate-glow"
              onClick={handleCreateRegistry}
            >
              Create a Registry
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button
                variant="hero-secondary"
                size="sm"
                className="w-full sm:w-auto group hover-lift"
                onClick={handleFindRegistry}
              >
                <Search className="w-4 h-4" />
                Find a Registry
              </Button>
              <Button
                variant="hero-secondary"
                size="sm"
                className="w-full sm:w-auto group hover-lift"
                onClick={handlePreviewSample}
              >
                <Eye className="w-4 h-4" />
                Preview Sample Registry
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className="mt-14 flex flex-col items-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-sm text-charcoal-light">
              Trusted by over <span className="font-semibold text-royal">10,000+</span> families across India
            </p>
            <div className="flex items-center gap-6 opacity-60">
              <span className="text-xs font-medium tracking-wider text-charcoal-light uppercase">
                Works with
              </span>
              <div className="flex items-center gap-4 text-charcoal-light text-sm font-medium">
                <span className="hover:text-royal transition-colors">Amazon</span>
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse-subtle" />
                <span className="hover:text-royal transition-colors">Flipkart</span>
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse-subtle" />
                <span className="hover:text-royal transition-colors">Nykaa</span>
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse-subtle" />
                <span className="hover:text-royal transition-colors">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
