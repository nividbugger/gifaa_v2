"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { listMyGroups } from "@/features/secret-santa/api";
import { coverFor } from "@/features/secret-santa/covers";
import { formatDate } from "@/features/secret-santa/links";
import type { SantaGroup } from "@/features/secret-santa/types";
import FinalCta from "@/features/secret-santa/components/landing/FinalCta";
import HowItWorks from "@/features/secret-santa/components/landing/HowItWorks";
import LandingHero from "@/features/secret-santa/components/landing/LandingHero";
import StickyCta from "@/features/secret-santa/components/landing/StickyCta";
import SantaShell from "@/features/secret-santa/components/SantaShell";
import GiftBox from "@/features/secret-santa/art/GiftBox";

const CREATE = "/santa/new";
const CREATE_VIA_LOGIN = "/login?redirect=%2Fsanta%2Fnew";

function YourGroups({ groups }: { groups: SantaGroup[] | null }) {
  return (
    <section className="container mx-auto max-w-6xl px-5 pt-4">
      <h2 className="font-serif text-2xl font-bold text-royal">Your exchanges</h2>
      {groups === null ? (
        <Loader2 className="mt-4 h-5 w-5 animate-spin text-royal" />
      ) : groups.length === 0 ? (
        <p className="mt-2 text-charcoal-light">You haven't organised one yet. Start your first below.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => {
            const cover = coverFor(g.code);
            return (
              <li key={g.id}>
                <Link href={`/santa/manage/${g.id}`} className="group relative block overflow-hidden rounded-3xl p-5 text-ivory shadow-lg transition-transform hover:-translate-y-1" style={{ background: cover.background }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e0c08f]">{g.status === "drawn" ? "Names drawn ✓" : "Open for guests"}</p>
                  <p className="mt-2 pr-16 font-serif text-xl font-bold leading-snug">{g.name}</p>
                  {formatDate(g.exchange_date) && <p className="mt-1 text-sm text-ivory/70">{formatDate(g.exchange_date)}</p>}
                  <GiftBox tone={cover.tone} className="absolute -bottom-2 -right-1 h-20 w-20 rotate-6 transition-transform group-hover:rotate-12" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function SantaLandingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [groups, setGroups] = useState<SantaGroup[] | null>(null);

  useEffect(() => {
    if (user) listMyGroups(user.id).then(setGroups).catch(() => setGroups([]));
  }, [user]);

  // Send signed-out visitors through login and straight back, so "Create a group" never dead-ends.
  const createHref = user || authLoading ? CREATE : CREATE_VIA_LOGIN;

  return (
    <SantaShell bare>
      <LandingHero createHref={createHref} />
      {user && <YourGroups groups={groups} />}
      <HowItWorks />
      <FinalCta createHref={createHref} />
      <StickyCta href={createHref} />
    </SantaShell>
  );
}
