"use client";

import * as React from "react";
import { ArrowRight, ClipboardList, ListChecks, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, Button, Dropdown, EmptyState, FilterChips, Modal, ProgressBar,
  SectionHeading, StatTile, StatusBadge, cx,
} from "@/components/ui";
import { ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, TOPIC_BY_ID } from "@/data/curriculum";
import { useProgress, type AssignmentStatus } from "@/state/progress";
import { AssignmentQuiz } from "./AssignmentQuiz";

type Filter = "all" | AssignmentStatus;

const PAGE_SIZE = 10;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "not-started", label: "Not started" },
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
  const [page, setPage] = React.useState(0);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const openTopic = openId ? (TOPIC_BY_ID.get(openId) ?? null) : null;

  const withAssignments = React.useMemo(() => ALL_TOPICS.filter((t) => t.assignment), []);
  const needle = q.trim().toLowerCase();

  const rows = withAssignments.filter((t) => {
    const s = topics[t.id]?.assignment ?? "not-started";
    if (filter !== "all" && s !== filter) return false;
    if (phase !== "all" && t.phaseId !== phase) return false;
    if (needle && !t.assignment!.title.toLowerCase().includes(needle)) return false;
    return true;
  });

  const pages = Math.ceil(rows.length / PAGE_SIZE);

  const count = (s: AssignmentStatus) => withAssignments.filter((t) => (topics[t.id]?.assignment ?? "not-started") === s).length;
  const doneCount = count("completed");
  const attempts = withAssignments.map((t) => topics[t.id]?.quiz).filter((q) => !!q);
  const avg = attempts.length
    ? Math.round((attempts.reduce((n, q) => n + q.correct / q.total, 0) / attempts.length) * 100)
    : 0;

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Assignments"
        title="Quick MCQ checks"
        description="Each assignment is a short multiple-choice quiz on one topic. Answer every question, submit, and see your score straight away."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile value={`${doneCount}`} label="Completed" accent sub={<ProgressBar value={(doneCount / withAssignments.length) * 100} size="xs" />} />
        <StatTile value={`${avg}%`} label="Average score" />
        <StatTile value={`${count("not-started")}`} label="Not started" sub={<span className="nums text-[11px] text-ink-3">of {withAssignments.length} quizzes</span>} />
      </div>

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search assignments…"
            aria-label="Search assignments"
            className="h-9 w-full rounded-md border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
          />
          {q && <button onClick={() => setQ("")} aria-label="Clear" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"><X size={13} /></button>}
        </div>
        <Dropdown label="Phase" value={phase} onChange={(v) => { setPhase(v); setPage(0); }} options={[{ value: "all", label: "All phases" }, ...PHASES.map((p) => ({ value: p.id, label: `Phase ${p.code} — ${p.title}` }))]} />
        <FilterChips options={FILTERS} value={filter} onChange={(v) => { setFilter(v); setPage(0); }} />
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
          {rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((t) => {
            const a = t.assignment!;
            const s = (topics[t.id]?.assignment ?? "not-started") as AssignmentStatus;
            const m = MODULE_BY_ID.get(t.moduleId)!;
            const p = PHASE_BY_ID.get(t.phaseId)!;
            const quiz = topics[t.id]?.quiz;
            return (
              <article
                key={t.id}
                className={cx(
                  "flex flex-col rounded-xl border bg-card p-5 transition-colors hover:border-line-hi hover:bg-card-hi",
                  "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mono truncate text-[10px] uppercase tracking-[0.1em] text-ink-3">
                      Phase {p.code} · {m.title}
                    </p>
                    <h2 className="display mt-2 text-[16px] leading-snug text-ink">{a.title}</h2>
                  </div>
                  <StatusBadge status={s} />
                </div>

                <p className="mt-2.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-2">{a.brief}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge tone={DIFFICULTY_TONE[a.difficulty]}>{a.difficulty}</Badge>
                  <Badge tone="quiet">
                    <ListChecks size={10} /> {a.questions.length} MCQs
                  </Badge>
                  {quiz && <Badge tone="brand">Score {quiz.correct}/{quiz.total}</Badge>}
                  <button
                    onClick={() => setOpenId(t.id)}
                    className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-ink transition-colors hover:text-brand-hi"
                  >
                    {quiz ? "View results" : "Start quiz"}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {pages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pages">
          <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-current={i === page ? "page" : undefined}
              className={cx(
                "nums size-8 rounded-md border text-[12px] transition-colors",
                i === page ? "border-line-hi bg-card-hi text-ink" : "border-transparent text-ink-3 hover:text-ink",
              )}
            >
              {i + 1}
            </button>
          ))}
          <Button size="sm" variant="ghost" disabled={page === pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          <span className="nums ml-2 text-[12px] text-ink-3">
            {page * PAGE_SIZE + 1}–{Math.min(rows.length, (page + 1) * PAGE_SIZE)} of {rows.length}
          </span>
        </nav>
      )}

      <Modal
        open={!!openTopic}
        onClose={() => setOpenId(null)}
        eyebrow={openTopic ? MODULE_BY_ID.get(openTopic.moduleId)!.title : undefined}
        title={openTopic?.assignment?.title ?? ""}
        width="max-w-4xl"
      >
        {openTopic && (
          <div className="-mx-5 -my-5 max-h-[70vh] overflow-y-auto px-5 py-5">
            <AssignmentQuiz topic={openTopic} />
          </div>
        )}
      </Modal>
    </Page>
  );
}

