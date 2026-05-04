import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/animation/FadeIn";
import { notFound } from "next/navigation";

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  const tagRecord = await prisma.tag.findUnique({
    where: { slug: tag },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        include: { author: true, category: true, tags: true },
      },
    },
  });

  if (!tagRecord) notFound();

  return (
    <div className="container py-12">
      <header className="mb-16 border-b-2 border-ink pb-8">
        <p className="eyebrow text-accent">Tag</p>
        <h1 className="masthead mt-3 flex items-baseline gap-3 text-display-2xl">
          <span className="text-accent" aria-hidden>#</span>
          <span>{tagRecord.name}</span>
        </h1>
        <p className="mt-3 font-italic italic text-lg text-muted">
          {locale === "zh"
            ? `共 ${tagRecord.posts.length} 篇与该标签相关`
            : `${tagRecord.posts.length} essays under this tag`}
        </p>
      </header>
      <div>
        {tagRecord.posts.map((post, idx) => (
          <FadeIn key={post.id} delay={Math.min(idx * 0.04, 0.3)}>
            <PostCard post={post} locale={locale} layout="horizontal" index={idx} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
