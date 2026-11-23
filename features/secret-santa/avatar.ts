// Deterministic initials and colours, so a person looks the same everywhere they appear.

export interface AvatarTone {
  bg: string;
  fg: string;
}

const TONES: readonly AvatarTone[] = [
  { bg: "#0a3566", fg: "#f3dfb1" },
  { bg: "#bb9558", fg: "#0a1f44" },
  { bg: "#14606b", fg: "#e8fbf8" },
  { bg: "#4b2a7d", fg: "#f1e1ff" },
  { bg: "#12503f", fg: "#f0d9a0" },
  { bg: "#7a2a3a", fg: "#ffe6c7" },
  { bg: "#e9dfc8", fg: "#0a3566" },
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

export function avatarTone(name: string): AvatarTone {
  let hash = 0;
  for (const char of name.trim().toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length]!;
}
