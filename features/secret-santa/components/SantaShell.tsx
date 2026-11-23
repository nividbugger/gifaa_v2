import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/santa.css";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  back?: { href: string; label: string };
  /** Full-bleed pages (the landing page) manage their own sections and spacing. */
  bare?: boolean;
  className?: string;
}

/** Shared chrome for every /santa screen: site header and footer around calm, roomy content. */
export default function SantaShell({ children, title, subtitle, back, bare = false, className = "" }: Props) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      {bare ? (
        <main className={`flex-1 ${className}`}>{children}</main>
      ) : (
        <main className={`flex-1 pt-24 pb-20 ${className}`}>
          <div className="container mx-auto max-w-2xl px-5">
            {back && (
              <Link href={back.href} className="mb-4 inline-flex items-center gap-1 text-sm text-charcoal-light hover:text-royal">
                <ArrowLeft className="h-4 w-4" /> {back.label}
              </Link>
            )}
            {title && (
              <div className="mb-6">
                <h1 className="font-serif text-3xl font-bold text-royal">{title}</h1>
                {subtitle && <p className="mt-1 text-charcoal-light">{subtitle}</p>}
              </div>
            )}
            <div className="space-y-5">{children}</div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-gold/15 bg-white p-5 shadow-[0_10px_34px_-14px_rgba(10,53,102,0.22)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function PanelTitle({ children, step }: { children: React.ReactNode; step?: number }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 font-serif text-xl font-semibold text-royal">
      {step !== undefined && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-royal font-sans text-xs font-bold text-[#f3dfb1]">{step}</span>
      )}
      {children}
    </h2>
  );
}
