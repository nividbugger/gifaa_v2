import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
        <Gift className="w-10 h-10 text-gold" />
      </div>
      <h1 className="text-5xl font-serif font-bold text-royal mb-3">404</h1>
      <h2 className="text-2xl font-serif font-semibold text-charcoal mb-4">Page Not Found</h2>
      <p className="text-charcoal-light mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="royal" size="lg">Go to Home</Button>
      </Link>
    </div>
  );
}
