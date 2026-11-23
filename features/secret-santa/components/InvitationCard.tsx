import { coverFor } from "../covers";
import { formatDate } from "../links";
import GiftBox from "../art/GiftBox";
import Snowfall from "../art/Snowfall";
import Sparkle from "../art/Sparkle";
import AvatarCluster, { type Person } from "./AvatarCluster";
import Countdown from "./Countdown";

interface Props {
  name: string;
  /** Budget per gift in rupees, as a number or the text being typed. */
  budget?: number | string | null;
  date?: string | null;
  note?: string | null;
  /** Invite code: decides which cover the group gets. */
  code?: string | null;
  hostName?: string | null;
  people?: Person[];
  /** When we only know how many have joined (not who), show a count instead of avatars. */
  joinedCount?: number;
  /** Show the countdown pill when there is a date. */
  showCountdown?: boolean;
  className?: string;
}

const GOLD = "text-[#e0c08f]";

function budgetText(budget: Props["budget"]): string | null {
  const n = typeof budget === "string" ? parseFloat(budget) : budget;
  return n && Number.isFinite(n) && n > 0 ? `₹${Math.round(n).toLocaleString("en-IN")} per gift` : null;
}

/** The exchange as a collectible card. Used for the live preview, the invite page and the group screens. */
export default function InvitationCard({ name, budget, date, note, code, hostName, people = [], showCountdown = false, joinedCount, className = "" }: Props) {
  const cover = coverFor(code);
  const chips = [budgetText(budget), formatDate(date ?? null)].filter(Boolean) as string[];

  return (
    <div className={`relative overflow-hidden rounded-[28px] text-ivory shadow-[0_24px_60px_-24px_rgba(5,13,36,0.7)] ${className}`} style={{ background: cover.background }}>
      <div className="santa-stars absolute inset-0 opacity-90" aria-hidden />
      <Snowfall count={12} />
      <Sparkle className={`santa-twinkle absolute right-8 top-7 h-4 w-4 ${GOLD}`} />
      <Sparkle className={`santa-twinkle absolute right-16 top-14 h-2.5 w-2.5 text-white/70 [animation-delay:1.2s]`} />

      <div className="relative p-6 pb-24 sm:p-8 sm:pb-10 sm:pr-40">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${GOLD}`}>Gifaa · Secret Santa</p>
        <h2 className="mt-3 break-words font-serif text-3xl font-bold leading-tight sm:text-4xl">{name.trim() || "Your exchange"}</h2>
        {hostName && <p className="mt-1 text-sm text-ivory/70">Hosted by {hostName}</p>}

        {(chips.length > 0 || showCountdown) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full bg-white/[0.12] px-3 py-1 text-xs font-semibold text-[#f6e6bd] ring-1 ring-white/15 backdrop-blur">
                {chip}
              </span>
            ))}
            {showCountdown && <Countdown date={date ?? null} />}
          </div>
        )}

        {note?.trim() && <p className="mt-4 max-w-sm text-sm italic text-ivory/80">“{note.trim()}”</p>}

        <div className="mt-6 flex items-center gap-3">
          {people.length > 0 ? (
            <>
              <AvatarCluster people={people} onDark />
              <span className="text-xs text-ivory/70">{people.length} {people.length === 1 ? "person" : "people"} in</span>
            </>
          ) : joinedCount ? (
            <span className="text-xs text-ivory/75">{joinedCount} {joinedCount === 1 ? "person has" : "people have"} joined</span>
          ) : (
            <span className="text-xs text-ivory/60">Waiting for the first guest…</span>
          )}
        </div>
      </div>

      <GiftBox tone={cover.tone} className="santa-float absolute -bottom-3 -right-2 h-28 w-28 [--r:6deg] sm:h-40 sm:w-40" />
    </div>
  );
}
