/**
 * Links people share (invites, personal links) always use the real site address, never the address the
 * page happens to be opened from (a gifaa.vercel.app preview, say) and never an env var that may point there.
 * Local development keeps using localhost so you can test the whole flow.
 */
export const PUBLIC_ORIGIN = "https://gifaa.in";

const isLocalHost = (host: string) => host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");

export function publicOrigin(): string {
  return typeof window !== "undefined" && isLocalHost(window.location.hostname) ? window.location.origin : PUBLIC_ORIGIN;
}

export const joinUrl = (code: string) => `${publicOrigin()}/santa/join/${code}`;
export const personalUrl = (token: string) => `${publicOrigin()}/santa/me/${token}`;

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export const formatDate = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

export const formatInr = (amount: number | null) => (amount ? `₹${amount.toLocaleString("en-IN")}` : null);
