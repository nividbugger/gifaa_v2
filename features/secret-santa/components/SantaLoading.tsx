import GiftBox from "../art/GiftBox";

/** Waiting states get a little personality instead of a bare spinner. */
export default function SantaLoading({ text = "The elves are working their magic…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24" role="status" aria-live="polite">
      <GiftBox tone="gold" className="santa-wobble h-20 w-20" />
      <p className="font-serif text-lg text-royal">{text}</p>
    </div>
  );
}
