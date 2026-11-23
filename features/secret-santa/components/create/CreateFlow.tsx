"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGroup, friendlyError } from "../../api";
import { quickDates } from "../../countdown";
import { formatDate, formatInr } from "../../links";
import InvitationCard from "../InvitationCard";
import Stepper from "../Stepper";

const STEPS = ["Name it", "Set the rules", "Looks good?"];
const BUDGETS = [500, 1000, 2000, 5000];

const chip = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors ${
    active ? "bg-royal text-[#f6e6bd] ring-royal" : "bg-white text-royal ring-gold/40 hover:bg-gold/10"
  }`;

const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-full bg-royal px-7 py-3.5 text-base font-semibold text-[#f6e6bd] shadow-lg transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40";

export default function CreateFlow({ userId, hostName }: { userId: string; hostName?: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", budget: "", exchangeDate: "", note: "" });
  const [customBudget, setCustomBudget] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const dates = useMemo(() => quickDates(), []);
  const year = new Date().getFullYear();
  const nameIdeas = [`Christmas Chaos ${year}`, "The Office Elves", "The Family Gift Club", "Hostel Santa Squad"];

  const create = async () => {
    setIsSaving(true);
    try {
      const group = await createGroup(userId, form);
      router.push(`/santa/manage/${group.id}`);
    } catch (error) {
      toast.error(friendlyError(error));
      setIsSaving(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) setStep(step + 1);
    else create();
  };

  const canContinue = step > 0 || form.name.trim().length > 0;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="lg:order-2 lg:sticky lg:top-28">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Live preview</p>
        <InvitationCard name={form.name} budget={form.budget} date={form.exchangeDate || null} note={form.note} hostName={hostName} showCountdown />
        <p className="mt-3 text-center text-xs text-charcoal-light">Every exchange gets its own cover once it's created.</p>
      </div>

      <form onSubmit={submit} className="lg:order-1">
        <Stepper steps={STEPS} current={step} />

        <div className="mt-8 rounded-3xl border border-gold/15 bg-white p-6 shadow-[0_10px_34px_-14px_rgba(10,53,102,0.22)] sm:p-8">
          {step === 0 && (
            <div className="santa-rise space-y-5">
              <div>
                <h1 className="font-serif text-3xl font-bold text-royal">Name your exchange</h1>
                <p className="mt-1 text-charcoal-light">Something your group will smile at.</p>
              </div>
              <Input autoFocus required maxLength={80} aria-label="Exchange name" placeholder="The Office Elves" value={form.name} onChange={(e) => set({ name: e.target.value })} className="h-14 rounded-2xl text-lg" />
              <div className="flex flex-wrap gap-2">
                {nameIdeas.map((idea) => (
                  <button key={idea} type="button" onClick={() => set({ name: idea })} className={chip(form.name === idea)}>{idea}</button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="santa-rise space-y-7">
              <h1 className="font-serif text-3xl font-bold text-royal">Set the rules</h1>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-charcoal">Budget per gift</legend>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button key={b} type="button" onClick={() => { setCustomBudget(false); set({ budget: String(b) }); }} className={chip(!customBudget && form.budget === String(b))}>{formatInr(b)}</button>
                  ))}
                  <button type="button" onClick={() => { setCustomBudget(true); set({ budget: "" }); }} className={chip(customBudget)}>Custom</button>
                  <button type="button" onClick={() => { setCustomBudget(false); set({ budget: "" }); }} className={chip(!customBudget && form.budget === "")}>No limit</button>
                </div>
                {customBudget && <Input autoFocus type="number" min="0" inputMode="numeric" aria-label="Custom budget in rupees" placeholder="Amount in ₹" value={form.budget} onChange={(e) => set({ budget: e.target.value })} className="mt-3 h-12 max-w-[220px] rounded-xl" />}
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-charcoal">Gift exchange date</legend>
                <div className="flex flex-wrap gap-2">
                  {dates.map((d) => (
                    <button key={d.value} type="button" onClick={() => set({ exchangeDate: d.value })} className={chip(form.exchangeDate === d.value)}>{d.label}</button>
                  ))}
                  <button type="button" onClick={() => set({ exchangeDate: "" })} className={chip(form.exchangeDate === "")}>Not decided</button>
                </div>
                <Input type="date" aria-label="Pick another date" value={form.exchangeDate} onChange={(e) => set({ exchangeDate: e.target.value })} className="mt-3 h-12 max-w-[220px] rounded-xl" />
              </fieldset>

              <div>
                <label htmlFor="note" className="mb-2 block text-sm font-semibold text-charcoal">A note for the group <span className="font-normal text-charcoal-light">(optional)</span></label>
                <Textarea id="note" rows={2} maxLength={500} placeholder="Handmade or under budget, be creative!" value={form.note} onChange={(e) => set({ note: e.target.value })} className="rounded-2xl" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="santa-rise space-y-5">
              <div>
                <h1 className="font-serif text-3xl font-bold text-royal">Looks good?</h1>
                <p className="mt-1 text-charcoal-light">Next you'll invite your people and add any "don't match" rules.</p>
              </div>
              <dl className="divide-y divide-gold/15 rounded-2xl bg-ivory-warm px-5 text-sm">
                {[
                  ["Name", form.name.trim()],
                  ["Budget", formatInr(form.budget ? Number(form.budget) : null) ?? "No limit"],
                  ["Exchange", formatDate(form.exchangeDate || null) ?? "Not decided yet"],
                  ["Note", form.note.trim() || "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-3">
                    <dt className="text-charcoal-light">{k}</dt>
                    <dd className="text-right font-medium text-charcoal">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-charcoal-light hover:text-royal">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <span />}
            <button type="submit" disabled={!canContinue || isSaving} className={primaryBtn}>
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : step === STEPS.length - 1 ? <>Create exchange <ArrowRight className="h-5 w-5" /></> : <>Continue <ArrowRight className="h-5 w-5" /></>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
