import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/utils";
import { Rss } from "lucide-react";

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const { title } = siteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink/70">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="masthead text-2xl">{title}</p>
            <p className="mt-2 font-serif italic text-muted">
              {locale === "zh" ? "为耐心的读者而作" : "Made for the patient reader"}
            </p>
          </div>
          <div className="font-sans text-sm uppercase tracking-widest">
            <p className="eyebrow mb-3">Sections</p>
            <ul className="space-y-2 normal-case tracking-normal">
              <li><Link href={`/${locale}/posts`} className="link-magazine">{t("posts")}</Link></li>
              <li><Link href={`/${locale}/archive`} className="link-magazine">{t("archive")}</Link></li>
              <li><Link href={`/${locale}/about`} className="link-magazine">{t("about")}</Link></li>
            </ul>
          </div>
          <div className="font-sans text-sm">
            <p className="eyebrow mb-3">Subscribe</p>
            <Link
              href="/rss.xml"
              className="inline-flex items-center gap-2 border border-rule px-3 py-2 transition-colors hover:bg-accent hover:text-paper hover:border-accent"
            >
              <Rss className="size-3.5" />
              <span className="uppercase tracking-widest">{t("rss")}</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-rule pt-6 font-sans text-xs uppercase tracking-widest text-muted md:flex-row md:justify-between">
          <p>© {year} {title} · {locale === "zh" ? "保留所有权利" : "All rights reserved"}</p>
          <p className="italic normal-case tracking-normal text-muted">
            {locale === "zh" ? "用 Next.js 与一杯黑咖啡构建" : "Built with Next.js and a cup of black coffee"}
          </p>
        </div>
      </div>
    </footer>
  );
}
