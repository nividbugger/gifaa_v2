"use client";

import { Gift, Heart, Calendar, User } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type GiftType = Database["public"]["Tables"]["registry_gifts"]["Row"];
type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];
type Contribution = Database["public"]["Tables"]["contributions"]["Row"];

interface ManageContributionsTabProps {
  gifts: GiftType[];
  cashFunds: CashFund[];
  contributions: Contribution[];
}

export default function ManageContributionsTab({ 
  gifts, 
  cashFunds,
  contributions 
}: ManageContributionsTabProps) {
  const purchasedGifts = gifts.filter(g => g.is_purchased);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get fund name by ID
  const getFundName = (fundId: string) => {
    const fund = cashFunds.find(f => f.id === fundId);
    return fund?.name || "Unknown Fund";
  };

  // Calculate total contributions per fund
  const contributionsByFund = cashFunds.map(fund => {
    const fundContributions = contributions.filter(c => c.cash_fund_id === fund.id);
    const total = fundContributions.reduce((sum, c) => sum + Number(c.amount), 0);
    return {
      fund,
      contributions: fundContributions,
      total,
    };
  });

  const hasAnyContributions = purchasedGifts.length > 0 || contributions.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {!hasAnyContributions ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gold/10">
          <Heart className="w-16 h-16 mx-auto text-gold/30 mb-4" />
          <h2 className="text-2xl font-serif font-semibold text-royal mb-2">
            No Contributions Yet
          </h2>
          <p className="text-charcoal-light">
            Share your registry with friends and family to start receiving gifts
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Purchased Gifts Section */}
          {purchasedGifts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gold/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Gift className="w-5 h-5 text-success" />
                <h2 className="text-xl font-serif font-semibold text-royal">
                  Purchased Gifts ({purchasedGifts.length})
                </h2>
              </div>

              <div className="space-y-4">
                {purchasedGifts.map((gift) => (
                  <div 
                    key={gift.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-success/10 border border-success/20"
                  >
                    {gift.product_image_url ? (
                      <img 
                        src={gift.product_image_url} 
                        alt={gift.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-success/10 rounded-lg flex items-center justify-center">
                        <Gift className="w-8 h-8 text-success" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal mb-1">
                        {gift.product_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-charcoal-light">
                        {gift.purchased_by_name && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {gift.purchased_by_name}
                          </div>
                        )}
                        {gift.purchased_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(gift.purchased_at)}
                          </div>
                        )}
                      </div>
                      {gift.purchase_message && (
                        <p className="mt-2 text-sm italic text-charcoal-light bg-white/50 p-2 rounded-lg">
                          "{gift.purchase_message}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {gift.price && (
                        <p className="font-semibold text-success">
                          ₹{gift.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cash Contributions Section */}
          {contributionsByFund.some(f => f.contributions.length > 0) && (
            <div className="bg-white rounded-2xl border border-gold/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-5 h-5 text-gold" />
                <h2 className="text-xl font-serif font-semibold text-royal">
                  Cash Contributions
                </h2>
              </div>

              <div className="space-y-6">
                {contributionsByFund.map(({ fund, contributions: fundContribs, total }) => {
                  if (fundContribs.length === 0) return null;

                  const progress = fund.target_amount 
                    ? Math.min((total / Number(fund.target_amount)) * 100, 100)
                    : null;

                  return (
                    <div key={fund.id} className="border-b border-gold/10 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-royal">{fund.name}</h3>
                        <p className="font-semibold text-gold">
                          ₹{total.toLocaleString("en-IN")}
                          {fund.target_amount && (
                            <span className="text-charcoal-light font-normal">
                              {" "}/ ₹{Number(fund.target_amount).toLocaleString("en-IN")}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      {progress !== null && (
                        <div className="w-full h-2 bg-gold/10 rounded-full mb-4 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}

                      {/* Individual Contributions */}
                      <div className="space-y-2">
                        {fundContribs.map((contrib) => (
                          <div 
                            key={contrib.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gold/5"
                          >
                            <div>
                              <p className="font-medium text-charcoal">
                                {contrib.is_anonymous ? "Anonymous" : contrib.contributor_name}
                              </p>
                              {contrib.message && (
                                <p className="text-sm text-charcoal-light italic">
                                  "{contrib.message}"
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gold">
                                ₹{Number(contrib.amount).toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-charcoal-light">
                                {formatDate(contrib.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
