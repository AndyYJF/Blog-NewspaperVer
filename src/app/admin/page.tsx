import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminDashboard() {
  const [total, published, drafts, viewsAgg, recent] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { category: true },
    }),
  ]);

  const stats = [
    { label: "Total Posts", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Total Views", value: viewsAgg._sum.views ?? 0 },
  ];

  return (
    <div className="p-10">
      <header className="mb-10 flex items-center justify-between border-b-2 border-ink pb-6">
        <div>
          <p className="eyebrow text-accent">Editorial Desk</p>
          <h1 className="font-serif text-4xl font-bold tracking-tightest">Dashboard</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-sans text-sm uppercase tracking-widest text-paper transition-colors hover:bg-accent hover:border-accent"
        >
          <Plus className="size-4" />
          New Post
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-l-2 border-accent bg-subtle/30 p-5">
            <p className="eyebrow">{s.label}</p>
            <p className="mt-2 font-serif text-4xl font-bold">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="eyebrow mb-4 border-b border-rule pb-2">Recent edits</h2>
        <ul className="divide-y divide-rule">
          {recent.map((p) => (
            <li key={p.id} className="py-4">
              <Link
                href={`/admin/posts/${p.id}/edit`}
                className="group flex items-baseline justify-between gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-sans text-[10px] uppercase tracking-widest ${
                      p.status === "published" ? "text-accent" : "text-muted"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                    {p.title}
                  </span>
                </div>
                <span className="font-sans text-xs uppercase tracking-widest text-muted">
                  {formatDate(p.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
          {!recent.length && (
            <li className="py-12 text-center italic text-muted">No drafts yet — start writing.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
