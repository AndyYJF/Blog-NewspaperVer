"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface GiscusProps {
  slug: string;
  locale: string;
  /** Server-loaded settings — falls back to env on first run */
  giscus?: {
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
  };
}

export function Comments({ slug, locale, giscus }: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Prefer server-loaded (from DB), fall back to NEXT_PUBLIC env (build-time)
  const repo = giscus?.repo || process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = giscus?.repoId || process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = giscus?.category || process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements";
  const categoryId = giscus?.categoryId || process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    if (!ref.current) return;
    if (!repo || !repoId || !categoryId) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", slug);
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
    ref.current.appendChild(script);
  }, [slug, locale, resolvedTheme, repo, repoId, category, categoryId]);

  if (!repo || !repoId || !categoryId) {
    return (
      <div className="rounded-sm border border-dashed border-rule p-6 font-sans text-sm italic text-muted">
        {locale === "zh"
          ? "评论区未配置 Giscus，请在 /admin/settings 中填写。"
          : "Giscus not configured. Please fill it in /admin/settings."}
      </div>
    );
  }

  return <div ref={ref} className="giscus" />;
}
