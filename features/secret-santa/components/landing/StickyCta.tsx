import Link from "next/link";

/**
 * Thumb-friendly call to action pinned to the bottom of phone screens. `sticky` (not `fixed`) inside the page
 * content means it stops where the footer begins instead of covering it. Render it as the last child of <main>.
 */
export default function StickyCta({ href }: { href: string }) {
  return (
    <div className="sticky inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050d24]/[0.92] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <Link href={href} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e0c08f] py-3.5 text-base font-semibold text-[#0a1f44]">
        Start a Secret Santa <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
