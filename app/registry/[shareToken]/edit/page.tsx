"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GiftsAndFundsTab from "@/components/registry/GiftsAndFundsTab";
import ManageContributionsTab from "@/components/registry/ManageContributionsTab";
import DetailsTab from "@/components/registry/DetailsTab";
import RegistryHeader from "@/components/registry/RegistryHeader";
import { GiftMilestoneTracker, CashFundMilestoneTracker } from "@/components/registry/MilestoneTracker";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];
type Gift = Database["public"]["Tables"]["registry_gifts"]["Row"];
type CashFund = Database["public"]["Tables"]["cash_funds"]["Row"];
type Contribution = Database["public"]["Tables"]["contributions"]["Row"];

interface CashFundWithContributions extends CashFund {
  totalContributions: number;
}

const supabase = getSupabaseBrowserClient();

export default function EditRegistryPage() {
  const params = useParams<{ shareToken: string }>();
  const shareToken = params.shareToken;
  const { user } = useAuth();
  const router = useRouter();

  const [registry, setRegistry] = useState<Registry | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [cashFunds, setCashFunds] = useState<CashFund[]>([]);
  const [cashFundsWithContributions, setCashFundsWithContributions] = useState<CashFundWithContributions[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gifts");

  useEffect(() => {
    const fetchRegistryData = async () => {
      if (!shareToken || !user) return;

      try {
        const { data: registryData, error: registryError } = await supabase
          .from("registries")
          .select("*")
          .eq("share_token", shareToken)
          .single();

        if (registryError) throw registryError;

        if (registryData.user_id !== user.id) {
          toast.error("You don't have permission to edit this registry");
          router.push("/dashboard");
          return;
        }

        setRegistry(registryData);

        const [giftsResult, fundsResult] = await Promise.all([
          supabase
            .from("registry_gifts")
            .select("*")
            .eq("registry_id", registryData.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("cash_funds")
            .select("*")
            .eq("registry_id", registryData.id)
            .order("created_at", { ascending: true }),
        ]);

        setGifts(giftsResult.data || []);
        setCashFunds(fundsResult.data || []);

        if (fundsResult.data && fundsResult.data.length > 0) {
          const fundIds = fundsResult.data.map((f) => f.id);
          const { data: contribData } = await supabase
            .from("contributions")
            .select("*")
            .in("cash_fund_id", fundIds)
            .order("created_at", { ascending: false });

          setContributions(contribData || []);

          const fundsWithTotals = (fundsResult.data || []).map((fund) => {
            const fundContributions = (contribData || []).filter((c) => c.cash_fund_id === fund.id);
            const total = fundContributions.reduce((sum, c) => sum + c.amount, 0);
            return { ...fund, totalContributions: total };
          });
          setCashFundsWithContributions(fundsWithTotals);
        } else {
          setCashFundsWithContributions([]);
        }
      } catch (error) {
        console.error("Error fetching registry:", error);
        toast.error("Failed to load registry");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistryData();
  }, [shareToken, user, router]);

  const handleRegistryUpdate = async (updates: Partial<Registry>) => {
    if (!registry) return;

    const { error } = await supabase
      .from("registries")
      .update(updates)
      .eq("id", registry.id);

    if (error) {
      toast.error("Failed to update registry");
      return;
    }

    setRegistry({ ...registry, ...updates });
    toast.success("Registry updated!");
  };

  const refreshGifts = async () => {
    if (!registry) return;
    const { data } = await supabase
      .from("registry_gifts")
      .select("*")
      .eq("registry_id", registry.id)
      .order("created_at", { ascending: false });
    setGifts(data || []);
  };

  const refreshFunds = async () => {
    if (!registry) return;
    const { data } = await supabase
      .from("cash_funds")
      .select("*")
      .eq("registry_id", registry.id)
      .order("created_at", { ascending: true });
    setCashFunds(data || []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-royal" />
      </div>
    );
  }

  if (!registry) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-charcoal-light">Registry not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <RegistryHeader
          registry={registry}
          onUpdate={handleRegistryUpdate}
          isEditing={true}
        />

        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <GiftMilestoneTracker
              totalGifts={gifts.length}
              purchasedGifts={gifts.filter((g) => g.is_purchased).length}
            />
            {cashFundsWithContributions
              .filter((fund) => fund.target_amount && fund.target_amount > 0)
              .slice(0, 2)
              .map((fund) => (
                <CashFundMilestoneTracker
                  key={fund.id}
                  fundName={fund.name}
                  currentAmount={fund.totalContributions}
                  targetAmount={fund.target_amount}
                />
              ))}
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="gifts" className="text-sm md:text-base">
                Gifts &amp; Funds
              </TabsTrigger>
              <TabsTrigger value="manage" className="text-sm md:text-base">
                Contributions
              </TabsTrigger>
              <TabsTrigger value="details" className="text-sm md:text-base">
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gifts">
              <GiftsAndFundsTab
                registryId={registry.id}
                gifts={gifts}
                cashFunds={cashFunds}
                onGiftsChange={refreshGifts}
                onFundsChange={refreshFunds}
              />
            </TabsContent>

            <TabsContent value="manage">
              <ManageContributionsTab
                gifts={gifts}
                cashFunds={cashFunds}
                contributions={contributions}
              />
            </TabsContent>

            <TabsContent value="details">
              <DetailsTab registry={registry} onUpdate={handleRegistryUpdate} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
