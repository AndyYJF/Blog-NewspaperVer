"use client";

import { useEffect, useState } from "react";
import { Save, Eye, EyeOff, Loader2, Check } from "lucide-react";

interface SettingItem {
  key: string;
  label: string;
  type: string;
  group: string;
  order: number;
  secret: boolean;
  envVar?: string;
  value: string;
  source: "db" | "env" | "default";
}

const groupLabels: Record<string, { en: string; zh: string }> = {
  general: { en: "General", zh: "站点常规" },
  comments: { en: "Comments (Giscus)", zh: "评论 (Giscus)" },
  ai: { en: "AI Provider", zh: "AI 服务商" },
};

export function SettingsForm({ initial }: { initial: SettingItem[] }) {
  const [items, setItems] = useState(initial);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((i) => [i.key, i.value]))
  );
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear "saved" badge
  useEffect(() => {
    if (savedAt) {
      const t = setTimeout(() => setSavedAt(null), 2400);
      return () => clearTimeout(t);
    }
  }, [savedAt]);

  const dirty = items.some((i) => values[i.key] !== i.value);

  async function save(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.toString?.() ?? `HTTP ${res.status}`);
      }
      // Refresh items so source becomes "db"
      const refresh = await fetch("/api/settings", { cache: "no-store" });
      const data = await refresh.json();
      setItems(data.items);
      setValues(Object.fromEntries(data.items.map((i: SettingItem) => [i.key, i.value])));
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // Group items
  const grouped = items.reduce<Record<string, SettingItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
  Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.order - b.order));

  return (
    <form onSubmit={save} className="max-w-3xl">
      <div className="space-y-12">
        {Object.entries(grouped).map(([group, groupItems]) => (
          <fieldset key={group}>
            <legend className="masthead text-2xl">
              {groupLabels[group]?.zh ?? group}
            </legend>
            <p className="eyebrow mt-1 text-muted">
              {groupLabels[group]?.en ?? group}
            </p>
            <div className="mt-6 space-y-6 border-l border-rule pl-6">
              {groupItems.map((item) => (
                <Field
                  key={item.key}
                  item={item}
                  value={values[item.key] ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [item.key]: v }))
                  }
                  revealed={revealed[item.key]}
                  onToggleReveal={() =>
                    setRevealed((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  isDirty={values[item.key] !== item.value}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-6 mt-12 flex items-center justify-between gap-4 border border-ink bg-paper px-5 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-3 font-sans text-[12px]">
          {saving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span className="text-muted">Saving…</span>
            </>
          ) : savedAt ? (
            <>
              <Check className="size-3.5 text-accent" />
              <span className="text-accent">Saved · settings live</span>
            </>
          ) : dirty ? (
            <span className="text-muted">Unsaved changes</span>
          ) : (
            <span className="text-muted">All settings synchronised</span>
          )}
          {error && <span className="text-accent">· {error}</span>}
        </div>
        <button
          type="submit"
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2 font-sans text-[11px] uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent hover:border-accent disabled:opacity-40 disabled:hover:bg-ink disabled:hover:border-ink"
        >
          <Save className="size-3.5" />
          Save changes
        </button>
      </div>
    </form>
  );
}

function Field({
  item,
  value,
  onChange,
  revealed,
  onToggleReveal,
  isDirty,
}: {
  item: SettingItem;
  value: string;
  onChange: (v: string) => void;
  revealed?: boolean;
  onToggleReveal: () => void;
  isDirty: boolean;
}) {
  const showAsPassword = item.secret && !revealed;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="font-sans text-[12px] font-semibold tracking-wide text-ink">
          {item.label}
        </label>
        <span className="font-mono text-[10px] text-muted">{item.key}</span>
      </div>

      {/* Source badge */}
      <p className="mt-1 flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow">
        {isDirty ? (
          <span className="text-accent">● Modified</span>
        ) : item.source === "db" ? (
          <span className="text-muted">Stored in database</span>
        ) : item.source === "env" ? (
          <span className="text-muted">
            Loaded from <code className="bg-subtle px-1">{item.envVar}</code> in .env
          </span>
        ) : (
          <span className="text-muted">Default value</span>
        )}
      </p>

      <div className="mt-2 flex gap-2">
        {item.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="flex-1 resize-none border border-rule bg-paper px-3 py-2 font-body text-sm outline-none transition-colors focus:border-accent"
          />
        ) : (
          <input
            type={showAsPassword ? "password" : item.type === "url" ? "url" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={item.envVar ? `(or set ${item.envVar} in .env)` : ""}
            className="flex-1 border border-rule bg-paper px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent"
          />
        )}
        {item.secret && (
          <button
            type="button"
            onClick={onToggleReveal}
            className="grid size-9 place-items-center border border-rule transition-colors hover:bg-subtle"
            aria-label={revealed ? "Hide" : "Show"}
          >
            {revealed ? (
              <EyeOff className="size-3.5" strokeWidth={1.5} />
            ) : (
              <Eye className="size-3.5" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
