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
    <div className="container py-12">
      <header className="mb-16 grid gap-6 border-b-2 border-ink pb-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="eyebrow text-accent">Section</p>
          <h1 className="masthead mt-3 text-display-2xl">
            {locale === "en" && cat.nameEn ? cat.nameEn : cat.name}
          </h1>
          {cat.description && (
            <p className="mt-3 font-italic italic text-lg text-muted">
              {cat.description}
            </p>
          )}
        </div>
        <div className="hidden md:col-span-4 md:flex md:items-end md:justify-end">
          <span className="font-display text-[6rem] leading-none text-accent/30">
            {String(cat.posts.length).padStart(2, "0")}
          </span>
        </div>
      </header>
      <div>
        {cat.posts.map((post, idx) => (
          <FadeIn key={post.id} delay={Math.min(idx * 0.04, 0.3)}>
            <PostCard post={post} locale={locale} layout="horizontal" index={idx} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
