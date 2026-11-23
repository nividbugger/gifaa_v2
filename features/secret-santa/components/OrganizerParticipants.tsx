"use client";

import { X } from "lucide-react";
import type { SantaParticipant } from "../types";
import { Avatar } from "./AvatarCluster";

interface Props {
  participants: SantaParticipant[];
  organizerUserId: string;
  canRemove: boolean;
  onRemove: (participant: SantaParticipant) => void;
}

export default function OrganizerParticipants({ participants, organizerUserId, canRemove, onRemove }: Props) {
  if (participants.length === 0) {
    return <p className="rounded-2xl bg-ivory-warm px-4 py-5 text-center text-sm text-charcoal-light">No one has joined yet. Share the invite link above and watch the table fill up.</p>;
  }
  return (
    <ul className="divide-y divide-gold/10">
      {participants.map((p) => (
        <li key={p.id} className="flex items-center gap-3 py-3">
          <Avatar name={p.name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-charcoal">
              {p.name} {p.user_id === organizerUserId && <span className="ml-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-royal">You</span>}
            </p>
            <p className="truncate text-xs text-charcoal-light">{p.email}</p>
          </div>
          {canRemove && (
            <button type="button" onClick={() => onRemove(p)} aria-label={`Remove ${p.name}`} className="rounded-full p-2 text-charcoal-light hover:bg-destructive/10 hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
