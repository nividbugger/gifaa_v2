"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyError, getGroup, listExclusions, listParticipants, removeParticipant } from "@/features/secret-santa/api";
import { formatDate, formatInr } from "@/features/secret-santa/links";
import { recallToken } from "@/features/secret-santa/token-store";
import type { SantaExclusion, SantaGroup, SantaParticipant } from "@/features/secret-santa/types";
import DrawPanel from "@/features/secret-santa/components/DrawPanel";
import ExclusionsEditor from "@/features/secret-santa/components/ExclusionsEditor";
import OrganizerParticipants from "@/features/secret-santa/components/OrganizerParticipants";
import SantaShell, { Panel, PanelTitle } from "@/features/secret-santa/components/SantaShell";
import ShareInvite from "@/features/secret-santa/components/ShareInvite";

export default function ManageSantaGroupPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [group, setGroup] = useState<SantaGroup | null>(null);
  const [participants, setParticipants] = useState<SantaParticipant[]>([]);
  const [exclusions, setExclusions] = useState<SantaExclusion[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  const load = useCallback(async () => {
    try {
      const g = await getGroup(id);
      const [p, x] = await Promise.all([listParticipants(id), listExclusions(id)]);
      setGroup(g);
      setParticipants(p);
      setExclusions(x);
      setState("ready");
    } catch {
      setState("missing"); // not found, or not your group (row-level security hides it)
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace(`/login?redirect=${encodeURIComponent(`/santa/manage/${id}`)}`);
    else load();
  }, [authLoading, user, id, router, load]);

  if (state === "loading") {
    return <SantaShell><div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-royal" /></div></SantaShell>;
  }
  if (state === "missing" || !group || !user) {
    return <SantaShell back={{ href: "/santa", label: "Secret Santa" }}><Panel><p className="text-charcoal">We couldn't find that group, or it isn't yours.</p></Panel></SantaShell>;
  }

  const myToken = recallToken(group.code);
  const iAmIn = participants.some((p) => p.user_id === user.id);
  const open = group.status === "open";
  const details = [formatInr(group.budget_amount) && `Budget ${formatInr(group.budget_amount)}`, formatDate(group.exchange_date)].filter(Boolean).join(" · ");

  const remove = async (p: SantaParticipant) => {
    try {
      await removeParticipant(p.id);
      load();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <SantaShell title={group.name} subtitle={details || undefined} back={{ href: "/santa", label: "Secret Santa" }}>
      {open && (
        <Panel>
          <PanelTitle>Invite people</PanelTitle>
          <ShareInvite group={group} />
        </Panel>
      )}

      <Panel>
        <PanelTitle>Your own spot</PanelTitle>
        {iAmIn && myToken ? (
          <Link href={`/santa/me/${myToken}`}><Button variant="gold">Open my wishlist{!open ? " & reveal" : ""}</Button></Link>
        ) : iAmIn ? (
          <p className="text-sm text-charcoal-light">You've joined. Use your personal link (from the email, or the device you joined on) to see your page.</p>
        ) : open ? (
          <div className="space-y-2">
            <p className="text-sm text-charcoal-light">Organisers can take part too. Join to add your wishlist and get a match.</p>
            <Link href={`/santa/join/${group.code}`}><Button variant="gold">Join as a participant</Button></Link>
          </div>
        ) : (
          <p className="text-sm text-charcoal-light">The draw is done and you're not in this group.</p>
        )}
      </Panel>

      <Panel>
        <PanelTitle>People ({participants.length})</PanelTitle>
        <OrganizerParticipants participants={participants} organizerUserId={user.id} canRemove={open} onRemove={remove} />
      </Panel>

      <Panel>
        <PanelTitle>Don't match</PanelTitle>
        <ExclusionsEditor groupId={group.id} participants={participants} exclusions={exclusions} disabled={!open} onChange={load} />
      </Panel>

      <Panel>
        <PanelTitle>Draw</PanelTitle>
        <DrawPanel group={group} participantCount={participants.length} onDone={load} />
      </Panel>
    </SantaShell>
  );
}
