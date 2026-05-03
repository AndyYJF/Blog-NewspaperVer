import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/animation/FadeIn";

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, titleEn: true, publishedAt: true, readingTime: true },
  });

  // 按年份分组
  const groups = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    const year = p.publishedAt ? new Date(p.publishedAt).getFullYear().toString() : "—";
    if (!acc[year]) acc[year] = [];
    acc[year].push(p);
    return acc;
  }, {});

  const years = Object.keys(groups).sort().reverse();

  return (
    <div className="container py-10">
      <header className="mb-12 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">Archive</p>
        <h1 className="font-serif text-display-xl font-bold tracking-tightest">
          {locale === "zh" ? "归档" : "Archive"}
        </h1>
      </header>

      <div className="mx-auto max-w-3xl space-y-16">
        {years.map((year, yi) => (
          <FadeIn key={year} delay={yi * 0.05}>
            <section>
              <h2 className="masthead mb-6 text-5xl text-accent">{year}</h2>
              <ul className="divide-y divide-rule">
                {groups[year].map((p) => (
                  <li key={p.id} className="py-3">
                    <Link
                      href={`/${locale}/posts/${p.slug}`}
                      className="group flex items-baseline justify-between gap-6"
                    >
                      <span className="font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                        {locale === "en" && p.titleEn ? p.titleEn : p.title}
                      </span>
                      <span className="shrink-0 font-sans text-xs uppercase tracking-widest text-muted">
                        {p.publishedAt ? formatDate(p.publishedAt, locale) : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
