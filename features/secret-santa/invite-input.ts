/**
 * Accepts either a bare invite code or a whole pasted invite link and returns the code, or null.
 * Codes are 10 hex characters today; we accept 6-32 letters/digits so future codes keep working.
 */
export function parseInviteCode(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const fromLink = /\/santa\/join\/([A-Za-z0-9]{6,32})/.exec(text);
  if (fromLink) return fromLink[1]!.toLowerCase();
  return /^[A-Za-z0-9]{6,32}$/.test(text) ? text.toLowerCase() : null;
}
