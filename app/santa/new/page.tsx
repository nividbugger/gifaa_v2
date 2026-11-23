"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CreateFlow from "@/features/secret-santa/components/create/CreateFlow";
import SantaShell from "@/features/secret-santa/components/SantaShell";

export default function NewSantaGroupPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?redirect=%2Fsanta%2Fnew");
  }, [user, authLoading, router]);

  return (
    <SantaShell bare>
      <div className="container mx-auto max-w-5xl px-5 pb-20 pt-28">
        {user ? (
          <CreateFlow userId={user.id} hostName={profile?.display_name} />
        ) : (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-royal" /></div>
        )}
      </div>
    </SantaShell>
  );
}
