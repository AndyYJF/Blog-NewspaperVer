"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/markdown";

export function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24 hidden lg:block">
      <p className="eyebrow mb-4 border-b border-rule pb-3">{label}</p>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              item.level === 3 && "pl-4",
              "transition-colors duration-200"
            )}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block leading-snug text-muted transition-colors hover:text-accent",
                active === item.id && "text-accent font-medium"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
