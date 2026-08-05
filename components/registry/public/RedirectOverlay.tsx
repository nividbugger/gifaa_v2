"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, MapPin, ExternalLink, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RedirectOverlayProps {
  url: string;
  productName: string;
  shippingAddress?: string | null;
  countdown: number;
  onClose: () => void;
  onCountdownComplete: () => void;
}

export default function RedirectOverlay({
  url,
  productName,
  shippingAddress,
  countdown,
  onClose,
  onCountdownComplete,
}: RedirectOverlayProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [currentCount, setCurrentCount] = useState(countdown);

  useEffect(() => {
    if (currentCount <= 0) {
      onCountdownComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentCount, onCountdownComplete]);

  const handleCopyAddress = async () => {
    if (!shippingAddress) return;
    
    try {
      await navigator.clipboard.writeText(shippingAddress);
      setCopiedAddress(true);
      toast.success("Address copied!");
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSkip = () => {
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-royal flex items-center justify-center p-4 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-lg text-center text-white animate-fade-up">
        {/* Icon */}
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center animate-glow">
            <Gift className="w-10 h-10 text-gold" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
          You'll be redirected shortly 💛
        </h2>

        {/* Product Name */}
        <p className="text-lg text-white/90 mb-6">
          Purchasing: <span className="font-semibold text-gold">{productName}</span>
        </p>

        {/* Countdown Timer */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-6 py-3 mb-3">
            <Clock className="w-5 h-5 text-gold" />
            <span className="text-sm">Redirecting in</span>
            <span className="text-3xl font-bold text-gold tabular-nums">
              {currentCount}
            </span>
            <span className="text-sm">seconds</span>
          </div>

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              Skip & go now
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="bg-white/10 border border-gold/20 backdrop-blur-sm rounded-2xl p-5 mb-6 text-left">
          <h3 className="font-semibold text-gold mb-2 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            Important Reminder
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            Please don't forget to mark this gift as purchased on Gifaa to avoid duplicate gifting.
          </p>
        </div>

        {/* Shipping Address */}
        {shippingAddress && (
          <div className="bg-white/10 border border-gold/20 backdrop-blur-sm rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-gold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="rounded-full text-white/80 hover:text-white hover:bg-white/10 -mt-1 h-7 px-2"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-white/80 text-sm whitespace-pre-line">
              {shippingAddress}
            </p>
          </div>
        )}

        {/* Cancel Button */}
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full bg-white text-royal hover:bg-white/90 shadow-elevated px-8"
          onClick={onClose}
        >
          Cancel & Go Back
        </Button>
      </div>
    </div>
  );
}
