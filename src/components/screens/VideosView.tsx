"use client";

import * as React from "react";
import Link from "next/link";
import { Play, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Button, Dropdown, EmptyState, FilterChips, ProgressBar, SectionHeading, StatTile, StatusDot, cx,
} from "@/components/ui";
import { ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration } from "@/data/curriculum";
import { useProgress } from "@/state/progress";

type Filter = "all" | "completed" | "in-progress" | "not-started";

export function VideosView() {
  const { topics } = useProgress();
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [phase, setPhase] = React.useState("all");

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

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
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
          onChange={setPhase}
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
          onChange={setFilter}
        />
        <span className="nums ml-auto text-[12px] text-ink-3">{rows.length} lessons</span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Play size={28} strokeWidth={1.5} />}
          title="No lessons match"
          description="Try clearing the phase or status filter."
          action={<Button size="sm" variant="secondary" onClick={() => { setQ(""); setFilter("all"); setPhase("all"); }}>Clear filters</Button>}
        />
      ) : (
        <ul className="divide-y divide-[#1a1a1a] overflow-hidden rounded-xl border border-line bg-card">
          {rows.slice(0, 160).map((t) => {
            const s = topics[t.id]?.status ?? "not-started";
            const pos = topics[t.id]?.videoPosition ?? 0;
            const m = MODULE_BY_ID.get(t.moduleId)!;
            const p = PHASE_BY_ID.get(t.phaseId)!;
            return (
              <li key={t.id}>
                <Link href={`/learn/${t.id}`} className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-card-hi">
                  <span className="relative flex h-10 w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-black">
                    <Play size={13} fill="currentColor" strokeWidth={0} className={cx("transition-colors", s === "completed" ? "text-ink-4" : "text-brand")} />
                    {pos > 0 && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
                        <span className="block h-full bg-brand" style={{ width: `${(pos / t.videoSeconds) * 100}%` }} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-ink">{t.title}</span>
                    <span className="mono block truncate text-[10px] uppercase tracking-[0.08em] text-ink-3">
                      P{p.code} · {m.code} {m.title}
                    </span>
                  </span>
                  <StatusDot status={s} size={14} />
                  <span className="nums w-12 shrink-0 text-right text-[11px] text-ink-3">{formatDuration(t.videoSeconds)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {rows.length > 160 && (
        <p className="text-center text-[12px] text-ink-3">
          Showing the first 160 of {rows.length}. Narrow by phase or search to see the rest.
        </p>
      )}
    </Page>
  );
}
