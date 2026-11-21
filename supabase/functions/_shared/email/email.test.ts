import { test } from "node:test";
import assert from "node:assert/strict";
import { createEmailSenderFromEnv, createResendSender, sendBatch, siteUrlFromEnv, type EmailMessage } from "./sender.ts";
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

test("sendBatch counts successes and failures, and a failure doesn't stop the rest", async () => {
  const sent: string[] = [];
  const sender = { configured: true, send: async (m: EmailMessage) => { if (m.to.startsWith("bad")) throw new Error("boom"); sent.push(m.to); } };
  const result = await sendBatch(sender, ["a@x.co", "bad1@x.co", "b@x.co", "bad2@x.co", "c@x.co"].map(msg));
  assert.deepEqual(result, { sent: 3, failed: 2 });
  assert.deepEqual(sent.sort(), ["a@x.co", "b@x.co", "c@x.co"]);
});

test("sendBatch never exceeds the concurrency limit and handles an empty list", async () => {
  let active = 0, peak = 0;
  const sender = { configured: true, send: async () => { peak = Math.max(peak, ++active); await new Promise((r) => setTimeout(r, 5)); active--; } };
  const result = await sendBatch(sender, Array.from({ length: 20 }, (_, i) => msg(`p${i}@x.co`)), 3);
  assert.equal(result.sent, 20);
  assert.ok(peak <= 3 && peak >= 2, `peak concurrency was ${peak}`);
  assert.deepEqual(await sendBatch(sender, []), { sent: 0, failed: 0 });
});

test("sendBatch doesn't put full recipient addresses in logs", async () => {
  const logged: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => { logged.push(args); };
  try { await sendBatch({ configured: true, send: async () => { throw new Error("x"); } }, [msg("someone@example.com")]); } finally { console.error = original; }
  assert.ok(!JSON.stringify(logged).includes("someone@example.com"));
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
