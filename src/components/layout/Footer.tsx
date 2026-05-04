import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSiteConfig } from "@/lib/settings";
import { Rss, Mail, Github } from "lucide-react";
import { RomanNumeral } from "./Ornament";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const { title } = await getSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-ink/80">
      <div className="container">
        <div className="magazine-double-rule mt-1 mb-12" aria-hidden />
      </div>

      <div className="container pb-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-accent">Colophon</p>
            <p className="masthead mt-3 text-5xl">{title}</p>
            <p className="mt-4 font-italic italic leading-relaxed text-muted">
              {locale === "zh"
                ? "为耐心的读者而作。本刊以 Next.js、Prisma 与一杯黑咖啡构建。"
                : "Made for the patient reader. Built with Next.js, Prisma, and a cup of black coffee."}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/rss.xml"
                aria-label="RSS"
                className="grid size-9 place-items-center border border-rule transition-colors hover:bg-accent hover:text-paper hover:border-accent"
              >
                <Rss className="size-3.5" strokeWidth={1.5} />
              </Link>
              <Link
                href="https://github.com"
                aria-label="GitHub"
                className="grid size-9 place-items-center border border-rule transition-colors hover:bg-accent hover:text-paper hover:border-accent"
              >
                <Github className="size-3.5" strokeWidth={1.5} />
              </Link>
              <Link
                href={`/${locale}/about`}
                aria-label="Mail"
                className="grid size-9 place-items-center border border-rule transition-colors hover:bg-accent hover:text-paper hover:border-accent"
              >
                <Mail className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Sections</p>
            <ul className="space-y-2.5 font-display text-lg">
              <li><Link href={`/${locale}/posts`} className="link-magazine">{t("posts")}</Link></li>
              <li><Link href={`/${locale}/archive`} className="link-magazine">{t("archive")}</Link></li>
              <li><Link href={`/${locale}/about`} className="link-magazine">{t("about")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Subscribe</p>
            <p className="font-italic italic text-muted">
              {locale === "zh"
                ? "本刊不发邮件、不追踪、不打扰。"
                : "No newsletter. No tracking. No noise."}
            </p>
            <p className="mt-3 font-italic italic text-muted">
              {locale === "zh"
                ? "可通过 RSS 静静地阅读。"
                : "Read quietly via RSS."}
            </p>
            <Link
              href="/rss.xml"
              className="mt-5 inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-sans text-[11px] uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent hover:border-accent"
            >
              <Rss className="size-3.5" />
              {locale === "zh" ? "订阅本刊" : "Subscribe via RSS"}
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-rule pt-6 md:flex-row md:justify-between">
          <p className="font-sans text-[10px] uppercase tracking-eyebrow text-muted">
            © <RomanNumeral n={year} /> {title} · {locale === "zh" ? "保留所有权利" : "All rights reserved"}
          </p>
          <p className="font-italic italic text-sm text-muted">
            {locale === "zh"
              ? "Set in Fraunces, Source Serif & Noto Serif SC"
              : "Set in Fraunces, Source Serif & Noto Serif SC"}
          </p>
        </div>
      </div>
    </footer>
  );
}
