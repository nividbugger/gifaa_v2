"use client";

import { useState, useEffect } from "react";
import { Wallet, Copy, Check, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = getSupabaseBrowserClient();
import type { Database } from "@/lib/supabase/types";

type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];

interface CashFundWithTotal extends CashFund {
  totalRaised: number;
}

interface UPIGiftingSectionProps {
  upiId: string;
  cashFunds: CashFund[];
  registryId: string;
}

export default function UPIGiftingSection({ upiId, cashFunds, registryId }: UPIGiftingSectionProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFund, setSelectedFund] = useState<CashFundWithTotal | null>(null);
  const [contributorName, setContributorName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fundsWithTotals, setFundsWithTotals] = useState<CashFundWithTotal[]>([]);

  // Fetch contribution totals for each fund
  useEffect(() => {
    const fetchTotals = async () => {
      if (cashFunds.length === 0) return;
      
      const fundIds = cashFunds.map(f => f.id);
      const { data: contributions } = await supabase
        .from("contributions")
        .select("cash_fund_id, amount")
        .in("cash_fund_id", fundIds);

      const totals = cashFunds.map(fund => {
        const fundContributions = (contributions || []).filter(c => c.cash_fund_id === fund.id);
        const total = fundContributions.reduce((sum, c) => sum + c.amount, 0);
        return { ...fund, totalRaised: total };
      });

      setFundsWithTotals(totals);
    };

    fetchTotals();
  }, [cashFunds]);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      toast.success("UPI ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRecordContribution = async () => {
    if (!selectedFund || !contributorName.trim() || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contributions")
        .insert({
          cash_fund_id: selectedFund.id,
          contributor_name: contributorName.trim(),
          amount: parseFloat(amount),
          message: message.trim() || null,
          is_anonymous: false,
        });

      if (error) throw error;

      setShowConfirmation(true);
      toast.success("Thank you for your generous gift! 💛");
      
      // Reset form
      setContributorName("");
      setAmount("");
      setMessage("");
      setSelectedFund(null);
    } catch (error) {
      console.error("Error recording contribution:", error);
      toast.error("Failed to record your contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!upiId && cashFunds.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-royal/5 to-gold/5 rounded-2xl border border-gold/20 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-royal">
              Gift via UPI
            </h2>
            <p className="text-charcoal-light text-sm">
              Send your blessings directly
            </p>
          </div>
        </div>

        {/* UPI ID Display */}
        {upiId && (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gold/10">
            <p className="text-sm text-charcoal-light mb-2">Send to:</p>
            <div className="flex items-center justify-between gap-4">
              <code className="text-lg font-mono font-semibold text-royal flex-1 break-all">
                {upiId}
              </code>
              <Button 
                variant="gold-outline" 
                size="sm"
                onClick={handleCopyUPI}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-charcoal-light mt-3">
              Open your UPI app (Google Pay, PhonePe, Paytm) and send your gift amount to this UPI ID.
            </p>
          </div>
        )}

        {/* Cash Funds */}
        {fundsWithTotals.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-charcoal">Choose a fund to contribute to:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fundsWithTotals.map((fund) => {
                const hasTarget = fund.target_amount && fund.target_amount > 0;
                const percentage = hasTarget 
                  ? Math.min(100, Math.round((fund.totalRaised / fund.target_amount!) * 100))
                  : 0;
                
                return (
                  <button
                    key={fund.id}
                    onClick={() => setSelectedFund(fund)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedFund?.id === fund.id
                        ? 'border-gold bg-gold/5'
                        : 'border-transparent bg-white hover:border-gold/30'
                    }`}
                  >
                    <h4 className="font-semibold text-royal mb-1">{fund.name}</h4>
                    {fund.description && (
                      <p className="text-sm text-charcoal-light mb-2 line-clamp-2">
                        {fund.description}
                      </p>
                    )}
                    {hasTarget && (
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-charcoal-light">
                            {formatPrice(fund.totalRaised)} raised
                          </span>
                          <span className="font-medium text-gold">
                            {formatPrice(fund.target_amount!)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2 bg-gold/10" />
                        <p className="text-xs text-charcoal-light">
                          {formatPrice(fund.totalRaised)} of {formatPrice(fund.target_amount!)} raised 💛
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Contribution Form */}
        {selectedFund && !showConfirmation && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-gold/10 space-y-4 animate-fade-up">
            <h4 className="font-medium text-charcoal">
              Contributing to: <span className="text-royal">{selectedFund.name}</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contributorName">Your Name *</Label>
                <Input
                  id="contributorName"
                  placeholder="Enter your name"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Write a heartfelt message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedFund(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="royal"
                onClick={handleRecordContribution}
                disabled={isSubmitting || !contributorName.trim() || !amount}
                className="flex-1"
              >
                {isSubmitting ? (
                  "Recording..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Record My Gift
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-charcoal-light text-center">
              After sending via UPI, record your gift here so the couple knows to thank you!
            </p>
          </div>
        )}

        {/* Confirmation */}
        {showConfirmation && (
          <div className="mt-6 p-6 bg-white rounded-xl border border-gold/20 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-success" />
            </div>
            <p className="text-charcoal mb-4">
              Your contribution to the cash fund has been recorded. Appreciate it!
            </p>
            <Button 
              variant="gold-outline" 
              onClick={() => setShowConfirmation(false)}
            >
              Gift Again
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
