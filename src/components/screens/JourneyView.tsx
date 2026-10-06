"use client";

import Link from "next/link";
import { ArrowRight, Award, Briefcase, Lock, Users } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, ButtonLink, Card, ProgressBar, ProgressRing, SectionHeading, StatusBadge, cx,
} from "@/components/ui";
import { PHASES, TOTALS } from "@/data/curriculum";
import { PROJECTS } from "@/data/projects";
import { useRollups } from "@/state/progress";

const MILESTONES = [
  { href: "/certification", icon: Award, label: "Certificate of Completion", note: "Unlocks at 100%" },
  { href: "/community", icon: Users, label: "FDE Community", note: "Open now" },
  { href: "/jobs", icon: Briefcase, label: "Job Portal", note: "Unlocks at 100%", locked: true },
];

export function JourneyView() {
  const { program, byPhase, byModule, phaseStatus, phasesCompleted, currentPhase } = useRollups();
  const projectsDone = PROJECTS.filter((p) => p.status === "completed").length;

  return (
    <Page className="space-y-8">
      <SectionHeading
        eyebrow="My Journey"
        title="Your FDE journey"
        description="Nine phases from the FDE role and Python fundamentals through to running a full client engagement. This is the whole route, where you are on it, and what's waiting at the end."
        action={
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="nums text-[13px] text-ink-2">{phasesCompleted} of {TOTALS.phases} phases</p>
              <p className="nums mt-0.5 text-[12px] text-ink-3">{projectsDone} of {PROJECTS.length} projects</p>
            </div>
            <ProgressRing value={program.percent} size={88} stroke={6} sublabel="Program" />
          </div>
        }
      />

      {/* ------------------------------------------------------- the roadmap */}
      <ol className="relative">
        {PHASES.map((phase, i) => {
          const status = phaseStatus(phase);
          const r = byPhase.get(phase.id)!;
          const isCurrent = phase.id === currentPhase.id;
          const last = i === PHASES.length - 1;

          return (
            <li key={phase.id} className="relative pb-4 pl-10 sm:pl-14">
              {/* spine */}
              {!last && (
                <span
                  className={cx(
                    "absolute left-[11px] top-9 bottom-0 w-px sm:left-[15px]",
                    status === "completed" ? "bg-brand/40" : "bg-line",
                  )}
                />
              )}
              {/* node */}
              <span className="absolute left-0 top-5 flex size-6 items-center justify-center sm:left-1">
                <span
                  className={cx(
                    "flex items-center justify-center rounded-full ring-4 ring-bg",
                    status === "completed" && "size-5 bg-brand text-white",
                    status === "in-progress" && "size-5 border-2 border-brand bg-bg",
                    (status === "upcoming" || status === "locked") && "size-4 border border-line-hi bg-card",
                  )}
                >
                  {status === "completed" && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {status === "in-progress" && <span className="size-1.5 rounded-full bg-brand" />}
                  {status === "locked" && <Lock size={8} className="text-ink-4" />}
                </span>
              </span>

              <Card
                className={cx(
                  "overflow-hidden transition-colors",
                  isCurrent ? "border-brand/35 bg-card-hi" : "hover:border-line-hi",
                  status === "locked" && "opacity-55",
                )}
              >
                {isCurrent && <div className="h-px bg-gradient-to-r from-brand via-brand/30 to-transparent" />}
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="mono text-[11px] tracking-[0.1em] text-ink-3">PHASE {phase.code}</span>
                        <StatusBadge status={status} />
                        {isCurrent && <Badge tone="brand">You are here</Badge>}
                      </div>
                      <h2 className="display mt-2.5 text-[19px] leading-snug text-ink">{phase.title}</h2>
                      <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-2">{phase.summary}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="display nums text-[22px] text-ink">{r.percent}%</span>
                      <p className="nums mt-1 text-[11px] text-ink-3">{r.completed}/{r.total} topics</p>
                    </div>
                  </div>

                  <ProgressBar
                    value={r.percent}
                    tone={status === "completed" ? "done" : status === "in-progress" ? "brand" : "muted"}
                    animated={status === "in-progress"}
                    className="mt-4"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink-3">
                    <span className="nums">{phase.modules.length} modules</span>
                    <span className="size-0.5 rounded-full bg-ink-4" />
                    <span className="nums">{r.total} topics</span>
                    {PROJECTS.some((p) => p.phaseId === phase.id) && (
                      <>
                        <span className="size-0.5 rounded-full bg-ink-4" />
                        <span className="nums">
                          {PROJECTS.filter((p) => p.phaseId === phase.id).length} project
                          {PROJECTS.filter((p) => p.phaseId === phase.id).length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>

                  {/* module strip — one notch per module */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {phase.modules.map((m) => {
                      const mr = byModule.get(m.id)!;
                      return (
                        <Link
                          key={m.id}
                          href={`/curriculum?phase=${phase.id}&module=${m.id}`}
                          title={`${m.code} ${m.title} — ${mr.percent}%`}
                          className="group relative h-6 min-w-[44px] flex-1 overflow-hidden rounded-[4px] border border-line bg-bg-sub transition-colors hover:border-line-hi"
                        >
                          <span
                            className={cx("absolute inset-y-0 left-0 transition-[width] duration-500", mr.percent === 100 ? "bg-brand/14" : "bg-brand/22")}
                            style={{ width: `${mr.percent}%` }}
                          />
                          <span className="mono relative flex h-full items-center justify-center text-[9px] tracking-[0.06em] text-ink-3 transition-colors group-hover:text-ink-2">
                            {m.code}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    {status === "locked" ? (
                      <span className="inline-flex items-center gap-2 text-[12px] text-ink-4">
                        <Lock size={12} /> Finish Phase {String(phase.number - 1).padStart(2, "0")} to open this phase
                      </span>
                    ) : (
                      <ButtonLink
                        href={`/curriculum?phase=${phase.id}`}
                        size="sm"
                        variant={isCurrent ? "primary" : "outline"}
                      >
                        {status === "completed" ? "Review phase" : status === "in-progress" ? "Continue phase" : "Preview phase"}
                        <ArrowRight size={13} />
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}

        {/* ------------------------------------------------- end of the road */}
        <li className="relative pl-10 sm:pl-14">
          <span className="absolute left-0 top-5 flex size-6 items-center justify-center sm:left-1">
            <span className="flex size-4 items-center justify-center rounded-full border border-line-hi bg-card ring-4 ring-bg">
              <Lock size={8} className="text-ink-4" />
            </span>
          </span>
          <Card className="brand-wash overflow-hidden border-line-hi">
            <div className="p-5">
              <div className="eyebrow text-brand-ink">At the end of the journey</div>
              <h2 className="display mt-2.5 text-[19px] text-ink">What completing the programme unlocks</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {MILESTONES.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    className="flex items-center gap-3 rounded-lg border border-line bg-bg-sub px-3.5 py-3 transition-colors hover:border-line-hi hover:bg-card-hi"
                  >
                    <m.icon size={16} className={m.locked ? "shrink-0 text-ink-4" : "shrink-0 text-brand-ink"} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] text-ink">{m.label}</span>
                      <span className="block text-[11px] text-ink-3">{m.note}</span>
                    </span>
                    {m.locked && <Lock size={11} className="ml-auto shrink-0 text-ink-4" />}
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </li>
      </ol>
    </Page>
  );
}
