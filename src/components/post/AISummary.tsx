import { Sparkles } from "lucide-react";

export function AISummary({ summary, label }: { summary: string; label: string }) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-accent-soft/40 p-6">
      <p className="eyebrow mb-3 flex items-center gap-2 text-accent">
        <Sparkles className="size-3.5" strokeWidth={2} />
        {label}
      </p>
      <p className="font-serif italic leading-relaxed text-ink">{summary}</p>
    </aside>
  );
}
