import { describe, expect, it } from "vitest";
import { authCookieBaseName, isExpired, joinAuthCookie, parseSessionCookie } from "./session";

const payload = { access_token: "tok", expires_at: 2_000_000_000, user: { id: "u1" } };
const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encoded = "base64-" + b64url(JSON.stringify(payload));

describe("session cookie", () => {
  it("parses base64url cookies (including URL-encoded values)", () => {
    expect(parseSessionCookie(encoded)).toEqual({ accessToken: "tok", userId: "u1", expiresAt: 2_000_000_000 });
    expect(parseSessionCookie(encodeURIComponent(encoded))?.userId).toBe("u1");
  });

  it("parses legacy raw-JSON cookies", () => {
    expect(parseSessionCookie(JSON.stringify(payload))?.accessToken).toBe("tok");
  });

  it("rejects garbage", () => {
    expect(parseSessionCookie("nope")).toBeNull();
    expect(parseSessionCookie(JSON.stringify({ access_token: "x" }))).toBeNull();
  });

  it("joins chunks in numeric order, not lexical", () => {
    const base = authCookieBaseName("abc");
    const chunks = Array.from({ length: 11 }, (_, i) => ({ name: `${base}.${i}`, value: String.fromCharCode(97 + i) }));
    expect(joinAuthCookie([...chunks].reverse(), base)).toBe("abcdefghijk");
    expect(joinAuthCookie([], base)).toBeNull();
  });

  it("treats near-expiry as expired", () => {
    const s = { accessToken: "t", userId: "u", expiresAt: 1000 };
    expect(isExpired(s, 950)).toBe(true);
    expect(isExpired(s, 900)).toBe(false);
  });
});
