import { avatarTone, initialsOf } from "../avatar";

export interface Person {
  id: string;
  name: string;
  isMe?: boolean;
}

export function Avatar({ name, size = 40, ring = false, className = "" }: { name: string; size?: number; ring?: boolean; className?: string }) {
  const tone = avatarTone(name);
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ${ring ? "ring-2 ring-[#e0c08f]" : ""} ${className}`}
      style={{ width: size, height: size, background: tone.bg, color: tone.fg, fontSize: Math.round(size * 0.38) }}
    >
      {initialsOf(name)}
    </span>
  );
}

/** Overlapping row of avatars with a "+N" overflow bubble. */
export default function AvatarCluster({ people, max = 5, size = 34, onDark = false, className = "" }: { people: Person[]; max?: number; size?: number; onDark?: boolean; className?: string }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const border = onDark ? "border-[#0a2a5e]" : "border-white";
  return (
    <div className={`flex items-center ${className}`}>
      {shown.map((p, i) => (
        <Avatar key={p.id} name={p.name} size={size} ring={p.isMe} className={`border-2 ${border} ${i > 0 ? "-ml-2.5" : ""}`} />
      ))}
      {extra > 0 && (
        <span
          className={`-ml-2.5 inline-flex items-center justify-center rounded-full border-2 ${border} bg-white/90 text-xs font-semibold text-royal`}
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
