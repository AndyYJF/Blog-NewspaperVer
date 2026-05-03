"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales } from "@/lib/i18n";

export function LocaleToggle({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();

  // 替换 URL 第一段
  const buildHref = (loc: string) => {
    const parts = pathname.split("/");
    if (locales.includes(parts[1] as (typeof locales)[number])) {
      parts[1] = loc;
    } else {
      parts.splice(1, 0, loc);
    }
    return parts.join("/") || `/${loc}`;
  };

  const next = currentLocale === "zh" ? "en" : "zh";

  return (
    <Link
      href={buildHref(next)}
      aria-label="Toggle language"
      className="grid size-9 place-items-center rounded-full border border-rule text-ink transition-colors hover:bg-subtle"
    >
      <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">
        {next}
      </span>
    </Link>
  );
}
