// Pure Secret Santa matching. No imports so it runs under Deno (edge function) and Node (tests).

export type Pair = readonly [string, string];

/**
 * Gives every participant exactly one person to gift, and every participant exactly one Santa.
 * Nobody draws themselves, and no excluded pair draws each other in either direction.
 * Returns null when the constraints make a valid draw impossible.
 */
export function drawAssignments(
  ids: readonly string[],
  excluded: readonly Pair[] = [],
  rng: () => number = Math.random
): Map<string, string> | null {
  if (ids.length < 2) return null;

  const blocked = new Set<string>();
  for (const [a, b] of excluded) {
    blocked.add(`${a}|${b}`);
    blocked.add(`${b}|${a}`);
  }
  const allowed = (giver: string, receiver: string) => giver !== receiver && !blocked.has(`${giver}|${receiver}`);

  // Randomised backtracking: shuffled candidates give a fair-looking draw, and backtracking
  // guarantees we find a solution whenever one exists (unlike retry-until-lucky shuffling).
  const givers = shuffle(ids, rng);
  const taken = new Set<string>();
  const result = new Map<string, string>();

  const assign = (index: number): boolean => {
    if (index === givers.length) return true;
    const giver = givers[index]!;
    for (const receiver of shuffle(ids, rng)) {
      if (taken.has(receiver) || !allowed(giver, receiver)) continue;
      taken.add(receiver);
      result.set(giver, receiver);
      if (assign(index + 1)) return true;
      taken.delete(receiver);
      result.delete(giver);
    }
    return false;
  };

  return assign(0) ? result : null;
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
