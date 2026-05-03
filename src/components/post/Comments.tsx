"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export function Comments({ slug, locale }: { slug: string; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const giscus: Partial<GiscusProps> = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  };

  useEffect(() => {
    if (!ref.current) return;
    if (!giscus.repo || !giscus.repoId || !giscus.categoryId) return;
    // 清空旧实例
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", giscus.repo);
    script.setAttribute("data-repo-id", giscus.repoId);
    script.setAttribute("data-category", giscus.category ?? "Announcements");
    script.setAttribute("data-category-id", giscus.categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", slug);
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark_dimmed" : "light");
    script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
    ref.current.appendChild(script);
  }, [slug, locale, resolvedTheme, giscus.repo, giscus.repoId, giscus.category, giscus.categoryId]);

  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) {
    return (
      <div className="rounded-sm border border-dashed border-rule p-6 font-sans text-sm italic text-muted">
        {locale === "zh"
          ? "评论区未配置 Giscus，请在 .env 中设置 NEXT_PUBLIC_GISCUS_* 以启用。"
          : "Giscus not configured. Set NEXT_PUBLIC_GISCUS_* in .env to enable."}
      </div>
    );
  }

  return <div ref={ref} className="giscus" />;
}
