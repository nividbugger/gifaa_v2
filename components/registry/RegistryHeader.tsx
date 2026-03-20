"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Camera,
  Calendar,
  MapPin,
  Pencil,
  Check,
  X,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { occasionLabels } from "@/lib/registry-templates";
import VisibilityControls from "./VisibilityControls";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = getSupabaseBrowserClient();
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/types";

type Registry = Database["public"]["Tables"]["registries"]["Row"];
type OccasionType = Database["public"]["Enums"]["occasion_type"];

interface RegistryHeaderProps {
  registry: Registry;
  onUpdate: (updates: Partial<Registry>) => Promise<void>;
  isEditing?: boolean;
}

export default function RegistryHeader({ registry, onUpdate, isEditing = false }: RegistryHeaderProps) {
  const { user } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(registry.title);
  const [eventDate, setEventDate] = useState(registry.event_date || "");
  const [eventLocation, setEventLocation] = useState(registry.event_location || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSave = async () => {
    await onUpdate({ title });
    setIsEditingTitle(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Generate a unique file path: user_id/registry_id/timestamp.ext
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `${user.id}/${registry.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('registry-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('registry-images')
        .getPublicUrl(filePath);

      // Update registry with new image URL
      await onUpdate({ header_image_url: publicUrl });
      toast.success("Registry image updated!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={registry.header_image_url || "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=600&fit=crop"}
          alt={registry.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal/80 via-royal/40 to-transparent" />

        {/* Top Bar: Back + Controls (stacks on mobile to prevent overlap) */}
        {isEditing && (
          <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-20 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <Link
              href="/dashboard"
              className="flex w-fit items-center gap-2 text-white/90 hover:text-white transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
              <span className="text-sm font-medium sm:hidden">Back</span>
            </Link>

            <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3 self-end md:self-auto">
              <VisibilityControls registry={registry} onUpdate={onUpdate} />

              {/* Change Image: icon-only on mobile to avoid crushed layout */}
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 shrink-0 h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                onClick={handleImageClick}
                disabled={isUploading}
                aria-label="Change header image"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin md:mr-2" />
                    <span className="sr-only">Uploading image</span>
                    <span className="hidden md:inline text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 md:mr-2" />
                    <span className="sr-only">Change Image</span>
                    <span className="hidden md:inline text-sm">Change Image</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
          <div className="container mx-auto">
            {/* Occasion Badge */}
            <span className="inline-block px-3 py-1 bg-gold text-royal text-sm font-medium rounded-full mb-3">
              {occasionLabels[registry.occasion as OccasionType]}
            </span>

            {/* Title */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl md:text-4xl font-serif font-bold bg-white/10 border-white/30 text-white placeholder:text-white/50 max-w-lg"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleTitleSave} className="text-white">
                  <Check className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(false)} className="text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl md:text-4xl font-serif font-bold text-white">
                  {registry.title}
                </h1>
                {isEditing && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsEditingTitle(true)}
                    className="text-white/70 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {registry.event_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(registry.event_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
              {registry.event_location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {registry.event_location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings Bar (only in edit mode) */}
      {isEditing && (
        <div className="bg-white border-b border-gold/10 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center gap-6">
              {/* Event Date */}
              <div className="flex items-center gap-2">
                <label htmlFor="eventDate" className="text-sm text-charcoal-light whitespace-nowrap">
                  Event Date
                </label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  onBlur={() => onUpdate({ event_date: eventDate || null })}
                  className="w-40 h-9 text-sm"
                />
              </div>

              {/* Event Location */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
                <label htmlFor="eventLocation" className="text-sm text-charcoal-light whitespace-nowrap">
                  Location
                </label>
                <Input
                  id="eventLocation"
                  placeholder="Add location"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  onBlur={() => onUpdate({ event_location: eventLocation || null })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
