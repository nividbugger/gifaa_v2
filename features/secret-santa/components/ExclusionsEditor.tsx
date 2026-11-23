"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { addExclusion, friendlyError, removeExclusion } from "../api";
import type { SantaExclusion, SantaParticipant } from "../types";

interface Props {
  groupId: string;
  participants: SantaParticipant[];
  exclusions: SantaExclusion[];
  disabled: boolean;
  onChange: () => void;
}

const selectClass = "h-11 flex-1 min-w-[130px] rounded-xl border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold";

/** "Don't match these two" — typically couples or siblings who already exchange gifts. */
export default function ExclusionsEditor({ groupId, participants, exclusions, disabled, onChange }: Props) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const nameOf = (id: string) => participants.find((p) => p.id === id)?.name ?? "Someone";

  const add = async () => {
    try {
      await addExclusion(groupId, a, b);
      setA("");
      setB("");
      onChange();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const remove = async (x: SantaExclusion) => {
    try {
      await removeExclusion(x.participant_a, x.participant_b);
      onChange();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-charcoal-light">Optional. Keep two people from drawing each other, like a couple or siblings.</p>
      {exclusions.map((x) => (
        <div key={`${x.participant_a}${x.participant_b}`} className="flex items-center justify-between rounded-2xl bg-ivory-warm px-4 py-2.5 text-sm font-medium text-charcoal">
          <span>{nameOf(x.participant_a)} ↔ {nameOf(x.participant_b)}</span>
          {!disabled && (
            <button onClick={() => remove(x)} aria-label="Remove rule" className="p-1 text-charcoal-light hover:text-destructive"><X className="w-4 h-4" /></button>
          )}
        </div>
      ))}
      {!disabled && participants.length >= 2 && (
        <div className="flex flex-wrap gap-2">
          <select aria-label="First person" className={selectClass} value={a} onChange={(e) => setA(e.target.value)}>
            <option value="">Person…</option>
            {participants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select aria-label="Second person" className={selectClass} value={b} onChange={(e) => setB(e.target.value)}>
            <option value="">can't draw…</option>
            {participants.filter((p) => p.id !== a).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button type="button" onClick={add} disabled={!a || !b} className="h-11 rounded-full px-5 text-sm font-semibold text-royal ring-1 ring-gold/50 hover:bg-gold/10 disabled:opacity-40">Add rule</button>
        </div>
      )}
    </div>
  );
}
