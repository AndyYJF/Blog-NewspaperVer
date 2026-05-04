"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/markdown";

export function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  // After a click, suppress observer updates briefly so the highlight
  // doesn't ping-pong while the browser scrolls.
  const lockUntilRef = useRef(0);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntilRef.current) return;
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

  // Sync from URL hash (initial load + browser back/forward)
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (hash && items.some((i) => i.id === hash)) setActive(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle default anchor scrolling; we just update state.
    setActive(id);
    // Lock observer for the smooth-scroll window so it doesn't override.
    lockUntilRef.current = Date.now() + 700;
    // Also handle the case where the same anchor is re-clicked: ensure the
    // jump still happens (browsers do nothing when the URL hash doesn't change).
    const el = document.getElementById(id);
    if (el && window.location.hash === `#${id}`) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-16">
      <p className="eyebrow mb-4 flex items-center gap-2 border-b border-rule pb-3 text-accent">
        <span className="h-px w-4 bg-accent" aria-hidden />
        {label}
      </p>
      <ul className="space-y-3 font-sans text-[12px]">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={cn(
              item.level === 3 && "pl-4",
              "transition-colors duration-300"
            )}
          >
            <a
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              className={cn(
                "group flex items-baseline gap-2 leading-snug text-muted transition-colors hover:text-accent",
                active === item.id && "text-accent font-semibold"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums text-rule transition-colors",
                  active === item.id && "text-accent"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
