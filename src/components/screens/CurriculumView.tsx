"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X, ListTree, Rows3 } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  AssetChips, Badge, Button, ButtonLink, Dropdown, EmptyState, FilterChips,
  ProgressBar, SectionHeading, StatusBadge, StatusDot, cx,
} from "@/components/ui";
import { PHASES, TOTALS, formatDuration, type Module, type Phase, type Topic } from "@/data/curriculum";
import { useProgress, useRollups, type TopicStatus } from "@/state/progress";

type Completion = "all" | "completed" | "in-progress" | "not-started";

const COMPLETION_FILTERS: Array<{ value: Completion; label: string }> = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In progress" },
  { value: "not-started", label: "Not started" },
];

/* --------------------------------------------------------------- topic row */

function TopicRow({ topic, status }: { topic: Topic; status: TopicStatus }) {
  return (
    <li>
      <Link
        href={`/learn/${topic.id}`}
        className={cx(
          "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-card-hi",
          status === "in-progress" && "bg-brand/5",
        )}
      >
        <span className="mt-0.5">
          <StatusDot status={status} size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block text-[13px] leading-snug", status === "not-started" ? "text-ink-2" : "text-ink")}>
            {topic.title}
          </span>
          <AssetChips
            className="mt-1.5"
            video={formatDuration(topic.videoSeconds)}
            notes={topic.hasNotes}
            assignment={!!topic.assignment}
            resources={topic.resources.length}
          />
        </span>
        <span className="shrink-0 pt-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="mono text-[10px] uppercase tracking-[0.1em] text-brand-ink">
            {status === "completed" ? "Review" : status === "in-progress" ? "Resume" : "Start"} →
          </span>
        </span>
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------- module card */

function ModuleCard({
  module,
  openModules,
  toggle,
  filter,
  query,
}: {
  module: Module;
  openModules: Set<string>;
  toggle: (id: string) => void;
  filter: Completion;
  query: string;
}) {
  const { topics } = useProgress();
  const { byModule } = useRollups();
  const r = byModule.get(module.id)!;
  const open = openModules.has(module.id);

  const visible = module.topics.filter((t) => {
    const s = topics[t.id]?.status ?? "not-started";
    if (filter !== "all" && s !== filter) return false;
    if (query && !t.title.toLowerCase().includes(query)) return false;
    return true;
  });

  if (visible.length === 0) return null;

  const status = r.percent === 100 ? "completed" : r.completed + r.inProgress > 0 ? "in-progress" : "not-started";
  const nextTopic = module.topics.find((t) => (topics[t.id]?.status ?? "not-started") !== "completed");

  return (
    <div className={cx("overflow-hidden rounded-xl border bg-card", status === "in-progress" ? "border-brand/25" : "border-line")}>
      <button
        onClick={() => toggle(module.id)}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-card-hi"
      >
        <StatusDot status={status} size={16} />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2.5">
            <span className="mono shrink-0 text-[11px] tracking-[0.08em] text-ink-3">{module.code}</span>
            <span className="display truncate text-[15px] text-ink">{module.title}</span>
          </span>
          <span className="nums mt-1 block text-[11px] text-ink-3">
            {module.topics.length} topics · {r.completed} completed
            {visible.length !== module.topics.length && ` · ${visible.length} matching`}
          </span>
        </span>
        <span className="hidden w-28 shrink-0 sm:block">
          <ProgressBar value={r.percent} size="sm" tone={status === "completed" ? "done" : "brand"} />
        </span>
        <span className="nums w-9 shrink-0 text-right text-[12px] text-ink-2">{r.percent}%</span>
        <ChevronDown size={15} className={cx("shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="animate-fade border-t border-line bg-bg-sub p-2">
          <ul className="space-y-0.5">
            {visible.map((t) => (
              <TopicRow key={t.id} topic={t} status={topics[t.id]?.status ?? "not-started"} />
            ))}
          </ul>
          {nextTopic && (
            <div className="mt-1 border-t border-line-soft px-3 pb-1 pt-3">
              <ButtonLink href={`/learn/${nextTopic.id}`} size="sm" variant="outline">
                {r.completed > 0 ? "Continue module" : "Start module"} →
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- phase block */

function PhaseBlock({
  phase,
  open,
  onToggle,
  openModules,
  toggleModule,
  filter,
  query,
}: {
  phase: Phase;
  open: boolean;
  onToggle: () => void;
  openModules: Set<string>;
  toggleModule: (id: string) => void;
  filter: Completion;
  query: string;
}) {
  const { byPhase, phaseStatus } = useRollups();
  const r = byPhase.get(phase.id)!;
  const status = phaseStatus(phase);

  const cards = phase.modules.map((m) => (
    <ModuleCard key={m.id} module={m} openModules={openModules} toggle={toggleModule} filter={filter} query={query} />
  ));
  const hasVisible = cards.some(Boolean);
  if (!hasVisible) return null;

  return (
    <section id={phase.id} className="scroll-mt-20">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start gap-3 border-b border-line py-3 text-left sm:items-center"
      >
        <ChevronDown size={15} className={cx("mt-1 shrink-0 text-ink-3 transition-transform duration-200 sm:mt-0", open && "rotate-180")} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="mono shrink-0 text-[11px] tracking-[0.1em] text-ink-3">PHASE {phase.code}</span>
            <span className="display text-[15px] leading-snug text-ink sm:truncate sm:text-[16px]">{phase.title}</span>
            <span className="hidden sm:inline-flex">
              <StatusBadge status={status} />
            </span>
          </span>
          <span className="nums mt-1.5 block text-[11px] text-ink-3 sm:hidden">
            {phase.modules.length} modules · {r.total} topics
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="nums hidden text-[11px] text-ink-3 lg:inline">
            {phase.modules.length} modules · {r.total} topics
          </span>
          <span className="hidden w-24 md:block">
            <ProgressBar value={r.percent} size="sm" tone={status === "completed" ? "done" : "brand"} />
          </span>
          <span className="nums w-9 text-right text-[12px] text-ink-2">{r.percent}%</span>
        </span>
      </button>

      {open && <div className="animate-fade mt-3 space-y-2.5">{cards}</div>}
    </section>
  );
}

/* -------------------------------------------------------------------- view */

export function CurriculumView() {
  const params = useSearchParams();
  const paramPhase = params.get("phase");
  const paramModule = params.get("module");

  const { program, currentPhase, totals } = useRollups();
  const { topics } = useProgress();

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Completion>("all");
  const [phaseFilter, setPhaseFilter] = React.useState<string>(paramPhase ?? "all");
  const [openPhases, setOpenPhases] = React.useState<Set<string>>(
    () => new Set([paramPhase ?? currentPhase.id]),
  );
  const [openModules, setOpenModules] = React.useState<Set<string>>(() => new Set(paramModule ? [paramModule] : []));

  // Deep links (dashboard, journey, search) land on the right node. The query
  // string is read during render and folded into the open/filter state, so a
  // link into ?phase=…&module=… never renders the collapsed view first.
  const [syncedParams, setSyncedParams] = React.useState(`${paramPhase}|${paramModule}`);
  if (syncedParams !== `${paramPhase}|${paramModule}`) {
    setSyncedParams(`${paramPhase}|${paramModule}`);
    if (paramPhase) {
      setPhaseFilter(paramPhase);
      setOpenPhases((s) => new Set(s).add(paramPhase));
    }
    if (paramModule) setOpenModules((s) => new Set(s).add(paramModule));
  }

  React.useEffect(() => {
    if (!paramPhase) return;
    const id = requestAnimationFrame(() =>
      document.getElementById(paramPhase)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    return () => cancelAnimationFrame(id);
  }, [paramPhase, paramModule]);

  const q = query.trim().toLowerCase();

  // Searching should reveal matches rather than hide them behind collapsed rows.
  const effectiveOpenPhases = q || filter !== "all" ? new Set(PHASES.map((p) => p.id)) : openPhases;
  const effectiveOpenModules = q || filter !== "all"
    ? new Set(PHASES.flatMap((p) => p.modules.map((m) => m.id)))
    : openModules;

  const shown = PHASES.filter((p) => phaseFilter === "all" || p.id === phaseFilter);

  const matchCount = React.useMemo(() => {
    if (!q && filter === "all") return null;
    let n = 0;
    for (const p of shown)
      for (const m of p.modules)
        for (const t of m.topics) {
          const s = topics[t.id]?.status ?? "not-started";
          if (filter !== "all" && s !== filter) continue;
          if (q && !t.title.toLowerCase().includes(q)) continue;
          n++;
        }
    return n;
  }, [q, filter, shown, topics]);

  const toggleSet = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const allExpanded = openPhases.size === PHASES.length;

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Curriculum"
        title="The structured FDE curriculum"
        description={`${totals.phases} phases, ${totals.modules} modules and ${totals.topics} topics. Every topic carries its own video, notes, resources and — where it earns one — a lab.`}
        action={
          <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
            <div>
              <div className="eyebrow mb-1.5">Programme</div>
              <p className="nums text-[12px] text-ink-2">{program.completed}/{program.total} topics</p>
            </div>
            <span className="display nums text-[22px] text-ink">{program.percent}%</span>
          </div>
        }
      />

      {/* ------------------------------------------------------------ toolbar */}
      <div className="sticky top-14 z-20 -mx-4 border-y border-line bg-bg/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics and modules…"
              aria-label="Search curriculum"
              className="h-9 w-full rounded-md border border-line bg-card pl-9 pr-9 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-line-hi"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-3 transition-colors hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <Dropdown
            label="Phase"
            value={phaseFilter}
            onChange={setPhaseFilter}
            options={[
              { value: "all", label: "All phases" },
              ...PHASES.map((p) => ({ value: p.id, label: `Phase ${p.code} — ${p.title}` })),
            ]}
          />

          <FilterChips options={COMPLETION_FILTERS} value={filter} onChange={setFilter} />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpenPhases(allExpanded ? new Set() : new Set(PHASES.map((p) => p.id)))}
            className="ml-auto"
          >
            {allExpanded ? <Rows3 size={13} /> : <ListTree size={13} />}
            {allExpanded ? "Collapse all" : "Expand all"}
          </Button>
        </div>

        {matchCount !== null && (
          <p className="nums mt-2.5 text-[12px] text-ink-3">
            {matchCount} {matchCount === 1 ? "topic" : "topics"} match
            {q && <> “<span className="text-ink-2">{query}</span>”</>}
            {filter !== "all" && <> · {COMPLETION_FILTERS.find((f) => f.value === filter)!.label.toLowerCase()}</>}
            {phaseFilter !== "all" && <> · Phase {PHASES.find((p) => p.id === phaseFilter)!.code}</>}
          </p>
        )}
      </div>

      {/* -------------------------------------------------------------- list */}
      {matchCount === 0 ? (
        <EmptyState
          icon={<Search size={28} strokeWidth={1.5} />}
          title="No topics match those filters"
          description="Try a different phase, clear the completion filter, or search for a module name like “RAG Engineering”."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setQuery(""); setFilter("all"); setPhaseFilter("all"); }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-7">
          {shown.map((phase) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              open={effectiveOpenPhases.has(phase.id)}
              onToggle={() => setOpenPhases((s) => toggleSet(s, phase.id))}
              openModules={effectiveOpenModules}
              toggleModule={(id) => setOpenModules((s) => toggleSet(s, id))}
              filter={filter}
              query={q}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line px-5 py-4">
        <p className="text-[13px] text-ink-3">
          The curriculum is the source of truth. Videos, Notes and Assignments in the sidebar are shortcuts into the same content.
        </p>
        <Badge tone="quiet">{TOTALS.topics} topics in total</Badge>
      </div>
    </Page>
  );
}
