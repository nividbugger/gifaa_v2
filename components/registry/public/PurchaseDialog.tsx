"use client";

import { useState } from "react";
import { Gift, Loader2, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/supabase/types";

type GiftItem = Database["public"]["Tables"]["registry_gifts"]["Row"];

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift: GiftItem | null;
  onConfirm: (name: string, message: string, isAnonymous: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export default function PurchaseDialog({
  open,
  onOpenChange,
  gift,
  onConfirm,
  isSubmitting,
}: PurchaseDialogProps) {
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleConfirm = async () => {
    await onConfirm(purchaserName, purchaseMessage, isAnonymous);
    // Reset form after successful submission
    setPurchaserName("");
    setPurchaseMessage("");
    setIsAnonymous(false);
  };

  if (!gift) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-royal text-xl">
            You're Gifting This! 🎁
          </DialogTitle>
          <DialogDescription className="text-charcoal-light">
            Let them know you're getting this so no one else does.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 pt-4">
          {/* Selected Gift Preview */}
          <div className="flex items-center gap-4 p-4 bg-ivory rounded-xl border border-gold/10">
            {gift.product_image_url ? (
              <img 
                src={gift.product_image_url} 
                alt={gift.product_name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-gold" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-charcoal line-clamp-2">{gift.product_name}</p>
              {gift.price && (
                <p className="text-sm text-royal font-medium mt-1">
                  {formatPrice(gift.price)}
                </p>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-charcoal">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={purchaserName}
              onChange={(e) => setPurchaserName(e.target.value)}
              className="border-gold/20 focus:border-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-charcoal">
              Personal Message <span className="text-charcoal-light">(optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Add a heartfelt note..."
              value={purchaseMessage}
              onChange={(e) => setPurchaseMessage(e.target.value)}
              rows={3}
              className="border-gold/20 focus:border-gold resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              className="border-gold/50 data-[state=checked]:bg-royal data-[state=checked]:border-royal"
            />
            <Label htmlFor="anonymous" className="text-sm cursor-pointer text-charcoal-light">
              Keep my name as a surprise (show as "Anonymous")
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-gold/20 hover:bg-gold/5"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="royal"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isSubmitting || !purchaserName.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </>
              )}
            </Button>
          </div>

          {/* Redirect Notice */}
          {gift.product_url && (
            <p className="text-xs text-center text-charcoal-light flex items-center justify-center gap-1">
              <ExternalLink className="w-3 h-3" />
              You'll be redirected to purchase after confirming
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
