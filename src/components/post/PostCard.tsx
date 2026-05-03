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
}: {
  post: PostWithRelations;
  locale: string;
  layout?: "horizontal" | "vertical";
}) {
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const href = `/${locale}/posts/${post.slug}`;

  if (layout === "vertical") {
    return (
      <article className="group flex flex-col gap-4">
        {post.coverImage && (
          <Link href={href} className="block overflow-hidden bg-subtle">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>
        )}
        <div className="flex flex-col gap-2">
          {post.category && (
            <Link
              href={`/${locale}/categories/${post.category.slug}`}
              className="eyebrow w-fit text-accent"
            >
              {post.category.name}
            </Link>
          )}
          <Link href={href}>
            <h3 className="font-serif text-2xl font-bold leading-tight tracking-tightest transition-colors group-hover:text-accent">
              {title}
            </h3>
          </Link>
          {excerpt && <p className="line-clamp-3 text-muted">{excerpt}</p>}
          <p className="eyebrow mt-1">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
            {post.readingTime ? ` · ${post.readingTime} min` : ""}
          </p>
        </div>
      </article>
    );
  }

  // 横版
  return (
    <article className="group grid gap-6 border-b border-rule pb-8 md:grid-cols-[40%,1fr] md:gap-10 md:pb-12">
      {post.coverImage && (
        <Link href={href} className="block overflow-hidden bg-subtle">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Link>
      )}
      <div className="flex flex-col justify-center gap-3">
        <div className="flex items-center gap-3">
          {post.category && (
            <Link href={`/${locale}/categories/${post.category.slug}`} className="eyebrow text-accent">
              {post.category.name}
            </Link>
          )}
          <span className="eyebrow text-muted">
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </span>
        </div>
        <Link href={href}>
          <h3 className="font-serif text-3xl font-bold leading-tight tracking-tightest transition-colors group-hover:text-accent md:text-4xl">
            {title}
          </h3>
        </Link>
        {excerpt && <p className="text-lg leading-relaxed text-muted">{excerpt}</p>}
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-sans text-muted">{post.author?.name}</span>
          <span className="size-1 rounded-full bg-rule" />
          <span className="eyebrow">{post.readingTime} min</span>
        </div>
      </div>
    </article>
  );
}
