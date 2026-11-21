import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  back?: { href: string; label: string };
}

/** Shared page chrome for every /santa screen so they all feel like one calm, focused flow. */
export default function SantaShell({ children, title, subtitle, back }: Props) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-5 max-w-2xl">
          {back && (
            <Link href={back.href} className="inline-flex items-center gap-1 text-sm text-charcoal-light hover:text-royal mb-4">
              <ArrowLeft className="w-4 h-4" /> {back.label}
            </Link>
          )}
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-serif font-bold text-royal">{title}</h1>
              {subtitle && <p className="text-charcoal-light mt-1">{subtitle}</p>}
            </div>
          )}
          <div className="space-y-5">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bg-white rounded-2xl border border-gold/10 p-5 ${className}`}>{children}</section>;
}

export function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-serif font-semibold text-royal mb-3">{children}</h2>;
}
