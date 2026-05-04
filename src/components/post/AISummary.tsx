import { Sparkles } from "lucide-react";

export function AISummary({ summary, label }: { summary: string; label: string }) {
  return (
    <aside className="my-10 grid grid-cols-[auto,1fr] gap-5 border-l-2 border-accent bg-accent-soft/30 p-6">
      <div className="grid size-9 place-items-center border border-accent bg-paper text-accent">
        <Sparkles className="size-4" strokeWidth={1.5} />
      </div>
      <div>
        <p className="eyebrow text-accent">{label}</p>
        <p className="mt-2 font-italic italic leading-relaxed text-ink">
          {summary}
        </p>
      </div>
    </aside>
  );
}
