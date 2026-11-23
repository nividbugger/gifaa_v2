import GiftBox from "../../art/GiftBox";
import Sparkle from "../../art/Sparkle";
import { Avatar } from "../AvatarCluster";

const STEPS = [
  { n: "01", title: "Gather", text: "Bring your favourite people together with one WhatsApp link. Friends join in seconds, no account needed." },
  { n: "02", title: "Draw", text: "Names are drawn in secret, even the organiser can't peek. Couples and siblings can be kept apart." },
  { n: "03", title: "Surprise", text: "Everyone gets their match's wishlist. Find something they'll love and keep the mystery until the exchange." },
];

function Art({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex items-center justify-center">
        {["Asha", "Ben", "Chen", "Divya"].map((n, i) => (
          <Avatar key={n} name={n} size={44} className={`border-[3px] border-white shadow-md ${i ? "-ml-3" : ""}`} />
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="relative mx-auto h-16 w-24 rounded-lg bg-[#e8dbbc] shadow-md">
        <div className="absolute inset-x-0 top-0 h-9 bg-[#efe3c6] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <span className="absolute left-1/2 top-[34%] h-7 w-7 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#e6c995] to-[#a98443] shadow" />
        <Sparkle className="santa-twinkle absolute -right-3 -top-3 h-5 w-5 text-[#bb9558]" />
      </div>
    );
  }
  return <GiftBox tone="midnight" className="mx-auto h-20 w-20" />;
}

export default function HowItWorks() {
  return (
    <section className="container mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">Made for friends, families &amp; office chaos</p>
      <h2 className="mt-3 text-center font-serif text-4xl font-bold text-royal md:text-5xl">So, how does the magic work?</h2>

      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.n} className="relative overflow-hidden rounded-[28px] border border-gold/15 bg-white p-7 shadow-[0_14px_40px_-20px_rgba(10,53,102,0.3)]">
            <span className="absolute right-5 top-3 font-serif text-6xl font-bold text-gold/15">{step.n}</span>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-ivory-warm">
              <Art index={i} />
            </div>
            <h3 className="mt-6 font-serif text-2xl font-bold text-royal">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-charcoal-light">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
