"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { createGroup, friendlyError } from "@/features/secret-santa/api";
import SantaShell, { Panel } from "@/features/secret-santa/components/SantaShell";

export default function NewSantaGroupPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", budget: "", exchangeDate: "", note: "" });
  const [isSaving, setIsSaving] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?redirect=%2Fsanta%2Fnew");
  }, [user, authLoading, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const group = await createGroup(user.id, form);
      router.push(`/santa/manage/${group.id}`);
    } catch (error) {
      toast.error(friendlyError(error));
      setIsSaving(false);
    }
  };

  return (
    <SantaShell title="Start a Secret Santa" subtitle="You can invite people on the next screen." back={{ href: "/santa", label: "Secret Santa" }}>
      <Panel>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group name *</Label>
            <Input id="name" required maxLength={80} placeholder="Family Secret Santa 2026" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget per gift (₹)</Label>
              <Input id="budget" type="number" min="0" placeholder="1000" value={form.budget} onChange={(e) => set({ budget: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Gift exchange date</Label>
              <Input id="date" type="date" value={form.exchangeDate} onChange={(e) => set({ exchangeDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note for the group (optional)</Label>
            <Textarea id="note" rows={2} maxLength={500} placeholder="Handmade or under budget — be creative!" value={form.note} onChange={(e) => set({ note: e.target.value })} />
          </div>
          <Button type="submit" variant="royal" size="lg" className="w-full" disabled={!form.name.trim() || isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create group"}
          </Button>
        </form>
      </Panel>
    </SantaShell>
  );
}
