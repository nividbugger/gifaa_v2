"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = getSupabaseBrowserClient();
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Link as LinkIcon, 
  Loader2, 
  Trash2, 
  ExternalLink,
  Package,
  Wallet,
  Edit2,
  Check,
  X,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { scrapeProductUrl } from "@/lib/api/product-scraper";
import type { Database } from "@/lib/supabase/types";

type Gift = Database["public"]["Tables"]["registry_gifts"]["Row"];
type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];

interface GiftsAndFundsTabProps {
  registryId: string;
  gifts: Gift[];
  cashFunds: CashFund[];
  onGiftsChange: () => void;
  onFundsChange: () => void;
}

export default function GiftsAndFundsTab({ 
  registryId, 
  gifts, 
  cashFunds, 
  onGiftsChange, 
  onFundsChange 
}: GiftsAndFundsTabProps) {
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftDescription, setGiftDescription] = useState("");
  const [giftImageUrl, setGiftImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  const [isAddingFund, setIsAddingFund] = useState(false);
  const [fundName, setFundName] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [fundTarget, setFundTarget] = useState("");

  const [editingFund, setEditingFund] = useState<string | null>(null);
  const [editFundName, setEditFundName] = useState("");
  const [editFundDescription, setEditFundDescription] = useState("");
  const [editFundTarget, setEditFundTarget] = useState("");

  const handleFetchProductDetails = async () => {
    if (!giftUrl.trim()) {
      toast.error("Please enter a product URL first");
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    try {
      const result = await scrapeProductUrl(giftUrl);

      if (result.success && result.data) {
        if (result.data.title) setGiftName(result.data.title);
        if (result.data.price) setGiftPrice(result.data.price.toString());
        if (result.data.description) setGiftDescription(result.data.description);
        if (result.data.image) setGiftImageUrl(result.data.image);
        setHasFetched(true);
        toast.success("Product details fetched!");
      } else {
        setFetchError(result.error || "Could not extract product details");
        toast.error("Could not fetch product details. Please enter manually.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setFetchError("Failed to fetch product details");
      toast.error("Failed to fetch product details");
    } finally {
      setIsFetching(false);
    }
  };

  const resetGiftForm = () => {
    setGiftUrl("");
    setGiftName("");
    setGiftPrice("");
    setGiftDescription("");
    setGiftImageUrl(null);
    setFetchError(null);
    setHasFetched(false);
  };

  const handleAddGift = async () => {
    if (!giftName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("registry_gifts").insert({
        registry_id: registryId,
        product_name: giftName.trim(),
        product_url: giftUrl.trim() || null,
        price: giftPrice ? parseFloat(giftPrice) : null,
        notes: giftDescription.trim() || null,
        product_image_url: giftImageUrl || null,
      });

      if (error) throw error;

      toast.success("Gift added!");
      resetGiftForm();
      setIsAddingGift(false);
      onGiftsChange();
    } catch (error) {
      console.error("Error adding gift:", error);
      toast.error("Failed to add gift");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    try {
      const { error } = await supabase
        .from("registry_gifts")
        .delete()
        .eq("id", giftId);

      if (error) throw error;

      toast.success("Gift removed");
      onGiftsChange();
    } catch (error) {
      console.error("Error deleting gift:", error);
      toast.error("Failed to remove gift");
    }
  };

  const handleAddFund = async () => {
    if (!fundName.trim()) {
      toast.error("Please enter a fund name");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("cash_funds").insert({
        registry_id: registryId,
        name: fundName.trim(),
        description: fundDescription.trim() || null,
        target_amount: fundTarget ? parseFloat(fundTarget) : null,
      });

      if (error) throw error;

      toast.success("Cash fund added!");
      setFundName("");
      setFundDescription("");
      setFundTarget("");
      setIsAddingFund(false);
      onFundsChange();
    } catch (error) {
      console.error("Error adding fund:", error);
      toast.error("Failed to add cash fund");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFund = async (fundId: string) => {
    try {
      const { error } = await supabase
        .from("cash_funds")
        .update({
          name: editFundName.trim(),
          description: editFundDescription.trim() || null,
          target_amount: editFundTarget ? parseFloat(editFundTarget) : null,
        })
        .eq("id", fundId);

      if (error) throw error;

      toast.success("Cash fund updated!");
      setEditingFund(null);
      onFundsChange();
    } catch (error) {
      console.error("Error updating fund:", error);
      toast.error("Failed to update cash fund");
    }
  };

  const handleDeleteFund = async (fundId: string) => {
    try {
      const { error } = await supabase
        .from("cash_funds")
        .delete()
        .eq("id", fundId);

      if (error) throw error;

      toast.success("Cash fund removed");
      onFundsChange();
    } catch (error) {
      console.error("Error deleting fund:", error);
      toast.error("Failed to remove cash fund");
    }
  };

  const startEditFund = (fund: CashFund) => {
    setEditingFund(fund.id);
    setEditFundName(fund.name);
    setEditFundDescription(fund.description || "");
    setEditFundTarget(fund.target_amount?.toString() || "");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Gifts Section */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-royal" />
            <h2 className="text-xl font-serif font-semibold text-royal">Gifts</h2>
          </div>
          <Dialog open={isAddingGift} onOpenChange={(open) => {
            setIsAddingGift(open);
            if (!open) resetGiftForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="royal" size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Gift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">Add a Gift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* URL Input with Fetch Button */}
                <div className="space-y-2">
                  <Label htmlFor="giftUrl">Product URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                      <Input
                        id="giftUrl"
                        placeholder="https://amazon.in/..."
                        value={giftUrl}
                        onChange={(e) => setGiftUrl(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="gold"
                      onClick={handleFetchProductDetails}
                      disabled={isFetching || !giftUrl.trim()}
                      className="gap-1 shrink-0"
                    >
                      {isFetching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isFetching ? "Fetching..." : "Auto-fill"}
                    </Button>
                  </div>
                  <p className="text-xs text-charcoal-light">
                    Paste a link from Amazon, Flipkart, or any store and click Auto-fill
                  </p>
                </div>

                {/* Auto-extraction notice */}
                {hasFetched && (
                  <div className="flex items-start gap-2 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p className="text-xs text-charcoal-light">
                      Auto-extraction may not always be accurate. Please review and edit the details below if needed.
                    </p>
                  </div>
                )}

                {fetchError && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">
                      {fetchError}. Please enter the details manually.
                    </p>
                  </div>
                )}

                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="giftName">Product Name *</Label>
                  <Input
                    id="giftName"
                    placeholder="e.g., Le Creuset Dutch Oven"
                    value={giftName}
                    onChange={(e) => setGiftName(e.target.value)}
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="giftPrice">Price (₹)</Label>
                  <Input
                    id="giftPrice"
                    type="number"
                    placeholder="5000"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="giftDescription">Description (optional)</Label>
                  <Textarea
                    id="giftDescription"
                    placeholder="Any notes about size, color, or preferences..."
                    value={giftDescription}
                    onChange={(e) => setGiftDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={handleAddGift} 
                  className="w-full" 
                  disabled={isSubmitting || !giftName.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Gift"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gifts List */}
        {gifts.length === 0 ? (
          <div className="text-center py-12 text-charcoal-light">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No gifts added yet</p>
            <p className="text-sm mt-1">Add items from any online store</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gifts.map((gift) => (
              <div 
                key={gift.id} 
                className={`flex items-center gap-4 p-3 rounded-xl border ${
                  gift.is_purchased 
                    ? "bg-success/10 border-success/30" 
                    : "bg-ivory border-gold/10"
                }`}
              >
                {gift.product_image_url ? (
                  <img 
                    src={gift.product_image_url} 
                    alt={gift.product_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-royal/5 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-royal/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal truncate">
                    {gift.product_name}
                  </h3>
                  {gift.price && (
                    <p className="text-sm text-charcoal-light">
                      ₹{gift.price.toLocaleString("en-IN")}
                    </p>
                  )}
                  {gift.is_purchased && (
                    <span className="inline-block text-xs bg-success/20 text-success px-2 py-0.5 rounded-full mt-1">
                      Purchased
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {gift.product_url && (
                    <a 
                      href={gift.product_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-charcoal-light hover:text-royal transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {!gift.is_purchased && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGift(gift.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cash Funds Section */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-serif font-semibold text-royal">Cash Funds</h2>
          </div>
          <Dialog open={isAddingFund} onOpenChange={setIsAddingFund}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Fund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Cash Fund</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="fundName">Fund Name *</Label>
                  <Input
                    id="fundName"
                    placeholder="e.g., Honeymoon Fund"
                    value={fundName}
                    onChange={(e) => setFundName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundDescription">Description</Label>
                  <Textarea
                    id="fundDescription"
                    placeholder="Help us create unforgettable memories..."
                    value={fundDescription}
                    onChange={(e) => setFundDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundTarget">Target Amount (₹) - Optional</Label>
                  <Input
                    id="fundTarget"
                    type="number"
                    placeholder="50000"
                    value={fundTarget}
                    onChange={(e) => setFundTarget(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddFund} 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Cash Fund"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Funds List */}
        {cashFunds.length === 0 ? (
          <div className="text-center py-12 text-charcoal-light">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No cash funds added yet</p>
            <p className="text-sm mt-1">Let guests contribute to your dreams</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cashFunds.map((fund) => (
              <div 
                key={fund.id} 
                className="p-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent"
              >
                {editingFund === fund.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editFundName}
                      onChange={(e) => setEditFundName(e.target.value)}
                      placeholder="Fund name"
                    />
                    <Textarea
                      value={editFundDescription}
                      onChange={(e) => setEditFundDescription(e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                    <Input
                      type="number"
                      value={editFundTarget}
                      onChange={(e) => setEditFundTarget(e.target.value)}
                      placeholder="Target amount"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditFund(fund.id)}>
                        <Check className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingFund(null)}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-royal">{fund.name}</h3>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditFund(fund)}
                          className="text-charcoal-light hover:text-royal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFund(fund.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {fund.description && (
                      <p className="text-sm text-charcoal-light mb-2">
                        {fund.description}
                      </p>
                    )}
                    {fund.target_amount && (
                      <p className="text-sm font-medium text-gold">
                        Target: ₹{fund.target_amount.toLocaleString("en-IN")}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
