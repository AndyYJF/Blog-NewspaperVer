import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/animation/FadeIn";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true, tags: true },
  });

  return (
    <div className="container py-12">
      <header className="mb-16 grid gap-6 border-b-2 border-ink pb-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="eyebrow text-accent">All Essays</p>
          <h1 className="masthead mt-3 text-display-2xl">{t("posts")}</h1>
          <p className="mt-3 font-italic italic text-lg text-muted">
            {locale === "zh"
              ? `共 ${posts.length} 篇文章 · 按发表时间倒序`
              : `${posts.length} essays · sorted by date`}
          </p>
        </div>
        <div className="hidden md:col-span-4 md:flex md:items-end md:justify-end">
          <span className="font-display text-[6rem] leading-none text-accent/30">
            {String(posts.length).padStart(2, "0")}
          </span>
        </div>
      </header>

      <div>
        {posts.map((post, idx) => (
          <FadeIn key={post.id} delay={Math.min(idx * 0.04, 0.3)}>
            <PostCard
              post={post}
              locale={locale}
              layout="horizontal"
              index={idx}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
