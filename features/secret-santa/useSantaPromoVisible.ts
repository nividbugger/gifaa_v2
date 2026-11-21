"use client";

import { useEffect, useState } from "react";
import { isSantaPromoVisible } from "./config";

/**
 * Whether seasonal Secret Santa entry points should show. Decided after mount so the server render
 * and first client render match (the answer depends on today's date).
 */
export function useSantaPromoVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(isSantaPromoVisible()), []);
  return visible;
}
