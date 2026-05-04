import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PostHero } from "@/components/post/PostHero";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/animation/FadeIn";
import { OrnamentTrio } from "@/components/layout/Ornament";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const featured = await prisma.post.findFirst({
    where: { status: "published", featured: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true, tags: true },
  });

  const recent = await prisma.post.findMany({
    where: { status: "published", id: { not: featured?.id } },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { author: true, category: true, tags: true },
  });

  // Build "In this issue" table of contents
  const allInIssue = featured ? [featured, ...recent] : recent;

  const categories = await prisma.category.findMany({
    where: { posts: { some: { status: "published" } } },
    include: { _count: { select: { posts: { where: { status: "published" } } } } },
    take: 6,
  });

  return (
    <div>
      {/* "In This Issue" — editorial table of contents */}
      <section className="border-b border-rule bg-paper/30">
        <div className="container py-10">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-accent">In This Issue</p>
              <h2 className="masthead mt-2 text-3xl">
                {locale === "zh" ? "目录" : "Contents"}
              </h2>
              <p className="mt-2 font-italic italic text-sm text-muted">
                {locale === "zh"
                  ? `本期共 ${allInIssue.length} 篇文章`
                  : `${allInIssue.length} essays in this issue`}
              </p>
            </div>
            <ol className="md:col-span-9 grid gap-x-10 gap-y-3 md:grid-cols-2">
              {allInIssue.slice(0, 8).map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={`/${locale}/posts/${p.slug}`}
                    className="group grid grid-cols-[2.4em,1fr,auto] items-baseline gap-3"
                  >
                    <span className="font-mono text-[10px] tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base leading-snug transition-colors group-hover:text-accent">
                      {locale === "en" && p.titleEn ? p.titleEn : p.title}
                    </span>
                    <span
                      className="hidden h-px flex-1 bg-rule self-center md:block"
                      aria-hidden
                    />
                    {p.readingTime && (
                      <span className="font-sans text-[10px] uppercase tracking-eyebrow text-muted">
                        p.{p.readingTime}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Featured Hero */}
      {featured && (
        <section className="container pt-16">
          <FadeIn>
            <p className="eyebrow mb-6 flex items-center gap-3 text-accent">
              <span className="h-px w-12 bg-accent" aria-hidden />
              <span>{t("featured")}</span>
            </p>
            <PostHero post={featured} locale={locale} />
          </FadeIn>
        </section>
      )}

      {/* Ornament divider */}
      <OrnamentTrio className="container my-12" />

      {/* Recent essays — editorial grid */}
      <section className="container pb-12">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow text-accent">02 / Reading</p>
            <h2 className="masthead mt-2 text-display-lg">
              {t("recent")}
            </h2>
          </div>
          <Link
            href={`/${locale}/posts`}
            className="link-magazine font-sans text-[11px] uppercase tracking-eyebrow"
          >
            {t("all")} →
          </Link>
        </header>

        {/* Top horizontal feature */}
        {recent[0] && (
          <FadeIn>
            <PostCard post={recent[0]} locale={locale} layout="horizontal" index={1} />
          </FadeIn>
        )}

        {/* Vertical grid */}
        <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {recent.slice(1).map((post, idx) => (
            <FadeIn key={post.id} delay={0.05 * (idx + 1)}>
              <PostCard
                post={post}
                locale={locale}
                layout="vertical"
                index={idx + 2}
              />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Sections — categorical browse */}
      {categories.length > 0 && (
        <section className="container border-t border-rule pt-14 pb-20">
          <header className="mb-10">
            <p className="eyebrow text-accent">03 / Sections</p>
            <h2 className="masthead mt-2 text-display-lg">
              {locale === "zh" ? "栏目" : "Departments"}
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.05}>
                <Link
                  href={`/${locale}/categories/${cat.slug}`}
                  className="group block border border-rule bg-paper/40 p-6 transition-all duration-500 ease-editorial hover:border-accent hover:bg-paper"
                >
                  <p className="font-mono text-[10px] tabular-nums text-muted">
                    №0{i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tightest transition-colors group-hover:text-accent">
                    {locale === "en" && cat.nameEn ? cat.nameEn : cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-2 font-italic italic text-sm leading-relaxed text-muted">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-5 flex items-baseline justify-between border-t border-rule pt-3">
                    <span className="font-sans text-[10px] uppercase tracking-eyebrow text-muted">
                      {cat._count.posts} {locale === "zh" ? "篇" : "essays"}
                    </span>
                    <span
                      className="font-sans text-[11px] uppercase tracking-eyebrow text-accent transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
