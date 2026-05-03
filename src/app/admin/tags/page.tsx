import { prisma } from "@/lib/prisma";

export default async function AdminTagsPage() {
  const [tags, categories] = await Promise.all([
    prisma.tag.findMany({
      include: { posts: { select: { id: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      include: { posts: { select: { id: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="p-10">
      <header className="mb-10 border-b-2 border-ink pb-6">
        <p className="eyebrow text-accent">Taxonomy</p>
        <h1 className="font-serif text-4xl font-bold tracking-tightest">Tags & Sections</h1>
      </header>

      <div className="grid gap-12 md:grid-cols-2">
        <section>
          <h2 className="eyebrow mb-4 border-b border-rule pb-2">Sections</h2>
          <ul className="divide-y divide-rule">
            {categories.map((c) => (
              <li key={c.id} className="flex items-baseline justify-between py-3">
                <span className="font-serif text-lg">{c.name}</span>
                <span className="font-sans text-xs uppercase tracking-widest text-muted">
                  {c.posts.length} posts
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="eyebrow mb-4 border-b border-rule pb-2">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t.id}
                className="border border-rule px-3 py-1 font-sans text-xs uppercase tracking-widest"
              >
                {t.name} <span className="text-muted">({t.posts.length})</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
