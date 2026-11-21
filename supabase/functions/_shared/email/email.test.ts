import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { RateLimitError, createEmailSenderFromEnv, createResendSender, keyFingerprint, normalizeApiKey, sendBatch, siteUrlFromEnv, type EmailMessage } from "./sender.ts";
import { escapeHtml, renderEmail } from "./layout.ts";

type Fetch = typeof fetch;
function mockFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const calls: { url: string; init: RequestInit; body: Record<string, unknown> }[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init, body: JSON.parse(String(init.body)) });
    return handler(url, init);
  }) as Fetch;
  return calls;
}
const msg = (to: string): EmailMessage => ({ to, subject: "s", html: "<p>h</p>" });
const env = (vars: Record<string, string>) => ({ get: (k: string) => vars[k] });

test("sends the expected Resend request, with defaults and reply-to", async () => {
  const calls = mockFetch(() => new Response("{}"));
  const sender = createResendSender({ apiKey: "re_key", from: "Gifaa <hello@gifaa.in>", replyTo: "help@gifaa.in" });
  await sender.send({ ...msg("a@b.co"), text: "plain" });
  const [call] = calls;
  assert.equal(call!.url, "https://api.resend.com/emails");
  assert.equal((call!.init.headers as Record<string, string>).Authorization, "Bearer re_key");
  assert.deepEqual(call!.body, { from: "Gifaa <hello@gifaa.in>", to: "a@b.co", subject: "s", html: "<p>h</p>", text: "plain", reply_to: "help@gifaa.in" });
});

test("per-message from/replyTo override the defaults; optional fields are omitted when absent", async () => {
  const calls = mockFetch(() => new Response("{}"));
  await createResendSender({ apiKey: "k", from: "Default <d@gifaa.in>" }).send({ ...msg("a@b.co"), from: "Support <support@gifaa.in>", replyTo: "x@y.z" });
  assert.equal(calls[0]!.body.from, "Support <support@gifaa.in>");
  assert.equal(calls[0]!.body.reply_to, "x@y.z");
  await createResendSender({ apiKey: "k", from: "f" }).send(msg("a@b.co"));
  assert.ok(!("reply_to" in calls[1]!.body) && !("text" in calls[1]!.body));
});

test("provider errors surface with the provider's message", async () => {
  mockFetch(() => new Response("domain not verified", { status: 403 }));
  await assert.rejects(createResendSender({ apiKey: "k", from: "f" }).send(msg("a@b.co")), /Resend 403: domain not verified/);
});

test("an unconfigured sender reports it and refuses to send", async () => {
  const sender = createEmailSenderFromEnv(env({}));
  assert.equal(sender.configured, false);
  await assert.rejects(sender.send(msg("a@b.co")), /not configured/);
});

test("env wiring: key enables it, defaults apply, overrides win", async () => {
  const calls = mockFetch(() => new Response("{}"));
  await createEmailSenderFromEnv(env({ RESEND_API_KEY: "k" })).send(msg("a@b.co"));
  assert.equal(calls[0]!.body.from, "Gifaa <hello@gifaa.in>");
  assert.equal(calls[0]!.body.reply_to, "letsgifaa@gmail.com");
  await createEmailSenderFromEnv(env({ RESEND_API_KEY: "k", EMAIL_FROM: "X <x@gifaa.in>", EMAIL_REPLY_TO: "r@gifaa.in" })).send(msg("a@b.co"));
  assert.equal(calls[1]!.body.from, "X <x@gifaa.in>");
  assert.equal(calls[1]!.body.reply_to, "r@gifaa.in");
  assert.equal(siteUrlFromEnv(env({})), "https://gifaa.in");
  assert.equal(siteUrlFromEnv(env({ SITE_URL: "https://www.gifaa.in/" })), "https://www.gifaa.in");
});

const noSleep = { sleep: async () => {} };

test("sendBatch counts successes and failures, and a failure doesn't stop the rest", async () => {
  const sent: string[] = [];
  const sender = { configured: true, send: async (m: EmailMessage) => { if (m.to.startsWith("bad")) throw new Error("boom"); sent.push(m.to); } };
  const result = await sendBatch(sender, ["a@x.co", "bad1@x.co", "b@x.co", "bad2@x.co", "c@x.co"].map(msg), noSleep);
  assert.deepEqual({ sent: result.sent, failed: result.failed }, { sent: 3, failed: 2 });
  assert.deepEqual(sent, ["a@x.co", "b@x.co", "c@x.co"], "sent in order, one at a time");
});

test("sendBatch reports WHY things failed: distinct reasons, capped at 3", async () => {
  const reasons = ["Resend 403: domain not verified", "Resend 403: domain not verified", "Resend 422: invalid to", "x".repeat(300), "four", "five"];
  let i = 0;
  const sender = { configured: true, send: async () => { throw new Error(reasons[i++]); } };
  const result = await sendBatch(sender, reasons.map((_, n) => msg(`p${n}@x.co`)), noSleep);
  assert.equal(result.failed, 6);
  assert.equal(result.errors.length, 3);
  assert.deepEqual(result.errors.slice(0, 2), ["Resend 403: domain not verified", "Resend 422: invalid to"]);
  assert.ok(result.errors[2]!.length <= 160, "long reasons are truncated");
});

test("sendBatch paces sends under the provider's rate limit", async () => {
  const sleeps: number[] = [];
  const result = await sendBatch({ configured: true, send: async () => {} }, ["a", "b", "c", "d"].map((n) => msg(`${n}@x.co`)), { minIntervalMs: 600, sleep: async (ms) => { sleeps.push(ms); } });
  assert.equal(result.sent, 4);
  assert.deepEqual(sleeps, [600, 600, 600], "a gap between sends, none before the first or after the last");
});

test("sendBatch waits and retries on a rate limit, then succeeds", async () => {
  let calls = 0;
  const sleeps: number[] = [];
  const sender = { configured: true, send: async () => { if (++calls < 3) throw new RateLimitError(1500); } };
  const result = await sendBatch(sender, [msg("a@x.co")], { sleep: async (ms) => { sleeps.push(ms); } });
  assert.deepEqual({ sent: result.sent, failed: result.failed }, { sent: 1, failed: 0 });
  assert.equal(calls, 3);
  assert.deepEqual(sleeps, [1500, 1500], "honours the provider's retry-after");
});

test("sendBatch gives up after maxRetries and says it was rate limiting", async () => {
  let calls = 0;
  const sender = { configured: true, send: async () => { calls++; throw new RateLimitError(100); } };
  const result = await sendBatch(sender, [msg("a@x.co")], { maxRetries: 2, ...noSleep });
  assert.equal(calls, 3, "1 try + 2 retries");
  assert.equal(result.failed, 1);
  assert.match(result.errors[0]!, /Rate limited/);
});

test("the Resend sender turns a 429 into a RateLimitError using Retry-After", async () => {
  mockFetch(() => new Response("slow down", { status: 429, headers: { "retry-after": "2" } }));
  const sender = createResendSender({ apiKey: "k", from: "f" });
  await assert.rejects(sender.send(msg("a@b.co")), (e: unknown) => e instanceof RateLimitError && e.retryAfterMs === 2000);
  mockFetch(() => new Response("slow down", { status: 429 }));
  await assert.rejects(sender.send(msg("a@b.co")), (e: unknown) => e instanceof RateLimitError && e.retryAfterMs === 1000, "default when the header is missing");
});

test("sendBatch handles an empty list and doesn't put full recipient addresses in logs", async () => {
  assert.deepEqual(await sendBatch({ configured: true, send: async () => {} }, [], noSleep), { sent: 0, failed: 0, errors: [] });
  const logged: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => { logged.push(args); };
  try { await sendBatch({ configured: true, send: async () => { throw new Error("x"); } }, [msg("someone@example.com")], noSleep); } finally { console.error = original; }
  assert.ok(!JSON.stringify(logged).includes("someone@example.com"));
});

test("API keys pasted with quotes or whitespace are cleaned before use", async () => {
  for (const messy of ['re_abc123', ' re_abc123 ', '"re_abc123"', "'re_abc123'", ' "re_abc123"\n', '`re_abc123`']) {
    assert.equal(normalizeApiKey(messy), "re_abc123", JSON.stringify(messy));
  }
  assert.equal(normalizeApiKey(""), undefined);
  assert.equal(normalizeApiKey('  ""  '), undefined);
  assert.equal(normalizeApiKey(undefined), undefined);

  const calls = mockFetch(() => new Response("{}"));
  await createResendSender({ apiKey: ' "re_abc123"\n', from: "f" }).send(msg("a@b.co"));
  assert.equal((calls[0]!.init.headers as Record<string, string>).Authorization, "Bearer re_abc123");
  assert.equal(createEmailSenderFromEnv(env({ RESEND_API_KEY: '""' })).configured, false, "an empty quoted key counts as not configured");
});

test("a 401 says what key the function holds (length + fingerprint) without revealing it", async () => {
  const key = "re_test_key_0123456789";
  mockFetch(() => new Response('{"message":"API key is invalid"}', { status: 401 }));
  const expectedFingerprint = createHash("sha256").update(key).digest("hex").slice(0, 8);
  assert.equal(await keyFingerprint(key), expectedFingerprint);
  await assert.rejects(createResendSender({ apiKey: key, from: "f" }).send(msg("a@b.co")), (e: unknown) => {
    const text = (e as Error).message;
    return text.includes("Resend 401") && text.includes("API key is invalid") && text.includes(`${key.length} chars`) && text.includes(expectedFingerprint) && !text.includes(key);
  });
});

test("layout escapes user-supplied text everywhere and builds a plain-text twin", () => {
  const evil = `<script>alert("x")</script>`;
  const { html, text } = renderEmail({
    preheader: evil, heading: `Hi ${evil}`, paragraphs: [evil], details: evil,
    cta: { label: evil, url: `https://gifaa.in/a?x="1"&y=2` }, footnote: evil,
  });
  assert.ok(!html.includes("<script>"), "no raw script tag");
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes(`href="https://gifaa.in/a?x=&quot;1&quot;&amp;y=2"`), "URL attribute is escaped");
  assert.ok(text.includes("Hi <script>") && text.includes("https://gifaa.in/a?x=\"1\"&y=2"), "text version is unescaped, plain");
  assert.equal(escapeHtml(`&<>"`), "&amp;&lt;&gt;&quot;");
});

test("layout omits optional blocks cleanly", () => {
  const { html, text } = renderEmail({ heading: "H", paragraphs: ["P"] });
  assert.ok(!html.includes("<a href") && !html.includes("display:none"));
  assert.ok(text.startsWith("H\n\nP") && text.endsWith("Sent by Gifaa · gifaa.in"));
});
