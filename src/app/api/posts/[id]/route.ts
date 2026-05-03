import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readingTime, slugify } from "@/lib/utils";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(),
  titleEn: z.string().optional().nullable(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  excerptEn: z.string().optional().nullable(),
  content: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  coverCaption: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  aiSummary: z.string().optional().nullable(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true, category: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const slug = data.slug ? slugify(data.slug) : undefined;
  const updates: Record<string, unknown> = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
    ...(slug && { slug }),
    ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
    ...(data.excerptEn !== undefined && { excerptEn: data.excerptEn }),
    ...(data.content !== undefined && { content: data.content, readingTime: readingTime(data.content) }),
    ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
    ...(data.coverCaption !== undefined && { coverCaption: data.coverCaption }),
    ...(data.featured !== undefined && { featured: data.featured }),
    ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    ...(data.aiSummary !== undefined && { aiSummary: data.aiSummary }),
  };

  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "published") {
      const cur = await prisma.post.findUnique({ where: { id } });
      if (cur && !cur.publishedAt) updates.publishedAt = new Date();
    }
  }

  if (data.tagIds) {
    updates.tags = { set: data.tagIds.map((tid) => ({ id: tid })) };
  }

  const post = await prisma.post.update({ where: { id }, data: updates });
  return NextResponse.json(post);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
