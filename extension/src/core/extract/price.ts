/** "₹1,29,999.00", "Rs. 499", "1299" → number. Returns null when no usable number is present. */
export function parsePriceText(text: string | null | undefined): number | null {
  if (!text) return null;
  const match = text.replace(/\s/g, "").match(/\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const value = parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}
