// Retailer detection for product image fallbacks when scraping can't find a real photo.

export interface RetailerInfo {
  name: string;
  initial: string;
  color: string;
}

const RETAILERS: { pattern: RegExp; info: RetailerInfo }[] = [
  { pattern: /amazon\./i, info: { name: "Amazon", initial: "a", color: "#E67E22" } },
  { pattern: /flipkart\./i, info: { name: "Flipkart", initial: "f", color: "#2874F0" } },
  { pattern: /myntra\./i, info: { name: "Myntra", initial: "m", color: "#E44075" } },
  { pattern: /nykaa\./i, info: { name: "Nykaa", initial: "n", color: "#C2185B" } },
  { pattern: /ajio\./i, info: { name: "Ajio", initial: "a", color: "#A31F34" } },
  { pattern: /meesho\./i, info: { name: "Meesho", initial: "m", color: "#9C27B0" } },
];

export function getRetailerInfo(productUrl: string | null | undefined): RetailerInfo | null {
  if (!productUrl) return null;
  try {
    const hostname = new URL(productUrl).hostname;
    const match = RETAILERS.find((r) => r.pattern.test(hostname));
    return match?.info ?? null;
  } catch {
    return null;
  }
}

// Older gifts may have a raw Google favicon URL saved as their "image" — treat that
// as no real image so the branded fallback renders instead of a tiny blurry icon.
export function isPlaceholderImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;
  return imageUrl.includes("google.com/s2/favicons");
}
