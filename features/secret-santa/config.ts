// Single switchboard for the seasonal Secret Santa feature.

/** Set NEXT_PUBLIC_SECRET_SANTA=off to hide every entry point immediately. */
export const SANTA_ENABLED = process.env.NEXT_PUBLIC_SECRET_SANTA !== "off";

/**
 * Promos disappear on their own after this moment, so nothing needs deploying at New Year.
 * The /santa routes keep working afterwards so existing groups can still reveal their matches.
 */
export const SANTA_PROMO_UNTIL = new Date("2027-01-06T00:00:00+05:30");

export const MIN_PARTICIPANTS = 3;
export const MAX_PARTICIPANTS = 50;
export const MAX_WISHES = 10;

export function isSantaPromoVisible(now: Date = new Date()): boolean {
  return SANTA_ENABLED && now < SANTA_PROMO_UNTIL;
}
