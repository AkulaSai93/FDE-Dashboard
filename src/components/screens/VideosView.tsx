"use client";

import * as React from "react";
import Link from "next/link";
import { Check, LayoutGrid, List, Play, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, Dropdown, EmptyState, FilterChips, LessonArt, ProgressBar, SectionHeading, StatTile } from "@/components/ui";
import { ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration } from "@/data/curriculum";
import { useProgress } from "@/state/progress";
import { cx } from "@/components/ui";

type Filter = "all" | "completed" | "in-progress" | "not-started";

/** One hue per phase, so a lesson's thumbnail tells you where it sits. */
const PAGE = 24;
const VIEW_KEY = "fde-lms:videos-view";

export function VideosView() {
  const { topics } = useProgress();
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [phase, setPhase] = React.useState("all");
  const [shown, setShown] = React.useState(PAGE);
  // Grid or list — remembered per browser; storage may be unavailable, so it's best-effort.
  const [view, setView] = React.useState<"grid" | "list">("grid");
  React.useEffect(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY);
      // localStorage is an external store read once after mount, so it can't break hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v === "grid" || v === "list") setView(v);
    } catch { /* storage unavailable — default to grid */ }
  }, []);
  const changeView = (v: "grid" | "list") => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch { /* not persisted */ }
  };

  const needle = q.trim().toLowerCase();

  const rows = ALL_TOPICS.filter((t) => {
    const s = topics[t.id]?.status ?? "not-started";
    if (filter !== "all" && s !== filter) return false;
    if (phase !== "all" && t.phaseId !== phase) return false;
    if (needle && !t.title.toLowerCase().includes(needle)) return false;
    return true;
  });

  const totalSeconds = ALL_TOPICS.reduce((a, t) => a + t.videoSeconds, 0);
  const watchedSeconds = ALL_TOPICS.reduce((a, t) => a + Math.min(t.videoSeconds, topics[t.id]?.videoPosition ?? 0), 0);
  const watchedCount = ALL_TOPICS.filter((t) => topics[t.id]?.status === "completed").length;
  const hrs = (s: number) => `${Math.round(s / 3600)} hr`;

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Videos"
        title="Every lesson in the programme"
        description="A flat index of all 371 lessons. This is a shortcut — the curriculum is still where each lesson sits in context."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile value={`${watchedCount}`} label="Lessons watched" accent sub={<ProgressBar value={(watchedCount / ALL_TOPICS.length) * 100} size="xs" />} />
        <StatTile value={hrs(watchedSeconds)} label="Watch time logged" sub={<span className="nums text-[11px] text-ink-3">of {hrs(totalSeconds)} total</span>} />
        <StatTile value={`${ALL_TOPICS.length - watchedCount}`} label="Lessons remaining" sub={<span className="nums text-[11px] text-ink-3">≈ {hrs(totalSeconds - watchedSeconds)} left</span>} />
      </div>

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-panel/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
            placeholder="Search lessons…"
            aria-label="Search lessons"
            className="h-9 w-full rounded-md border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink">
              <X size={13} />
            </button>
          )}
        </div>
        <Dropdown
          label="Phase"
          value={phase}
          onChange={(v) => { setPhase(v); setShown(PAGE); }}
          options={[{ value: "all", label: "All phases" }, ...PHASES.map((p) => ({ value: p.id, label: `Phase ${p.code} — ${p.title}` }))]}
        />
        <FilterChips
          options={[
            { value: "all", label: "All" },
            { value: "completed", label: "Watched" },
            { value: "in-progress", label: "In progress" },
            { value: "not-started", label: "Unwatched" },
          ]}
          value={filter}
          onChange={(v) => { setFilter(v); setShown(PAGE); }}
        />
        <span className="nums ml-auto text-[12px] text-ink-3">{rows.length} lessons</span>
        <div role="group" aria-label="Layout" className="flex rounded-[var(--radius-md)] bg-card p-0.5 ring-1 ring-line">
          {([["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]] as const).map(([v, Icon, label]) => (
            <button
              key={v}
              onClick={() => changeView(v)}
              aria-pressed={view === v}
              aria-label={label}
              title={label}
              className={cx(
                "flex size-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
                view === v ? "bg-card-hi2 text-ink" : "text-ink-3 hover:text-ink",
              )}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Play size={28} strokeWidth={1.5} />}
          title="No lessons match"
          description="Try clearing the phase or status filter."
          action={<Button size="sm" variant="secondary" onClick={() => { setQ(""); setFilter("all"); setPhase("all"); }}>Clear filters</Button>}
        />
      ) : (
        view === "list" ? (
        <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-lg)] border border-line">
          {rows.slice(0, shown).map((t) => {
            const s = topics[t.id]?.status ?? "not-started";
            const pos = topics[t.id]?.videoPosition ?? 0;
            const m = MODULE_BY_ID.get(t.moduleId)!;
            const p = PHASE_BY_ID.get(t.phaseId)!;
            return (
              <li key={t.id}>
                <Link href={`/learn/${t.id}`} className="group flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-card sm:px-4">
                  <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-card sm:w-36">
                    { }
                    <LessonArt topicId={t.id} compact />
                    <span className="nums absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] text-white">{formatDuration(t.videoSeconds)}</span>
                    {s !== "completed" && pos > 0 && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/25">
                        <span className="block h-full bg-brand" style={{ width: `${(pos / t.videoSeconds) * 100}%` }} />
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play size={16} fill="currentColor" strokeWidth={0} className="text-white" />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-ink transition-colors group-hover:text-brand-ink">{t.title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-3">
                      <span className="text-ink-2">P{p.code}</span> · {m.code} {m.title}
                    </span>
                  </span>
                  <span className="nums hidden w-14 shrink-0 text-right text-[12px] text-ink-3 sm:block">{formatDuration(t.videoSeconds)}</span>
                  <span
                    className={cx(
                      "hidden w-24 shrink-0 justify-center rounded-full px-2 py-1 text-[11px] font-medium md:flex",
                      s === "completed" ? "bg-white/[0.07] text-ink" : s === "in-progress" ? "bg-brand/12 text-brand-ink" : "bg-card-hi text-ink-3",
                    )}
                  >
                    {s === "completed" ? "Watched" : s === "in-progress" ? "In progress" : "Not started"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        ) : (
        <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {rows.slice(0, shown).map((t) => {
            const s = topics[t.id]?.status ?? "not-started";
            const pos = topics[t.id]?.videoPosition ?? 0;
            const m = MODULE_BY_ID.get(t.moduleId)!;
            const p = PHASE_BY_ID.get(t.phaseId)!;
            return (
              <li key={t.id}>
                <Link href={`/learn/${t.id}`} className="group block">
                  {/* thumbnail */}
                  <div className="relative aspect-video overflow-hidden rounded-[var(--radius-lg)] bg-card ring-1 ring-line transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:ring-line-hi">
                    <LessonArt topicId={t.id} className="transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-2.5 top-2.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
                      P{p.code} · {m.code}
                    </span>
                    <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white opacity-0 shadow-[0_0_24px_rgba(230,22,31,.5)] transition-opacity group-hover:opacity-100">
                      <Play size={15} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                    </span>
                    <span className="nums absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      {formatDuration(t.videoSeconds)}
                    </span>
                    {s === "completed" ? (
                      <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-ink-2">
                        <Check size={11} strokeWidth={3} /> Watched
                      </span>
                    ) : pos > 0 ? (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
                        <span className="block h-full bg-brand" style={{ width: `${(pos / t.videoSeconds) * 100}%` }} />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2.5 line-clamp-1 text-[14px] text-ink transition-colors group-hover:text-brand-ink">{t.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-3">{m.title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        )
      )}
      {rows.length > shown && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>
            Load more · {rows.length - shown} left
          </Button>
        </div>
      )}
    </Page>
  );
}
