import type { RegistrySummary } from "@/core/api";

interface Props {
  registries: RegistrySummary[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function RegistryPicker({ registries, selectedId, onChange }: Props) {
  return (
    <label className="field">
      <span>Add to registry</span>
      <select value={selectedId} onChange={(e) => onChange(e.target.value)}>
        {registries.map((r) => (
          <option key={r.id} value={r.id}>{r.title}</option>
        ))}
      </select>
    </label>
  );
}
