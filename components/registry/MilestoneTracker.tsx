import { Progress } from "@/components/ui/progress";
import { Gift, Wallet, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GiftMilestoneProps {
  totalGifts: number;
  purchasedGifts: number;
  variant?: "card" | "inline";
  showLabel?: boolean;
}

export function GiftMilestoneTracker({ 
  totalGifts, 
  purchasedGifts, 
  variant = "card",
  showLabel = true 
}: GiftMilestoneProps) {
  if (totalGifts === 0) return null;
  
  const percentage = Math.round((purchasedGifts / totalGifts) * 100);
  const isComplete = percentage === 100;
  const isAlmostThere = percentage >= 75 && percentage < 100;
  
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3">
        <Progress 
          value={percentage} 
          className="h-2 flex-1 bg-royal/10"
        />
        <span className="text-sm font-medium text-charcoal-light whitespace-nowrap">
          {purchasedGifts}/{totalGifts}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-ivory/50 rounded-xl border border-gold/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-royal/10 flex items-center justify-center">
            <Gift className="w-4 h-4 text-royal" />
          </div>
          {showLabel && (
            <span className="text-sm font-medium text-charcoal">Gift Progress</span>
          )}
        </div>
        <span className="text-sm font-semibold text-royal">
          {purchasedGifts} of {totalGifts}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2.5 bg-royal/10"
      />
      
      {isComplete && (
        <p className="text-xs text-success mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          All gifts purchased! 🎉
        </p>
      )}
      {isAlmostThere && (
        <p className="text-xs text-gold mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Almost there ✨
        </p>
      )}
    </div>
  );
}

interface CashFundMilestoneProps {
  fundName: string;
  currentAmount: number;
  targetAmount: number | null;
  variant?: "card" | "compact";
  showFundName?: boolean;
}

export function CashFundMilestoneTracker({ 
  fundName,
  currentAmount, 
  targetAmount, 
  variant = "card",
  showFundName = true
}: CashFundMilestoneProps) {
  // Only show milestone if target amount is set
  if (!targetAmount || targetAmount <= 0) return null;
  
  const percentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  const isComplete = currentAmount >= targetAmount;
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-charcoal-light">
            {formatCurrency(currentAmount)} raised
          </span>
          <span className="font-medium text-royal">
            {formatCurrency(targetAmount)}
          </span>
        </div>
        <Progress 
          value={percentage} 
          className="h-2 bg-gold/10"
        />
        {isComplete && (
          <p className="text-xs text-success flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Goal reached! 💛
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gold/5 to-transparent rounded-xl border border-gold/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-gold" />
          </div>
          {showFundName && (
            <span className="text-sm font-medium text-charcoal truncate max-w-[150px]">
              {fundName}
            </span>
          )}
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          isComplete 
            ? "bg-success/10 text-success" 
            : "bg-gold/10 text-gold"
        )}>
          {percentage}%
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2.5 bg-gold/10"
      />
      
      <p className="text-sm mt-3 text-charcoal-light">
        {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)} raised 💛
      </p>
      
      {isComplete && (
        <p className="text-xs text-success mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Goal reached! Thank you!
        </p>
      )}
    </div>
  );
}

// Combined milestone summary for dashboard cards
interface MilestoneSummaryProps {
  totalGifts: number;
  purchasedGifts: number;
}

export function MilestoneSummary({ totalGifts, purchasedGifts }: MilestoneSummaryProps) {
  if (totalGifts === 0) return null;
  
  const percentage = Math.round((purchasedGifts / totalGifts) * 100);
  
  return (
    <div className="mt-3 pt-3 border-t border-gold/10">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-charcoal-light flex items-center gap-1">
          <Gift className="w-3 h-3" />
          Gifting Progress
        </span>
        <span className="font-medium text-royal">{purchasedGifts}/{totalGifts}</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-1.5 bg-royal/10"
      />
    </div>
  );
}
