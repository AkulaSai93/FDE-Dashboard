"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Flame } from "lucide-react";
import { CommandSearch } from "./CommandSearch";
import { Breadcrumbs, cx } from "@/components/ui";
import { ALL_NAV_ITEMS } from "./nav";
import { MODULE_BY_ID, PHASE_BY_ID, TOPIC_BY_ID } from "@/data/curriculum";
import { PROJECT_BY_ID } from "@/data/projects";
import { NOTIFICATIONS } from "@/data/activity";
import { USER } from "@/data/user";

function useBreadcrumbs() {
  const pathname = usePathname();
  return React.useMemo(() => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "FDE Program", href: "/dashboard" }];
    const seg = pathname.split("/").filter(Boolean);
    if (seg.length === 0) return crumbs;

    if (seg[0] === "learn" && seg[1]) {
      const topic = TOPIC_BY_ID.get(seg[1]);
      if (topic) {
        const phase = PHASE_BY_ID.get(topic.phaseId)!;
        const mod = MODULE_BY_ID.get(topic.moduleId)!;
        crumbs.push(
          { label: `Phase ${phase.code}`, href: `/curriculum?phase=${phase.id}` },
          { label: `Module ${mod.code}`, href: `/curriculum?phase=${phase.id}&module=${mod.id}` },
          { label: topic.title },
        );
        return crumbs;
      }
    }

    if (seg[0] === "projects" && seg[1]) {
      crumbs.push({ label: "Projects", href: "/projects" }, { label: PROJECT_BY_ID.get(seg[1])?.short ?? seg[1] });
      return crumbs;
    }

    if (seg[0] === "notes" && seg[1]) {
      crumbs.push({ label: "Notes", href: "/notes" }, { label: TOPIC_BY_ID.get(seg[1])?.title ?? seg[1] });
      return crumbs;
    }

    const nav = ALL_NAV_ITEMS.find((n) => n.href === "/" + seg[0]);
    crumbs.push({ label: nav?.label ?? seg[0] });
    return crumbs;
  }, [pathname]);
}

function Notifications() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="relative flex size-8.5 items-center justify-center rounded-md border border-line bg-card text-ink-2 transition-colors hover:border-line-hi hover:text-ink"
      >
        <Bell size={15} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-brand ring-2 ring-card" />
        )}
      </button>
      {open && (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line-hi bg-surface shadow-2xl shadow-black/70">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="display text-[13px] text-ink">Notifications</span>
            <span className="eyebrow">{unread} unread</span>
          </div>
          <ul className="max-h-[60vh] divide-y divide-[#1a1a1a] overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-card"
                >
                  <span className={cx("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-brand" : "bg-ink-4")} />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-ink">{n.title}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-ink-3">{n.body}</span>
                    <span className="eyebrow mt-1.5 block">{n.when}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className="flex size-8.5 items-center justify-center rounded-md border border-line-hi bg-card-hi text-[11px] font-semibold text-ink transition-colors hover:border-[#3a3a3a]"
      >
        {USER.initials}
      </button>
      {open && (
        <div className="animate-fade absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line-hi bg-surface shadow-2xl shadow-black/70">
          <div className="border-b border-line px-4 py-3.5">
            <p className="text-[13px] font-medium text-ink">{USER.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-3">{USER.email}</p>
            <p className="eyebrow mt-2">{USER.cohort} · Unlocked</p>
          </div>
          <div className="p-1.5">
            {[
              { href: "/settings", label: "Settings" },
              { href: "/certification", label: "Certificate" },
              { href: "/help", label: "Help & support" },
            ].map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2.5 py-2 text-[13px] text-ink-2 transition-colors hover:bg-card-hi hover:text-ink"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const crumbs = useBreadcrumbs();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="flex size-8.5 shrink-0 items-center justify-center rounded-md border border-line bg-card text-ink-2 transition-colors hover:text-ink lg:hidden"
      >
        <Menu size={16} />
      </button>

      <div className="hidden min-w-0 flex-1 md:block">
        <Breadcrumbs items={crumbs} />
      </div>
      <div className="flex-1 md:hidden" />

      <div className="flex shrink-0 items-center gap-2">
        <span className="mono hidden items-center gap-1.5 rounded-md border border-line bg-card px-2.5 py-1.5 text-[11px] text-ink-2 xl:inline-flex">
          <Flame size={12} className="text-brand-ink" />
          {USER.streakDays} day streak
        </span>
        <CommandSearch />
        <Notifications />
        <ProfileMenu />
      </div>
    </header>
  );
}
