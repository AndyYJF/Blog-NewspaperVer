import { auth } from "@/lib/auth";
import { settingsSchema } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  // Build the same payload the API would return (saves a round trip on first paint)
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;

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
      value: map[s.key] ?? envVal ?? def,
      source: (map[s.key] !== undefined
        ? "db"
        : envVal
        ? "env"
        : "default") as "db" | "env" | "default",
    };
  });

  return (
    <div className="p-10">
      <header className="mb-10 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">Configuration</p>
        <h1 className="masthead mt-3 text-display-xl">Settings</h1>
        <p className="mt-3 max-w-2xl font-italic italic text-muted">
          所有变量将立即生效。优先级：数据库 &gt; <code className="bg-subtle px-1 font-mono">.env</code> &gt;
          内置默认值。修改后保存即可，无需重启服务。
        </p>
        <p className="mt-2 font-sans text-[11px] uppercase tracking-eyebrow text-muted">
          Logged in as <strong className="text-ink">{session?.user?.email}</strong>
        </p>
      </header>

      <SettingsForm initial={items} />
    </div>
  );
}
