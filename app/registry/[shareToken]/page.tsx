import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ViewRegistryClient from "@/components/registry/public/ViewRegistryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Gift } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ shareToken: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareToken } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: registry } = await supabase
    .from("registries")
    .select("title, event_date, event_location, header_image_url, personal_message")
    .eq("share_token", shareToken)
    .single();

  if (!registry) {
    return { title: "Registry Not Found – Gifaa" };
  }

  const description = registry.personal_message
    ? registry.personal_message
    : `View the gift registry for ${registry.title} on Gifaa.`;

  return {
    title: `${registry.title} – Gifaa Gift Registry`,
    description,
    openGraph: {
      title: `${registry.title} – Gifaa Gift Registry`,
      description,
      images: registry.header_image_url ? [registry.header_image_url] : [],
    },
  };
}

export default async function ViewRegistryPage({ params }: PageProps) {
  const { shareToken } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: registry, error: registryError } = await supabase
    .from("registries")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (registryError || !registry) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20 px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
              <Gift className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-royal mb-3">Registry Not Found</h1>
            <p className="text-charcoal-light mb-8 leading-relaxed">
              This registry may be private or the link might be incorrect.
              Double-check the URL or contact the registry owner.
            </p>
            <Link href="/">
              <Button variant="royal" size="lg">Go to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const [giftsResult, fundsResult] = await Promise.all([
    supabase
      .from("registry_gifts")
      .select("*")
      .eq("registry_id", registry.id)
      .order("is_purchased", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("cash_funds")
      .select("*")
      .eq("registry_id", registry.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <ViewRegistryClient
      initialRegistry={registry}
      initialGifts={giftsResult.data || []}
      initialCashFunds={fundsResult.data || []}
      shareToken={shareToken}
    />
  );
}
