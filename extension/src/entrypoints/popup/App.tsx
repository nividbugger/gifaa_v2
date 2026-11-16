import { useState } from "react";
import { addGift, ApiError, registryUrl, type RegistrySummary } from "@/core/api";
import { config } from "@/core/config";
import { ProductForm } from "@/components/ProductForm";
import { RegistryPicker } from "@/components/RegistryPicker";
import { SignInPrompt } from "@/components/SignInPrompt";
import { useProductForm, useRegistries, useSession } from "./hooks";

export function App() {
  const { view, reload } = useSession();
  const signedIn = view.status === "signed-in";
  const { registries, selectedId, select, error: registryError } = useRegistries(view);
  const { form, update, isReading, isFillingGaps } = useProductForm(signedIn);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [added, setAdded] = useState<RegistrySummary | null>(null);

  if (view.status === "loading" || view.status === "refreshing") {
    return <p className="center muted pad">{view.status === "refreshing" ? "Reconnecting…" : "Loading…"}</p>;
  }
  if (view.status === "error") {
    return (
      <Shell>
        <p className="error">Something went wrong: {view.message}</p>
        <button className="btn link" onClick={reload}>Try again</button>
      </Shell>
    );
  }
  if (view.status !== "signed-in") return <Shell><SignInPrompt status={view.status} onRetry={reload} /></Shell>;
  if (registryError) return <Shell><p className="error">{registryError}</p><button className="btn link" onClick={reload}>Try again</button></Shell>;
  if (!registries || isReading) return <p className="center muted pad">Reading product…</p>;

  if (registries.length === 0) {
    return (
      <Shell>
        <p className="muted">You don't have a registry yet.</p>
        <button className="btn primary" onClick={() => browser.tabs.create({ url: `${config.siteUrl}/create-registry` })}>Create one</button>
      </Shell>
    );
  }

  const registry = registries.find((r) => r.id === selectedId)!;

  if (added) {
    return (
      <Shell>
        <div className="stack center">
          <h2>Added to “{added.title}” 🎁</h2>
          <button className="btn primary" onClick={() => browser.tabs.create({ url: registryUrl(added) })}>View registry</button>
          <button className="btn link" onClick={() => window.close()}>Close</button>
        </div>
      </Shell>
    );
  }

  const save = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await addGift(view.session, registry.id, {
        name: form.name, url: form.url, price: form.price, notes: form.notes, imageUrl: form.imageUrl,
      });
      setAdded(registry);
    } catch (e) {
      setSaveError(e instanceof ApiError && e.isAuthError ? "Your session expired — click “Reconnect” below." : "Couldn't add this item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Shell>
      <RegistryPicker registries={registries} selectedId={selectedId} onChange={select} />
      <ProductForm form={form} onChange={update} isFillingGaps={isFillingGaps} />
      {saveError && <p className="error">{saveError}</p>}
      {saveError?.includes("Reconnect") && <button className="btn link" onClick={reload}>Reconnect</button>}
      <button className="btn primary" disabled={isSaving || !form.name.trim()} onClick={save}>
        {isSaving ? "Adding…" : "Add to registry"}
      </button>
      <p className="muted small">Eligible Amazon links may be converted to affiliate links; Gifaa may earn a small commission.</p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="shell stack">
      <header className="brand">Gifaa</header>
      {children}
    </main>
  );
}
