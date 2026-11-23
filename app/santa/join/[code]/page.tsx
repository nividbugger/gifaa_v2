"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyError, getGroupPreview, joinGroup } from "@/features/secret-santa/api";
import { recallToken, rememberToken } from "@/features/secret-santa/token-store";
import type { SantaGroupPreview } from "@/features/secret-santa/types";
import GiftBox from "@/features/secret-santa/art/GiftBox";
import InvitationCard from "@/features/secret-santa/components/InvitationCard";
import SantaLoading from "@/features/secret-santa/components/SantaLoading";
import SantaShell, { Panel } from "@/features/secret-santa/components/SantaShell";

export default function JoinSantaGroupPage() {
  const { code } = useParams<{ code: string }>();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [preview, setPreview] = useState<SantaGroupPreview | null | undefined>(undefined);
  const [loadFailed, setLoadFailed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isJoining, setIsJoining] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  // Already joined on this device: skip straight to their page.
  useEffect(() => {
    const token = recallToken(code);
    if (token) router.replace(`/santa/me/${token}`);
    else {
      // null = no such group; a thrown error = the lookup itself failed. Don't tell people their link is bad when it isn't.
      getGroupPreview(code).then(setPreview).catch((error) => {
        console.error("[santa] could not load invite preview", error);
        setLoadFailed(true);
        setPreview(null);
      });
    }
  }, [code, router]);

  // Convenience prefill for signed-in users (still editable).
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      name: f.name || profile?.display_name || "",
      email: f.email || user.email || "",
      phone: f.phone || profile?.phone_number || "",
    }));
  }, [user, profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    try {
      const token = await joinGroup(code, form.name, form.email, form.phone);
      rememberToken(code, token);
      router.push(`/santa/me/${token}`);
    } catch (error) {
      toast.error(friendlyError(error));
      setIsJoining(false);
    }
  };

  if (preview === undefined) return <SantaShell><SantaLoading text="Opening your invitation…" /></SantaShell>;

  if (preview === null) {
    return (
      <SantaShell>
        <Panel className="text-center">
          <GiftBox tone="ivory" className="mx-auto h-20 w-20" />
          <h1 className="mt-3 font-serif text-2xl font-bold text-royal">{loadFailed ? "We couldn't open this invite" : "This invite isn't valid"}</h1>
          <p className="mt-2 text-charcoal-light">
            {loadFailed ? "Please check your connection and try again." : "Ask the organiser to share the link again."}
          </p>
          {loadFailed && (
            <button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-full bg-royal px-6 py-3 text-sm font-semibold text-[#f6e6bd]">Try again</button>
          )}
        </Panel>
      </SantaShell>
    );
  }

  return (
    <SantaShell>
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">You're invited</p>
        <p className="mt-1 font-serif text-lg text-charcoal-light">{preview.organizer_name ? `${preview.organizer_name} has a secret for you` : "A secret awaits"}</p>
      </div>

      <InvitationCard name={preview.name} budget={preview.budget_amount} date={preview.exchange_date} note={preview.note} code={code} hostName={preview.organizer_name} joinedCount={preview.participant_count} showCountdown />

      {preview.status === "drawn" ? (
        <Panel>
          <p className="text-sm text-charcoal">The names have already been drawn for this group. If you joined earlier, open the personal link from your email.</p>
        </Panel>
      ) : (
        <Panel>
          <h2 className="mb-1 font-serif text-2xl font-semibold text-royal">Join the exchange</h2>
          <p className="mb-5 text-sm text-charcoal-light">Takes ten seconds. No account needed.</p>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name *</Label>
              <Input id="name" required maxLength={60} autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} className="h-12 rounded-xl" />
              <p className="text-xs text-charcoal-light">We'll email your personal link when names are drawn. The organiser can see your name and email.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile (optional)</Label>
              <Input id="phone" type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <button type="submit" disabled={isJoining} className="flex w-full items-center justify-center gap-2 rounded-full bg-royal py-4 text-base font-semibold text-[#f6e6bd] shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50">
              {isJoining ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Join Secret Santa <span aria-hidden>🎅</span></>}
            </button>
          </form>
        </Panel>
      )}
    </SantaShell>
  );
}
