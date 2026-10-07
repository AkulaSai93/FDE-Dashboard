"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, FileText, Link2, Play, Trophy } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, Card, CardHeader, cx } from "@/components/ui";
import type { Project } from "@/data/projects";
import { PHASE_BY_ID, formatDuration } from "@/data/curriculum";

const RESOURCE_ICON = { doc: FileText, repo: Link2, paper: BookOpen, tool: ExternalLink } as const;

export function ProjectDetailView({ project }: { project: Project }) {
  const phase = PHASE_BY_ID.get(project.phaseId)!;
  const [active, setActive] = React.useState(0);
  const [durations, setDurations] = React.useState<Record<string, number>>({});
  const video = project.videos[active];

  // Read each clip's real length for the playlist.
  React.useEffect(() => {
    const els = project.videos.map((v) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => setDurations((d) => ({ ...d, [v.src]: el.duration }));
      el.src = v.src;
      return el;
    });
    return () => els.forEach((el) => el.removeAttribute("src"));
  }, [project.videos]);

  return (
    <Page className="max-w-[1200px] space-y-6">
      <Link href="/projects" className="mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink-2">
        <ArrowLeft size={12} /> All projects
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-3">Phase {phase.code} · {phase.title}</span>
          <Badge tone="quiet">{project.category}</Badge>
          <Badge tone="quiet">{project.domain}</Badge>
          {project.capstone && <Badge tone="brand"><Trophy size={10} /> Capstone</Badge>}
        </div>
        <h1 className="display mt-3 text-[26px] leading-tight text-ink sm:text-[30px]">{project.title}</h1>
      </div>

      {video && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <video
            key={active}
            src={video.src}
            poster={project.thumbnail}
            controls
            playsInline
            autoPlay={active > 0}
            onEnded={() => active < project.videos.length - 1 && setActive(active + 1)}
            className="aspect-video w-full rounded-xl border border-line bg-black"
          />
          <Card className="overflow-hidden">
            <div className="flex items-baseline justify-between border-b border-line px-4 py-3">
              <span className="eyebrow">Project videos</span>
              <span className="nums text-[11px] text-ink-3">{active + 1} / {project.videos.length}</span>
            </div>
            <ol>
              {project.videos.map((v, i) => {
                return (
                  <li key={v.title}>
                    <button
                      onClick={() => setActive(i)}
                      className={cx(
                        "flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors last:border-0 hover:bg-card-hi",
                        i === active && "bg-brand/8",
                      )}
                    >
                      <span className={cx("nums flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]", i === active ? "border-brand bg-brand text-white" : "border-line-hi text-ink-3")}>
                        {i === active ? <Play size={9} fill="currentColor" strokeWidth={0} /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx("block truncate text-[13px]", i === active ? "text-ink" : "text-ink-2")}>{v.title}</span>
                      </span>
                      <span className="nums shrink-0 text-[11px] text-ink-3">
                        {durations[v.src] ? formatDuration(Math.round(durations[v.src])) : "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader eyebrow="Problem statement" title="What you need to build" />
        <div className="border-t border-line px-5 py-5">
          <p className="text-[14px] leading-[1.75] text-ink-2">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="mono rounded border border-line bg-bg-sub px-2 py-1 text-[10px] text-ink-3">{s}</span>
            ))}
          </div>
        </div>
      </Card>

      {project.resources.length > 0 && (
        <section>
          <h2 className="eyebrow mb-3">Resources</h2>
          <ul className="space-y-2">
            {project.resources.map((r) => {
              const Icon = RESOURCE_ICON[r.kind];
              return (
                <li key={r.label}>
                  <a
                    href={r.href}
                    className="group flex items-center gap-3.5 rounded-lg border border-line bg-card px-4 py-3.5 transition-colors hover:border-line-hi hover:bg-card-hi"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-bg-sub text-ink-3">
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{r.label}</span>
                      <span className="mono block text-[10px] uppercase tracking-[0.1em] text-ink-3">{r.kind}</span>
                    </span>
                    <ExternalLink size={13} className="shrink-0 text-ink-4 transition-colors group-hover:text-brand-ink" />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Page>
  );
}
