"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Phone } from "lucide-react";

const supabase = getSupabaseBrowserClient();

export default function PhoneNumberDialog() {
  const { user, profile, refreshProfile } = useAuth();
  const [open, setOpen] = useState(true);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user || !profile || profile.phone_number) return null;

  const handleSave = async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      toast.error("Please enter a phone number");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ phone_number: trimmed } as any)
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast.error("Failed to save phone number");
      return;
    }
    toast.success("Phone number saved!");
    await refreshProfile();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-2">
            <Phone className="w-6 h-6 text-gold" />
          </div>
          <DialogTitle className="text-center">Add your phone number</DialogTitle>
          <DialogDescription className="text-center">
            This is optional. We may use it to send you updates about your registry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Input
            type="tel"
            placeholder="+91 99999 99999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Skip</Button>
            <Button variant="royal" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
