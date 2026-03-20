"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Search, Gift, Calendar, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];

const occasionLabels: Record<string, string> = {
  wedding: "Wedding",
  baby_shower: "Baby Shower",
  housewarming: "Housewarming",
  birthday: "Birthday",
  anniversary: "Anniversary",
  other: "Celebration",
};

const supabase = getSupabaseBrowserClient();

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const checkDirectLink = (query: string): string | null => {
    const shareTokenMatch = query.match(/registry\/([a-f0-9]+)/i);
    if (shareTokenMatch) return shareTokenMatch[1];
    if (/^[a-f0-9]{32}$/i.test(query.trim())) return query.trim();
    return null;
  };

  const handleSearch = useCallback(async (query?: string) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;

    const directToken = checkDirectLink(q);
    if (directToken) {
      router.push(`/registry/${directToken}`);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });

    try {
      const { data, error } = await supabase
        .from("registries")
        .select("*")
        .eq("is_public", true)
        .or(`title.ilike.%${q}%,event_location.ilike.%${q}%`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setRegistries(data || []);
    } catch (error) {
      console.error("Error searching registries:", error);
      setRegistries([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, router]);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-royal mb-3">
              Find a Registry
            </h1>
            <p className="text-charcoal-light max-w-md mx-auto">
              Search by registry name, location, or paste a direct registry link
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gold/20 p-6 mb-8 shadow-soft">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-light" />
                <Input
                  type="search"
                  placeholder="Search by name, city, or paste a registry link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-12 text-base border-gold/20 focus:border-gold"
                />
              </div>
              <Button
                variant="royal"
                size="lg"
                onClick={() => handleSearch()}
                disabled={isLoading || !searchQuery.trim()}
                className="px-8"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-charcoal-light">
              <span>Try searching:</span>
              {["Wedding", "Mumbai", "Baby Shower"].map((term) => (
                <button
                  key={term}
                  onClick={() => { setSearchQuery(term); handleSearch(term); }}
                  className="text-royal hover:underline"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-royal mx-auto mb-4" />
              <p className="text-charcoal-light">Searching registries...</p>
            </div>
          ) : hasSearched ? (
            registries.length > 0 ? (
              <div className="space-y-4">
                <p className="text-charcoal-light text-sm mb-4">
                  Found {registries.length} {registries.length === 1 ? "registry" : "registries"}
                </p>
                {registries.map((registry) => (
                  <button
                    key={registry.id}
                    onClick={() => router.push(`/registry/${registry.share_token}`)}
                    className="w-full text-left bg-white rounded-xl border border-gold/10 p-5 hover:border-gold/30 hover:shadow-soft transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-royal/10 to-gold/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Gift className="w-7 h-7 text-royal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-charcoal text-lg mb-1 group-hover:text-royal transition-colors">
                          {registry.title}
                        </h3>
                        <p className="text-sm text-gold font-medium mb-2">
                          {occasionLabels[registry.occasion] || registry.occasion}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-light">
                          {registry.event_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(registry.event_date)}
                            </span>
                          )}
                          {registry.event_location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {registry.event_location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gold/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal/5 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-charcoal/30" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">No registries found</h3>
                <p className="text-charcoal-light text-sm max-w-sm mx-auto">
                  Try a different search term, or check if you have the exact registry link to paste.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-charcoal-light">
              <p>Enter a search term or paste a registry link to find registries</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
