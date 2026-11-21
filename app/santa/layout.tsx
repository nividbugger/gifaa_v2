import type { Metadata } from "next";

// Seasonal feature. Personal links contain a secret token, so keep them out of search results and
// don't leak them to product sites via the Referer header when someone clicks a wishlist link.
export const metadata: Metadata = {
  title: "Secret Santa | Gifaa",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function SantaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
