// Post-login destination handling, shared by the login/signup pages and the OAuth callback.

export const POST_LOGIN_COOKIE = "gifaa_post_login";
const COOKIE_MAX_AGE_SECONDS = 600;

/**
 * Only same-site absolute paths are allowed as a post-login destination. Anything else (another
 * origin, protocol-relative `//host`, backslash tricks, `@host`, `javascript:` …) falls back, so
 * the login flow can never be used as an open redirect.
 */
export function safeRedirectPath(input: string | null | undefined, fallback = "/dashboard"): string {
  if (!input || !input.startsWith("/") || input.startsWith("//") || input.includes("\\") || /[\u0000-\u001f]/.test(input)) {
    return fallback;
  }
  try {
    const parsed = new URL(input, "https://placeholder.invalid");
    return parsed.origin === "https://placeholder.invalid" ? input : fallback;
  } catch {
    return fallback;
  }
}

/**
 * The OAuth round-trip can return on a different host than it started on (www vs apex), and
 * host-only cookies don't cross that. Scope to the registrable domain when there is one.
 */
export function postLoginCookieDomain(hostname: string): string | undefined {
  if (hostname === "localhost" || !hostname.includes(".") || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return undefined;
  return `.${hostname.replace(/^www\./, "")}`;
}

/** Browser only. Remembers where to send the user after Google sign-in returns to /auth/callback. */
export function rememberPostLoginPath(path: string): void {
  const domain = postLoginCookieDomain(window.location.hostname);
  document.cookie = [
    `${POST_LOGIN_COOKIE}=${encodeURIComponent(safeRedirectPath(path))}`,
    "path=/",
    `max-age=${COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    ...(domain ? [`domain=${domain}`] : []),
    ...(window.location.protocol === "https:" ? ["Secure"] : []),
  ].join("; ");
}
