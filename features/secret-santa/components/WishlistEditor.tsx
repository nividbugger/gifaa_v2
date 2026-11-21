"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scrapeProductUrl } from "@/lib/api/product-scraper";
import { addWish, deleteWish, friendlyError } from "../api";
import { MAX_WISHES } from "../config";
import type { SantaWish } from "../types";
import WishCard from "./WishCard";

interface Props {
  token: string;
  wishes: SantaWish[];
  onChange: () => void;
}

const EMPTY = { url: "", name: "", price: "", notes: "", image: "" };

export default function WishlistEditor({ token, wishes, onChange }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const autofill = async () => {
    setIsFetching(true);
    const result = await scrapeProductUrl(form.url);
    setIsFetching(false);
    if (result.success && result.data) {
      set({
        name: result.data.title ?? form.name,
        price: result.data.price?.toString() ?? form.price,
        image: result.data.image ?? form.image,
      });
    } else {
      toast.error("Couldn't read that link — you can fill the details in yourself.");
    }
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await addWish(token, { name: form.name, url: form.url, price: form.price, notes: form.notes, image_url: form.image });
      setForm(EMPTY);
      setIsOpen(false);
      onChange();
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteWish(token, id);
      onChange();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <div className="space-y-3">
      {wishes.length === 0 && !isOpen && (
        <p className="text-sm text-charcoal-light">Add a few things you'd love. Your Secret Santa will see this list — and only them.</p>
      )}
      {wishes.map((wish) => (
        <WishCard key={wish.id} wish={wish} onRemove={() => remove(wish.id)} />
      ))}

      {isOpen ? (
        <div className="space-y-3 rounded-xl border border-gold/20 p-4">
          <div className="flex gap-2">
            <Input placeholder="Paste a product link (optional)" value={form.url} onChange={(e) => set({ url: e.target.value })} />
            <Button type="button" variant="gold" onClick={autofill} disabled={!form.url.trim() || isFetching} className="shrink-0 gap-1">
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Auto-fill
            </Button>
          </div>
          <Input placeholder="What is it? *" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          <div className="flex gap-2">
            <Input type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={(e) => set({ price: e.target.value })} />
            <Input placeholder="Size, colour… (optional)" value={form.notes} onChange={(e) => set({ notes: e.target.value })} />
          </div>
          <p className="text-xs text-charcoal-light">
            Eligible Amazon links may be converted into affiliate links, allowing Gifaa to earn a small commission.
          </p>
          <div className="flex gap-2">
            <Button variant="royal" onClick={save} disabled={!form.name.trim() || isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to my wishlist"}
            </Button>
            <Button variant="ghost" onClick={() => { setIsOpen(false); setForm(EMPTY); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setIsOpen(true)} disabled={wishes.length >= MAX_WISHES} className="gap-2">
          <Plus className="w-4 h-4" /> {wishes.length >= MAX_WISHES ? `Maximum ${MAX_WISHES} wishes` : "Add a wish"}
        </Button>
      )}
    </div>
  );
}
