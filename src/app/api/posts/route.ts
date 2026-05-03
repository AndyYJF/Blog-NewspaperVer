import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readingTime, slugify } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  excerptEn: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  coverCaption: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().optional().default(false),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  aiSummary: z.string().optional().nullable(),
});

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: true, author: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  const exists = await prisma.post.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const author = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });

  const post = await prisma.post.create({
    data: {
      slug,
      title: data.title,
      titleEn: data.titleEn ?? null,
      excerpt: data.excerpt ?? null,
      excerptEn: data.excerptEn ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      coverCaption: data.coverCaption ?? null,
      status: data.status,
      featured: data.featured ?? false,
      readingTime: readingTime(data.content),
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: author.id,
      categoryId: data.categoryId || null,
      aiSummary: data.aiSummary ?? null,
      tags: data.tagIds.length ? { connect: data.tagIds.map((id) => ({ id })) } : undefined,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
