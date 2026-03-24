"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Check,
  CreditCard,
  MapPin,
  Link as LinkIcon,
  Heart,
  Save,
  Trash2,
  AlertTriangle,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = getSupabaseBrowserClient();
import type { Database } from "@/lib/supabase/types";
import UPIQRDisplay from "./UPIQRDisplay";

type Registry = Database["public"]["Tables"]["registries"]["Row"];

interface DetailsTabProps {
  registry: Registry;
  onUpdate: (updates: Partial<Registry>) => Promise<void>;
}

export default function DetailsTab({ registry, onUpdate }: DetailsTabProps) {
  const router = useRouter();
  const [upiId, setUpiId] = useState(registry.upi_id || "");
  const [shippingAddress, setShippingAddress] = useState(registry.shipping_address || "");
  const [thankYouNote, setThankYouNote] = useState(registry.thank_you_note || "");
  const [qrUrl, setQrUrl] = useState<string | null>(registry.upi_qr_url ?? null);
  const [isUploadingQR, setIsUploadingQR] = useState(false);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingQR(true);
    try {
      const filePath = `upi-qr/${registry.id}`;
      const { error: uploadError } = await supabase.storage
        .from("registry-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("registry-images")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("registries")
        .update({ upi_qr_url: publicUrl })
        .eq("id", registry.id);

      if (dbError) throw dbError;

      setQrUrl(publicUrl);
      toast.success("QR code uploaded!");
    } catch (err) {
      console.error("QR upload error:", err);
      toast.error("Failed to upload QR code");
    } finally {
      setIsUploadingQR(false);
      if (qrInputRef.current) qrInputRef.current.value = "";
    }
  };

  const handleRemoveQR = async () => {
    try {
      await supabase.storage.from("registry-images").remove([`upi-qr/${registry.id}`]);

      const { error: dbError } = await supabase
        .from("registries")
        .update({ upi_qr_url: null })
        .eq("id", registry.id);

      if (dbError) throw dbError;

      setQrUrl(null);
      toast.success("QR code removed");
    } catch (err) {
      console.error("QR remove error:", err);
      toast.error("Failed to remove QR code");
    }
  };

  const handleDeleteRegistry = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("registries")
        .delete()
        .eq("id", registry.id);

      if (error) throw error;

      toast.success("Registry deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting registry:", error);
      toast.error("Failed to delete registry");
    } finally {
      setIsDeleting(false);
    }
  };

  const registryUrl = `${window.location.origin}/registry/${registry.share_token}`;

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpiSave = () => {
    onUpdate({ upi_id: upiId.trim() || null });
  };

  const handleAddressSave = () => {
    onUpdate({ shipping_address: shippingAddress.trim() || null });
  };

  const handleThankYouSave = () => {
    onUpdate({ thank_you_note: thankYouNote.trim() || null });
  };

  const hasChanges =
    (upiId.trim() || "") !== (registry.upi_id || "") ||
    (shippingAddress.trim() || "") !== (registry.shipping_address || "") ||
    (thankYouNote.trim() || "") !== (registry.thank_you_note || "");

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onUpdate({
        upi_id: upiId.trim() || null,
        shipping_address: shippingAddress.trim() || null,
        thank_you_note: thankYouNote.trim() || null,
      });
      toast.success("All changes saved!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Registry URL */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-5 h-5 text-royal" />
          <h2 className="text-lg font-serif font-semibold text-royal">Registry Link</h2>
        </div>
        <p className="text-sm text-charcoal-light mb-3">
          Share this link with your guests so they can view and contribute to your registry
        </p>
        <div className="flex items-center gap-2">
          <Input
            value={registryUrl}
            readOnly
            className="bg-ivory text-charcoal font-mono text-sm"
          />
          <Button
            variant="royal"
            size="sm"
            onClick={() => handleCopy(registryUrl, "url")}
            className="shrink-0"
          >
            {copiedField === "url" ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* UPI ID */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-serif font-semibold text-royal">UPI Payment</h2>
        </div>
        <p className="text-sm text-charcoal-light mb-3">
          Add your UPI ID and optionally upload your QR code so guests can pay easily
        </p>

        {/* UPI ID input */}
        <div className="flex items-center gap-2 mb-6">
          <Input
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            onBlur={handleUpiSave}
          />
          {registry.upi_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(registry.upi_id!, "upi")}
              className="shrink-0"
            >
              {copiedField === "upi" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* QR code upload */}
        <div className="border-t border-gold/10 pt-5">
          <Label className="text-sm font-medium text-charcoal mb-3 block">
            UPI QR Code <span className="text-charcoal-light font-normal">(optional)</span>
          </Label>

          {qrUrl ? (
            /* QR preview + remove */
            <div className="flex items-start gap-4">
              <UPIQRDisplay upiId={upiId || registry.upi_id || ""} qrUrl={qrUrl} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveQR}
                className="shrink-0 mt-1 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            /* Upload prompt */
            <div
              className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gold/20 bg-gold/[0.02] cursor-pointer hover:border-gold/40 hover:bg-gold/[0.04] transition-colors"
              onClick={() => qrInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-charcoal-light" />
              <p className="text-sm text-charcoal-light text-center">
                Upload your UPI QR code image from your bank app
              </p>
              <p className="text-xs text-charcoal-light/60">PNG, JPG up to 5MB</p>
            </div>
          )}

          <input
            ref={qrInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleQRUpload}
            disabled={isUploadingQR}
          />
          {isUploadingQR && (
            <p className="text-sm text-charcoal-light mt-2 text-center animate-pulse">
              Uploading QR code…
            </p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-royal" />
          <h2 className="text-lg font-serif font-semibold text-royal">Shipping Address</h2>
        </div>
        <p className="text-sm text-charcoal-light mb-3">
          Add your address so guests know where to send physical gifts
        </p>
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your complete shipping address..."
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            onBlur={handleAddressSave}
            rows={3}
          />
          {registry.shipping_address && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(registry.shipping_address!, "address")}
              className="gap-1"
            >
              {copiedField === "address" ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Address
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Thank You Note */}
      <div className="bg-white rounded-2xl border border-gold/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-serif font-semibold text-royal">Thank You Note</h2>
        </div>
        <p className="text-sm text-charcoal-light mb-3">
          This message will be shown to guests after they make a contribution
        </p>
        <Textarea
          placeholder="Thank you for your love and generosity..."
          value={thankYouNote}
          onChange={(e) => setThankYouNote(e.target.value)}
          onBlur={handleThankYouSave}
          rows={3}
        />
      </div>

      {/* Save All Button */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          variant="royal"
          size="lg"
          onClick={handleSaveAll}
          disabled={!hasChanges || isSaving}
          className="gap-2 shadow-elevated"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Delete Registry */}
      <div className="bg-white rounded-2xl border border-destructive/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-serif font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-charcoal-light mb-4">
          Permanently delete this registry along with all its gifts, cash funds, and contributions. This action cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Registry
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>"{registry.title}"</strong> and all associated gifts, cash funds, and contributions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRegistry}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Yes, delete registry"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
