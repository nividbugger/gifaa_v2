"use client";

import { ExternalLink } from "lucide-react";

interface UPIQRDisplayProps {
  upiId: string;
  qrUrl: string;
}

export default function UPIQRDisplay({ upiId, qrUrl }: UPIQRDisplayProps) {
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&cu=INR`;

  return (
    <div className="flex flex-col items-center gap-4">

      {/* QR image frame */}
      <div className="relative p-4 bg-white rounded-3xl border border-gold/30 shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
        {/* Gold corner brackets */}
        <span className="absolute top-2.5 left-2.5  w-5 h-5 border-t-2 border-l-2 border-gold/70 rounded-tl-md pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-gold/70 rounded-tr-md pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5  w-5 h-5 border-b-2 border-l-2 border-gold/70 rounded-bl-md pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-gold/70 rounded-br-md pointer-events-none" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="UPI QR Code"
          className="w-44 h-44 object-contain rounded-2xl"
        />
      </div>

      {/* Tappable UPI ID */}
      <div className="text-center space-y-1">
        <p className="text-xs text-charcoal-light tracking-wide uppercase">
          Scan or tap to pay
        </p>
        <a
          href={upiLink}
          className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-royal hover:text-royal/70 transition-colors hover:underline underline-offset-4"
        >
          {upiId}
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
      </div>
    </div>
  );
}
