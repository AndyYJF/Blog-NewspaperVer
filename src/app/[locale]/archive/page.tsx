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
    include: { category: true },
  });

  // Group by year
  const groups = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    const year = p.publishedAt ? new Date(p.publishedAt).getFullYear().toString() : "—";
    if (!acc[year]) acc[year] = [];
    acc[year].push(p);
    return acc;
  }, {});

  const years = Object.keys(groups).sort().reverse();

  return (
    <div className="container py-12">
      <header className="mb-20 border-b-2 border-ink pb-8">
        <p className="eyebrow text-accent">Archive</p>
        <h1 className="masthead mt-3 text-display-2xl">
          {locale === "zh" ? "归档" : "The Archive"}
        </h1>
        <p className="mt-3 font-italic italic text-lg text-muted">
          {locale === "zh"
            ? `按年份组织 · ${posts.length} 篇`
            : `Organised by year · ${posts.length} essays`}
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-24">
        {years.map((year, yi) => (
          <FadeIn key={year} delay={yi * 0.05}>
            <section className="grid grid-cols-[auto,1fr] gap-x-10 gap-y-2 md:gap-x-16">
              {/* Year — large numeric anchor */}
              <h2
                className="section-numeral sticky top-12 self-start text-[5rem] leading-none md:text-[7rem]"
                style={{ writingMode: "vertical-rl" }}
              >
                <span style={{ writingMode: "horizontal-tb", display: "block" }}>
                  {year}
                </span>
              </h2>
              <ul className="divide-y divide-rule">
                {groups[year].map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/${locale}/posts/${p.slug}`}
                      className="group grid grid-cols-[2.5em,1fr,auto] items-baseline gap-4 py-4"
                    >
                      <span className="font-mono text-[10px] tabular-nums text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="font-display text-xl leading-snug transition-colors group-hover:text-accent">
                          {locale === "en" && p.titleEn ? p.titleEn : p.title}
                        </span>
                        {p.category && (
                          <span className="ml-3 font-sans text-[10px] uppercase tracking-eyebrow text-accent">
                            {p.category.name}
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-eyebrow text-muted">
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
