"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Lock, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail,
  X
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];

interface VisibilityControlsProps {
  registry: Registry;
  onUpdate: (updates: Partial<Registry>) => Promise<void>;
}

export default function VisibilityControls({ registry, onUpdate }: VisibilityControlsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const registryUrl = `${window.location.origin}/registry/${registry.share_token}`;
  
  const defaultMessage = `Hey! I've created a gift registry for ${registry.title}. Check it out and feel free to pick something special: ${registryUrl}`;
  const [shareMessage, setShareMessage] = useState(defaultMessage);

  const handleVisibilityToggle = async () => {
    await onUpdate({ is_public: !registry.is_public });
    toast.success(registry.is_public ? "Registry is now private" : "Registry is now public");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(registryUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Gift Registry: ${registry.title}`);
    const body = encodeURIComponent(shareMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3">
      {/* Visibility Toggle */}
      <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-ivory border border-gold/20">
        {registry.is_public ? (
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />
        ) : (
          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-charcoal-light" />
        )}
        <Label 
          htmlFor="visibility-toggle" 
          className="text-xs md:text-sm font-medium text-charcoal cursor-pointer"
        >
          {registry.is_public ? "Public" : "Private"}
        </Label>
        <Switch
          id="visibility-toggle"
          checked={registry.is_public}
          onCheckedChange={handleVisibilityToggle}
          className="ml-0.5 md:ml-1 data-[state=checked]:bg-success scale-90 md:scale-100"
        />
      </div>

      {/* Share Button */}
      <Button
        variant="gold"
        size="sm"
        className="gap-1 md:gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-3"
        onClick={() => setIsShareOpen(true)}
      >
        <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        Share
      </Button>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg sm:text-xl">Share Your Registry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
            {/* Registry Link */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-charcoal">Registry Link</Label>
              <div className="flex gap-2">
                <div className="flex-1 px-2 sm:px-3 py-2 bg-ivory rounded-lg border border-gold/20 text-xs sm:text-sm font-mono text-charcoal-light overflow-x-auto whitespace-nowrap">
                  {registryUrl}
                </div>
                <Button
                  variant="royal"
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0 h-9 w-9 p-0 sm:h-9 sm:w-auto sm:px-3"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-charcoal">Your Message</Label>
              <Textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
                className="text-xs sm:text-sm"
                placeholder="Write a personal message to share..."
              />
              <p className="text-[10px] sm:text-xs text-charcoal-light">
                This message will be included when sharing via WhatsApp or Email
              </p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                className="gap-1.5 sm:gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs sm:text-sm h-9 sm:h-10"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="gap-1.5 sm:gap-2 border-royal/20 hover:bg-royal/5 text-royal text-xs sm:text-sm h-9 sm:h-10"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Email
              </Button>
            </div>

            {/* Privacy Note */}
            <div className="p-2.5 sm:p-3 bg-ivory rounded-lg border border-gold/10">
              <p className="text-[10px] sm:text-xs text-charcoal-light leading-relaxed">
                {registry.is_public ? (
                  <>
                    <Globe className="w-3 h-3 inline mr-1 text-success" />
                    Your registry is <span className="font-medium text-success">public</span> and can be found via search.
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 inline mr-1" />
                    Your registry is <span className="font-medium">private</span> and only accessible via this link.
                  </>
                )}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
