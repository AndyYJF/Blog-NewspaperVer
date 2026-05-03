import { auth } from "@/lib/auth";
import { summarizeArticle } from "@/lib/deepseek";
import { stripMarkdown } from "@/lib/markdown";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  content: z.string().min(20),
  locale: z.enum(["zh", "en"]).optional().default("zh"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const text = stripMarkdown(parsed.data.content);
    const summary = await summarizeArticle(parsed.data.title, text, parsed.data.locale);
    return NextResponse.json({ summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
