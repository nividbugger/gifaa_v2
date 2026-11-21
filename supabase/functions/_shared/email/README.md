# Gifaa email (shared)

One sender, one branded layout, used by every feature. Provider: [Resend](https://resend.com) with `gifaa.in` verified.

## Configuration (Supabase secrets, shared by all functions)
```bash
supabase secrets set \
  RESEND_API_KEY=re_...                 \
  EMAIL_FROM="Gifaa <hello@gifaa.in>"   \
  EMAIL_REPLY_TO=letsgifaa@gmail.com    \
  SITE_URL=https://www.gifaa.in
```
| Secret | Purpose | Default |
|---|---|---|
| `RESEND_API_KEY` | Enables sending. **Unset = email disabled**; callers get `sender.configured === false` and should degrade gracefully | none |
| `EMAIL_FROM` | Default sender. Any `@gifaa.in` address works, no mailbox needed | `Gifaa <hello@gifaa.in>` |
| `EMAIL_REPLY_TO` | Where replies go (the From address has no inbox) | `letsgifaa@gmail.com` |
| `SITE_URL` | Origin for links inside emails | `https://gifaa.in` |

## Adding a new email (e.g. "someone bought a gift from your registry")
1. Write a template next to the feature that sends it. It takes data and returns an `EmailMessage`; pass **plain text** to `renderEmail`, which escapes it (names and notes are user input):
   ```ts
   import { renderEmail } from "../_shared/email/layout.ts";
   import type { EmailMessage } from "../_shared/email/sender.ts";

   export function buildGiftPurchasedEmail(i: { to: string; ownerName: string; giftName: string; registryUrl: string }): EmailMessage {
     const { html, text } = renderEmail({
       heading: `Good news, ${i.ownerName}!`,
       paragraphs: [`Someone just bought “${i.giftName}” from your registry.`],
       cta: { label: "View registry", url: i.registryUrl },
     });
     return { to: i.to, subject: "A gift was purchased 🎁", html, text };
   }
   ```
2. In the edge function that triggers it:
   ```ts
   import { createEmailSenderFromEnv, sendBatch, siteUrlFromEnv } from "../_shared/email/sender.ts";
   const sender = createEmailSenderFromEnv(Deno.env);
   if (sender.configured) await sendBatch(sender, [buildGiftPurchasedEmail({ ... })]);
   ```
3. Add a small test next to the template (see `santa-draw/match-email.test.ts`).

## Rules
- **Never expose sending to the browser** (no public "send email" endpoint): it would be an open spam relay. Emails are sent only from server-side functions that have already authorised the action.
- Send only emails the recipient expects (transactional). Marketing email needs consent and an unsubscribe link, which this module doesn't provide yet.
- Don't put secrets (tokens) in emails unless the email *is* the credential (like a personal link); say so in the footnote.
- Always send via `renderEmail` so every message has the same branding, a plain-text twin and escaping.

## Tests
`node --test supabase/functions/_shared/email/email.test.ts` (sender, batching, escaping; no network or Deno needed).

## Optional: Supabase Auth emails through Resend
Signup/confirmation mail uses Supabase's built-in sender, which is heavily rate-limited. In the dashboard: *Authentication → Emails → SMTP Settings* → host `smtp.resend.com`, port `465`, user `resend`, password = an API key, sender `hello@gifaa.in`.
