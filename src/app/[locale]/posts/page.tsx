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
    <div className="container py-10">
      <header className="mb-12 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">All</p>
        <h1 className="font-serif text-display-xl font-bold tracking-tightest">
          {t("posts")}
        </h1>
        <p className="mt-2 italic text-muted">
          {locale === "zh" ? `共 ${posts.length} 篇` : `${posts.length} essays`}
        </p>
      </header>

      <div className="space-y-2">
        {posts.map((post, idx) => (
          <FadeIn key={post.id} delay={Math.min(idx * 0.04, 0.3)}>
            <PostCard post={post} locale={locale} layout="horizontal" />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
