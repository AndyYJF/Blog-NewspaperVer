import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const session = await auth();
  const { title, tagline, url } = siteConfig();

  return (
    <div className="p-10">
      <header className="mb-10 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">Configuration</p>
        <h1 className="font-serif text-4xl font-bold tracking-tightest">Settings</h1>
      </header>

      <section className="max-w-2xl space-y-8">
        <div>
          <p className="eyebrow mb-1">Editor</p>
          <p className="font-serif text-lg">{session?.user?.name ?? "—"}</p>
          <p className="font-sans text-sm text-muted">{session?.user?.email}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">Site title</p>
          <p className="font-serif text-lg">{title}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">Tagline</p>
          <p className="font-serif text-lg italic">{tagline}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">URL</p>
          <p className="font-mono text-sm">{url}</p>
        </div>
        <p className="rounded-sm border border-rule bg-subtle/40 p-4 font-sans text-sm italic text-muted">
          这些设置当前由 <code className="rounded-sm bg-paper px-1">.env</code> 管理。
          修改 <code className="rounded-sm bg-paper px-1">NEXT_PUBLIC_SITE_TITLE</code>、
          <code className="rounded-sm bg-paper px-1">NEXT_PUBLIC_SITE_TAGLINE</code> 等变量后重启即可生效。
        </p>
      </section>
    </div>
  );
}
