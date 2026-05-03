import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = siteConfig();
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = ["", "/posts", "/archive", "/about"].flatMap((p) =>
    ["zh", "en"].map((loc) => ({
      url: `${url}/${loc}${p}`,
      lastModified: new Date(),
    }))
  );

  const postRoutes = posts.flatMap((p) =>
    ["zh", "en"].map((loc) => ({
      url: `${url}/${loc}/posts/${p.slug}`,
      lastModified: p.updatedAt,
    }))
  );

  return [...staticRoutes, ...postRoutes];
}
