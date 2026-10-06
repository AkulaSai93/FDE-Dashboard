"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Clock, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, Button, Dropdown, EmptyState, FilterChips, ProgressBar,
  SectionHeading, StatTile, StatusBadge, cx,
} from "@/components/ui";
import { ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID } from "@/data/curriculum";
import { useProgress, type AssignmentStatus } from "@/state/progress";

type Filter = "all" | AssignmentStatus;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "submitted", label: "Submitted" },
  { value: "evaluated", label: "Evaluated" },
  { value: "completed", label: "Completed" },
];

const DIFFICULTY_TONE = {
  Beginner: "quiet",
  Intermediate: "neutral",
  Advanced: "brand",
} as const;

export function AssignmentsView() {
  const { topics } = useProgress();
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [phase, setPhase] = React.useState("all");

  const withAssignments = React.useMemo(() => ALL_TOPICS.filter((t) => t.assignment), []);
  const needle = q.trim().toLowerCase();

  const rows = withAssignments.filter((t) => {
    const s = topics[t.id]?.assignment ?? "not-started";
    if (filter !== "all" && s !== filter) return false;
    if (phase !== "all" && t.phaseId !== phase) return false;
    if (needle && !t.assignment!.title.toLowerCase().includes(needle)) return false;
    return true;
  });

  const count = (s: AssignmentStatus) => withAssignments.filter((t) => (topics[t.id]?.assignment ?? "not-started") === s).length;
  const doneCount = count("completed") + count("evaluated");

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Assignments"
        title="Labs across the programme"
        description="Every lab belongs to a topic in the curriculum. This view exists so you can see what's outstanding across all nine phases at once."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile value={`${doneCount}`} label="Completed" accent sub={<ProgressBar value={(doneCount / withAssignments.length) * 100} size="xs" />} />
        <StatTile value={`${count("submitted")}`} label="Awaiting review" />
        <StatTile value={`${count("in-progress")}`} label="In progress" />
        <StatTile value={`${count("not-started")}`} label="Not started" sub={<span className="nums text-[11px] text-ink-3">of {withAssignments.length} labs</span>} />
      </div>

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assignments…"
            aria-label="Search assignments"
            className="h-9 w-full rounded-md border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
          />
          {q && <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"><X size={13} /></button>}
        </div>
        <Dropdown label="Phase" value={phase} onChange={setPhase} options={[{ value: "all", label: "All phases" }, ...PHASES.map((p) => ({ value: p.id, label: `Phase ${p.code} — ${p.title}` }))]} />
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} strokeWidth={1.5} />}
          title="Nothing here right now"
          description="No assignment matches those filters. Clearing the status filter usually brings the backlog back."
          action={<Button size="sm" variant="secondary" onClick={() => { setQ(""); setFilter("all"); setPhase("all"); }}>Clear filters</Button>}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.slice(0, 60).map((t) => {
            const a = t.assignment!;
            const s = (topics[t.id]?.assignment ?? "not-started") as AssignmentStatus;
            const m = MODULE_BY_ID.get(t.moduleId)!;
            const p = PHASE_BY_ID.get(t.phaseId)!;
            const open = s === "not-started" || s === "in-progress";
            return (
              <article
                key={t.id}
                className={cx(
                  "flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-line-hi hover:bg-card-hi",
                  s === "in-progress" ? "border-brand/25" : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mono truncate text-[10px] uppercase tracking-[0.1em] text-ink-3">
                      Phase {p.code} · {m.title}
                    </p>
                    <h2 className="display mt-2 text-[16px] leading-snug text-ink">{a.title}</h2>
                  </div>
                  <StatusBadge status={s === "not-started" ? "not-started" : s} />
                </div>

                <p className="mt-2.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-2">{a.brief}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge tone={DIFFICULTY_TONE[a.difficulty]}>{a.difficulty}</Badge>
                  <Badge tone="quiet">
                    <Clock size={10} /> ~{Math.round(a.estMinutes / 60)} hr
                  </Badge>
                  <Link
                    href={`/learn/${t.id}`}
                    className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-ink transition-colors hover:text-brand-hi"
                  >
                    {open ? (s === "in-progress" ? "Continue assignment" : "Start assignment") : "Review submission"}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {rows.length > 60 && (
        <p className="text-center text-[12px] text-ink-3">Showing 60 of {rows.length} — filter by phase to narrow the list.</p>
      )}
    </Page>
  );
}
