"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, Trophy } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, SectionHeading, cx } from "@/components/ui";
import { PROJECTS, type Project } from "@/data/projects";
import { PHASE_BY_ID } from "@/data/curriculum";

/** Project cover: the landing-page image when there is one, generated art otherwise. */
export function ProjectThumbnail({ project, className }: { project: Project; className?: string }) {
  const phase = PHASE_BY_ID.get(project.phaseId)!;
  return (
    <div
      className={cx(
        "relative flex aspect-video items-end overflow-hidden border-b border-line bg-bg-sub p-4",
        project.capstone && "brand-wash",
        className,
      )}
    >
      {project.thumbnail ? (
        <>
          <Image src={project.thumbnail} alt={project.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        </>
      ) : (
        <span className="display pointer-events-none absolute -right-2 -top-6 text-[120px] leading-none text-ink/5">{phase.code}</span>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="relative">
        <span className="mono text-[10px] uppercase tracking-[0.1em] text-white/70">{project.domain}</span>
        <p className="display mt-1 text-[22px] leading-tight text-white">{project.short}</p>
      </div>
      {project.videos.length > 0 && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-white">
          <PlayCircle size={12} /> {project.videos.length} videos
        </span>
      )}
    </div>
  );
}

export function ProjectsView() {
  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Projects"
        title="What you'll ship"
        description="Each project is a real-world problem statement. Open one to read the brief, watch the walkthrough video and grab the resources."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((p) => {
          const phase = PHASE_BY_ID.get(p.phaseId)!;
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className={cx(
                "group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-line-hi hover:bg-card-hi",
                p.capstone ? "border-line-hi" : "border-line",
              )}
            >
              <ProjectThumbnail project={p} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-3">Phase {phase.code}</span>
                  <Badge tone="quiet">{p.category}</Badge>
                  {p.capstone && <Badge tone="brand"><Trophy size={10} /> Capstone</Badge>}
                </div>
                <h2 className="display mt-2.5 text-[16px] leading-snug text-ink">{p.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-2">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-ink transition-colors group-hover:text-brand-hi">
                  View project <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}
