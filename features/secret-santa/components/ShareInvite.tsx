"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { joinUrl, whatsappShareUrl, formatInr, formatDate } from "../links";
import type { SantaGroup } from "../types";

export default function ShareInvite({ group }: { group: SantaGroup }) {
  const [copied, setCopied] = useState(false);
  const url = joinUrl(group.code);
  const budget = formatInr(group.budget_amount);
  const date = formatDate(group.exchange_date);

  const message = [
    `🎅 You're invited to a Secret Santa: "${group.name}"`,
    [budget && `Budget ${budget}`, date && `Exchange ${date}`].filter(Boolean).join(" · "),
    `Join here: ${url}`,
  ].filter(Boolean).join("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="break-all rounded-2xl border border-dashed border-gold/50 bg-ivory-warm px-4 py-3 text-sm font-medium text-charcoal">{url}</div>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={whatsappShareUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-royal px-5 py-3 text-sm font-semibold text-[#f6e6bd] shadow-md transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" /> Invite on WhatsApp
        </a>
        <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-royal ring-1 ring-gold/50 hover:bg-gold/10">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
