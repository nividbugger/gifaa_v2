// Gifaa's shared email sending. Any edge function can import this module (see README.md for usage).
// Note: keep example import lines out of comments; the Supabase CLI scans them as real imports.
// Deliberately NOT exposed as a client-callable endpoint: that would be an open spam relay.

export const DEFAULT_FROM = "Gifaa <hello@gifaa.in>";
export const DEFAULT_REPLY_TO = "letsgifaa@gmail.com";
export const DEFAULT_SITE_URL = "https://gifaa.in";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Always provide one: it improves deliverability and accessibility. */
  text?: string;
  /** Overrides the default sender for this message, e.g. "Gifaa Support <support@gifaa.in>". */
  from?: string;
  replyTo?: string;
}

export interface EmailSender {
  /** False when no provider key is set; callers should degrade gracefully instead of failing. */
  readonly configured: boolean;
  send(message: EmailMessage): Promise<void>;
}

export interface SenderConfig {
  apiKey: string | undefined;
  from: string;
  replyTo?: string;
}

/**
 * Resend (https://resend.com). The From address usually has no mailbox behind it, so
 * `replyTo` is what makes replies reach a real inbox.
 */
export function createResendSender({ apiKey, from, replyTo }: SenderConfig): EmailSender {
  return {
    configured: !!apiKey,
    async send(message) {
      if (!apiKey) throw new Error("Email is not configured");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: message.from ?? from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          ...(message.text && { text: message.text }),
          ...((message.replyTo ?? replyTo) && { reply_to: message.replyTo ?? replyTo }),
        }),
      });
      if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
    },
  };
}

/** Secrets: RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO. Takes an env reader so it works in Deno and in tests. */
export function createEmailSenderFromEnv(env: { get(name: string): string | undefined }): EmailSender {
  return createResendSender({
    apiKey: env.get("RESEND_API_KEY"),
    from: env.get("EMAIL_FROM") ?? DEFAULT_FROM,
    replyTo: env.get("EMAIL_REPLY_TO") ?? DEFAULT_REPLY_TO,
  });
}

/** Origin of the web app, for building links inside emails (secret: SITE_URL). */
export function siteUrlFromEnv(env: { get(name: string): string | undefined }): string {
  return (env.get("SITE_URL") ?? DEFAULT_SITE_URL).replace(/\/$/, "");
}

export interface BatchResult {
  sent: number;
  failed: number;
}

/** Sends many messages with bounded concurrency. One failure never stops the rest. */
export async function sendBatch(sender: EmailSender, messages: readonly EmailMessage[], concurrency = 5): Promise<BatchResult> {
  const queue = [...messages];
  const result: BatchResult = { sent: 0, failed: 0 };

  const worker = async () => {
    for (let message = queue.shift(); message; message = queue.shift()) {
      try {
        await sender.send(message);
        result.sent++;
      } catch (error) {
        console.error("email failed", message.to.replace(/^(.).*(@.*)$/, "$1***$2"), error);
        result.failed++;
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  return result;
}
