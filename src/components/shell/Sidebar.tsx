"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { NAV } from "./nav";
import { Wordmark } from "./Logo";
import { cx, ProgressBar } from "@/components/ui";
import { useRollups } from "@/state/progress";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { program, phasesCompleted, totals } = useRollups();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-14 shrink-0 items-center border-b border-line px-4">
        <Link href="/dashboard" onClick={onNavigate} className="min-w-0 rounded-md">
          <Wordmark />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={gi} className={cx(gi > 0 && "mt-5 border-t border-line-soft pt-5")}>
            {group.label && <div className="eyebrow mb-2 px-2.5">{group.label}</div>}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
                  (item.href === "/curriculum" && pathname.startsWith("/learn"));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors duration-150",
                        active
                          ? "bg-card-hi font-medium text-ink"
                          : item.locked
                            ? "text-ink-4 hover:bg-card hover:text-ink-3"
                            : "text-ink-2 hover:bg-card hover:text-ink",
                      )}
                    >
                      {/* Red accent indicator — not a red pill */}
                      <span
                        className={cx(
                          "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-brand transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon
                        size={15}
                        strokeWidth={1.75}
                        className={cx("shrink-0", active ? "text-brand-ink" : "text-current")}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.locked && <Lock size={11} className="shrink-0 text-ink-4" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Persistent programme progress — the one number always on screen */}
      <div className="shrink-0 border-t border-line p-3">
        <Link
          href="/journey"
          onClick={onNavigate}
          className="block rounded-lg border border-line bg-card p-3 transition-colors hover:border-line-hi hover:bg-card-hi"
        >
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Program</span>
            <span className="display nums text-[15px] text-ink">{program.percent}%</span>
          </div>
          <ProgressBar value={program.percent} size="sm" className="mt-2.5" />
          <p className="nums mt-2.5 text-[11px] text-ink-3">
            {phasesCompleted} of {totals.phases} phases · {program.completed}/{program.total} topics
          </p>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-line lg:block">
      <SidebarContent />
    </aside>
  );
}
