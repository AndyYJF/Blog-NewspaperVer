"use client";

import { useEffect, useState } from "react";

interface MarqueeStripProps {
  items: string[];
  /** Duration in seconds for one full loop */
  duration?: number;
}

/**
 * Top-of-page marquee — quietly scrolls editorial announcements.
 * Pauses on hover. Doubles content for seamless loop.
 */
export function MarqueeStrip({ items, duration = 60 }: MarqueeStripProps) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-7 border-b border-rule bg-paper" aria-hidden />;
  }

  // Double the items for seamless loop
  const content = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-b border-rule bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Editorial announcements"
    >
      <div
        className="flex whitespace-nowrap py-1.5"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {content.map((item, i) => (
          <span
            key={i}
            className="eyebrow-tight mx-8 inline-flex items-center gap-3 text-muted"
          >
            <span className="text-accent">✦</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
