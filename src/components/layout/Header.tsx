import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { siteConfig } from "@/lib/utils";
import { format } from "date-fns";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const { title, tagline } = siteConfig();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  const nav = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/posts`, label: t("posts") },
    { href: `/${locale}/archive`, label: t("archive") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <header className="border-b border-ink/80">
      {/* 顶栏：日期 + 切换 */}
      <div className="border-b border-rule">
        <div className="container flex items-center justify-between py-2 font-sans text-[11px] uppercase tracking-widest text-muted">
          <span>{today}</span>
          <div className="flex items-center gap-2">
            <LocaleToggle currentLocale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* 报头 — 杂志大刊名 */}
      <div className="container py-10 text-center md:py-14">
        <p className="eyebrow mb-3">No. 1 · Vol. I</p>
        <Link href={`/${locale}`} className="masthead block text-display-2xl">
          {title}
        </Link>
        <p className="mx-auto mt-3 max-w-md font-serif italic text-muted">{tagline}</p>
      </div>

      {/* 导航 */}
      <nav className="border-y border-ink/80 bg-paper">
        <div className="container flex items-center justify-center gap-x-8 gap-y-2 py-3 text-sm font-sans uppercase tracking-widest md:gap-x-12">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-magazine py-1 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
