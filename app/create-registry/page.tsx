"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Gift, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import {
  OccasionType,
  occasionTemplates,
  occasionLabels,
  occasionIcons,
} from "@/lib/registry-templates";

const supabase = getSupabaseBrowserClient();

const occasionImages: Record<OccasionType, string> = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
  baby_shower: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop",
  housewarming: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  birthday: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&h=400&fit=crop",
  anniversary: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop",
  other: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=400&fit=crop",
};

export default function CreateRegistryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      const occasion = searchParams.get("occasion");
      const redirect = occasion ? `/create-registry?occasion=${occasion}` : "/create-registry";
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [user, authLoading, router, searchParams]);

  // Auto-trigger creation when coming from landing page occasion cards
  useEffect(() => {
    if (!user || authLoading || isCreating) return;
    const occasion = searchParams.get("occasion") as OccasionType | null;
    const validOccasions: OccasionType[] = ["wedding", "baby_shower", "housewarming", "birthday", "anniversary", "other"];
    if (occasion && validOccasions.includes(occasion)) {
      handleOccasionSelect(occasion);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleOccasionSelect = async (occasion: OccasionType) => {
    if (!user) {
      toast.error("Please sign in to create a registry");
      router.push("/login");
      return;
    }

    setSelectedOccasion(occasion);
    setIsCreating(true);

    try {
      const template = occasionTemplates[occasion];

      const { data: registry, error: registryError } = await supabase
        .from("registries")
        .insert({
          user_id: user.id,
          title: template.title,
          occasion: occasion,
          personal_message: template.personalMessage,
          thank_you_note: template.thankYouNote,
          header_image_url: template.headerImage,
          is_public: true,
        })
        .select()
        .single();

      if (registryError) throw registryError;

      const cashFundsToInsert = template.cashFunds.map((fund) => ({
        registry_id: registry.id,
        name: fund.name,
        description: fund.description,
      }));

      await supabase.from("cash_funds").insert(cashFundsToInsert);

      toast.success("Registry created! Let's personalize it.");
      router.push(`/registry/${registry.share_token}/edit`);
    } catch (error) {
      console.error("Error creating registry:", error);
      toast.error("Failed to create registry. Please try again.");
      setIsCreating(false);
      setSelectedOccasion(null);
    }
  };

  const occasions: OccasionType[] = ["wedding", "baby_shower", "housewarming", "birthday", "anniversary", "other"];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-royal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-6">
          <Button
            variant="ghost"
            className="mb-8 text-charcoal-light hover:text-royal"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-royal/10 mb-4">
              <Gift className="w-8 h-8 text-royal" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-royal mb-4">
              What&apos;s the Occasion?
            </h1>
            <p className="text-lg text-charcoal-light max-w-xl mx-auto">
              Choose the type of celebration and we&apos;ll create a beautiful registry template just for you
            </p>
          </div>

          {isCreating ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-royal mb-4" />
              <p className="text-lg text-charcoal-light">
                Creating your {selectedOccasion && occasionLabels[selectedOccasion]} registry...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {occasions.map((occasion) => (
                <button
                  key={occasion}
                  onClick={() => handleOccasionSelect(occasion)}
                  className="group relative overflow-hidden rounded-2xl border-2 border-transparent hover:border-gold bg-white shadow-sm hover:shadow-elegant transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={occasionImages[occasion]}
                      alt={occasionLabels[occasion]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-royal/60 to-transparent" />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {occasionIcons[occasion]}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-royal mb-2 group-hover:text-royal/80 transition-colors">
                      {occasionLabels[occasion]}
                    </h3>
                    <p className="text-sm text-charcoal-light line-clamp-2">
                      {occasionTemplates[occasion].personalMessage.slice(0, 80)}...
                    </p>
                    <div className="mt-4 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
