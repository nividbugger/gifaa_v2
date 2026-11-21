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

function summarise(result: DrawResult): string {
  if (!result.emailConfigured) return "Names drawn! Email isn't set up yet, so ask everyone to open their personal link (they got it when they joined).";
  return result.failed
    ? `Names drawn! Emailed ${result.emailed} of ${result.participants}; ${result.failed} didn't send.`
    : `Names drawn! Everyone has been emailed their personal link.`;
}

export default function DrawPanel({ group, participantCount, onDone }: Props) {
  const [isWorking, setIsWorking] = useState(false);
  const drawn = group.status === "drawn";

  const run = async (action: "draw" | "notify") => {
    setIsWorking(true);
    try {
      const result = await runOrganizerAction(group.id, action);
      toast.success(action === "draw" ? summarise(result) : `Emails sent to ${result.emailed} people.`);
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
