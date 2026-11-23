import Link from "next/link";
import GiftBox from "../../art/GiftBox";
import Snowfall from "../../art/Snowfall";

const WHO = ["Friends", "Families", "Office chaos", "Hostel gangs", "Book clubs", "Neighbours"];

export default function FinalCta({ createHref }: { createHref: string }) {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-5 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {WHO.map((w) => (
            <span key={w} className="rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-medium text-royal">{w}</span>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-5 py-12 md:pb-16">
        <div className="relative overflow-hidden rounded-[36px] px-7 py-14 text-center text-ivory md:px-16" style={{ background: "linear-gradient(135deg,#050d24 0%,#0a2a5e 60%,#0a3566 100%)" }}>
          <div className="santa-stars absolute inset-0" aria-hidden />
          <Snowfall count={18} />
          <GiftBox tone="gold" className="santa-float absolute -bottom-4 -left-4 hidden h-36 w-36 [--r:-8deg] md:block" />
          <GiftBox tone="ivory" className="santa-float absolute -bottom-4 -right-4 hidden h-36 w-36 [--r:8deg] md:block" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">Your next favourite tradition starts here.</h2>
            <p className="mx-auto mt-4 max-w-md text-ivory/75">No spreadsheets. No awkward assignments. Just a little holiday magic.</p>
            <Link href={createHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e0c08f] px-8 py-4 text-base font-semibold text-[#0a1f44] shadow-[0_10px_30px_-8px_rgba(224,192,143,0.6)] transition-transform hover:-translate-y-0.5">
              Start your Secret Santa <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
