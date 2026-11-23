/** A hanging bauble. Its colour comes from `text-*` classes. */
export default function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 78" className={className} aria-hidden="true" focusable="false">
      <line x1="22" y1="0" x2="22" y2="17" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <rect x="17" y="15" width="10" height="7" rx="2" fill="#bb9558" />
      <circle cx="22" cy="50" r="22" fill="currentColor" />
      <ellipse cx="14" cy="41" rx="5" ry="9" fill="#fff" opacity="0.28" transform="rotate(-25 14 41)" />
      <path d="M2 50 Q22 58 42 50" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.25" />
    </svg>
  );
}
