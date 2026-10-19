"use client";

import * as React from "react";
import { ArrowRight, Check, ClipboardList, Search, X } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Button, Dropdown, EmptyState, FilterChips, Modal, ProgressBar, SectionHeading, cx,
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

const DIFFICULTY_DOT = {
  Beginner: "bg-ink-3",
  Intermediate: "bg-ink-2",
  Advanced: "bg-brand",
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
        decor="study"
        eyebrow="Assignments"
        title="Quick MCQ checks"
        description="One short multiple-choice quiz at the end of each module. Answer, submit, see your score."
      />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-4">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-baseline justify-between text-[13px]">
            <span className="text-ink-2"><span className="display nums text-[22px] font-light text-ink">{doneCount}</span> / {withAssignments.length} completed</span>
            <span className="nums text-ink-3">{Math.round((doneCount / withAssignments.length) * 100)}%</span>
          </div>
          <ProgressBar value={(doneCount / withAssignments.length) * 100} size="sm" tone="done" className="mt-2" />
        </div>
        <div className="text-[13px] text-ink-3"><span className="display nums mr-1.5 text-[22px] font-light text-ink">{avg}%</span>average score</div>
        <div className="text-[13px] text-ink-3"><span className="display nums mr-1.5 text-[22px] font-light text-ink">{count("not-started")}</span>to do</div>
      </div>

      <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-2.5 border-y border-line bg-panel/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
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
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line">
          {/* column headings (desktop) */}
          <div className="hidden grid-cols-[minmax(0,1fr)_110px_80px_120px_130px] items-center gap-4 border-b border-line bg-bg-sub px-4 py-2.5 text-[11px] text-ink-3 md:grid">
            <span>Quiz</span><span>Difficulty</span><span>Questions</span><span>Result</span><span className="text-right">Action</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((t) => {
              const a = t.assignment!;
              const m = MODULE_BY_ID.get(t.moduleId)!;
              const p = PHASE_BY_ID.get(t.phaseId)!;
              const quiz = topics[t.id]?.quiz;
              const pct = quiz ? Math.round((quiz.correct / quiz.total) * 100) : 0;
              return (
                <li
                  key={t.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-card md:grid-cols-[minmax(0,1fr)_110px_80px_120px_130px]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cx("flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]", quiz ? "bg-white/[0.07] text-ink" : "bg-white/[0.06] text-ink-2")}>
                      {quiz ? <Check size={16} strokeWidth={2.5} /> : <ClipboardList size={16} />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] text-ink">{m.title}</p>
                      <p className="truncate text-[12px] text-ink-3">Phase {p.code} · Module {m.code}</p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 text-[12px] text-ink-2 md:flex">
                    <span className={cx("size-1.5 rounded-full", DIFFICULTY_DOT[a.difficulty])} />
                    {a.difficulty}
                  </span>
                  <span className="nums hidden text-[13px] text-ink-2 md:block">{a.questions.length}</span>
                  <span className="hidden md:block">
                    {quiz ? (
                      <span className="flex items-center gap-2">
                        <span className="nums text-[13px] text-ink">{quiz.correct}/{quiz.total}</span>
                        <span className="h-1 flex-1 overflow-hidden rounded-full bg-card-hi2">
                          <span className={cx("block h-full rounded-full", pct >= 80 ? "bg-ink-2" : "bg-ink-2")} style={{ width: `${pct}%` }} />
                        </span>
                      </span>
                    ) : (
                      <span className="text-[12px] text-ink-4">—</span>
                    )}
                  </span>
                  <span className="justify-self-end">
                    <Button size="sm" variant={quiz ? "ghost" : "primary"} onClick={() => setOpenId(t.id)}>
                      {quiz ? "View results" : "Start quiz"}
                      <ArrowRight size={12} />
                    </Button>
                  </span>
                </li>
              );
            })}
          </ul>
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

