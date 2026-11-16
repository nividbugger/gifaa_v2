import { describe, expect, it } from "vitest";
import { isExpired, parseSessionCookie, readChunkedCookie } from "./session";

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

  it("reads chunks by point lookup in order, stopping at the first gap", async () => {
    const jar: Record<string, string> = { "b.0": "ab", "b.1": "cd", "b.2": "ef", "b.4": "NOPE", other: "x" };
    const get = async (name: string) => jar[name] ?? null;
    expect(await readChunkedCookie("b", get)).toBe("abcdef");
    expect(await readChunkedCookie("missing", get)).toBeNull();
  });

  it("prefers an unchunked cookie when present", async () => {
    expect(await readChunkedCookie("b", async (n) => (n === "b" ? "whole" : "chunk"))).toBe("whole");
  });

  it("treats near-expiry as expired", () => {
    const s = { accessToken: "t", userId: "u", expiresAt: 1000 };
    expect(isExpired(s, 950)).toBe(true);
    expect(isExpired(s, 900)).toBe(false);
  });
});
