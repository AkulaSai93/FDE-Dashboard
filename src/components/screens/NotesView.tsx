"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, FileText, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, EmptyState, FilterChips, SectionHeading, StatusDot, cx } from "@/components/ui";
import { PHASES, hash } from "@/data/curriculum";
import { useProgress, useRollups } from "@/state/progress";

type Scope = "all" | "bookmarked" | "unread";

export function NotesView() {
  const { topics } = useProgress();
  const { currentPhase } = useRollups();
  const [q, setQ] = React.useState("");
  const [scope, setScope] = React.useState<Scope>("all");
  const [open, setOpen] = React.useState<Set<string>>(() => new Set([currentPhase.id]));

  const needle = q.trim().toLowerCase();
  const searching = needle.length > 0 || scope !== "all";

  const matches = (topicId: string, title: string) => {
    if (needle && !title.toLowerCase().includes(needle)) return false;
    if (scope === "bookmarked" && !topics[topicId]?.bookmarked) return false;
    if (scope === "unread" && topics[topicId]?.status === "completed") return false;
    return true;
  };

  const total = PHASES.reduce(
    (a, p) => a + p.modules.reduce((b, m) => b + m.topics.filter((t) => matches(t.id, t.title)).length, 0),
    0,
  );

  const bookmarked = Object.values(topics).filter((t) => t.bookmarked).length;

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Notes"
        title="Structured notes for every topic"
        description="Module-by-module notes that follow the videos, so you revise in minutes instead of rewatching hours. Written like developer documentation, not slide dumps."
        action={
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3">
            <Bookmark size={14} className="text-brand-ink" fill="currentColor" />
            <span className="nums text-[13px] text-ink-2">{bookmarked} bookmarked</span>
          </div>
        }
      />

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes"
            className="h-9 w-full rounded-md border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
          />
          {q && <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"><X size={13} /></button>}
        </div>
        <FilterChips
          options={[
            { value: "all", label: "All notes" },
            { value: "bookmarked", label: "Bookmarked" },
            { value: "unread", label: "Not yet read" },
          ]}
          value={scope}
          onChange={setScope}
        />
        <span className="nums ml-auto text-[12px] text-ink-3">{total} notes</span>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={<FileText size={28} strokeWidth={1.5} />}
          title={scope === "bookmarked" ? "No bookmarked notes yet" : "No notes match"}
          description={
            scope === "bookmarked"
              ? "Bookmark a note from any lesson and it will collect here for revision."
              : "Try a different search term, or switch back to all notes."
          }
          action={<Button size="sm" variant="secondary" onClick={() => { setQ(""); setScope("all"); }}>Clear filters</Button>}
        />
      ) : (
        <div className="space-y-3">
          {PHASES.map((phase) => {
            const visibleModules = phase.modules
              .map((m) => ({ m, ts: m.topics.filter((t) => matches(t.id, t.title)) }))
              .filter((x) => x.ts.length > 0);
            if (visibleModules.length === 0) return null;
            const isOpen = searching || open.has(phase.id);
            const noteCount = visibleModules.reduce((a, x) => a + x.ts.length, 0);

            return (
              <section key={phase.id} className="overflow-hidden rounded-xl border border-line bg-card">
                <button
                  onClick={() =>
                    setOpen((s) => {
                      const n = new Set(s);
                      if (n.has(phase.id)) n.delete(phase.id);
                      else n.add(phase.id);
                      return n;
                    })
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-card-hi"
                >
                  <ChevronDown size={14} className={cx("shrink-0 text-ink-3 transition-transform", isOpen && "rotate-180")} />
                  <span className="mono shrink-0 text-[11px] tracking-[0.1em] text-ink-3">PHASE {phase.code}</span>
                  <span className="display truncate text-[15px] text-ink">{phase.title}</span>
                  <span className="nums ml-auto shrink-0 text-[11px] text-ink-3">{noteCount} notes</span>
                </button>

                {isOpen && (
                  <div className="animate-fade border-t border-line">
                    {visibleModules.map(({ m, ts }) => (
                      <div key={m.id} className="border-b border-line-soft last:border-0">
                        <div className="flex items-baseline gap-2.5 bg-bg-sub px-4 py-2.5">
                          <span className="mono text-[10px] tracking-[0.08em] text-ink-4">{m.code}</span>
                          <span className="text-[12px] font-medium text-ink-2">{m.title}</span>
                          <span className="nums ml-auto text-[10px] text-ink-4">{ts.length}</span>
                        </div>
                        <ul className="p-1.5">
                          {ts.map((t) => (
                            <li key={t.id}>
                              <Link href={`/notes/${t.id}`} className="group flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors hover:bg-card-hi">
                                <StatusDot status={topics[t.id]?.status ?? "not-started"} size={13} />
                                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2 transition-colors group-hover:text-ink">{t.title}</span>
                                {topics[t.id]?.bookmarked && <Bookmark size={11} fill="currentColor" className="shrink-0 text-brand-ink" />}
                                <span className="nums shrink-0 text-[10px] text-ink-4">{4 + (hash(t.id) % 7)} min read</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </Page>
  );
}
