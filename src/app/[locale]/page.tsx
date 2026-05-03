import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PostHero } from "@/components/post/PostHero";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/animation/FadeIn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  return (
    <div className="container py-10">
      {/* Featured */}
      {featured && (
        <FadeIn>
          <div className="mb-4">
            <p className="eyebrow text-accent">{t("featured")}</p>
          </div>
          <PostHero post={featured} locale={locale} />
        </FadeIn>
      )}

      {/* Recent */}
      <section className="mt-16">
        <div className="mb-10 flex items-end justify-between border-b-2 border-ink pb-3">
          <h2 className="font-serif text-display-lg font-bold tracking-tightest">
            {t("recent")}
          </h2>
          <Link
            href={`/${locale}/posts`}
            className="link-magazine flex items-center gap-1 font-sans text-sm uppercase tracking-widest"
          >
            {t("all")}
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {/* 顶部一篇横版突出 */}
        {recent[0] && (
          <FadeIn delay={0.05}>
            <PostCard post={recent[0]} locale={locale} layout="horizontal" />
          </FadeIn>
        )}

        {/* 三列网格 */}
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {recent.slice(1).map((post, idx) => (
            <FadeIn key={post.id} delay={0.05 * (idx + 1)}>
              <PostCard post={post} locale={locale} layout="vertical" />
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
