"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import GiftBox from "../art/GiftBox";
import Snowfall from "../art/Snowfall";
import Sparkle from "../art/Sparkle";
import { joinUrl, whatsappShareUrl } from "../links";
import type { SantaView } from "../types";
import Confetti from "./Confetti";
import { Panel, PanelTitle } from "./SantaShell";
import WishCard from "./WishCard";

type Match = NonNullable<SantaView["match"]>;
type Stage = "sealed" | "opening" | "box" | "revealed";

const revealedKey = (token: string) => `gifaa:santa:revealed:${token}`;
const MIDNIGHT = "linear-gradient(160deg,#050d24 0%,#0a2a5e 60%,#0a3566 100%)";

interface Props {
  match: Match;
  token: string;
  myName: string;
  groupName: string;
  groupCode: string;
}

/**
 * Sealed envelope -> tap -> a gift box -> tap -> confetti and the name. Two taps, because anticipation
 * is the point. Returning visitors skip straight to the result, and reduced-motion users get one tap.
 */
export default function RevealExperience({ match, token, myName, groupName, groupCode }: Props) {
  const [stage, setStage] = useState<Stage>("sealed");
  const [burst, setBurst] = useState(false);
  const reduced = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (localStorage.getItem(revealedKey(token))) setStage("revealed");
    } catch {
      /* private mode: they just see the full reveal each time */
    }
    return () => clearTimeout(timer.current);
  }, [token]);

  const reveal = () => {
    setStage("revealed");
    setBurst(true);
    try {
      localStorage.setItem(revealedKey(token), "1");
    } catch {
      /* ignore */
    }
  };

  const openEnvelope = () => {
    if (reduced.current) return reveal();
    setStage("opening");
    timer.current = setTimeout(() => setStage("box"), 1100);
  };

  const replay = () => {
    setBurst(false);
    setStage("sealed");
  };

  const open = stage !== "sealed";
  const shareText = `🎅 I just got my Secret Santa match for "${groupName}"! I can't tell you who 🤫 Join the fun: ${joinUrl(groupCode)}`;

  return (
    <>
      <Confetti run={burst} onDone={() => setBurst(false)} />

      <div className="relative overflow-hidden rounded-[32px] px-5 py-10 text-center text-ivory shadow-[0_24px_60px_-24px_rgba(5,13,36,0.75)] sm:px-8 sm:py-14" style={{ background: MIDNIGHT }}>
        <div className="santa-stars absolute inset-0" aria-hidden />
        <Snowfall count={16} />

        <div className="relative">
          {(stage === "sealed" || stage === "opening") && (
            <div className="santa-pop">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e0c08f]">A letter for you</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Your match is ready</h2>

              <button
                type="button"
                onClick={openEnvelope}
                disabled={stage !== "sealed"}
                aria-label="Open your envelope"
                className="group relative mx-auto mt-10 block h-[180px] w-[270px] [perspective:900px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0c08f] sm:h-[210px] sm:w-[320px]"
              >
                <span className="absolute inset-0 rounded-2xl bg-[#d9c9a3] shadow-2xl" />
                <span className={`absolute inset-x-4 bottom-4 top-4 z-[5] flex flex-col items-center justify-center rounded-xl bg-ivory text-center shadow transition-transform duration-700 ease-out ${open ? "-translate-y-24 sm:-translate-y-28" : ""}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Secret Santa</span>
                  <span className="mt-1 font-serif text-lg font-bold text-royal">For {myName}</span>
                </span>
                <span className="absolute inset-0 z-10 rounded-2xl bg-[#e8dbbc] [clip-path:polygon(0_0,50%_54%,100%_0,100%_100%,0_100%)]" />
                <span className={`absolute inset-x-0 top-0 h-[56%] origin-top bg-[#efe3c6] transition-transform duration-500 [clip-path:polygon(0_0,100%_0,50%_100%)] ${open ? "z-0 [transform:rotateX(180deg)]" : "z-20"}`} />
                <span className={`absolute left-1/2 top-[44%] z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#f1d9a4] to-[#a98443] shadow-lg transition-all duration-300 ${open ? "scale-50 opacity-0" : "santa-pulse-ring group-hover:scale-105"}`}>
                  <Sparkle className="h-6 w-6 text-[#7a5a1f]" />
                </span>
              </button>

              <p className="mt-8 text-sm text-ivory/70">{stage === "sealed" ? "Tap the envelope to open it. Make sure nobody's looking over your shoulder." : "Opening…"}</p>
            </div>
          )}

          {stage === "box" && (
            <div className="santa-pop">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e0c08f]">One more thing</p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Unwrap your surprise</h2>
              <button type="button" onClick={reveal} aria-label="Unwrap your gift" className="mx-auto mt-8 block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0c08f]">
                <GiftBox tone="gold" className="santa-wobble santa-glow h-48 w-48 sm:h-56 sm:w-56" />
              </button>
              <p className="mt-6 text-sm text-ivory/70">Tap the gift</p>
            </div>
          )}

          {stage === "revealed" && (
            <div className="santa-pop">
              <GiftBox tone="gold" lidOpen className="mx-auto h-24 w-24" />
              <p className="mt-4 text-sm text-ivory/75">You're the Secret Santa for</p>
              <p className="santa-shimmer-text mt-1 break-words font-serif text-5xl font-bold leading-tight sm:text-6xl">{match.name}</p>
              <p className="mt-4 text-sm text-ivory/70">🤫 Keep it secret until the exchange.</p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a href={whatsappShareUrl(shareText)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#e0c08f] px-5 py-3 text-sm font-semibold text-[#0a1f44] transition-transform hover:-translate-y-0.5">
                  <MessageCircle className="h-4 w-4" /> Share the excitement
                </a>
                <button type="button" onClick={replay} className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-ivory/80 ring-1 ring-white/25 hover:bg-white/10">
                  <RotateCcw className="h-4 w-4" /> Replay
                </button>
              </div>
              <p className="mt-3 text-xs text-ivory/50">Sharing never reveals who you got.</p>
            </div>
          )}
        </div>
      </div>

      {stage === "revealed" && (
        <Panel className="mt-5">
          <PanelTitle>{match.name}'s wishlist</PanelTitle>
          {match.wishes.length === 0 ? (
            <p className="text-sm text-charcoal-light">{match.name} hasn't added a wishlist yet. Check back soon.</p>
          ) : (
            <div className="space-y-2.5">{match.wishes.map((wish) => <WishCard key={wish.id} wish={wish} />)}</div>
          )}
        </Panel>
      )}
    </>
  );
}
