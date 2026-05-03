import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: true },
  });

  return (
    <div className="p-10">
      <header className="mb-10 flex items-center justify-between border-b-2 border-ink pb-6">
        <div>
          <p className="eyebrow text-accent">Manuscripts</p>
          <h1 className="font-serif text-4xl font-bold tracking-tightest">Posts</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-sans text-sm uppercase tracking-widest text-paper transition-colors hover:bg-accent hover:border-accent"
        >
          <Plus className="size-4" />
          New
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-3 text-left font-medium uppercase tracking-widest">Title</th>
              <th className="py-3 text-left font-medium uppercase tracking-widest">Section</th>
              <th className="py-3 text-left font-medium uppercase tracking-widest">Status</th>
              <th className="py-3 text-left font-medium uppercase tracking-widest">Updated</th>
              <th className="py-3 text-right" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-rule">
                <td className="py-4 pr-4 font-serif text-base">{p.title}</td>
                <td className="py-4 pr-4 text-muted">{p.category?.name ?? "—"}</td>
                <td className="py-4 pr-4">
                  <span
                    className={`inline-block rounded-sm border px-2 py-0.5 text-xs uppercase tracking-widest ${
                      p.status === "published"
                        ? "border-accent text-accent"
                        : "border-rule text-muted"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-4 pr-4 text-xs uppercase tracking-widest text-muted">
                  {formatDate(p.updatedAt)}
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`/admin/posts/${p.id}/edit`}
                    className="inline-flex items-center gap-1 border border-rule px-3 py-1 transition-colors hover:bg-subtle"
                  >
                    <Pencil className="size-3" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr>
                <td colSpan={5} className="py-16 text-center italic text-muted">
                  No posts yet. <Link href="/admin/posts/new" className="link-magazine text-accent">Create your first one.</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
