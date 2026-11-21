const origin = () => process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "https://gifaa.in");

export const joinUrl = (code: string) => `${origin()}/santa/join/${code}`;
export const personalUrl = (token: string) => `${origin()}/santa/me/${token}`;

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export const formatDate = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

export const formatInr = (amount: number | null) => (amount ? `₹${amount.toLocaleString("en-IN")}` : null);
