import { test } from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_ORIGIN, joinUrl, personalUrl } from "./links.ts";

const withHost = (hostname: string, origin: string, run: () => void) => {
  (globalThis as any).window = { location: { hostname, origin } };
  try { run(); } finally { delete (globalThis as any).window; }
};

test("shared links use gifaa.in from the real site, a Vercel preview, or the server", () => {
  assert.equal(PUBLIC_ORIGIN, "https://gifaa.in");
  withHost("www.gifaa.in", "https://www.gifaa.in", () => assert.equal(joinUrl("fa87618ed4"), "https://gifaa.in/santa/join/fa87618ed4"));
  withHost("gifaa.vercel.app", "https://gifaa.vercel.app", () => assert.equal(joinUrl("fa87618ed4"), "https://gifaa.in/santa/join/fa87618ed4"));
  withHost("gifaa-2k5glkcy3-nividbuggers-projects.vercel.app", "https://x.vercel.app", () => assert.equal(personalUrl("tok"), "https://gifaa.in/santa/me/tok"));
  assert.equal(joinUrl("abc"), "https://gifaa.in/santa/join/abc", "no window (server render)");
});

test("local development keeps using localhost so the flow can be tested", () => {
  withHost("localhost", "http://localhost:3000", () => assert.equal(joinUrl("abc"), "http://localhost:3000/santa/join/abc"));
  withHost("127.0.0.1", "http://127.0.0.1:3000", () => assert.equal(personalUrl("t"), "http://127.0.0.1:3000/santa/me/t"));
});
