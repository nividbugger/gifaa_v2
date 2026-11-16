// Reads the user's Gifaa session from the website's cookies.
//
// We deliberately never refresh the token ourselves: Supabase rotates refresh tokens, so a second
// client refreshing would invalidate the website's session. Instead we ask the website to refresh
// (its middleware does it on any page load) and re-read the cookie.

import { config, siteOrigins } from "./config";
import { authCookieBaseName, isExpired, parseSessionCookie, readChunkedCookie, type Session } from "./session";

const REFRESH_TIMEOUT_MS = 12_000;
const baseName = authCookieBaseName(config.projectRef);

export type SessionState =
  | { status: "signed-in"; session: Session }
  | { status: "expired" }
  | { status: "signed-out" };

async function readSessionCookie(): Promise<Session | null> {
  for (const origin of siteOrigins()) {
    const raw = await readChunkedCookie(baseName, async (name) => (await browser.cookies.get({ url: origin, name }))?.value ?? null);
    const session = raw ? parseSessionCookie(raw) : null;
    if (session) return session;
  }
  console.debug(`[gifaa] no usable session cookie "${baseName}" at`, siteOrigins());
  return null;
}

export async function getSessionState(): Promise<SessionState> {
  const session = await readSessionCookie();
  if (!session) return { status: "signed-out" };
  return isExpired(session) ? { status: "expired" } : { status: "signed-in", session };
}

/** Loads the site in a background tab so its middleware refreshes the cookie, then re-reads it. */
export async function refreshSessionViaSite(): Promise<SessionState> {
  const tab = await browser.tabs.create({ url: `${config.siteUrl}/dashboard`, active: false });

  const cookieChanged = new Promise<void>((resolve) => {
    const listener = (info: { cookie: { name: string; value: string } }) => {
      if (info.cookie.name.startsWith(baseName)) {
        browser.cookies.onChanged.removeListener(listener);
        resolve();
      }
    };
    browser.cookies.onChanged.addListener(listener);
    setTimeout(() => {
      browser.cookies.onChanged.removeListener(listener);
      resolve();
    }, REFRESH_TIMEOUT_MS);
  });

  try {
    await cookieChanged;
  } finally {
    if (tab.id !== undefined) await browser.tabs.remove(tab.id).catch(() => {});
  }
  return getSessionState();
}
