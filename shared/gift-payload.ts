// Single place that maps "a product the user wants" to a `registry_gifts` row.
// Used by the web Add Gift dialog and the browser extension so both write identical data.

import type { Database } from "../lib/supabase/types";

export type GiftInsert = Database["public"]["Tables"]["registry_gifts"]["Insert"];

export interface GiftFormValues {
  name: string;
  url?: string | null;
  /** Price as typed by the user (string) or extracted from a page (number). */
  price?: string | number | null;
  notes?: string | null;
  imageUrl?: string | null;
}

export function parsePrice(price: GiftFormValues["price"]): number | null {
  if (price === null || price === undefined || price === "") return null;
  const value = typeof price === "number" ? price : parseFloat(price);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function buildGiftInsert(registryId: string, values: GiftFormValues): GiftInsert {
  return {
    registry_id: registryId,
    product_name: values.name.trim(),
    product_url: values.url?.trim() || null,
    price: parsePrice(values.price),
    notes: values.notes?.trim() || null,
    product_image_url: values.imageUrl || null,
  };
}
