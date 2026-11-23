import { Check } from "lucide-react";

/** Progress through a short flow. Labels collapse on very small screens; the numbers always stay. */
export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? "step" : undefined}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                done ? "bg-royal text-[#f3dfb1]" : active ? "bg-gold text-charcoal shadow-[0_0_0_4px_rgba(187,149,88,0.25)]" : "bg-ivory-warm text-charcoal-light"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`ml-2 hidden text-sm font-medium sm:block ${active ? "text-royal" : "text-charcoal-light"}`}>{label}</span>
            {i < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${done ? "bg-royal/40" : "bg-gold/30"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
