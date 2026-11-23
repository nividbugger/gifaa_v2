"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { getView } from "@/features/secret-santa/api";
import { personalUrl } from "@/features/secret-santa/links";
import { rememberToken } from "@/features/secret-santa/token-store";
import type { SantaView } from "@/features/secret-santa/types";
import GiftBox from "@/features/secret-santa/art/GiftBox";
import Sparkle from "@/features/secret-santa/art/Sparkle";
import AvatarRing from "@/features/secret-santa/components/AvatarRing";
import InvitationCard from "@/features/secret-santa/components/InvitationCard";
import RevealExperience from "@/features/secret-santa/components/RevealExperience";
import SantaLoading from "@/features/secret-santa/components/SantaLoading";
import SantaShell, { Panel, PanelTitle } from "@/features/secret-santa/components/SantaShell";
import WishlistEditor from "@/features/secret-santa/components/WishlistEditor";

export default function MySantaPage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<SantaView | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    getView(token)
      .then((v) => { setView(v); rememberToken(v.group.code, token); })
      .catch((error) => { console.error("[santa] could not load personal page", error); setMissing(true); });
  }, [token]);

  useEffect(() => {
    load();
    // Pick up the draw (or new people) when the tab regains focus, without a manual refresh.
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  if (missing) {
    return (
      <SantaShell>
        <Panel className="text-center">
          <GiftBox tone="ivory" className="mx-auto h-20 w-20" />
          <h1 className="mt-3 font-serif text-2xl font-bold text-royal">This personal link isn't valid</h1>
          <p className="mt-2 text-charcoal-light">Check the email you were sent, or ask the organiser to resend it.</p>
        </Panel>
      </SantaShell>
    );
  }
  if (!view) return <SantaShell><SantaLoading /></SantaShell>;

  const { group } = view;
  const drawn = group.status === "drawn";
  const people = view.participants.map((p) => ({ id: p.id, name: p.name, isMe: p.is_me }));

  const copyLink = async () => {
    await navigator.clipboard.writeText(personalUrl(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SantaShell>
      <p className="text-center font-serif text-lg text-charcoal-light">Hi {view.me.name} 👋</p>
      <InvitationCard name={group.name} budget={group.budget_amount} date={group.exchange_date} note={group.note} code={group.code} people={people} showCountdown />

      {drawn && view.match ? (
        <RevealExperience match={view.match} token={token} myName={view.me.name} groupName={group.name} groupCode={group.code} />
      ) : (
        <Panel className="relative overflow-hidden text-center">
          <Sparkle className="santa-twinkle absolute right-6 top-6 h-4 w-4 text-gold" />
          <GiftBox tone="ivory" className="santa-float mx-auto h-24 w-24" />
          <h2 className="mt-2 font-serif text-2xl font-bold text-royal">Waiting for the draw</h2>
          <p className="mx-auto mt-1 max-w-sm text-charcoal-light">
            {view.participants.length} {view.participants.length === 1 ? "person has" : "people have"} joined. We'll email you the moment names are drawn. Add your wishlist while you wait.
          </p>
        </Panel>
      )}

      <Panel>
        <PanelTitle step={1}>My wishlist</PanelTitle>
        <WishlistEditor token={token} wishes={view.my_wishes} onChange={load} />
      </Panel>

      <Panel>
        <PanelTitle step={2}>Who's in</PanelTitle>
        <AvatarRing people={people} center={<div className="text-center"><GiftBox tone="gold" className="mx-auto h-14 w-14" /><p className="mt-1 text-xs font-semibold text-royal">{people.length} in</p></div>} />
      </Panel>

      <Panel>
        <PanelTitle>Your personal link</PanelTitle>
        <p className="mb-3 text-sm text-charcoal-light">Bookmark this to come back. Don't share it. Anyone with it could see your match.</p>
        <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-royal ring-1 ring-gold/50 hover:bg-gold/10">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy my link"}
        </button>
      </Panel>
    </SantaShell>
  );
}
