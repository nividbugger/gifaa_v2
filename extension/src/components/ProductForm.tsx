import type { FormState } from "@/entrypoints/popup/hooks";

interface Props {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
  isFillingGaps: boolean;
}

export function ProductForm({ form, onChange, isFillingGaps }: Props) {
  return (
    <div className="stack">
      <div className="product-head">
        {form.imageUrl ? <img src={form.imageUrl} alt="" onError={() => onChange({ imageUrl: "" })} /> : <div className="img-placeholder" />}
        <label className="field grow">
          <span>Product name</span>
          <input value={form.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. Le Creuset Dutch Oven" />
        </label>
      </div>
      <label className="field">
        <span>Price (₹)</span>
        <input type="number" min="0" value={form.price} onChange={(e) => onChange({ price: e.target.value })} />
      </label>
      <label className="field">
        <span>Notes (optional)</span>
        <textarea rows={2} value={form.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Size, colour, preferences…" />
      </label>
      {isFillingGaps && <p className="muted small">Fetching missing details…</p>}
    </div>
  );
}
