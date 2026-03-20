"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Loader2, Gift, MapPin, Copy, Check, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistryHero from "@/components/registry/public/RegistryHero";
import GiftCard from "@/components/registry/public/GiftCard";
import GiftFilters from "@/components/registry/public/GiftFilters";
import UPIGiftingSection from "@/components/registry/public/UPIGiftingSection";
import PurchaseDialog from "@/components/registry/public/PurchaseDialog";
import RedirectOverlay from "@/components/registry/public/RedirectOverlay";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];
type GiftItem = Database["public"]["Tables"]["registry_gifts"]["Row"];
type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];

interface ViewRegistryClientProps {
  initialRegistry: Registry;
  initialGifts: GiftItem[];
  initialCashFunds: CashFund[];
  shareToken: string;
}

export default function ViewRegistryClient({
  initialRegistry,
  initialGifts,
  initialCashFunds,
  shareToken,
}: ViewRegistryClientProps) {
  const supabase = getSupabaseBrowserClient();
  const { user } = useAuth();

  const [registry] = useState<Registry>(initialRegistry);
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [cashFunds] = useState<CashFund[]>(initialCashFunds);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [showPurchased, setShowPurchased] = useState(true);
  const [showAvailable, setShowAvailable] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  // Purchase dialog state
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect overlay state
  const [redirectData, setRedirectData] = useState<{
    url: string;
    productName: string;
  } | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);

  const isOwner = user && registry && user.id === registry.user_id;

  const maxPrice = useMemo(() => {
    const prices = gifts.map((g) => g.price).filter((p): p is number => p !== null);
    return prices.length > 0 ? Math.max(...prices) : 100000;
  }, [gifts]);

  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      if (gift.is_purchased && !showPurchased) return false;
      if (!gift.is_purchased && !showAvailable) return false;
      if (gift.price !== null) {
        if (gift.price < priceRange[0] || gift.price > priceRange[1]) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = gift.product_name.toLowerCase().includes(query);
        const notesMatch = gift.notes?.toLowerCase().includes(query);
        if (!nameMatch && !notesMatch) return false;
      }
      return true;
    });
  }, [gifts, showPurchased, showAvailable, priceRange, searchQuery]);

  const hasActiveFilters = useMemo(() => {
    return (
      !showPurchased ||
      !showAvailable ||
      priceRange[0] > 0 ||
      priceRange[1] < maxPrice ||
      searchQuery.trim().length > 0
    );
  }, [showPurchased, showAvailable, priceRange, maxPrice, searchQuery]);

  const clearFilters = () => {
    setShowPurchased(true);
    setShowAvailable(true);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  // Set up realtime subscription for gifts
  useEffect(() => {
    const channel = supabase
      .channel(`registry-${shareToken}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registry_gifts" },
        async () => {
          const { data } = await supabase
            .from("registry_gifts")
            .select("*")
            .eq("registry_id", registry.id)
            .order("is_purchased", { ascending: true })
            .order("created_at", { ascending: false });
          setGifts(data || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shareToken, registry.id, supabase]);

  const handleGiftClick = (gift: GiftItem) => {
    if (gift.is_purchased) return;
    setSelectedGift(gift);
    setPurchaseDialogOpen(true);
  };

  const handleMarkAsPurchased = async (
    name: string,
    message: string,
    isAnonymous: boolean
  ) => {
    if (!selectedGift || !name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("registry_gifts")
        .update({
          is_purchased: true,
          purchased_by_name: isAnonymous ? "Anonymous" : name.trim(),
          purchase_message: message.trim() || null,
          purchased_at: new Date().toISOString(),
          purchased_by_user_id: user?.id || null,
        })
        .eq("id", selectedGift.id);

      if (error) throw error;

      setGifts((prev) =>
        prev.map((g) =>
          g.id === selectedGift.id
            ? {
                ...g,
                is_purchased: true,
                purchased_by_name: isAnonymous ? "Anonymous" : name.trim(),
                purchase_message: message.trim() || null,
              }
            : g
        )
      );

      toast.success("Gift marked as purchased! 🎉");
      setPurchaseDialogOpen(false);

      if (selectedGift.product_url) {
        setRedirectData({
          url: selectedGift.product_url,
          productName: selectedGift.product_name,
        });
      }

      setSelectedGift(null);
    } catch (error) {
      console.error("Error marking gift as purchased:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = async () => {
    if (!registry?.shipping_address) return;
    try {
      await navigator.clipboard.writeText(registry.shipping_address);
      setCopiedAddress(true);
      toast.success("Address copied!");
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleRedirectComplete = () => {
    if (redirectData) {
      window.open(redirectData.url, "_blank");
    }
    setRedirectData(null);
  };

  const availableCount = gifts.filter((g) => !g.is_purchased).length;
  const purchasedCount = gifts.filter((g) => g.is_purchased).length;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      {redirectData && (
        <RedirectOverlay
          url={redirectData.url}
          productName={redirectData.productName}
          shippingAddress={registry.shipping_address}
          countdown={8}
          onClose={() => setRedirectData(null)}
          onCountdownComplete={handleRedirectComplete}
        />
      )}

      <main className="flex-1 pt-16">
        <RegistryHero
          registry={registry}
          isOwner={isOwner ?? false}
          shareToken={shareToken}
        />

        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
          {gifts.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 py-4">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-royal">{gifts.length}</p>
                <p className="text-sm text-charcoal-light">Total Gifts</p>
              </div>
              <div className="w-px h-10 bg-gold/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-primary">{availableCount}</p>
                <p className="text-sm text-charcoal-light">Available</p>
              </div>
              <div className="w-px h-10 bg-gold/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-success">{purchasedCount}</p>
                <p className="text-sm text-charcoal-light">Purchased</p>
              </div>
            </div>
          )}

          {gifts.length > 0 && (
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-serif font-bold text-royal flex items-center gap-3">
                  <Gift className="w-6 h-6 text-gold" />
                  Gift Ideas
                </h2>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                  <Input
                    type="search"
                    placeholder="Search gifts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gold/20 focus:border-gold"
                  />
                </div>
              </div>

              <GiftFilters
                priceRange={priceRange}
                maxPrice={maxPrice}
                onPriceRangeChange={setPriceRange}
                showPurchased={showPurchased}
                showAvailable={showAvailable}
                onShowPurchasedChange={setShowPurchased}
                onShowAvailableChange={setShowAvailable}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {filteredGifts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGifts.map((gift) => (
                    <GiftCard key={gift.id} gift={gift} onGiftClick={handleGiftClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gold/10">
                  <Gift className="w-12 h-12 mx-auto text-charcoal/20 mb-4" />
                  <p className="text-charcoal-light">
                    {hasActiveFilters
                      ? "No gifts match your filters. Try adjusting them."
                      : "No gifts available at the moment."}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={clearFilters} className="mt-2 text-royal">
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </section>
          )}

          {registry.upi_id && (
            <UPIGiftingSection
              upiId={registry.upi_id}
              cashFunds={cashFunds}
              registryId={registry.id}
            />
          )}

          {registry.shipping_address && (
            <section className="mb-12">
              <div className="bg-white rounded-2xl border border-gold/20 p-6 md:p-8 max-w-2xl">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-royal text-lg">Shipping Address</h3>
                      <p className="text-sm text-charcoal-light">Send physical gifts here</p>
                    </div>
                  </div>
                  <Button variant="gold-outline" size="sm" onClick={handleCopyAddress}>
                    {copiedAddress ? (
                      <><Check className="w-4 h-4 mr-1" />Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1" />Copy</>
                    )}
                  </Button>
                </div>
                <p className="text-charcoal whitespace-pre-line">{registry.shipping_address}</p>
              </div>
            </section>
          )}

          {registry.thank_you_note && (
            <section className="text-center py-10 px-6 bg-gradient-to-br from-white to-ivory rounded-2xl border border-gold/20 mb-12">
              <MessageSquare className="w-8 h-8 mx-auto text-gold mb-4" />
              <p className="text-lg md:text-xl text-charcoal leading-relaxed italic font-serif max-w-2xl mx-auto">
                &ldquo;{registry.thank_you_note}&rdquo;
              </p>
            </section>
          )}

          {gifts.length === 0 && cashFunds.length === 0 && !registry.upi_id && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                <Gift className="w-12 h-12 text-gold" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-royal mb-3">Gift List Coming Soon!</h2>
              <p className="text-charcoal-light max-w-md mx-auto">
                The registry owner is still adding gifts. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <PurchaseDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        gift={selectedGift}
        onConfirm={handleMarkAsPurchased}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
}
