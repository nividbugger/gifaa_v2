"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getView } from "@/features/secret-santa/api";
import { formatDate, formatInr, personalUrl } from "@/features/secret-santa/links";
import { rememberToken } from "@/features/secret-santa/token-store";
import type { SantaView } from "@/features/secret-santa/types";
import RevealCard from "@/features/secret-santa/components/RevealCard";
import SantaShell, { Panel, PanelTitle } from "@/features/secret-santa/components/SantaShell";
import WishlistEditor from "@/features/secret-santa/components/WishlistEditor";

export default function MySantaPage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<SantaView | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    getView(token).then((v) => { setView(v); rememberToken(v.group.code, token); }).catch((error) => { console.error("[santa] could not load personal page", error); setMissing(true); });
  }, [token]);

  useEffect(() => {
    load();
    // Pick up the draw (or new people) when the tab regains focus, without a manual refresh.
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  if (missing) {
    return <SantaShell><Panel><p className="text-charcoal">This personal link isn't valid. Check the email you were sent, or ask the organiser to resend it.</p></Panel></SantaShell>;
  }
  if (!view) {
    return <SantaShell><div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-royal" /></div></SantaShell>;
  }

  const { group } = view;
  const drawn = group.status === "drawn";
  const details = [formatInr(group.budget_amount) && `Budget ${formatInr(group.budget_amount)}`, formatDate(group.exchange_date)].filter(Boolean).join(" · ");

  const copyLink = async () => {
    await navigator.clipboard.writeText(personalUrl(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SantaShell title={group.name} subtitle={[`Hi ${view.me.name}`, details].filter(Boolean).join(" · ")}>
      {group.note && <p className="text-sm text-charcoal-light italic -mt-2">“{group.note}”</p>}

      <Panel>
        {drawn && view.match ? (
          <RevealCard match={view.match} />
        ) : (
          <div className="text-center py-4 space-y-1">
            <div className="text-4xl" aria-hidden>⏳</div>
            <p className="font-medium text-charcoal">Waiting for the draw</p>
            <p className="text-sm text-charcoal-light">{view.participants.length} {view.participants.length === 1 ? "person has" : "people have"} joined. You'll be emailed when names are drawn.</p>
          </div>
        )}
      </Panel>

      <Panel>
        <PanelTitle>My wishlist</PanelTitle>
        <WishlistEditor token={token} wishes={view.my_wishes} onChange={load} />
      </Panel>

      <Panel>
        <PanelTitle>Who's in ({view.participants.length})</PanelTitle>
        <div className="flex flex-wrap gap-2">
          {view.participants.map((p) => (
            <span key={p.id} className={`rounded-full px-3 py-1 text-sm ${p.is_me ? "bg-royal text-white" : "bg-ivory-warm text-charcoal"}`}>{p.name}{p.is_me ? " (you)" : ""}</span>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelTitle>Your personal link</PanelTitle>
        <p className="text-sm text-charcoal-light mb-3">Bookmark this to come back. Don't share it — anyone with it could see your match.</p>
        <Button variant="outline" onClick={copyLink} className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy my link"}
        </Button>
      </Panel>
    </SantaShell>
  );
}
