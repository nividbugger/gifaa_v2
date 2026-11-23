"use client";

import { useState } from "react";
import { Loader2, Shuffle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { friendlyError, runOrganizerAction } from "../api";
import { MIN_PARTICIPANTS } from "../config";
import type { DrawResult, SantaGroup } from "../types";
import Confetti from "./Confetti";

interface Props {
  group: SantaGroup;
  participantCount: number;
  onDone: () => void;
}

type Outcome = { message: string; ok: boolean };

/** Plain-language result of sending the emails, including the reason when something failed. */
function emailOutcome(result: DrawResult, prefix: string): Outcome {
  if (!result.emailConfigured) {
    return { ok: false, message: `${prefix} Email isn't set up yet, so ask everyone to open their personal link (they got it when they joined).` };
  }
  if (result.failed === 0) return { ok: true, message: `${prefix} Everyone has been emailed their personal link.` };
  const reason = result.emailErrors?.[0] ? ` Reason: ${result.emailErrors[0]}` : "";
  return { ok: false, message: `${prefix} Emailed ${result.emailed} of ${result.participants}; ${result.failed} didn't send.${reason}` };
}

export default function DrawPanel({ group, participantCount, onDone }: Props) {
  const [isWorking, setIsWorking] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const drawn = group.status === "drawn";

  const run = async (action: "draw" | "notify") => {
    setIsWorking(true);
    try {
      const result = await runOrganizerAction(group.id, action);
      const outcome = emailOutcome(result, action === "draw" ? "Names drawn!" : "Done.");
      if (action === "draw") setCelebrate(true);
      if (outcome.ok) toast.success(outcome.message);
      else toast.warning(outcome.message, { duration: 12000 });
      onDone();
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setIsWorking(false);
    }
  };

  if (drawn) {
    return (
      <div className="space-y-4">
        <Confetti run={celebrate} onDone={() => setCelebrate(false)} />
        <div className="rounded-2xl bg-gradient-to-br from-[#0a2a5e] to-[#0a3566] p-5 text-ivory">
          <p className="font-serif text-xl font-bold text-[#f6e6bd]">The names are drawn ✨</p>
          <p className="mt-1 text-sm text-ivory/80">Nobody, not even you, can see who got whom. Everyone reveals their match from their personal link.</p>
        </div>
        <button type="button" onClick={() => run("notify")} disabled={isWorking} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-royal ring-1 ring-gold/50 hover:bg-gold/10 disabled:opacity-50">
          {isWorking && <Loader2 className="h-4 w-4 animate-spin" />} Re-send everyone's email
        </button>
      </div>
    );
  }

  const ready = participantCount >= MIN_PARTICIPANTS;
  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal-light">
        {ready ? "Once you draw, the group is locked and matches are secret, even from you." : `You need at least ${MIN_PARTICIPANTS} people to draw (${participantCount} so far).`}
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            disabled={!ready || isWorking}
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-charcoal shadow-[0_10px_28px_-8px_rgba(187,149,88,0.7)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 ${ready && !isWorking ? "santa-pulse-ring" : ""}`}
          >
            {isWorking ? <><Loader2 className="h-5 w-5 animate-spin" /> The elves are shuffling…</> : <><Shuffle className="h-5 w-5" /> Draw names</>}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Draw names for “{group.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {participantCount} people are in. After drawing, no one can join or leave and the draw can't be redone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction onClick={() => run("draw")}>Draw</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
