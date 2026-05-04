import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ArticleContent } from "@/components/post/ArticleContent";
import { TableOfContents } from "@/components/post/TableOfContents";
import { Comments } from "@/components/post/Comments";
import { AISummary } from "@/components/post/AISummary";
import { Ornament } from "@/components/layout/Ornament";
import { extractToc } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { getSiteConfig } from "@/lib/settings";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  return {
    title,
    description: post.excerpt ?? post.aiSummary ?? undefined,
    openGraph: {
      title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "post" });

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true, tags: true },
  });
  if (!post || post.status !== "published") notFound();

  const cfg = await getSiteConfig();

  void prisma.post
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const toc = extractToc(post.content);

  return (
    <article className="container py-10">
      {/* Back link */}
      <Link
        href={`/${locale}/posts`}
        className="link-magazine mb-12 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-muted"
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
          <path d="M14 5 L1 5 M5 1 L1 5 L5 9" stroke="currentColor" strokeWidth="1" />
        </svg>
        {t("backToList")}
      </Link>

      {/* Article header — editorial centered with kicker */}
      <header className="mx-auto max-w-4xl text-center">
        {post.category && (
          <Link
            href={`/${locale}/categories/${post.category.slug}`}
            className="label-issue mb-6 inline-flex items-center gap-3 text-accent"
          >
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span>{post.category.name}</span>
            <span className="h-px w-8 bg-accent" aria-hidden />
          </Link>
        )}
        <h1 className="font-display text-display-2xl font-bold leading-[0.98] tracking-tightest md:text-display-3xl">
          {title}
        </h1>
        {excerpt && (
          <p className="mx-auto mt-8 max-w-2xl font-italic italic text-xl leading-snug text-muted md:text-2xl">
            {excerpt}
          </p>
        )}
        {/* Byline */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[11px] uppercase tracking-eyebrow">
          <span className="text-muted">By</span>
          <span className="font-semibold text-ink">{post.author?.name}</span>
          <span className="h-px w-6 bg-rule" aria-hidden />
          <span className="text-muted">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
          <span className="h-px w-6 bg-rule" aria-hidden />
          <span className="text-accent">
            {t("readingMinutes", { minutes: post.readingTime ?? 1 })}
          </span>
        </div>

        {/* Decorative ornament */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-rule" aria-hidden />
          <span className="font-display text-base text-accent" aria-hidden>✦</span>
          <span className="h-px w-16 bg-rule" aria-hidden />
        </div>
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <figure className="relative mt-14 overflow-hidden bg-subtle">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Corner brackets */}
            <span className="absolute left-3 top-3 size-6 border-l border-t border-paper" aria-hidden />
            <span className="absolute right-3 top-3 size-6 border-r border-t border-paper" aria-hidden />
            <span className="absolute left-3 bottom-3 size-6 border-l border-b border-paper" aria-hidden />
            <span className="absolute right-3 bottom-3 size-6 border-r border-b border-paper" aria-hidden />
          </div>
          {post.coverCaption && (
            <figcaption className="mt-3 text-center font-italic italic text-sm text-muted">
              {post.coverCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article body with TOC */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[14rem,minmax(0,42rem),14rem] lg:gap-x-12">
        <aside className="hidden lg:block">
          <TableOfContents items={toc} label={t("tableOfContents")} />
        </aside>

        <div>
          {post.aiSummary && <AISummary summary={post.aiSummary} label={t("aiSummary")} />}
          <ArticleContent content={post.content} />

          {/* End ornament */}
          <Ornament className="mt-16" />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12">
              <p className="eyebrow mb-4 text-center">{t("tags")}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/tags/${tag.slug}`}
                    className="border border-rule px-3 py-1 font-sans text-[11px] uppercase tracking-eyebrow transition-colors hover:bg-accent hover:text-paper hover:border-accent"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author bio */}
          {post.author && (
            <div className="mt-16 grid grid-cols-[auto,1fr] gap-5 border-t border-rule pt-8">
              <div className="grid size-14 place-items-center bg-accent-soft font-display text-2xl font-bold text-accent">
                {post.author.name?.slice(0, 1) ?? "·"}
              </div>
              <div>
                <p className="eyebrow text-accent">
                  {locale === "zh" ? "撰文" : "Written by"}
                </p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {post.author.name}
                </p>
                {post.author.bio && (
                  <p className="mt-1 font-italic italic text-sm leading-relaxed text-muted">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          <section className="mt-20 border-t-2 border-ink pt-10">
            <header className="mb-8 text-center">
              <p className="eyebrow text-accent">Discourse</p>
              <h2 className="masthead mt-2 text-3xl">{t("comments")}</h2>
            </header>
            <Comments slug={post.slug} locale={locale} giscus={cfg.giscus} />
          </section>
        </div>

        <aside className="hidden lg:block" aria-hidden>
          {/* Right gutter — could host marginalia in future */}
        </aside>
      </div>
    </article>
  );
}
