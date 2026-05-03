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
    <section className="grid gap-8 border-b border-ink/70 pb-12 md:grid-cols-12 md:gap-10">
      {post.coverImage && (
        <Link
          href={href}
          className="group relative col-span-12 block overflow-hidden bg-subtle md:col-span-7"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          {post.coverCaption && (
            <p className="mt-2 font-sans text-xs italic text-muted">{post.coverCaption}</p>
          )}
        </Link>
      )}

      <div className="col-span-12 flex flex-col justify-center md:col-span-5">
        {post.category && (
          <Link
            href={`/${locale}/categories/${post.category.slug}`}
            className="eyebrow mb-4 w-fit text-accent"
          >
            {post.category.name}
          </Link>
        )}
        <Link href={href}>
          <h2 className="font-serif text-display-xl font-bold leading-[1.05] tracking-tightest transition-colors hover:text-accent">
            {title}
          </h2>
        </Link>
        {excerpt && (
          <p className="mt-5 text-xl italic leading-relaxed text-muted">{excerpt}</p>
        )}
        <div className="mt-8 flex items-center gap-4 font-sans text-sm">
          <span className="text-ink">{post.author?.name}</span>
          <span className="size-1 rounded-full bg-rule" />
          <span className="text-muted">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
          <span className="size-1 rounded-full bg-rule" />
          <span className="eyebrow">{post.readingTime} min</span>
        </div>
      </div>
    </section>
  );
}
