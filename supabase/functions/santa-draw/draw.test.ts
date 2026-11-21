import { test } from "node:test";
import assert from "node:assert/strict";
import { drawAssignments } from "./draw.ts";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `p${i}`);

/** Every giver has one receiver, every receiver one giver, nobody gifts themselves. */
function assertValid(ids: string[], result: Map<string, string>) {
  assert.equal(result.size, ids.length);
  assert.deepEqual([...result.keys()].sort(), [...ids].sort());
  assert.deepEqual([...result.values()].sort(), [...ids].sort());
  for (const [giver, receiver] of result) assert.notEqual(giver, receiver);
}

test("valid draws for many group sizes, repeated (randomised)", () => {
  for (const n of [2, 3, 4, 5, 8, 15, 50]) {
    for (let run = 0; run < 100; run++) assertValid(ids(n), drawAssignments(ids(n))!);
  }
});

test("honours exclusions in both directions", () => {
  const people = ids(6);
  const excluded = [["p0", "p1"], ["p2", "p3"]] as const;
  for (let run = 0; run < 300; run++) {
    const result = drawAssignments(people, excluded)!;
    assertValid(people, result);
    assert.notEqual(result.get("p0"), "p1");
    assert.notEqual(result.get("p1"), "p0");
    assert.notEqual(result.get("p2"), "p3");
    assert.notEqual(result.get("p3"), "p2");
  }
});

test("finds the single valid solution when constraints are tight (no luck involved)", () => {
  // a can only gift d, and only d can gift a, which forces b <-> c as well.
  for (let run = 0; run < 200; run++) {
    const result = drawAssignments(["a", "b", "c", "d"], [["a", "b"], ["a", "c"]])!;
    assert.deepEqual([...result].sort(), [["a", "d"], ["b", "c"], ["c", "b"], ["d", "a"]]);
  }
});

test("a lone blocked pair in a group of three is impossible", () => {
  assert.equal(drawAssignments(["a", "b", "c"], [["a", "b"]]), null);
});

test("returns null when impossible", () => {
  assert.equal(drawAssignments(["solo"]), null);
  assert.equal(drawAssignments([]), null);
  // p0 cannot gift p1 or p2, and with only three people that leaves no one.
  assert.equal(drawAssignments(["p0", "p1", "p2"], [["p0", "p1"], ["p0", "p2"]]), null);
});

test("is deterministic for a seeded rng", () => {
  const seeded = () => {
    let s = 42;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  };
  assert.deepEqual([...drawAssignments(ids(8), [], seeded())!], [...drawAssignments(ids(8), [], seeded())!]);
});
