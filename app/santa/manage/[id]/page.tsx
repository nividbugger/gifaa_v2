"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyError, getGroup, listExclusions, listParticipants, removeParticipant } from "@/features/secret-santa/api";
import { MIN_PARTICIPANTS } from "@/features/secret-santa/config";
import { recallToken } from "@/features/secret-santa/token-store";
import type { SantaExclusion, SantaGroup, SantaParticipant } from "@/features/secret-santa/types";
import GiftBox from "@/features/secret-santa/art/GiftBox";
import AvatarRing from "@/features/secret-santa/components/AvatarRing";
import DrawPanel from "@/features/secret-santa/components/DrawPanel";
import ExclusionsEditor from "@/features/secret-santa/components/ExclusionsEditor";
import InvitationCard from "@/features/secret-santa/components/InvitationCard";
import OrganizerParticipants from "@/features/secret-santa/components/OrganizerParticipants";
import SantaLoading from "@/features/secret-santa/components/SantaLoading";
import SantaShell, { Panel, PanelTitle } from "@/features/secret-santa/components/SantaShell";
import ShareInvite from "@/features/secret-santa/components/ShareInvite";

const primary = "inline-flex items-center justify-center rounded-full bg-royal px-6 py-3 text-sm font-semibold text-[#f6e6bd] shadow-md transition-transform hover:-translate-y-0.5";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gold/15 bg-white px-3 py-4 text-center shadow-sm">
      <p className="font-serif text-2xl font-bold text-royal">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-light">{label}</p>
    </div>
  );
}

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

  if (state === "loading") return <SantaShell><SantaLoading /></SantaShell>;
  if (state === "missing" || !group || !user) {
    return (
      <SantaShell back={{ href: "/santa", label: "Secret Santa" }}>
        <Panel className="text-center">
          <GiftBox tone="ivory" className="mx-auto h-20 w-20" />
          <p className="mt-3 text-charcoal">We couldn't find that group, or it isn't yours.</p>
        </Panel>
      </SantaShell>
    );
  }

  const myToken = recallToken(group.code);
  const iAmIn = participants.some((p) => p.user_id === user.id);
  const open = group.status === "open";
  const people = participants.map((p) => ({ id: p.id, name: p.name, isMe: p.user_id === user.id }));

  const remove = async (p: SantaParticipant) => {
    try {
      await removeParticipant(p.id);
      load();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <SantaShell back={{ href: "/santa", label: "Secret Santa" }}>
      <InvitationCard name={group.name} budget={group.budget_amount} date={group.exchange_date} note={group.note} code={group.code} people={people} showCountdown />

      <div className="grid grid-cols-3 gap-3" aria-label="Group status">
        <Stat value={String(participants.length)} label="Joined" />
        <Stat value={open ? "Open" : "Drawn"} label="Status" />
        <Stat value={open ? `${Math.max(MIN_PARTICIPANTS - participants.length, 0)} more` : "All set"} label={open ? "To draw" : "Matches"} />
      </div>

      {open && (
        <Panel>
          <PanelTitle step={1}>Invite your people</PanelTitle>
          <ShareInvite group={group} />
        </Panel>
      )}

      <Panel>
        <PanelTitle step={open ? 2 : 1}>Who's in</PanelTitle>
        {participants.length > 0 && (
          <div className="mb-4">
            <AvatarRing people={people} center={<div className="text-center"><GiftBox tone="gold" className="mx-auto h-14 w-14" /><p className="mt-1 text-xs font-semibold text-royal">{participants.length} in</p></div>} />
          </div>
        )}
        <OrganizerParticipants participants={participants} organizerUserId={user.id} canRemove={open} onRemove={remove} />
        <div className="mt-5 border-t border-gold/15 pt-5">
          {iAmIn && myToken ? (
            <Link href={`/santa/me/${myToken}`} className={primary}>Open my wishlist{!open ? " & reveal" : ""}</Link>
          ) : iAmIn ? (
            <p className="text-sm text-charcoal-light">You've joined. Use your personal link (from the email, or the device you joined on) to see your page.</p>
          ) : open ? (
            <div className="space-y-2">
              <p className="text-sm text-charcoal-light">Organisers can take part too. Join to add your wishlist and get a match.</p>
              <Link href={`/santa/join/${group.code}`} className={primary}>Join as a participant</Link>
            </div>
          ) : (
            <p className="text-sm text-charcoal-light">The draw is done and you're not in this group.</p>
          )}
        </div>
      </Panel>

      <Panel>
        <PanelTitle step={open ? 3 : 2}>Don't match</PanelTitle>
        <ExclusionsEditor groupId={group.id} participants={participants} exclusions={exclusions} disabled={!open} onChange={load} />
      </Panel>

      <Panel>
        <PanelTitle step={open ? 4 : 3}>The draw</PanelTitle>
        <DrawPanel group={group} participantCount={participants.length} onDone={load} />
      </Panel>
    </SantaShell>
  );
}
