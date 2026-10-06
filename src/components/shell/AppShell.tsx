"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Sidebar, SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NAV } from "./nav";
import { cx } from "@/components/ui";

const MOBILE_PRIMARY = NAV.flatMap((g) => g.items).filter((i) => i.primary);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The drawer is open only for the route it was opened on, so navigating
  // anywhere closes it without a render-then-correct pass.
  const [openFor, setOpenFor] = React.useState<string | null>(null);
  const menuOpen = openFor === pathname;
  const setMenuOpen = (v: boolean) => setOpenFor(v ? pathname : null);

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-dvh bg-bg">
      <Sidebar />

      {/* Mobile / tablet drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade absolute inset-0 bg-black/75 backdrop-blur-[2px]" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] border-r border-line shadow-2xl shadow-black/80">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 rounded-md p-1 text-ink-3 transition-colors hover:bg-card-hi hover:text-ink"
            >
              <X size={16} />
            </button>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom bar — the four destinations that carry the journey */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden">
        {MOBILE_PRIMARY.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/") ||
            (item.href === "/curriculum" && pathname.startsWith("/learn"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-ink" : "text-ink-3",
              )}
            >
              <span className={cx("absolute inset-x-5 top-0 h-0.5 rounded-b-full bg-brand transition-opacity", active ? "opacity-100" : "opacity-0")} />
              <Icon size={17} strokeWidth={1.75} className={active ? "text-brand-ink" : undefined} />
              {item.label.replace("My ", "")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/** Standard page container — one gutter rule across the whole product. */
export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 sm:py-8", className)}>{children}</div>;
}
