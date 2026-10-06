"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Play, FileUp, Sparkles, Boxes } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, ButtonLink, Card, CardHeader, ProgressBar, ProgressRing, SegmentedProgress,
  StatTile, StatusDot, cx,
} from "@/components/ui";
import {
  MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration, formatMinutes,
} from "@/data/curriculum";
import { PROJECTS } from "@/data/projects";
import { RECENT_ACTIVITY } from "@/data/activity";
import { USER } from "@/data/user";
import { useCurrentTopic, useProgress, useRollups, useUpNext } from "@/state/progress";

function useGreeting() {
  // Rendered time-neutral on the server, then personalised after mount so the
  // markup never mismatches during hydration.
  const [greeting, setGreeting] = React.useState("Welcome back");
  React.useEffect(() => {
    // The clock is an external system: it can't be read during render without
    // the server and client disagreeing, so this is a deliberate sync.
    const h = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);
  return greeting;
}

const ACTIVITY_ICON = {
  completed: Check,
  watched: Play,
  submitted: FileUp,
  started: Boxes,
  unlocked: Sparkles,
} as const;

export function DashboardView() {
  const greeting = useGreeting();
  const { program, byPhase, byModule, modulesCompleted, currentPhase, totals } = useRollups();
  const { topics, lastActiveMinutesAgo } = useProgress();
  const topic = useCurrentTopic();
  const upNext = useUpNext(4);

  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const modRollup = byModule.get(mod.id)!;
  const phaseRollup = byPhase.get(currentPhase.id)!;
  const tp = topics[topic.id];

  const projectsDone = PROJECTS.filter((p) => p.status === "completed").length;
  const lastSeen = lastActiveMinutesAgo === 0 ? "just now" : `${lastActiveMinutesAgo} min ago`;

  return (
    <Page className="space-y-7">
      {/* ------------------------------------------------ header + progress */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="display text-[28px] leading-tight text-ink sm:text-[32px]">
            {greeting}, {USER.firstName}
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-2">Continue your FDE journey.</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden text-right sm:block">
            <div className="eyebrow mb-1.5">Overall progress</div>
            <p className="nums text-[13px] text-ink-2">
              {program.completed} of {program.total} topics
            </p>
            <p className="nums mt-0.5 text-[12px] text-ink-3">
              {modulesCompleted} of {totals.modules} modules
            </p>
          </div>
          <ProgressRing value={program.percent} size={96} stroke={6} sublabel="Complete" />
        </div>
      </header>

      {/* ------------------------------------------------- continue learning */}
      <Card className="brand-wash relative overflow-hidden border-line-hi">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-7">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="eyebrow text-brand-ink">Continue learning</span>
              <span className="h-px flex-1 bg-gradient-to-r from-brand/35 to-transparent" />
            </div>

            <p className="mono mt-4 text-[11px] uppercase tracking-[0.1em] text-ink-3">
              Phase {phase.code} · {phase.title}
            </p>
            <h2 className="display mt-2 text-[24px] leading-tight text-ink sm:text-[28px]">{topic.title}</h2>
            <p className="mt-2 text-[13px] text-ink-2">
              {mod.code} {mod.title} · Topic {topic.index} of {mod.topics.length}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink-3">
              <span className="nums">
                <span className="text-ink-2">{formatDuration(tp?.videoPosition ?? 0)}</span> / {formatDuration(topic.videoSeconds)}
              </span>
              <span className="size-0.5 rounded-full bg-ink-4" />
              <span className="nums">Module {modRollup.percent}% complete</span>
              <span className="size-0.5 rounded-full bg-ink-4" />
              <span>Last watched {lastSeen}</span>
            </div>

            <ProgressBar
              value={((tp?.videoPosition ?? 0) / topic.videoSeconds) * 100}
              animated
              className="mt-3 max-w-md"
            />
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
            <ButtonLink href={`/learn/${topic.id}`} variant="primary" size="lg" className="w-full sm:w-auto">
              Continue learning
              <ArrowRight size={15} />
            </ButtonLink>
            <ButtonLink href={`/curriculum?phase=${phase.id}&module=${mod.id}`} variant="outline" size="lg" className="w-full sm:w-auto">
              View module
            </ButtonLink>
          </div>
        </div>
      </Card>

      {/* --------------------------------------------------------- stat row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          value={`${program.percent}%`}
          label="Overall progress"
          accent
          sub={<ProgressBar value={program.percent} size="xs" />}
        />
        <StatTile
          value={<><span>{modulesCompleted}</span><span className="text-ink-4"> / {totals.modules}</span></>}
          label="Modules completed"
          sub={<ProgressBar value={(modulesCompleted / totals.modules) * 100} size="xs" tone="done" />}
        />
        <StatTile
          value={<><span>{projectsDone}</span><span className="text-ink-4"> / {PROJECTS.length}</span></>}
          label="Projects completed"
          sub={<ProgressBar value={(projectsDone / PROJECTS.length) * 100} size="xs" tone="done" />}
        />
        <StatTile
          value={<><span>{program.completed}</span><span className="text-ink-4"> / {program.total}</span></>}
          label="Topics completed"
          sub={<ProgressBar value={program.percent} size="xs" tone="done" />}
        />
      </div>

      {/* ----------------------------------------------------- current phase */}
      <Card>
        <CardHeader
          eyebrow="Current phase"
          title={`Phase ${currentPhase.code} · ${currentPhase.title}`}
          action={
            <ButtonLink href={`/curriculum?phase=${currentPhase.id}`} size="sm" variant="outline" className="shrink-0">
              Continue phase <ArrowRight size={13} />
            </ButtonLink>
          }
        />
        <div className="border-t border-line px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="max-w-xl text-[13px] leading-relaxed text-ink-2">{currentPhase.summary}</p>
            <span className="display nums shrink-0 text-[22px] text-ink">{phaseRollup.percent}%</span>
          </div>
          <ProgressBar value={phaseRollup.percent} className="mt-4" animated />

          <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {currentPhase.modules.map((m) => {
              const r = byModule.get(m.id)!;
              const status = r.percent === 100 ? "completed" : r.completed + r.inProgress > 0 ? "in-progress" : "not-started";
              return (
                <li key={m.id}>
                  <Link
                    href={`/curriculum?phase=${currentPhase.id}&module=${m.id}`}
                    className="flex items-center gap-2.5 rounded-lg border border-line bg-bg-sub px-3 py-2.5 transition-colors hover:border-line-hi hover:bg-card-hi"
                  >
                    <StatusDot status={status} size={14} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{m.title}</span>
                      <span className="nums block text-[11px] text-ink-3">{r.completed}/{r.total} topics</span>
                    </span>
                    <span className="nums shrink-0 text-[12px] text-ink-3">{r.percent}%</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      {/* -------------------------------------------- activity + what's next */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader eyebrow="Recent activity" title="What you've been doing" />
          <ul className="divide-y divide-[#1a1a1a] border-t border-line">
            {RECENT_ACTIVITY.map((a) => {
              const Icon = ACTIVITY_ICON[a.kind];
              const isDone = a.kind === "completed";
              return (
                <li key={a.id}>
                  <Link href={a.href} className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-card-hi">
                    <span
                      className={cx(
                        "flex size-7 shrink-0 items-center justify-center rounded-md border",
                        isDone ? "border-brand/30 bg-brand/10 text-brand-ink" : "border-line bg-bg-sub text-ink-3",
                      )}
                    >
                      <Icon size={13} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{a.title}</span>
                      <span className="mono block truncate text-[10px] uppercase tracking-[0.08em] text-ink-3">{a.context}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-3">{a.when}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            eyebrow="Up next"
            title="Recommended for you"
            action={<Link href="/curriculum" className="shrink-0 text-[12px] text-ink-3 transition-colors hover:text-ink">All</Link>}
          />
          <ol className="divide-y divide-[#1a1a1a] border-t border-line">
            {upNext.map((t, i) => {
              const m = MODULE_BY_ID.get(t.moduleId)!;
              const p = PHASE_BY_ID.get(t.phaseId)!;
              return (
                <li key={t.id}>
                  <Link href={`/learn/${t.id}`} className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-card-hi">
                    <span className="mono w-4 shrink-0 nums text-[11px] text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{t.title}</span>
                      <span className="mono block truncate text-[10px] uppercase tracking-[0.08em] text-ink-3">
                        P{p.code} · {m.title}
                      </span>
                    </span>
                    <span className="nums shrink-0 text-[11px] text-ink-3">{formatMinutes(t.videoSeconds)}</span>
                    <ArrowRight size={13} className="shrink-0 text-ink-4 transition-colors group-hover:text-brand-ink" />
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-line p-4">
            <ButtonLink href={`/learn/${upNext[0]?.id ?? ""}`} variant="secondary" size="sm" className="w-full">
              Start next topic <ArrowRight size={13} />
            </ButtonLink>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------- programme at a glance */}
      <Card>
        <CardHeader
          eyebrow="Programme"
          title="All nine phases"
          action={<ButtonLink href="/journey" size="sm" variant="outline">Open My Journey <ArrowRight size={13} /></ButtonLink>}
        />
        <div className="border-t border-line px-5 py-5">
          <SegmentedProgress
            segments={PHASES.map((p) => ({
              id: p.id,
              percent: byPhase.get(p.id)!.percent,
              label: `Phase ${p.code} — ${p.title} (${byPhase.get(p.id)!.percent}%)`,
            }))}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {PHASES.map((p) => {
              const r = byPhase.get(p.id)!;
              return (
                <Link key={p.id} href={`/curriculum?phase=${p.id}`} className="group flex items-center gap-1.5">
                  <StatusDot status={r.percent === 100 ? "completed" : r.completed > 0 ? "in-progress" : "not-started"} size={12} />
                  <span className="mono text-[10px] uppercase tracking-[0.08em] text-ink-3 transition-colors group-hover:text-ink-2">
                    P{p.code}
                  </span>
                </Link>
              );
            })}
            <Badge tone="quiet" className="ml-auto">
              {totals.phases} phases · {totals.modules} modules · {totals.topics} topics
            </Badge>
          </div>
        </div>
      </Card>
    </Page>
  );
}
