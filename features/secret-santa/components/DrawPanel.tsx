"use client";

import { useState } from "react";
import { Loader2, Shuffle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { friendlyError, runOrganizerAction } from "../api";
import { MIN_PARTICIPANTS } from "../config";
import type { DrawResult, SantaGroup } from "../types";

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
  const drawn = group.status === "drawn";

  const run = async (action: "draw" | "notify") => {
    setIsWorking(true);
    try {
      const result = await runOrganizerAction(group.id, action);
      const outcome = emailOutcome(result, action === "draw" ? "Names drawn!" : "Done.");
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
      <div className="space-y-3">
        <p className="text-sm text-charcoal">
          ✅ The names are drawn. Nobody — not even you — can see who got whom. Everyone reveals their match from their personal link.
        </p>
        <Button variant="outline" onClick={() => run("notify")} disabled={isWorking} className="gap-2">
          {isWorking && <Loader2 className="w-4 h-4 animate-spin" />} Re-send everyone's email
        </Button>
      </div>
    );
  }

  const ready = participantCount >= MIN_PARTICIPANTS;
  return (
    <div className="space-y-3">
      <p className="text-sm text-charcoal-light">
        {ready ? "Once you draw, the group is locked and matches are secret — even from you." : `You need at least ${MIN_PARTICIPANTS} people to draw (${participantCount} so far).`}
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="royal" size="lg" disabled={!ready || isWorking} className="gap-2">
            {isWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />} Draw names
          </Button>
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
