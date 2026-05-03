import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/animation/FadeIn";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = await prisma.category.findUnique({
    where: { slug: category },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        include: { author: true, category: true, tags: true },
      },
    },
  });

  if (!cat) notFound();

  return (
    <div className="container py-10">
      <header className="mb-12 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">Section</p>
        <h1 className="font-serif text-display-xl font-bold tracking-tightest">
          {locale === "en" && cat.nameEn ? cat.nameEn : cat.name}
        </h1>
        {cat.description && (
          <p className="mt-2 italic text-muted">{cat.description}</p>
        )}
      </header>
      <div className="space-y-2">
        {cat.posts.map((post, idx) => (
          <FadeIn key={post.id} delay={Math.min(idx * 0.04, 0.3)}>
            <PostCard post={post} locale={locale} layout="horizontal" />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
