"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { listMyGroups } from "@/features/secret-santa/api";
import { formatDate } from "@/features/secret-santa/links";
import type { SantaGroup } from "@/features/secret-santa/types";
import SantaShell, { Panel, PanelTitle } from "@/features/secret-santa/components/SantaShell";

const STEPS = [
  ["1", "Start a group", "Name it, set a budget and a date."],
  ["2", "Invite everyone", "Share one link on WhatsApp. No sign-up needed to join."],
  ["3", "Draw & reveal", "Names are drawn in secret. Everyone sees only their own match and wishlist."],
];

export default function SantaLandingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<SantaGroup[] | null>(null);

  useEffect(() => {
    if (user) listMyGroups(user.id).then(setGroups).catch(() => setGroups([]));
  }, [user]);

  return (
    <SantaShell>
      <div className="text-center py-4">
        <div className="text-5xl mb-3" aria-hidden>🎅</div>
        <h1 className="text-3xl font-serif font-bold text-royal">Secret Santa</h1>
        <p className="text-charcoal-light mt-2 max-w-md mx-auto">
          Draw names with friends, family or colleagues — with wishlists, so everyone gets a gift they actually want.
        </p>
        <div className="mt-5">
          <Link href={user || authLoading ? "/santa/new" : "/login?redirect=%2Fsanta%2Fnew"}>
            <Button variant="royal" size="lg">Start a Secret Santa</Button>
          </Link>
        </div>
      </div>

      <Panel>
        <ol className="space-y-3">
          {STEPS.map(([n, title, text]) => (
            <li key={n} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#c0392b]/10 text-[#c0392b] font-semibold flex items-center justify-center shrink-0">{n}</span>
              <p className="text-sm text-charcoal"><strong>{title}.</strong> <span className="text-charcoal-light">{text}</span></p>
            </li>
          ))}
        </ol>
      </Panel>

      {user && (
        <Panel>
          <PanelTitle>Your groups</PanelTitle>
          {groups === null ? (
            <Loader2 className="w-5 h-5 animate-spin text-royal" />
          ) : groups.length === 0 ? (
            <p className="text-sm text-charcoal-light">You haven't organised a group yet.</p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {groups.map((g) => (
                <li key={g.id}>
                  <Link href={`/santa/manage/${g.id}`} className="flex items-center justify-between py-3 hover:text-royal">
                    <span className="font-medium text-charcoal">{g.name}</span>
                    <span className="text-xs text-charcoal-light">
                      {g.status === "drawn" ? "Drawn" : "Open"}{formatDate(g.exchange_date) ? ` · ${formatDate(g.exchange_date)}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
    </SantaShell>
  );
}
