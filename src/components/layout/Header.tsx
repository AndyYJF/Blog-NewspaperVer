import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { getSiteConfig } from "@/lib/settings";
import { format } from "date-fns";
import { RomanNumeral } from "./Ornament";

interface HeaderProps {
  locale: string;
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const { title, tagline } = await getSiteConfig();
  const now = new Date();
  const dateLong =
    locale === "zh"
      ? `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · 星期${"日一二三四五六"[now.getDay()]}`
      : format(now, "EEEE, MMMM d, yyyy");
  const issueYear = now.getFullYear();

  const nav = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/posts`, label: t("posts") },
    { href: `/${locale}/archive`, label: t("archive") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <header className="relative">
      <div className="border-b border-rule">
        <div className="container flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <span className="hidden h-1.5 w-1.5 rotate-45 bg-accent md:inline-block" aria-hidden />
            <span className="eyebrow-tight">{dateLong}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-sans text-[10px] uppercase tracking-eyebrow text-muted md:inline">
              Established <RomanNumeral n={issueYear} />
            </span>
            <span className="hidden h-3 w-px bg-rule md:inline-block" aria-hidden />
            <LocaleToggle currentLocale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="border-b border-ink/80">
        <div className="container relative py-12 text-center md:py-16">
          <span
            className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 text-rule md:inline-block"
            aria-hidden
          >
            <svg width="42" height="60" viewBox="0 0 42 60" fill="none">
              <path d="M40 1 L1 1 L1 59 L40 59" stroke="currentColor" strokeWidth="1" />
              <path d="M35 8 L8 8 L8 52 L35 52" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </span>
          <span
            className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-rule md:inline-block"
            aria-hidden
          >
            <svg width="42" height="60" viewBox="0 0 42 60" fill="none">
              <path d="M2 1 L41 1 L41 59 L2 59" stroke="currentColor" strokeWidth="1" />
              <path d="M7 8 L34 8 L34 52 L7 52" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </span>

          <p className="label-issue mb-5 flex items-center justify-center gap-3 text-accent">
            <span aria-hidden>—</span>
            <span>Vol. <RomanNumeral n={1} /></span>
            <span aria-hidden className="text-muted">·</span>
            <span>No. <RomanNumeral n={1} /></span>
            <span aria-hidden className="text-muted">·</span>
            <span><RomanNumeral n={issueYear} /></span>
            <span aria-hidden>—</span>
          </p>

          <Link
            href={`/${locale}`}
            className="masthead block text-display-3xl text-ink"
            aria-label={title}
          >
            <span className="inline-block animate-letters-in">{title}</span>
          </Link>

          <p className="mx-auto mt-4 max-w-md font-italic italic text-muted">
            {tagline}
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-muted">
            <span className="h-px flex-1 max-w-[80px] bg-rule" aria-hidden />
            <span className="font-display text-base text-accent" aria-hidden>✦</span>
            <span className="h-px flex-1 max-w-[80px] bg-rule" aria-hidden />
          </div>
        </div>
      </div>

      <nav className="border-b border-ink/70 bg-canvas/60 backdrop-blur-sm">
        <div className="container flex items-center justify-center gap-x-6 gap-y-2 py-4 md:gap-x-12">
          {nav.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-magazine font-sans text-[12px] uppercase tracking-eyebrow text-ink transition-colors hover:text-accent"
            >
              <sup className="mr-1.5 font-mono text-[8px] text-muted">
                {String(idx + 1).padStart(2, "0")}
              </sup>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
