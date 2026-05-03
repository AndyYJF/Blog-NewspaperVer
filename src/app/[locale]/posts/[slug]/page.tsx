import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ArticleContent } from "@/components/post/ArticleContent";
import { TableOfContents } from "@/components/post/TableOfContents";
import { Comments } from "@/components/post/Comments";
import { AISummary } from "@/components/post/AISummary";
import { extractToc } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  // 异步增加浏览数（不阻塞）
  void prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const toc = extractToc(post.content);

  return (
    <article className="container py-10">
      <Link
        href={`/${locale}/posts`}
        className="link-magazine mb-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-muted"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.5} />
        {t("backToList")}
      </Link>

      {/* 文章头部 */}
      <header className="mx-auto max-w-3xl text-center">
        {post.category && (
          <Link
            href={`/${locale}/categories/${post.category.slug}`}
            className="eyebrow mb-5 inline-block text-accent"
          >
            {post.category.name}
          </Link>
        )}
        <h1 className="font-serif text-display-2xl font-bold leading-[1.05] tracking-tightest">
          {title}
        </h1>
        {excerpt && (
          <p className="mx-auto mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-muted">
            {excerpt}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-sm">
          <span>{t("by")} <strong className="text-ink">{post.author?.name}</strong></span>
          <span className="size-1 rounded-full bg-rule" />
          <span className="text-muted">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
          <span className="size-1 rounded-full bg-rule" />
          <span className="eyebrow">{t("readingMinutes", { minutes: post.readingTime ?? 1 })}</span>
        </div>
      </header>

      {/* 封面图 */}
      {post.coverImage && (
        <figure className="mt-10 overflow-hidden bg-subtle">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          {post.coverCaption && (
            <figcaption className="mt-2 font-sans text-xs italic text-muted">
              {post.coverCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* 主体 + TOC */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr,minmax(0,42rem),1fr]">
        <div className="hidden lg:block">
          <TableOfContents items={toc} label={t("tableOfContents")} />
        </div>
        <div>
          {post.aiSummary && <AISummary summary={post.aiSummary} label={t("aiSummary")} />}
          <ArticleContent content={post.content} />

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="mt-16 border-t border-rule pt-6">
              <p className="eyebrow mb-3">{t("tags")}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/tags/${tag.slug}`}
                    className="border border-rule px-3 py-1 font-sans text-xs uppercase tracking-widest transition-colors hover:bg-accent hover:text-paper hover:border-accent"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 评论 */}
          <section className="mt-16 border-t-2 border-ink pt-8">
            <h2 className="eyebrow mb-6">{t("comments")}</h2>
            <Comments slug={post.slug} locale={locale} />
          </section>
        </div>
        <div />
      </div>
    </article>
  );
}
