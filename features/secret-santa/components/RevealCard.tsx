"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SantaView } from "../types";
import WishCard from "./WishCard";

type Match = NonNullable<SantaView["match"]>;

/** Tap-to-reveal so nobody sees their match by accident (shoulder-surfing, screen sharing). */
export default function RevealCard({ match }: { match: Match }) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-5xl" aria-hidden>🎁</div>
        <p className="text-charcoal-light">Your match is ready. Make sure nobody's looking over your shoulder.</p>
        <Button variant="royal" size="lg" onClick={() => setRevealed(true)}>Reveal my match</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <p className="text-sm text-charcoal-light">You're the Secret Santa for</p>
        <p className="text-3xl font-serif font-bold text-royal mt-1">🎅 {match.name}</p>
      </div>
      {match.wishes.length === 0 ? (
        <p className="text-center text-sm text-charcoal-light">{match.name} hasn't added a wishlist yet — check back soon.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-charcoal">Their wishlist</p>
          {match.wishes.map((wish) => <WishCard key={wish.id} wish={wish} />)}
        </div>
      )}
    </div>
  );
}
