"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Bookmark, Check, Download, ExternalLink, FileText,
  BookOpen, Link2, ClipboardList, Upload,
} from "lucide-react";
import {
  AssetChips, Badge, Button, ButtonLink, Card, ProgressBar, StatusBadge, StatusDot, Tabs, cx,
} from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { VideoPlayer } from "./VideoPlayer";
import { NoteReader } from "./NoteReader";
import {
  MODULE_BY_ID, PHASE_BY_ID, formatDuration, formatMinutes, topicNeighbours, type Topic,
} from "@/data/curriculum";
import { buildNote } from "@/lib/notes";
import { useProgress, useRollups, useTopicProgress } from "@/state/progress";

type Tab = "overview" | "notes" | "resources" | "assignment";

const RESOURCE_ICON = { doc: FileText, repo: Link2, paper: BookOpen, tool: ExternalLink } as const;

export function LearnView({ topic }: { topic: Topic }) {
  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const { prev, next } = topicNeighbours(topic.id);
  const { topics, setVideoPosition, setTopicStatus, toggleBookmark, setAssignmentStatus } = useProgress();
  const { byModule, byPhase } = useRollups();
  const tp = useTopicProgress(topic.id);
  const { push } = useToast();

  // Tab resets when you move to another topic. Derived during render rather
  // than in an effect, so there's no flash of the previous topic's tab.
  const [tabState, setTabState] = React.useState<{ topicId: string; tab: Tab }>({ topicId: topic.id, tab: "overview" });
  const tab = tabState.topicId === topic.id ? tabState.tab : "overview";
  const setTab = (t: Tab) => setTabState({ topicId: topic.id, tab: t });

  const modRollup = byModule.get(mod.id)!;
  const phaseRollup = byPhase.get(phase.id)!;
  const note = React.useMemo(() => buildNote(topic), [topic]);
  const done = tp.status === "completed";

  const complete = () => {
    if (done) {
      setTopicStatus(topic.id, "in-progress");
      return;
    }
    setTopicStatus(topic.id, "completed");
    push({
      tone: "success",
      title: `${topic.title} completed`,
      description: next ? `Up next: ${next.title}` : "That's the last topic in the programme.",
      action: next ? { label: "Go to next lesson", href: `/learn/${next.id}` } : undefined,
    });
  };

  const tabs: Array<{ value: Tab; label: string; icon: React.ReactNode }> = [
    { value: "overview", label: "Overview", icon: <BookOpen size={13} /> },
    { value: "notes", label: "Notes", icon: <FileText size={13} /> },
    { value: "resources", label: "Resources", icon: <Link2 size={13} /> },
    ...(topic.assignment
      ? [{ value: "assignment" as const, label: "Assignment", icon: <ClipboardList size={13} /> }]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ============================================== main workspace */}
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link href={`/curriculum?phase=${phase.id}&module=${mod.id}`} className="mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink-2">
              <ArrowLeft size={12} /> {mod.code} {mod.title}
            </Link>
            <span className="size-0.5 rounded-full bg-ink-4" />
            <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
              Topic {topic.index} of {mod.topics.length}
            </span>
            <StatusBadge status={tp.status} className="ml-auto" />
          </div>

          <VideoPlayer
            title={topic.title}
            durationSeconds={topic.videoSeconds}
            position={tp.videoPosition}
            onPosition={(s) => setVideoPosition(topic.id, s)}
            completed={done}
            onEnded={() =>
              push({
                tone: "success",
                title: "Video finished",
                description: `${topic.title} is marked complete.`,
                action: next ? { label: "Next lesson", href: `/learn/${next.id}` } : undefined,
              })
            }
          />

          {/* ------------------------------------------------- title block */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="display text-[24px] leading-tight text-ink sm:text-[28px]">{topic.title}</h1>
              <AssetChips
                className="mt-2.5"
                video={formatDuration(topic.videoSeconds)}
                notes={topic.hasNotes}
                assignment={!!topic.assignment}
                resources={topic.resources.length}
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(topic.id)}
                aria-pressed={tp.bookmarked}
                aria-label={tp.bookmarked ? "Remove bookmark" : "Bookmark this topic"}
              >
                <Bookmark size={14} fill={tp.bookmarked ? "currentColor" : "none"} className={tp.bookmarked ? "text-brand-ink" : undefined} />
                {tp.bookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant={done ? "secondary" : "primary"} size="sm" onClick={complete}>
                <Check size={14} strokeWidth={3} />
                {done ? "Completed" : "Mark as complete"}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={(tp.videoPosition / topic.videoSeconds) * 100} size="sm" className="max-w-sm" />
            <span className="nums shrink-0 text-[11px] text-ink-3">
              {formatDuration(tp.videoPosition)} / {formatDuration(topic.videoSeconds)}
            </span>
          </div>

          {/* ------------------------------------------------------- tabs */}
          <Tabs tabs={tabs} value={tab} onChange={setTab} className="mt-6" />

          <div className="py-6">
            {tab === "overview" && (
              <div className="animate-fade grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div>
                  <h2 className="eyebrow mb-3">What you&apos;ll learn</h2>
                  <ul className="space-y-2.5">
                    {note.blocks.find((b) => b.kind === "bullets")?.items?.map((it, i) => (
                      <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink-2">
                        <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brand" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-[66ch] text-[14px] leading-[1.75] text-ink-2">
                    {note.blocks.find((b) => b.kind === "p")?.text}
                  </p>
                  <Button variant="outline" size="sm" className="mt-5" onClick={() => setTab("notes")}>
                    Read the full notes <ArrowRight size={13} />
                  </Button>
                </div>

                <aside className="space-y-2.5">
                  <Card className="p-4">
                    <div className="eyebrow mb-3">This topic</div>
                    <dl className="space-y-2.5 text-[12px]">
                      {[
                        ["Phase", `${phase.code} · ${phase.title}`],
                        ["Module", `${mod.code} ${mod.title}`],
                        ["Video", formatMinutes(topic.videoSeconds)],
                        ["Notes", `${note.readMinutes} min read`],
                        ["Lab", topic.assignment ? topic.assignment.difficulty : "None"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-start justify-between gap-3">
                          <dt className="shrink-0 text-ink-3">{k}</dt>
                          <dd className="text-right text-ink-2">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                  <Card className="p-4">
                    <div className="eyebrow mb-2.5">Module progress</div>
                    <div className="flex items-baseline justify-between">
                      <span className="nums text-[12px] text-ink-2">{modRollup.completed}/{modRollup.total} topics</span>
                      <span className="display nums text-[16px] text-ink">{modRollup.percent}%</span>
                    </div>
                    <ProgressBar value={modRollup.percent} size="sm" className="mt-2.5" />
                    <div className="mt-3.5 flex items-baseline justify-between border-t border-line pt-3">
                      <span className="text-[11px] text-ink-3">Phase {phase.code}</span>
                      <span className="nums text-[12px] text-ink-2">{phaseRollup.percent}%</span>
                    </div>
                  </Card>
                </aside>
              </div>
            )}

            {tab === "notes" && (
              <div className="animate-fade">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <div className="eyebrow mb-1.5">{note.moduleLabel}</div>
                    <h2 className="display text-[18px] text-ink">{note.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toggleBookmark(topic.id)}>
                      <Bookmark size={13} fill={tp.bookmarked ? "currentColor" : "none"} />
                      {tp.bookmarked ? "Saved" : "Bookmark"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => push({ title: "Notes downloaded", description: `${note.title}.md saved to your device.` })}>
                      <Download size={13} /> Download
                    </Button>
                    <ButtonLink size="sm" variant="ghost" href={`/notes/${topic.id}`}>
                      Open full page <ArrowRight size={13} />
                    </ButtonLink>
                  </div>
                </div>
                <NoteReader note={note} />
              </div>
            )}

            {tab === "resources" && (
              <div className="animate-fade max-w-2xl">
                <h2 className="eyebrow mb-3">Resources for this topic</h2>
                <ul className="space-y-2">
                  {topic.resources.map((r, i) => {
                    const Icon = RESOURCE_ICON[r.kind];
                    return (
                      <li key={i}>
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
              </div>
            )}

            {tab === "assignment" && topic.assignment && (
              <div className="animate-fade max-w-2xl">
                <Card className="overflow-hidden">
                  <div className="border-b border-line px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="eyebrow">Assignment</span>
                      <Badge tone="neutral">{topic.assignment.difficulty}</Badge>
                      <Badge tone="quiet">~{Math.round(topic.assignment.estMinutes / 60)} hr</Badge>
                      <StatusBadge status={tp.assignment === "not-started" ? "not-started" : tp.assignment} className="ml-auto" />
                    </div>
                    <h2 className="display mt-3 text-[19px] text-ink">{topic.assignment.title}</h2>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-[14px] leading-[1.75] text-ink-2">{topic.assignment.brief}</p>
                    <h3 className="eyebrow mb-2.5 mt-6">Submission checklist</h3>
                    <ul className="space-y-2">
                      {[
                        "A repository link with a README a reviewer can follow",
                        "Tests, or an explanation of why the behaviour can't be tested",
                        "A short note on the trade-off you made and what you'd change with more time",
                      ].map((c) => (
                        <li key={c} className="flex gap-3 text-[13px] leading-relaxed text-ink-2">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-ink-4" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {tp.assignment === "not-started" && (
                        <Button variant="primary" size="sm" onClick={() => { setAssignmentStatus(topic.id, "in-progress"); push({ title: "Assignment started", description: topic.assignment!.title }); }}>
                          Start assignment <ArrowRight size={13} />
                        </Button>
                      )}
                      {tp.assignment === "in-progress" && (
                        <Button variant="primary" size="sm" onClick={() => { setAssignmentStatus(topic.id, "submitted"); push({ tone: "success", title: "Assignment submitted", description: "You'll get reviewer feedback within 48 hours." }); }}>
                          <Upload size={13} /> Submit for review
                        </Button>
                      )}
                      {(tp.assignment === "submitted" || tp.assignment === "evaluated" || tp.assignment === "completed") && (
                        <Button variant="secondary" size="sm" disabled>
                          <Check size={13} strokeWidth={3} /> Submitted
                        </Button>
                      )}
                      <ButtonLink href="/assignments" variant="ghost" size="sm">All assignments</ButtonLink>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* --------------------------------------------- prev / next */}
          <nav className="flex items-center justify-between gap-3 border-t border-line pt-5">
            {prev ? (
              <Link href={`/learn/${prev.id}`} className="group flex min-w-0 items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 transition-colors hover:border-line-hi hover:bg-card-hi">
                <ArrowLeft size={14} className="shrink-0 text-ink-3 transition-colors group-hover:text-ink" />
                <span className="min-w-0 text-left">
                  <span className="eyebrow block">Previous</span>
                  <span className="mt-1 block truncate text-[13px] text-ink">{prev.title}</span>
                </span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${next.id}`} className="group flex min-w-0 items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 text-right transition-colors hover:border-brand/30 hover:bg-card-hi">
                <span className="min-w-0">
                  <span className="eyebrow block">Next lesson</span>
                  <span className="mt-1 block truncate text-[13px] text-ink">{next.title}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 text-ink-3 transition-colors group-hover:text-brand-ink" />
              </Link>
            ) : <span />}
          </nav>
        </div>

        {/* ============================================ course navigation */}
        <aside className="min-w-0">
          <div className="xl:sticky xl:top-20">
            <Card className="overflow-hidden">
              <div className="border-b border-line px-4 py-3.5">
                <div className="eyebrow mb-1.5">Module {mod.code}</div>
                <p className="display truncate text-[14px] text-ink">{mod.title}</p>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <ProgressBar value={modRollup.percent} size="sm" />
                  <span className="nums shrink-0 text-[11px] text-ink-3">{modRollup.completed}/{modRollup.total}</span>
                </div>
              </div>
              <ol className="max-h-[52vh] overflow-y-auto p-1.5">
                {mod.topics.map((t) => {
                  const s = topics[t.id]?.status ?? "not-started";
                  const active = t.id === topic.id;
                  return (
                    <li key={t.id}>
                      <Link
                        href={`/learn/${t.id}`}
                        aria-current={active ? "true" : undefined}
                        className={cx(
                          "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors",
                          active ? "bg-card-hi" : "hover:bg-card-hi",
                        )}
                      >
                        {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-brand" />}
                        <StatusDot status={s} size={14} />
                        <span className={cx("min-w-0 flex-1 truncate text-[12.5px]", active ? "font-medium text-ink" : s === "not-started" ? "text-ink-3" : "text-ink-2")}>
                          {t.title}
                        </span>
                        <span className="nums shrink-0 text-[10px] text-ink-4">{formatMinutes(t.videoSeconds)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
              <div className="border-t border-line p-3">
                <ButtonLink href={`/curriculum?phase=${phase.id}&module=${mod.id}`} size="sm" variant="outline" className="w-full">
                  All modules in Phase {phase.code}
                </ButtonLink>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
