"use client";

import { useState, useEffect } from "react";
import { Wallet, Heart, Send, ArrowLeft, CheckCircle2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = getSupabaseBrowserClient();
import type { Database } from "@/lib/supabase/types";
import UPIQRDisplay from "@/components/registry/UPIQRDisplay";

type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];

interface CashFundWithTotal extends CashFund {
  totalRaised: number;
}

interface UPIGiftingSectionProps {
  upiId: string;
  qrUrl?: string;
  cashFunds: CashFund[];
  registryId: string;
}

type Step = "select" | "details" | "pay";

// Step indicator pill
function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ["select", "details", "pay"];
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s === step ? "w-6 bg-gold" : steps.indexOf(step) > i ? "w-3 bg-gold/40" : "w-3 bg-gold/15"
          }`}
        />
      ))}
    </div>
  );
}

export default function UPIGiftingSection({ upiId, qrUrl, cashFunds, registryId }: UPIGiftingSectionProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedFund, setSelectedFund] = useState<CashFundWithTotal | null>(null);
  const [contributorName, setContributorName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundsWithTotals, setFundsWithTotals] = useState<CashFundWithTotal[]>([]);

  useEffect(() => {
    const fetchTotals = async () => {
      if (cashFunds.length === 0) return;
      const fundIds = cashFunds.map(f => f.id);
      const { data: contributions } = await supabase
        .from("contributions")
        .select("cash_fund_id, amount")
        .in("cash_fund_id", fundIds);
      const totals = cashFunds.map(fund => {
        const fundContribs = (contributions || []).filter(c => c.cash_fund_id === fund.id);
        return { ...fund, totalRaised: fundContribs.reduce((sum, c) => sum + c.amount, 0) };
      });
      setFundsWithTotals(totals);
    };
    fetchTotals();
  }, [cashFunds]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const handleSelectFund = (fund: CashFundWithTotal) => {
    setSelectedFund(fund);
    setStep("details");
  };

  const handleRecordContribution = async () => {
    if (!selectedFund || !contributorName.trim() || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contributions").insert({
        cash_fund_id: selectedFund.id,
        registry_id: registryId,
        contributor_name: contributorName.trim(),
        amount: parseFloat(amount),
        message: message.trim() || null,
      });
      if (error) throw error;
      setStep("pay");
    } catch (error) {
      console.error("Error recording contribution:", error);
      toast.error("Failed to record your contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGiftAgain = () => {
    setStep("select");
    setSelectedFund(null);
    setContributorName("");
    setAmount("");
    setMessage("");
  };

  if (!upiId && cashFunds.length === 0) return null;

  // No cash funds — just show UPI payment details directly
  if (cashFunds.length === 0) {
    return (
      <section className="mb-12">
        <div className="bg-gradient-to-br from-royal/5 to-gold/5 rounded-2xl border border-gold/20 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-royal">Gift via UPI</h2>
              <p className="text-charcoal-light text-sm">Send your blessings directly</p>
            </div>
          </div>
          <UPIPaymentPanel upiId={upiId} qrUrl={qrUrl} amount="" />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-royal/5 to-gold/5 rounded-2xl border border-gold/20 p-6 md:p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-royal">Gift via UPI</h2>
            <p className="text-charcoal-light text-sm">Send your blessings directly</p>
          </div>
        </div>

        <StepDots step={step} />

        {/* ── Step 1: Choose a fund ── */}
        {step === "select" && (
          <div className="animate-fade-up">
            <p className="text-xs font-medium text-charcoal-light uppercase tracking-widest mb-1">Step 1 of 3</p>
            <h3 className="text-lg font-serif font-semibold text-royal mb-4">Which fund would you like to contribute to?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fundsWithTotals.map((fund) => {
                const hasTarget = fund.target_amount && fund.target_amount > 0;
                const percentage = hasTarget
                  ? Math.min(100, Math.round((fund.totalRaised / fund.target_amount!) * 100))
                  : 0;
                return (
                  <button
                    key={fund.id}
                    onClick={() => handleSelectFund(fund)}
                    className="text-left p-4 rounded-xl border-2 border-transparent bg-white hover:border-gold/40 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-royal group-hover:text-gold transition-colors">{fund.name}</h4>
                      <span className="text-gold text-lg shrink-0">→</span>
                    </div>
                    {fund.description && (
                      <p className="text-sm text-charcoal-light mb-2 line-clamp-2">{fund.description}</p>
                    )}
                    {hasTarget && (
                      <div className="space-y-1.5 mt-3">
                        <Progress value={percentage} className="h-1.5 bg-gold/10" />
                        <p className="text-xs text-charcoal-light">
                          {formatPrice(fund.totalRaised)} of {formatPrice(fund.target_amount!)} raised
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Your details ── */}
        {step === "details" && selectedFund && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1.5 text-sm text-charcoal-light hover:text-royal transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-xs font-medium text-charcoal-light uppercase tracking-widest mb-1">Step 2 of 3</p>
            <h3 className="text-lg font-serif font-semibold text-royal mb-1">Tell us about your gift</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 rounded-full mb-5">
              <Heart className="w-3 h-3 text-gold" />
              <span className="text-xs font-medium text-gold">{selectedFund.name}</span>
            </div>

            <div className="bg-white rounded-xl border border-gold/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contributorName">Your Name *</Label>
                  <Input
                    id="contributorName"
                    placeholder="Enter your name"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Gift Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">A personal message <span className="text-charcoal-light font-normal">(optional)</span></Label>
                <Textarea
                  id="message"
                  placeholder="Write something heartfelt..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                variant="royal"
                onClick={handleRecordContribution}
                disabled={isSubmitting || !contributorName.trim() || !amount}
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  "Saving your gift..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Record My Gift — Then Pay
                  </>
                )}
              </Button>
              <p className="text-xs text-charcoal-light/70 text-center">
                We&apos;ll save your gift details first, then show you how to send the payment.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3: Gift recorded → now pay ── */}
        {step === "pay" && selectedFund && (
          <div className="animate-fade-up space-y-5">
            {/* Celebration banner */}
            <div className="bg-white rounded-xl border border-gold/20 p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-gold" />
              </div>
              <p className="text-xs font-medium text-charcoal-light uppercase tracking-widest mb-1">Step 3 of 3</p>
              <h3 className="text-lg font-serif font-semibold text-royal mb-1">Gift recorded! 💛</h3>
              <p className="text-sm text-charcoal-light">
                <span className="font-medium text-charcoal">{contributorName}</span>, your{" "}
                <span className="font-medium text-charcoal">{formatPrice(parseFloat(amount))}</span> gift towards{" "}
                <span className="font-medium text-charcoal">{selectedFund.name}</span> has been saved.
              </p>
            </div>

            {/* UPI payment panel — revealed as reward */}
            <div className="bg-white rounded-xl border border-gold/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-4 h-4 text-gold" />
                <p className="text-sm font-semibold text-charcoal">Now send the payment via UPI</p>
              </div>
              <UPIPaymentPanel upiId={upiId} qrUrl={qrUrl} amount={amount} />
            </div>

            <div className="text-center">
              <Button variant="gold-outline" size="sm" onClick={handleGiftAgain}>
                Gift to another fund
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Reusable UPI payment display with QR + steps
function UPIPaymentPanel({ upiId, qrUrl, amount }: { upiId: string; qrUrl?: string; amount: string }) {
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&cu=INR${amount ? `&am=${amount}` : ""}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {qrUrl ? (
        <UPIQRDisplay upiId={upiId} qrUrl={qrUrl} />
      ) : (
        <div className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-gold/20 bg-gold/[0.02]">
          <p className="text-xs text-charcoal-light tracking-wide uppercase mb-1">Tap to open UPI app</p>
          <a
            href={upiLink}
            className="font-mono text-base font-semibold text-royal hover:text-gold transition-colors hover:underline underline-offset-4"
          >
            {upiId}
          </a>
        </div>
      )}

      <ol className="flex-1 space-y-3 text-sm text-charcoal-light list-none">
        <li className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-xs flex items-center justify-center font-semibold shrink-0">1</span>
          Open Google Pay, PhonePe, or Paytm
        </li>
        <li className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-xs flex items-center justify-center font-semibold shrink-0">2</span>
          {qrUrl ? "Scan the QR code or tap the UPI ID" : "Tap the UPI ID above to open your app"}
        </li>
        <li className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-xs flex items-center justify-center font-semibold shrink-0">3</span>
          {amount ? (
            <>Send exactly <span className="font-semibold text-charcoal mx-1">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(parseFloat(amount))}</span> and confirm</>
          ) : (
            "Enter your gift amount and send"
          )}
        </li>
      </ol>
    </div>
  );
}
