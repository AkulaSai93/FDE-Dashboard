"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Circle, GitBranch, Trophy } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, ButtonLink, Card, CardHeader, ProgressBar, StatusBadge, cx } from "@/components/ui";
import { PROJECT_STAGES, type Project } from "@/data/projects";
import { PHASE_BY_ID } from "@/data/curriculum";

const STAGE_DETAIL: Record<string, string[]> = {
  research: ["Read the brief and the constraints", "Map the data you actually have", "Write down the success metric before you build"],
  build: ["Implement the core path end to end", "Handle the malformed inputs", "Add the tests that would have caught your last bug"],
  deploy: ["Containerise it", "Deploy to a real environment", "Put monitoring in front of it"],
  document: ["README a stranger can follow", "Architecture decision record", "A short demo a stakeholder would understand"],
};

export function ProjectDetailView({ project }: { project: Project }) {
  const phase = PHASE_BY_ID.get(project.phaseId)!;
  const pct = Math.round((project.stagesComplete / PROJECT_STAGES.length) * 100);

  return (
    <Page className="max-w-[1000px] space-y-6">
      <Link href="/projects" className="mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink-2">
        <ArrowLeft size={12} /> All projects
      </Link>

      <Card className={cx("overflow-hidden", project.capstone && "brand-wash border-line-hi")}>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-3">Phase {phase.code} · {phase.title}</span>
            <Badge tone="quiet">{project.category}</Badge>
            <Badge tone="quiet">{project.domain}</Badge>
            {project.capstone && <Badge tone="brand"><Trophy size={10} /> Capstone</Badge>}
            <StatusBadge status={project.status === "not-started" ? "not-started" : project.status} className="ml-auto" />
          </div>

          <h1 className="display mt-4 text-[26px] leading-tight text-ink sm:text-[30px]">{project.title}</h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.75] text-ink-2">{project.summary}</p>

          <div className="mt-6 flex items-center gap-4">
            <ProgressBar value={pct} className="max-w-md" animated={project.status === "in-progress"} />
            <span className="display nums shrink-0 text-[18px] text-ink">{pct}%</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="mono rounded border border-line bg-bg-sub px-2 py-1 text-[10px] text-ink-3">{s}</span>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Delivery stages" title="How this project runs" />
        <ol className="border-t border-line">
          {PROJECT_STAGES.map((stage, i) => {
            const done = i < project.stagesComplete;
            const current = i === project.stagesComplete && project.status !== "locked";
            return (
              <li key={stage.key} className={cx("flex gap-4 border-b border-line-soft px-5 py-4 last:border-0", current && "bg-brand/5")}>
                <span className="mt-0.5 shrink-0">
                  {done ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand text-white"><Check size={11} strokeWidth={3} /></span>
                  ) : current ? (
                    <span className="flex size-5 items-center justify-center rounded-full border-2 border-brand"><span className="size-1.5 rounded-full bg-brand" /></span>
                  ) : (
                    <Circle size={20} strokeWidth={1.5} className="text-ink-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-4">0{i + 1}</span>
                    <h3 className={cx("display text-[15px]", done || current ? "text-ink" : "text-ink-2")}>{stage.label}</h3>
                    {current && <Badge tone="brand">Current</Badge>}
                  </div>
                  <ul className="mt-2.5 space-y-1.5">
                    {STAGE_DETAIL[stage.key].map((d) => (
                      <li key={d} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                        <span className={cx("mt-[8px] size-1 shrink-0 rounded-full", done ? "bg-brand/60" : "bg-ink-4")} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="flex flex-wrap items-center gap-2.5">
        <ButtonLink href={`/curriculum?phase=${phase.id}`} variant="outline" size="md">
          Review Phase {phase.code} curriculum
        </ButtonLink>
        <ButtonLink href="/projects" variant="ghost" size="md">
          <GitBranch size={14} /> All projects
        </ButtonLink>
        <ButtonLink href="/certification" variant="primary" size="md" className="ml-auto">
          Certification <ArrowRight size={14} />
        </ButtonLink>
      </div>
    </Page>
  );
}
