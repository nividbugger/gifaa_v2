// Pure helpers for decoding the Supabase auth cookie written by @supabase/ssr on the website.
// Kept free of browser APIs so it can be unit-tested.

export interface Session {
  accessToken: string;
  userId: string;
  /** Unix seconds. */
  expiresAt: number;
}

const BASE64_PREFIX = "base64-";
const EXPIRY_SKEW_SECONDS = 60;

export function authCookieBaseName(projectRef: string): string {
  return `sb-${projectRef}-auth-token`;
}

/**
 * Reads a possibly-chunked cookie by exact name (`<base>`, else `<base>.0`, `<base>.1`, … until one is missing),
 * mirroring @supabase/ssr. Uses point lookups because `cookies.getAll` can return nothing for some sites.
 */
export async function readChunkedCookie(
  baseName: string,
  getValue: (name: string) => Promise<string | null>
): Promise<string | null> {
  const single = await getValue(baseName);
  if (single) return single;

  const chunks: string[] = [];
  for (let i = 0; ; i++) {
    const chunk = await getValue(`${baseName}.${i}`);
    if (!chunk) break;
    chunks.push(chunk);
  }
  return chunks.length ? chunks.join("") : null;
}

function decodeBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(padded), (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseSessionCookie(rawValue: string): Session | null {
  try {
    let value = decodeURIComponent(rawValue);
    if (value.startsWith(BASE64_PREFIX)) value = decodeBase64Url(value.slice(BASE64_PREFIX.length));

    const parsed = JSON.parse(value);
    if (!parsed?.access_token || !parsed?.user?.id) return null;

    return {
      accessToken: parsed.access_token,
      userId: parsed.user.id,
      expiresAt: Number(parsed.expires_at) || 0,
    };
  } catch {
    return null;
  }
}

export function isExpired(session: Session, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  return session.expiresAt - nowSeconds < EXPIRY_SKEW_SECONDS;
}
