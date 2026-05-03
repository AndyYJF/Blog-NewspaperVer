import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Admin 路由保护（不参与 i18n）
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API / 静态资源 / RSS 跳过 i18n
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname === "/rss.xml" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
