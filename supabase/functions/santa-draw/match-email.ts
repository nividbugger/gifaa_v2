// Secret Santa's email template. Lives with the feature (not in _shared) so it's removed with it.

import { renderEmail } from "../_shared/email/layout.ts";
import type { EmailMessage } from "../_shared/email/sender.ts";

export interface MatchEmailInput {
  to: string;
  participantName: string;
  groupName: string;
  link: string;
  budget: number | null;
  exchangeDate: string | null;
}

/** Deliberately does not name the match: the reveal happens on the page, behind the personal link. */
export function buildMatchEmail(input: MatchEmailInput): EmailMessage {
  const details = [
    input.budget ? `Budget: ₹${input.budget.toLocaleString("en-IN")}` : null,
    input.exchangeDate ? `Gift exchange: ${input.exchangeDate}` : null,
  ].filter(Boolean).join(" · ");

  const { html, text } = renderEmail({
    preheader: "Tap to find out who you're gifting.",
    heading: `Hi ${input.participantName} 🎁`,
    paragraphs: [`The names have been drawn for ${input.groupName}. Tap below to find out who you're gifting — and keep it secret!`],
    details: details || undefined,
    cta: { label: "Reveal my match", url: input.link },
    footnote: "This link is personal to you — don't forward it, or someone could peek at your match.",
  });

  return { to: input.to, subject: `🎅 Your Secret Santa match is ready – ${input.groupName}`, html, text };
}
