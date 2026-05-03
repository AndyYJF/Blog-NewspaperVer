import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LayoutDashboard, FileText, Tags, Settings, LogOut, ExternalLink } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // 登录页特殊处理
  // 由于这是布局，需要让 children 在登录时也能渲染
  // 中间件已经做了未登录跳转，这里只给已登录的人看完整布局
  if (!session?.user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    );
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/tags", label: "Tags", icon: Tags },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="grid min-h-screen grid-cols-[240px,1fr]">
        {/* Sidebar */}
        <aside className="border-r border-rule bg-subtle/40">
          <div className="border-b border-rule px-6 py-5">
            <p className="masthead text-xl">Editor</p>
            <p className="font-sans text-xs uppercase tracking-widest text-muted">
              {session.user.email}
            </p>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-sm px-3 py-2 font-sans text-sm transition-colors hover:bg-subtle"
              >
                <item.icon className="size-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            ))}
            <Link
              href="/zh"
              target="_blank"
              className="mt-4 flex items-center gap-3 rounded-sm px-3 py-2 font-sans text-sm text-muted transition-colors hover:text-ink"
            >
              <ExternalLink className="size-4" strokeWidth={1.5} />
              View site
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="mt-1 flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left font-sans text-sm text-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                <LogOut className="size-4" strokeWidth={1.5} />
                Sign out
              </button>
            </form>
          </nav>
        </aside>

        <div className="overflow-x-hidden">{children}</div>
      </div>
    </ThemeProvider>
  );
}

// 防止 NextAuth 在登录页之外渲染前导致重定向丢失状态
export async function ensureLoggedIn() {
  const s = await auth();
  if (!s?.user) redirect("/admin/login");
  return s;
}
