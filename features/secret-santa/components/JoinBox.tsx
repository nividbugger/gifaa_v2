"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { parseInviteCode } from "../invite-input";

/** "Have an invite?" Paste the whole link or just the code. */
export default function JoinBox({ className = "", id }: { className?: string; id?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = parseInviteCode(value);
    if (!code) {
      setError("That doesn't look like an invite link or code.");
      return;
    }
    router.push(`/santa/join/${code}`);
  };

  return (
    <form id={id} onSubmit={submit} className={className}>
      <label htmlFor="invite" className="mb-2 block text-sm font-medium text-ivory/80">Have an invite? Paste the link or code</label>
      <div className="flex gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-[#e0c08f]">
        <input
          id="invite"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          placeholder="gifaa.in/santa/join/…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
        />
        <button type="submit" aria-label="Join this exchange" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e0c08f] text-[#0a1f44] transition-transform hover:scale-105">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-[#ffb4a8]" role="alert">{error}</p>}
    </form>
  );
}
