import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes — JWT check only, no full auth() wrap (avoids cookie bloat).
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      salt: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API / static / feeds — bypass i18n
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
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
