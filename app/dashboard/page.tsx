"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Gift, Plus, Calendar, MapPin, Globe, Lock, Copy, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PhoneNumberDialog from "@/components/auth/PhoneNumberDialog";

const supabase = getSupabaseBrowserClient();

interface Registry {
  id: string;
  title: string;
  occasion: string;
  event_date: string | null;
  event_location: string | null;
  is_public: boolean;
  share_token: string | null;
  header_image_url: string | null;
  created_at: string;
}

interface RegistryWithStats extends Registry {
  totalGifts: number;
  purchasedGifts: number;
}

const occasionImages: Record<string, string> = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  baby_shower: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
  housewarming: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  birthday: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=300&fit=crop",
  other: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop",
};

const occasionLabels: Record<string, string> = {
  wedding: "Wedding",
  baby_shower: "Baby Shower",
  housewarming: "Housewarming",
  birthday: "Birthday",
  other: "Celebration",
};

function MilestoneSummary({ totalGifts, purchasedGifts }: { totalGifts: number; purchasedGifts: number }) {
  if (totalGifts === 0) return null;
  const percentage = Math.round((purchasedGifts / totalGifts) * 100);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-charcoal-light mb-1">
        <span>{purchasedGifts} of {totalGifts} gifts purchased</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1.5 bg-gold/10 rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [registries, setRegistries] = useState<RegistryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchRegistries = async () => {
      try {
        const { data: registryData, error } = await supabase
          .from("registries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          toast.error("Failed to load registries");
          return;
        }

        const registriesWithStats = await Promise.all(
          (registryData || []).map(async (registry) => {
            const { data: gifts } = await supabase
              .from("registry_gifts")
              .select("is_purchased")
              .eq("registry_id", registry.id);

            return {
              ...registry,
              totalGifts: gifts?.length || 0,
              purchasedGifts: gifts?.filter((g) => g.is_purchased).length || 0,
            };
          })
        );

        setRegistries(registriesWithStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistries();
  }, [user, router]);

  const copyRegistryLink = (e: React.MouseEvent, shareToken: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/registry/${shareToken}`);
    toast.success("Registry link copied!");
  };

  const handleDeleteRegistry = async (e: React.MouseEvent, registryId: string) => {
    e.stopPropagation();
    const { error } = await supabase.from("registries").delete().eq("id", registryId);
    if (error) {
      toast.error("Failed to delete registry");
      return;
    }
    setRegistries((prev) => prev.filter((r) => r.id !== registryId));
    toast.success("Registry deleted successfully");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <PhoneNumberDialog />
      <Header />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-royal mb-2">
              Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}!
            </h1>
            <p className="text-charcoal-light text-lg">Manage your gift registries and track contributions</p>
          </div>

          <div className="mb-8">
            <Link href="/create-registry">
              <Button variant="royal" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create New Registry
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-royal" />
            </div>
          ) : registries.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gold/10">
              <Gift className="w-16 h-16 mx-auto text-gold mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-royal mb-2">No Registries Yet</h2>
              <p className="text-charcoal-light mb-6">Create your first registry to start receiving thoughtful gifts</p>
              <Link href="/create-registry">
                <Button variant="gold" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Registry
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registries.map((registry) => (
                <div
                  key={registry.id}
                  onClick={() => registry.share_token && router.push(`/registry/${registry.share_token}/edit`)}
                  className="bg-white rounded-2xl border border-gold/10 overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer hover:border-gold/30"
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={registry.header_image_url || occasionImages[registry.occasion]}
                      alt={registry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${registry.is_public ? "bg-emerald-100 text-emerald-700" : "bg-charcoal/10 text-charcoal"}`}>
                        {registry.is_public ? <><Globe className="w-3 h-3" />Public</> : <><Lock className="w-3 h-3" />Private</>}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-royal/90 text-white rounded-full text-xs font-medium">
                        {occasionLabels[registry.occasion] || registry.occasion}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-serif font-semibold text-royal mb-2 line-clamp-1 group-hover:text-royal-light transition-colors">
                      {registry.title}
                    </h3>

                    <div className="space-y-1.5 mb-3">
                      {registry.event_date && (
                        <div className="flex items-center gap-2 text-sm text-charcoal-light">
                          <Calendar className="w-4 h-4" />
                          {formatDate(registry.event_date)}
                        </div>
                      )}
                      {registry.event_location && (
                        <div className="flex items-center gap-2 text-sm text-charcoal-light">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{registry.event_location}</span>
                        </div>
                      )}
                    </div>

                    <MilestoneSummary totalGifts={registry.totalGifts} purchasedGifts={registry.purchasedGifts} />

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gold/10">
                      <Link
                        href={`/registry/${registry.share_token}`}
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="outline" size="sm" className="w-full">View</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => registry.share_token && copyRegistryLink(e, registry.share_token)}
                        className="text-charcoal-light hover:text-royal"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="text-charcoal-light hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this registry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>&ldquo;{registry.title}&rdquo;</strong> and all associated gifts, cash funds, and contributions. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleDeleteRegistry(e, registry.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Yes, delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
