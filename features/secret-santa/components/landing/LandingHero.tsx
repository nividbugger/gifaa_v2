import Link from "next/link";
import GiftBox from "../../art/GiftBox";
import Ornament from "../../art/Ornament";
import Snowfall from "../../art/Snowfall";
import Sparkle from "../../art/Sparkle";
import JoinBox from "../JoinBox";

const TRUST = ["Free to use", "Friends join without an account", "Secrets stay secret"];

export default function LandingHero({ createHref }: { createHref: string }) {
  return (
    <section className="relative overflow-hidden text-ivory" style={{ background: "linear-gradient(160deg,#050d24 0%,#0a2a5e 58%,#0a3566 100%)" }}>
      <div className="santa-stars absolute inset-0" aria-hidden />
      <Snowfall count={34} />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#2f6fc0]/20 blur-3xl" aria-hidden />

      <div className="container relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-32 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-40">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e0c08f]">Gifaa presents · The Holiday Edit ✳</p>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            The art of giving,{" "}
            <em className="santa-shimmer-text pr-1 font-serif font-bold italic">secretly.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/80">
            One group. Random matches. Thoughtful gifts. Zero spoilers. Draw names with your people and let everyone share a wishlist.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={createHref}
              className="santa-pulse-ring inline-flex items-center gap-2 rounded-full bg-[#e0c08f] px-7 py-4 text-base font-semibold text-[#0a1f44] shadow-[0_10px_30px_-8px_rgba(224,192,143,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Create a group <span aria-hidden>→</span>
            </Link>
            <a href="#join" className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-ivory ring-1 ring-white/30 transition-colors hover:bg-white/10">
              Join a group <span aria-hidden>↗</span>
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ivory/70">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Sparkle className="h-3 w-3 text-[#e0c08f]" /> {t}
              </li>
            ))}
          </ul>

          <JoinBox id="join" className="mt-10 max-w-md scroll-mt-28" />
        </div>

        <div className="relative mx-auto h-[300px] w-full max-w-[420px] md:h-[440px]" aria-hidden>
          <div className="absolute inset-x-6 bottom-4 top-10 rounded-full bg-[#e0c08f]/10 blur-3xl" />
          <GiftBox tone="gold" className="santa-float absolute bottom-0 left-[18%] h-[62%] w-[62%] [--r:-3deg]" />
          <GiftBox tone="midnight" className="santa-float absolute bottom-2 right-0 h-[40%] w-[40%] [--r:5deg] [animation-delay:1s]" />
          <GiftBox tone="ivory" className="santa-float absolute bottom-6 left-0 h-[30%] w-[30%] [--r:-8deg] [animation-delay:2s]" />
          <Ornament className="santa-float absolute -top-4 left-[20%] h-24 w-14 text-[#2f6fc0] [--r:2deg]" />
          <Ornament className="santa-float absolute -top-6 right-[22%] h-28 w-16 text-[#c9a15f] [--r:-2deg] [animation-delay:1.5s]" />
          <Sparkle className="santa-twinkle absolute right-2 top-1/3 h-6 w-6 text-[#f6e6bd]" />
          <Sparkle className="santa-twinkle absolute left-2 top-1/2 h-4 w-4 text-white/80 [animation-delay:1s]" />
          <Sparkle className="santa-twinkle absolute right-1/4 top-6 h-3 w-3 text-[#e0c08f] [animation-delay:2s]" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ivory" aria-hidden />
    </section>
  );
}
