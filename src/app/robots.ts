import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const { url } = siteConfig();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
