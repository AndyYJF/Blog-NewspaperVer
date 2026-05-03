import { prisma } from "./prisma";
import { siteConfig } from "./utils";

export async function generateRssFeed() {
  const { url, title, tagline } = siteConfig();
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { author: true, category: true },
  });

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const items = posts
    .map((p) => {
      const link = `${url}/zh/posts/${p.slug}`;
      const pubDate = (p.publishedAt ?? p.createdAt).toUTCString();
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(p.excerpt ?? p.aiSummary ?? "")}</description>
      <author>${escape(p.author?.email ?? "")} (${escape(p.author?.name ?? "")})</author>
      ${p.category ? `<category>${escape(p.category.name)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(title)}</title>
    <link>${url}</link>
    <description>${escape(tagline)}</description>
    <language>zh-CN</language>
    <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
