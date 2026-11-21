"use client";

import { X } from "lucide-react";
import type { SantaParticipant } from "../types";

interface Props {
  participants: SantaParticipant[];
  organizerUserId: string;
  canRemove: boolean;
  onRemove: (participant: SantaParticipant) => void;
}

export default function OrganizerParticipants({ participants, organizerUserId, canRemove, onRemove }: Props) {
  if (participants.length === 0) {
    return <p className="text-sm text-charcoal-light">No one has joined yet. Share the invite link above.</p>;
  }
  return (
    <ul className="divide-y divide-gold/10">
      {participants.map((p) => (
        <li key={p.id} className="flex items-center gap-3 py-2.5">
          <div className="w-9 h-9 rounded-full bg-royal/10 text-royal flex items-center justify-center font-medium shrink-0">
            {p.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">
              {p.name} {p.user_id === organizerUserId && <span className="text-xs text-charcoal-light">(you)</span>}
            </p>
            <p className="text-xs text-charcoal-light truncate">{p.email}</p>
          </div>
          {canRemove && (
            <button onClick={() => onRemove(p)} aria-label={`Remove ${p.name}`} className="p-2 text-charcoal-light hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
