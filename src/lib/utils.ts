import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = "zh") {
  const d = typeof date === "string" ? new Date(date) : date;
  if (locale === "zh") {
    return format(d, "yyyy 年 M 月 d 日", { locale: zhCN });
  }
  return format(d, "MMMM d, yyyy", { locale: enUS });
}

export function formatDateShort(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM dd");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function readingTime(text: string) {
  // 中英混合的阅读速度估计：英文 ~200wpm, 中文 ~300字/分钟
  const cn = (text.match(/[一-龥]/g) ?? []).length;
  const en = text.replace(/[一-龥]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cn / 300 + en / 200));
}

export function truncate(text: string, n: number) {
  if (text.length <= n) return text;
  return text.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

export function siteConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    title: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Quill & Press",
    tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "A magazine of essays and ideas",
  };
}
