import { test } from "node:test";
import assert from "node:assert/strict";
import { postLoginCookieDomain, safeRedirectPath } from "./redirect.ts";

test("accepts normal same-site paths, including query strings", () => {
  for (const ok of ["/santa/new", "/dashboard", "/create-registry?occasion=wedding", "/santa/manage/abc-123", "/a%20b"]) {
    assert.equal(safeRedirectPath(ok), ok);
  }
});

test("rejects every open-redirect trick and falls back", () => {
  const attacks = [
    "//evil.com", "///evil.com", "/\\evil.com", "\\\\evil.com", "https://evil.com", "http://evil.com/x",
    "@evil.com", "evil.com", "javascript:alert(1)", "data:text/html,x", "/\nhttps://evil.com", "/a\rb", "/\tevil", "",
  ];
  for (const attack of attacks) assert.equal(safeRedirectPath(attack), "/dashboard", `should reject ${JSON.stringify(attack)}`);
  assert.equal(safeRedirectPath(null), "/dashboard");
  assert.equal(safeRedirectPath(undefined), "/dashboard");
});

test("honours a custom fallback", () => {
  assert.equal(safeRedirectPath("//evil.com", "/home"), "/home");
});

test("cookie domain covers www and apex in production, nothing on localhost/IPs", () => {
  assert.equal(postLoginCookieDomain("www.gifaa.in"), ".gifaa.in");
  assert.equal(postLoginCookieDomain("gifaa.in"), ".gifaa.in");
  assert.equal(postLoginCookieDomain("localhost"), undefined);
  assert.equal(postLoginCookieDomain("192.168.1.5"), undefined);
});
