import { useCallback, useEffect, useState } from "react";
import { addGift, listRegistries, ApiError, type RegistrySummary } from "@/core/api";
import { getSessionState, type SessionState } from "@/core/session-source";
import { readActiveTabProduct, scrapeMissing } from "@/core/page-product";
import { lastRegistryId } from "@/core/storage";

export type SessionView = SessionState | { status: "loading" } | { status: "refreshing" };

/** Resolves the website session, transparently asking the site to refresh an expired token once. */
export function useSession() {
  const [view, setView] = useState<SessionView>({ status: "loading" });

  const load = useCallback(async () => {
    setView({ status: "loading" });
    let state = await getSessionState();
    if (state.status === "expired") {
      setView({ status: "refreshing" });
      state = (await browser.runtime.sendMessage({ type: "refresh-session" })) as SessionState;
    }
    setView(state);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { view, reload: load };
}

export function useRegistries(view: SessionView) {
  const [registries, setRegistries] = useState<RegistrySummary[] | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (view.status !== "signed-in") return;
    (async () => {
      try {
        const [list, last] = await Promise.all([listRegistries(view.session), lastRegistryId.getValue()]);
        setRegistries(list);
        setSelectedId(list.find((r) => r.id === last)?.id ?? list[0]?.id ?? "");
      } catch (e) {
        setError(e instanceof ApiError && e.isAuthError ? "Your session expired. Please reconnect." : "Couldn't load your registries.");
      }
    })();
  }, [view]);

  const select = (id: string) => {
    setSelectedId(id);
    lastRegistryId.setValue(id);
  };

  return { registries, selectedId, select, error };
}

export interface FormState {
  name: string;
  price: string;
  notes: string;
  imageUrl: string;
  url: string;
}

const EMPTY_FORM: FormState = { name: "", price: "", notes: "", imageUrl: "", url: "" };

/** Prefills the form from the active tab, then fills any blanks from the server scraper without clobbering user edits. */
export function useProductForm(enabled: boolean) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isReading, setIsReading] = useState(true);
  const [isFillingGaps, setIsFillingGaps] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      const product = await readActiveTabProduct();
      if (cancelled) return;
      setForm({
        name: product.title ?? "",
        price: product.price?.toString() ?? "",
        notes: "",
        imageUrl: product.image ?? "",
        url: product.url ?? "",
      });
      setIsReading(false);

      if (product.url && (!product.title || !product.price || !product.image)) {
        setIsFillingGaps(true);
        const scraped = await scrapeMissing(product.url);
        if (!cancelled && scraped) {
          setForm((f) => ({
            ...f,
            name: f.name || scraped.title || "",
            price: f.price || scraped.price?.toString() || "",
            imageUrl: f.imageUrl || scraped.image || "",
          }));
        }
        if (!cancelled) setIsFillingGaps(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  return { form, update, isReading, isFillingGaps };
}

export { addGift };
