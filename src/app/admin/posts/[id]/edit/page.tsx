import { prisma } from "@/lib/prisma";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { tags: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  return (
    <MarkdownEditor
      categories={categories}
      tags={tags}
      initial={{
        id: post.id,
        title: post.title,
        titleEn: post.titleEn,
        slug: post.slug,
        excerpt: post.excerpt,
        excerptEn: post.excerptEn,
        content: post.content,
        coverImage: post.coverImage,
        coverCaption: post.coverCaption,
        status: post.status as "draft" | "published",
        featured: post.featured,
        categoryId: post.categoryId,
        aiSummary: post.aiSummary,
        tagIds: post.tags.map((t) => t.id),
      }}
    />
  );
}
