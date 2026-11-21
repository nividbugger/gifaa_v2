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

/** Thrown on HTTP 429 so callers can wait and retry instead of treating it as a hard failure. */
export class RateLimitError extends Error {
  readonly retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super(`Rate limited by the email provider (retry in ${retryAfterMs}ms)`);
    this.retryAfterMs = retryAfterMs;
  }
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
      if (response.status === 429) {
        const seconds = Number(response.headers.get("retry-after"));
        throw new RateLimitError(Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds * 1000) : 1000);
      }
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
  /** Up to 3 distinct failure reasons, so callers can show *why* instead of just "failed". */
  errors: string[];
}

export interface BatchOptions {
  /** Gap between sends. Resend's default limit is 2 requests/second, so stay under it. */
  minIntervalMs?: number;
  /** Retries per message when the provider says "slow down" (429). */
  maxRetries?: number;
  /** Injectable so tests don't really wait. */
  sleep?: (ms: number) => Promise<void>;
}

const MAX_REPORTED_ERRORS = 3;
const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Sends messages one at a time, paced under the provider's rate limit, retrying when told to slow down.
 * One failure never stops the rest, and the distinct reasons are reported back.
 */
export async function sendBatch(sender: EmailSender, messages: readonly EmailMessage[], options: BatchOptions = {}): Promise<BatchResult> {
  const { minIntervalMs = 600, maxRetries = 3, sleep = defaultSleep } = options;
  const result: BatchResult = { sent: 0, failed: 0, errors: [] };

  for (const [index, message] of messages.entries()) {
    if (index > 0) await sleep(minIntervalMs);

    for (let attempt = 0; ; attempt++) {
      try {
        await sender.send(message);
        result.sent++;
        break;
      } catch (error) {
        if (error instanceof RateLimitError && attempt < maxRetries) {
          await sleep(error.retryAfterMs);
          continue;
        }
        console.error("email failed", message.to.replace(/^(.).*(@.*)$/, "$1***$2"), error);
        result.failed++;
        const reason = (error instanceof Error ? error.message : String(error)).slice(0, 160);
        if (result.errors.length < MAX_REPORTED_ERRORS && !result.errors.includes(reason)) result.errors.push(reason);
        break;
      }
    }
  }
  return result;
}
