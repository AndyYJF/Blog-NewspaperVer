"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("common");

  useEffect(() => setMounted(true), []);

  const toggle = () => {
    const next = (resolvedTheme ?? theme) === "dark" ? "light" : "dark";
    // View Transitions API：圆形扩散
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || !btnRef.current) {
      setTheme(next);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const transition = doc.startViewTransition(() => setTheme(next));
    transition.ready.then(() => {
      const isDark = next === "dark";
      document.documentElement.animate(
        {
          clipPath: isDark
            ? [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
            : [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: isDark ? "::view-transition-new(root)" : "::view-transition-old(root)",
        }
      );
    });
  };

  if (!mounted) {
    return <button className="size-9 rounded-full" aria-hidden />;
  }

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label={t("darkMode")}
      className="grid size-9 place-items-center rounded-full border border-rule text-ink transition-colors hover:bg-subtle"
    >
      {(resolvedTheme ?? theme) === "dark" ? (
        <Sun className="size-4" strokeWidth={1.5} />
      ) : (
        <Moon className="size-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
