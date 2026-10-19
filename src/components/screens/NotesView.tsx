"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Check, FileText, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, EmptyState, FilterChips, SectionHeading, cx } from "@/components/ui";
import { PHASES, hash, type Topic } from "@/data/curriculum";
import { useProgress, useRollups } from "@/state/progress";

type Scope = "all" | "bookmarked" | "unread";

const readMinutes = (id: string) => 4 + (hash(id) % 7);

export function NotesView() {
  const { topics } = useProgress();
  const { currentPhase } = useRollups();
  const [q, setQ] = React.useState("");
  const [scope, setScope] = React.useState<Scope>("all");
  const [phaseId, setPhaseId] = React.useState(currentPhase.id);

  const needle = q.trim().toLowerCase();
  const filtering = needle.length > 0 || scope !== "all";

  const matches = (t: Topic) => {
    if (needle && !t.title.toLowerCase().includes(needle)) return false;
    if (scope === "bookmarked" && !topics[t.id]?.bookmarked) return false;
    if (scope === "unread" && topics[t.id]?.status === "completed") return false;
    return true;
  };

  const bookmarked = Object.values(topics).filter((t) => t.bookmarked).length;
  // While searching or filtering, show matches from every phase; otherwise just the selected one.
  const phases = filtering ? PHASES : PHASES.filter((p) => p.id === phaseId);
  const groups = phases
    .map((p) => ({
      p,
      modules: p.modules.map((m) => ({ m, ts: m.topics.filter(matches) })).filter((x) => x.ts.length > 0),
    }))
    .filter((g) => g.modules.length > 0);
  const shown = groups.reduce((a, g) => a + g.modules.reduce((b, x) => b + x.ts.length, 0), 0);

  return (
    <Page className="space-y-7">
      <SectionHeading
        decor="study"
        eyebrow="Notes"
        title="Structured notes"
        description="Module-by-module notes that follow the videos, so you revise in minutes instead of rewatching hours."
      />

      {/* --------------------------------------------------------- toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search all notes…"
            aria-label="Search notes"
            className="h-10 w-full rounded-[var(--radius-md)] border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink">
              <X size={13} />
            </button>
          )}
        </div>
        <FilterChips
          options={[
            { value: "all", label: "All" },
            { value: "bookmarked", label: `Bookmarked · ${bookmarked}` },
            { value: "unread", label: "Not read yet" },
          ]}
          value={scope}
          onChange={setScope}
        />
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ------------------------------------------------------ phases */}
        <nav aria-label="Phases" className={cx("min-w-0 lg:sticky lg:top-20 lg:self-start", filtering && "opacity-40")}>
          <ul className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible">
            {PHASES.map((p) => {
              const count = p.modules.reduce((a, m) => a + m.topics.length, 0);
              const active = !filtering && p.id === phaseId;
              return (
                <li key={p.id} className="shrink-0">
                  <button
                    onClick={() => { setPhaseId(p.id); setQ(""); setScope("all"); }}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-left transition-colors",
                      active ? "bg-card text-ink ring-1 ring-line-hi" : "text-ink-3 hover:bg-card/60 hover:text-ink-2",
                    )}
                  >
                    <span className={cx("mono text-[11px]", active ? "text-notes" : "text-ink-4")}>{p.code}</span>
                    <span className="truncate text-[13px] lg:flex-1">{p.title}</span>
                    <span className="nums hidden text-[11px] text-ink-4 lg:inline">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ------------------------------------------------------ notes */}
        <div className="min-w-0">
          {shown === 0 ? (
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
            <div className="space-y-9">
              {filtering && <p className="nums text-[13px] text-ink-3">{shown} notes found across all phases</p>}
              {groups.map(({ p, modules }) => (
                <div key={p.id} className="space-y-7">
                  {filtering ? (
                    <h2 className="display text-[18px] text-ink">
                      <span className="mono mr-2 text-[12px] text-notes">P{p.code}</span>
                      {p.title}
                    </h2>
                  ) : (
                    <div>
                      <p className="mono text-[11px] uppercase tracking-[0.12em] text-notes">Phase {p.code}</p>
                      <h2 className="display mt-1.5 text-[24px] font-light leading-tight text-ink">{p.title}</h2>
                    </div>
                  )}

                  {modules.map(({ m, ts }) => (
                    <section key={m.id}>
                      <div className="mb-3 flex items-baseline gap-2.5 border-b border-line pb-2.5">
                        <span className="mono text-[11px] text-ink-4">{m.code}</span>
                        <h3 className="text-[14px] font-medium text-ink-2">{m.title}</h3>
                        <span className="nums ml-auto text-[11px] text-ink-4">{ts.length} notes</span>
                      </div>
                      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                        {ts.map((t) => {
                          const read = topics[t.id]?.status === "completed";
                          const saved = topics[t.id]?.bookmarked;
                          return (
                            <li key={t.id}>
                              <Link
                                href={`/notes/${t.id}`}
                                className="group flex h-full items-start gap-3 rounded-[var(--radius-md)] border border-line bg-card p-3.5 transition-colors hover:border-notes/40 hover:bg-card-hi"
                              >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-notes/12 text-notes">
                                  <FileText size={16} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="line-clamp-2 text-[13.5px] leading-snug text-ink transition-colors group-hover:text-notes">{t.title}</span>
                                  <span className="mt-1.5 flex items-center gap-2 text-[11.5px] text-ink-3">
                                    <span className="nums">{readMinutes(t.id)} min read</span>
                                    {read && (
                                      <span className="inline-flex items-center gap-1 text-done">
                                        <Check size={11} strokeWidth={3} /> Read
                                      </span>
                                    )}
                                  </span>
                                </span>
                                {saved && <Bookmark size={13} fill="currentColor" className="mt-0.5 shrink-0 text-brand-ink" />}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
