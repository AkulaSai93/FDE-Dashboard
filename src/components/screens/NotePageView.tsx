"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, Download, PlayCircle } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, ButtonLink, Card, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { NoteReader } from "./NoteReader";
import { buildNote } from "@/lib/notes";
import { MODULE_BY_ID, formatMinutes, type Topic } from "@/data/curriculum";
import { useProgress, useTopicProgress } from "@/state/progress";

export function NotePageView({ topic }: { topic: Topic }) {
  const note = buildNote(topic);
  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const tp = useTopicProgress(topic.id);
  const { toggleBookmark, setTopicStatus } = useProgress();
  const { push } = useToast();

  const idx = mod.topics.findIndex((t) => t.id === topic.id);
  const prev = mod.topics[idx - 1];
  const next = mod.topics[idx + 1];

  return (
    <Page className="max-w-[1000px]">
      <Link href="/notes" className="mono mb-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink-2">
        <ArrowLeft size={12} /> All notes
      </Link>

      <header className="border-b border-line pb-6">
        <div className="eyebrow mb-2.5">{note.phaseLabel} · {note.moduleLabel}</div>
        <h1 className="display text-[30px] leading-tight text-ink sm:text-[34px]">{note.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <StatusBadge status={tp.status} />
          <span className="nums text-[12px] text-ink-3">{note.readMinutes} min read</span>
          <span className="size-0.5 rounded-full bg-ink-4" />
          <span className="nums text-[12px] text-ink-3">Video {formatMinutes(topic.videoSeconds)}</span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => toggleBookmark(topic.id)} aria-pressed={tp.bookmarked}>
              <Bookmark size={13} fill={tp.bookmarked ? "currentColor" : "none"} className={tp.bookmarked ? "text-brand-ink" : undefined} />
              {tp.bookmarked ? "Saved" : "Bookmark"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => push({ title: "Notes downloaded", description: `${note.title}.md saved to your device.` })}>
              <Download size={13} /> Download
            </Button>
            <Button
              size="sm"
              variant={tp.status === "completed" ? "secondary" : "primary"}
              onClick={() => {
                const done = tp.status === "completed";
                setTopicStatus(topic.id, done ? "in-progress" : "completed");
                if (!done) push({ tone: "success", title: `${topic.title} marked complete` });
              }}
            >
              <Check size={13} strokeWidth={3} /> {tp.status === "completed" ? "Completed" : "Mark complete"}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <NoteReader note={note} />

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4">
            <div className="eyebrow mb-3">Watch the lesson</div>
            <Link href={`/learn/${topic.id}`} className="group flex items-center gap-3 rounded-lg border border-line bg-bg-sub p-3 transition-colors hover:border-brand/30 hover:bg-card-hi">
              <PlayCircle size={18} className="shrink-0 text-brand-ink" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] text-ink">{topic.title}</span>
                <span className="nums block text-[11px] text-ink-3">{formatMinutes(topic.videoSeconds)}</span>
              </span>
            </Link>
          </Card>

          <Card className="p-4">
            <div className="eyebrow mb-3">In this module</div>
            <ul className="space-y-1">
              {mod.topics.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/notes/${t.id}`}
                    className={`block truncate rounded px-2 py-1.5 text-[12px] transition-colors ${t.id === topic.id ? "bg-card-hi font-medium text-ink" : "text-ink-3 hover:bg-card-hi hover:text-ink-2"}`}
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      <nav className="flex items-center justify-between gap-3 border-t border-line pt-5">
        {prev ? (
          <ButtonLink href={`/notes/${prev.id}`} variant="outline" size="sm"><ArrowLeft size={13} /> {prev.title}</ButtonLink>
        ) : <span />}
        {next ? (
          <ButtonLink href={`/notes/${next.id}`} variant="outline" size="sm">{next.title} <ArrowRight size={13} /></ButtonLink>
        ) : <span />}
      </nav>
    </Page>
  );
}
