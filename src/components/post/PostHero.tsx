import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Post, Category, User } from "@prisma/client";

type PostHeroProps = {
  post: Post & { author?: User | null; category?: Category | null };
  locale: string;
};

export function PostHero({ post, locale }: PostHeroProps) {
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const href = `/${locale}/posts/${post.slug}`;

  return (
    <section className="relative grid gap-10 pb-16 md:grid-cols-12 md:gap-12 md:pb-20">
      {/* Asymmetric: image takes 7/12 on the left */}
      {post.coverImage && (
        <Link
          href={href}
          className="group relative col-span-12 block overflow-hidden bg-subtle md:col-span-7 md:order-1"
        >
          <div className="relative aspect-[5/4] w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              priority
              className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.025] animate-subtle-pan"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/0 via-transparent to-ink/15" />
            {/* Corner brackets — editorial framing */}
            <span className="absolute left-3 top-3 size-6 border-l border-t border-paper" aria-hidden />
            <span className="absolute right-3 top-3 size-6 border-r border-t border-paper" aria-hidden />
            <span className="absolute left-3 bottom-3 size-6 border-l border-b border-paper" aria-hidden />
            <span className="absolute right-3 bottom-3 size-6 border-r border-b border-paper" aria-hidden />
          </div>
          {post.coverCaption && (
            <p className="mt-2 font-italic italic text-xs text-muted">
              {post.coverCaption}
            </p>
          )}
        </Link>
      )}

      {/* Text column — 5/12 on the right */}
      <div className="relative col-span-12 flex flex-col justify-center gap-6 md:col-span-5">
        {/* Big leading numeral — decorative */}
        <span className="section-numeral text-[7rem] leading-none md:text-[9rem]" aria-hidden>
          01
        </span>

        {/* Section pill */}
        {post.category && (
          <Link
            href={`/${locale}/categories/${post.category.slug}`}
            className="label-issue -mt-4 flex items-center gap-2 text-accent"
          >
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span>{post.category.name}</span>
          </Link>
        )}

        <Link href={href}>
          <h2 className="font-display text-display-2xl font-bold leading-[0.98] tracking-tightest transition-colors hover:text-accent">
            {title}
          </h2>
        </Link>

        {excerpt && (
          <p className="font-italic italic text-xl leading-snug text-muted md:text-2xl">
            {excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 font-sans text-[11px] uppercase tracking-eyebrow">
          <span className="text-muted">By</span>
          <span className="font-semibold text-ink">{post.author?.name}</span>
          <span className="h-px w-6 bg-rule" aria-hidden />
          <span className="text-muted">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
          <span className="h-px w-6 bg-rule" aria-hidden />
          <span className="text-accent">{post.readingTime} min read</span>
        </div>

        {/* Continue reading arrow */}
        <Link
          href={href}
          className="group mt-4 inline-flex w-fit items-center gap-3 font-sans text-[11px] uppercase tracking-eyebrow text-ink"
        >
          <span className="border-b border-current pb-0.5 transition-colors group-hover:text-accent">
            {locale === "zh" ? "阅读全文" : "Continue reading"}
          </span>
          <svg
            width="28"
            height="10"
            viewBox="0 0 28 10"
            fill="none"
            className="transition-transform duration-500 ease-editorial group-hover:translate-x-2"
            aria-hidden
          >
            <path
              d="M0 5 L26 5 M22 1 L26 5 L22 9"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
