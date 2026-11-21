"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { friendlyError, getGroupPreview, joinGroup } from "@/features/secret-santa/api";
import { formatDate, formatInr } from "@/features/secret-santa/links";
import { recallToken, rememberToken } from "@/features/secret-santa/token-store";
import type { SantaGroupPreview } from "@/features/secret-santa/types";
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

  if (preview === undefined) {
    return <SantaShell><div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-royal" /></div></SantaShell>;
  }
  if (preview === null) {
    return (
      <SantaShell>
        <Panel>
          <p className="text-charcoal">
            {loadFailed ? "We couldn't load this invite just now. Please check your connection and try again." : "This invite link isn't valid. Ask the organiser to share it again."}
          </p>
          {loadFailed && <Button variant="outline" className="mt-3" onClick={() => window.location.reload()}>Try again</Button>}
        </Panel>
      </SantaShell>
    );
  }

  const details = [formatInr(preview.budget_amount) && `Budget ${formatInr(preview.budget_amount)}`, formatDate(preview.exchange_date)].filter(Boolean).join(" · ");

  return (
    <SantaShell>
      <div className="text-center">
        <div className="text-5xl mb-2" aria-hidden>🎅</div>
        <h1 className="text-2xl font-serif font-bold text-royal">{preview.name}</h1>
        <p className="text-charcoal-light text-sm mt-1">
          {preview.organizer_name ? `${preview.organizer_name} invited you` : "You're invited"} · {preview.participant_count} joined
        </p>
        {details && <p className="text-sm text-charcoal mt-1">{details}</p>}
        {preview.note && <p className="text-sm text-charcoal-light mt-2 italic">“{preview.note}”</p>}
      </div>

      {preview.status === "drawn" ? (
        <Panel><p className="text-charcoal text-sm">The names have already been drawn for this group. If you joined earlier, open the personal link from your email.</p></Panel>
      ) : (
        <Panel>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name *</Label>
              <Input id="name" required maxLength={60} value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => set({ email: e.target.value })} />
              <p className="text-xs text-charcoal-light">We'll email your personal link when names are drawn. The organiser can see your name and email.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile (optional)</Label>
              <Input id="phone" type="tel" maxLength={20} value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
            <Button type="submit" variant="royal" size="lg" className="w-full" disabled={isJoining}>
              {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Secret Santa"}
            </Button>
          </form>
        </Panel>
      )}
    </SantaShell>
  );
}
