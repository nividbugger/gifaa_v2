"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg bg-ivory-warm px-3 py-2 text-sm text-charcoal break-all">{url}</div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="royal" className="gap-2">
          <a href={whatsappShareUrl(message)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4" /> Invite on WhatsApp
          </a>
        </Button>
        <Button variant="outline" onClick={copy} className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
