import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { url } = await getSiteConfig();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
