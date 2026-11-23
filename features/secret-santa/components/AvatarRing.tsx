import { Avatar, type Person } from "./AvatarCluster";

const MAX_AROUND = 10;

/** The group, seated around a table. Whatever you pass as `center` sits in the middle. */
export default function AvatarRing({ people, center }: { people: Person[]; center?: React.ReactNode }) {
  const shown = people.length > MAX_AROUND ? people.slice(0, MAX_AROUND - 1) : people;
  const extra = people.length - shown.length;
  const seats = shown.length + (extra > 0 ? 1 : 0);

  const place = (index: number) => {
    const angle = (index / Math.max(seats, 1)) * Math.PI * 2 - Math.PI / 2;
    return { left: `${50 + 41 * Math.cos(angle)}%`, top: `${50 + 41 * Math.sin(angle)}%` };
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <div className="absolute inset-[9%] rounded-full border border-dashed border-gold/50" />
      <div className="absolute inset-0 flex items-center justify-center">{center}</div>
      {shown.map((p, i) => (
        <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={place(i)}>
          <Avatar name={p.name} size={44} ring={p.isMe} className="border-2 border-white shadow-md" />
        </div>
      ))}
      {extra > 0 && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={place(shown.length)}>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-ivory-warm text-xs font-semibold text-royal shadow-md">+{extra}</span>
        </div>
      )}
    </div>
  );
}
