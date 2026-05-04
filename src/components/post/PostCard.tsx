import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post, Tag, Category, User } from "@prisma/client";

type PostWithRelations = Post & {
  author?: User | null;
  category?: Category | null;
  tags?: Tag[];
};

export function PostCard({
  post,
  locale,
  layout = "horizontal",
  index,
}: {
  post: PostWithRelations;
  locale: string;
  layout?: "horizontal" | "vertical" | "compact";
  index?: number;
}) {
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const href = `/${locale}/posts/${post.slug}`;
  const indexStr = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  if (layout === "compact") {
    return (
      <article className="group grid grid-cols-[auto,1fr] items-baseline gap-4 border-b border-rule py-4">
        {indexStr && (
          <span className="font-mono text-[11px] tabular-nums text-muted">
            {indexStr}
          </span>
        )}
        <div>
          <Link href={href}>
            <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-accent">
              {title}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-eyebrow text-muted">
            {post.category && <span className="text-accent">{post.category.name}</span>}
            {post.publishedAt && <span aria-hidden>·</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt, locale)}</span>}
            {post.readingTime && <span aria-hidden>·</span>}
            {post.readingTime && <span>{post.readingTime} min</span>}
          </div>
        </div>
      </article>
    );
  }

  if (layout === "vertical") {
    return (
      <article className="group flex flex-col gap-4">
        {/* Index badge over image */}
        <Link href={href} className="relative block overflow-hidden bg-subtle">
          {post.coverImage ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                className="object-cover transition-all duration-700 ease-editorial group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Subtle vignette overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/0 transition-colors duration-700 group-hover:to-ink/15" />
            </div>
          ) : (
            <div className="relative aspect-[4/3] w-full bg-subtle grid place-items-center">
              <span className="font-display text-7xl text-rule">
                {title.slice(0, 1)}
              </span>
            </div>
          )}
          {indexStr && (
            <span className="absolute left-3 top-3 grid size-7 place-items-center bg-paper font-mono text-[10px] tabular-nums tracking-wider text-ink">
              №{indexStr}
            </span>
          )}
        </Link>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-eyebrow text-muted">
            {post.category && (
              <Link
                href={`/${locale}/categories/${post.category.slug}`}
                className="text-accent"
              >
                {post.category.name}
              </Link>
            )}
            {post.publishedAt && <span aria-hidden>·</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt, locale)}</span>}
          </div>
          <Link href={href}>
            <h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tightest transition-colors group-hover:text-accent">
              {title}
            </h3>
          </Link>
          {excerpt && (
            <p className="line-clamp-3 leading-relaxed text-muted">{excerpt}</p>
          )}
          <p className="mt-1 font-sans text-[10px] uppercase tracking-eyebrow text-muted">
            {post.author?.name && `By ${post.author.name}`}
            {post.readingTime && ` · ${post.readingTime} min read`}
          </p>
        </div>
      </article>
    );
  }

  // Horizontal — newspaper feature treatment
  return (
    <article className="group grid gap-6 border-b border-rule pb-10 md:grid-cols-12 md:gap-10 md:pb-14">
      {post.coverImage && (
        <Link href={href} className="relative block overflow-hidden bg-subtle md:col-span-5">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover transition-all duration-700 ease-editorial group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/0 transition-colors duration-700 group-hover:to-ink/10" />
          </div>
          {indexStr && (
            <span className="absolute left-3 top-3 bg-paper px-2 py-1 font-mono text-[10px] tabular-nums tracking-wider text-ink">
              №{indexStr}
            </span>
          )}
        </Link>
      )}
      <div className="flex flex-col justify-center gap-4 md:col-span-7">
        <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-eyebrow text-muted">
          {post.category && (
            <Link
              href={`/${locale}/categories/${post.category.slug}`}
              className="text-accent"
            >
              {post.category.name}
            </Link>
          )}
          <span aria-hidden className="text-rule">|</span>
          <span>
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
        </div>
        <Link href={href}>
          <h3 className="font-display text-3xl font-bold leading-[1.08] tracking-tightest transition-colors group-hover:text-accent md:text-[2.6rem]">
            {title}
          </h3>
        </Link>
        {excerpt && (
          <p className="font-italic italic text-lg leading-relaxed text-muted md:text-xl">
            {excerpt}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 font-sans text-[11px]">
          <span className="text-muted">By</span>
          <span className="font-semibold uppercase tracking-eyebrow text-ink">
            {post.author?.name}
          </span>
          {post.readingTime && (
            <>
              <span className="text-rule" aria-hidden>·</span>
              <span className="uppercase tracking-eyebrow text-muted">
                {post.readingTime} min read
              </span>
            </>
          )}
          <span className="ml-auto inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-eyebrow text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span>Read</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
              <path d="M0 5 L13 5 M9 1 L13 5 L9 9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
