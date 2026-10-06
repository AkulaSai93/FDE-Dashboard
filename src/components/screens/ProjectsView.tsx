"use client";

import { ArrowRight, Boxes, Lock, Trophy } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, ButtonLink, Card, ProgressBar, SectionHeading, StatTile, StatusBadge, cx,
} from "@/components/ui";
import { PROJECTS, PROJECT_STAGES, type Project } from "@/data/projects";
import { PHASE_BY_ID } from "@/data/curriculum";
import { useRollups } from "@/state/progress";

function StageTrack({ project, className }: { project: Project; className?: string }) {
  return (
    <ol className={cx("flex gap-1.5", className)}>
      {PROJECT_STAGES.map((s, i) => {
        const done = i < project.stagesComplete;
        const current = i === project.stagesComplete && project.status === "in-progress";
        return (
          <li key={s.key} className="min-w-0 flex-1">
            <div
              className={cx(
                "h-1 rounded-full transition-colors",
                done ? "bg-brand" : current ? "bg-brand/35" : "bg-[#1c1c1c]",
              )}
            />
            <span
              className={cx(
                "mono mt-2 block truncate text-[9px] uppercase tracking-[0.1em]",
                done ? "text-brand-ink" : current ? "text-ink-2" : "text-ink-4",
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ProjectsView() {
  const { program } = useRollups();
  const completed = PROJECTS.filter((p) => p.status === "completed").length;
  const inProgress = PROJECTS.filter((p) => p.status === "in-progress").length;

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Projects"
        title="What you'll ship"
        description="Projects are the portfolio you leave the programme with. Each one runs the full loop — research, build, deploy, document — the same shape as a real client engagement."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile value={<><span>{completed}</span><span className="text-ink-4"> / {PROJECTS.length}</span></>} label="Projects completed" accent sub={<ProgressBar value={(completed / PROJECTS.length) * 100} size="xs" />} />
        <StatTile value={`${inProgress}`} label="In progress" />
        <StatTile value={`${program.percent}%`} label="Programme progress" sub={<span className="text-[11px] text-ink-3">Capstone unlocks at 100%</span>} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PROJECTS.map((p) => {
          const phase = PHASE_BY_ID.get(p.phaseId)!;
          const locked = p.status === "locked";
          const pct = Math.round((p.stagesComplete / PROJECT_STAGES.length) * 100);

          return (
            <Card
              key={p.id}
              className={cx(
                "flex flex-col overflow-hidden transition-colors",
                p.capstone && "brand-wash border-line-hi",
                p.status === "in-progress" && "border-brand/25",
                locked && "opacity-70",
                !locked && "hover:border-line-hi",
              )}
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-3">Phase {phase.code}</span>
                      <Badge tone="quiet">{p.category}</Badge>
                      <Badge tone="quiet">{p.domain}</Badge>
                      {p.capstone && <Badge tone="brand"><Trophy size={10} /> Capstone</Badge>}
                    </div>
                    <h2 className="display mt-2.5 text-[18px] leading-snug text-ink">{p.title}</h2>
                  </div>
                  <StatusBadge status={locked ? "locked" : p.status === "not-started" ? "not-started" : p.status} />
                </div>

                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-2">{p.summary}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="mono rounded border border-line bg-bg-sub px-2 py-1 text-[10px] text-ink-3">{s}</span>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-2.5 flex items-baseline justify-between">
                    <span className="eyebrow">Stages</span>
                    <span className="nums text-[12px] text-ink-2">{pct}% complete</span>
                  </div>
                  <StageTrack project={p} />
                </div>
              </div>

              <div className="border-t border-line px-5 py-3.5">
                {locked ? (
                  <span className="inline-flex items-center gap-2 text-[12px] text-ink-4">
                    <Lock size={12} /> Unlocks when you reach Phase {phase.code}
                  </span>
                ) : (
                  <ButtonLink href={`/projects/${p.id}`} size="sm" variant={p.status === "in-progress" ? "primary" : "outline"}>
                    {p.status === "completed" ? "View project" : p.status === "in-progress" ? "Open project" : "Start project"}
                    <ArrowRight size={13} />
                  </ButtonLink>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <Boxes size={18} className="shrink-0 text-ink-3" />
          <div>
            <p className="display text-[14px] text-ink">Completed projects become your portfolio</p>
            <p className="mt-1 text-[13px] text-ink-2">Every finished project ships with a repo, a deployment and a write-up you can hand to a hiring manager.</p>
          </div>
        </div>
        <ButtonLink href="/certification" size="sm" variant="outline">See what completion unlocks <ArrowRight size={13} /></ButtonLink>
      </Card>
    </Page>
  );
}
