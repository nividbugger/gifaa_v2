"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Gift, MapPin, Copy, Check, MessageSquare, Search, Trophy, Sparkles, Heart, Wallet } from "lucide-react";
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

  const hasCashFunds = cashFunds.length > 0 || !!registry.upi_id;
  const defaultTab = gifts.length > 0 ? "gifts" : hasCashFunds ? "funds" : "gifts";
  const [activeTab, setActiveTab] = useState<"gifts" | "funds">(defaultTab);

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

          {/* Progress bar + Hall of Fame — always visible when gifts exist */}
          {gifts.length > 0 && (
            <>
              <div className="bg-white rounded-2xl border border-gold/20 p-6 mb-8 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-charcoal">Registry Progress</span>
                  </div>
                  <span className="text-sm font-bold text-royal">
                    {purchasedCount}/{gifts.length} gifted
                  </span>
                </div>
                <div className="relative h-3 bg-ivory-warm rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                    style={{
                      width: `${gifts.length > 0 ? (purchasedCount / gifts.length) * 100 : 0}%`,
                      background: "linear-gradient(90deg, hsl(213 52% 24%) 0%, hsl(37 42% 54%) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-charcoal-light">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {purchasedCount} gifted
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-charcoal-light">
                      <span className="w-2 h-2 rounded-full bg-gold" />
                      {availableCount} remaining
                    </span>
                  </div>
                  {purchasedCount === gifts.length && gifts.length > 0 && (
                    <span className="text-xs font-semibold text-gold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> All gifts claimed! 🎉
                    </span>
                  )}
                  {purchasedCount > 0 && purchasedCount < gifts.length && (
                    <span className="text-xs text-charcoal-light">
                      {Math.round((purchasedCount / gifts.length) * 100)}% complete
                    </span>
                  )}
                </div>
              </div>

              {purchasedCount > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
                    <div className="flex items-center gap-2 px-4">
                      <Trophy className="w-4 h-4 text-gold" />
                      <span className="text-sm font-serif font-semibold text-charcoal">Hall of Gifters</span>
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {gifts
                      .filter((g) => g.is_purchased && g.purchased_by_name)
                      .map((g) => (
                        <div key={g.id} className="flex items-center gap-2 bg-white border border-gold/20 rounded-full px-3 py-1.5 shadow-soft">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-royal to-gold flex items-center justify-center text-[10px] text-white font-bold">
                            {g.purchased_by_name!.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-charcoal">{g.purchased_by_name}</span>
                          <span className="text-[10px] text-gold">✦</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tab bar — only show if both sections have content */}
          {gifts.length > 0 && hasCashFunds && (
            <div className="flex gap-2 mb-8 p-1 bg-white rounded-2xl border border-gold/20 shadow-soft w-fit">
              <button
                onClick={() => setActiveTab("gifts")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "gifts"
                    ? "bg-royal text-white shadow-sm"
                    : "text-charcoal-light hover:text-charcoal"
                }`}
              >
                <Gift className="w-4 h-4" />
                Gift Ideas
                <span className={`text-xs ${activeTab === "gifts" ? "opacity-60" : "opacity-50"}`}>
                  ({gifts.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("funds")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "funds"
                    ? "bg-royal text-white shadow-sm"
                    : "text-charcoal-light hover:text-charcoal"
                }`}
              >
                <Wallet className="w-4 h-4" />
                Cash &amp; UPI
                {cashFunds.length > 0 && (
                  <span className={`text-xs ${activeTab === "funds" ? "opacity-60" : "opacity-50"}`}>
                    ({cashFunds.length})
                  </span>
                )}
              </button>
            </div>
          )}

          {/* ── Gifts tab ── */}
          {(activeTab === "gifts" || !hasCashFunds) && (
            <div>
              {gifts.length > 0 ? (
                <section className="mb-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gold text-lg">❈</span>
                      <h2 className="text-2xl font-serif font-bold text-royal">Gift Ideas</h2>
                      <span className="text-gold text-lg">❈</span>
                    </div>
                    <div className="relative max-w-xs w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                      <Input
                        type="search"
                        placeholder="Search gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gold/20 focus:border-gold rounded-full"
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
              ) : (
                !hasCashFunds && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                      <Gift className="w-12 h-12 text-gold" />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-royal mb-3">Gift List Coming Soon!</h2>
                    <p className="text-charcoal-light max-w-md mx-auto">
                      The registry owner is still adding gifts. Check back soon!
                    </p>
                  </div>
                )
              )}

              {/* Shipping address — lives in Gifts tab */}
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
            </div>
          )}

          {/* ── Cash & UPI tab ── */}
          {(activeTab === "funds" || !gifts.length) && hasCashFunds && (
            <UPIGiftingSection
              upiId={registry.upi_id ?? ""}
              qrUrl={registry.upi_qr_url ?? undefined}
              cashFunds={cashFunds}
              registryId={registry.id}
            />
          )}

          {/* Thank you note — always at the bottom */}
          {registry.thank_you_note && (
            <section className="text-center py-10 px-6 bg-gradient-to-br from-white to-ivory rounded-2xl border border-gold/20 mb-12">
              <MessageSquare className="w-8 h-8 mx-auto text-gold mb-4" />
              <p className="text-lg md:text-xl text-charcoal leading-relaxed italic font-serif max-w-2xl mx-auto">
                &ldquo;{registry.thank_you_note}&rdquo;
              </p>
            </section>
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
