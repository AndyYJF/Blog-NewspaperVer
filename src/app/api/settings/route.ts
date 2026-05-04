import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { settingsSchema, invalidateSettings } from "@/lib/settings";
import { z } from "zod";

const validKeys = settingsSchema.map((s) => s.key) as string[];

const updateSchema = z.object({
  values: z.record(z.string(), z.string()),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  // Build a list with schema metadata + current value (or env/default)
  const items = settingsSchema.map((s) => {
    const envVal = (s as { envVar?: string }).envVar
      ? process.env[(s as { envVar?: string }).envVar!]
      : undefined;
    const def = (s as { default: string }).default;
    return {
      key: s.key,
      label: s.label,
      type: s.type,
      group: s.group,
      order: s.order,
      secret: (s as { secret?: boolean }).secret ?? false,
      envVar: (s as { envVar?: string }).envVar,
      // Stored DB value, or fallback chain
      value: map[s.key] ?? envVal ?? def,
      // Indicate where the current value came from
      source: map[s.key] !== undefined ? "db" : envVal ? "env" : "default",
    };
  });

  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = Object.entries(parsed.data.values).filter(([k]) =>
    validKeys.includes(k)
  );

  // Persist as upserts
  await Promise.all(
    updates.map(async ([key, value]) => {
      const meta = settingsSchema.find((s) => s.key === key)!;
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          type: meta.type,
          label: meta.label,
          group: meta.group,
          order: meta.order,
          secret: (meta as { secret?: boolean }).secret ?? false,
        },
      });
    })
  );

  invalidateSettings();

  return NextResponse.json({ ok: true, updated: updates.length });
}
