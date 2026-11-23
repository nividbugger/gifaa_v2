// Calendar-day maths for "N days to go". Dates are plain YYYY-MM-DD (no time zone), compared in local time.

export type Countdown =
  | { kind: "none" }
  | { kind: "future"; days: number }
  | { kind: "today" }
  | { kind: "past"; days: number };

const DAY_MS = 86_400_000;

export function parseLocalDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function daysUntil(iso: string | null | undefined, now: Date = new Date()): Countdown {
  const target = iso ? parseLocalDate(iso) : null;
  if (!target) return { kind: "none" };
  const days = Math.round((target.getTime() - startOfDay(now).getTime()) / DAY_MS);
  if (days === 0) return { kind: "today" };
  return days > 0 ? { kind: "future", days } : { kind: "past", days: -days };
}

export function countdownLabel(countdown: Countdown): string | null {
  switch (countdown.kind) {
    case "none":
      return null;
    case "today":
      return "Today's the day!";
    case "future":
      return countdown.days === 1 ? "Tomorrow!" : `${countdown.days} days to go`;
    case "past":
      return countdown.days === 1 ? "Yesterday" : `${countdown.days} days ago`;
  }
}

/** Days until the next 25 December (0 on the day itself). */
export function daysUntilChristmas(now: Date = new Date()): number {
  const today = startOfDay(now);
  let christmas = new Date(today.getFullYear(), 11, 25);
  if (christmas < today) christmas = new Date(today.getFullYear() + 1, 11, 25);
  return Math.round((christmas.getTime() - today.getTime()) / DAY_MS);
}

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** One-tap exchange dates: the next 24, 25 and 31 December. */
export function quickDates(now: Date = new Date()): { label: string; value: string }[] {
  const today = startOfDay(now);
  return [
    { label: "Dec 24", day: 24 },
    { label: "Dec 25", day: 25 },
    { label: "Dec 31", day: 31 },
  ].map(({ label, day }) => {
    let date = new Date(today.getFullYear(), 11, day);
    if (date < today) date = new Date(today.getFullYear() + 1, 11, day);
    return { label, value: toIso(date) };
  });
}
