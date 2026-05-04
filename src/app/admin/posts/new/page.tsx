import { prisma } from "@/lib/prisma";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";

// Editor preview renders KaTeX + highlight.js — load CSS only here.
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.min.css";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <MarkdownEditor categories={categories} tags={tags} />;
}
