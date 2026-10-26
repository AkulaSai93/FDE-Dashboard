"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, Play,
} from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { LessonArt, ProgressRing, WhatsAppIcon, cx } from "@/components/ui";
import { StreakPanel } from "@/components/shell/StreakPanel";
import { TODAY, WEEK, WEEK_MAX, WEEK_TOTAL } from "@/data/streak";
import {
  ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration, formatMinutes,
} from "@/data/curriculum";
import { COMMUNITY_STATS, WHATSAPP_COMMUNITY_URL } from "@/data/activity";
import { USER } from "@/data/user";
import { useCurrentTopic, useProgress, useRollups, useUpNext } from "@/state/progress";

/* ============================================================================
 * DASHBOARD
 *
 * Ordered by what the learner needs, not by what data exists:
 *
 *   1. DO       — the one lesson to resume, given the most space on the page
 *   2. NEXT     — the three after it, so the queue is visible without clicking
 *   3. WHERE    — one strip for all nine phases plus the current phase's modules
 *   4. MOMENTUM — streak, this week and the community: the reasons to come
 *                 back tomorrow
 *
 * Two colours throughout: white means finished, red means in flight, grey means
 * untouched. Colour that isn't one of those comes from lesson thumbnails.
 * ========================================================================= */

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

/* ------------------------------------------------------------- primitives */

function Bar({ value, className, tone = "bg-brand" }: { value: number; className?: string; tone?: string }) {
  return (
    <span className={cx("block h-1.5 overflow-hidden rounded-full bg-card-hi2", className)}>
      <span className={cx("block h-full rounded-full transition-[width] duration-500", tone)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  );
}

/** Quiet band label. Replaces the row of identical red section dots — on a
 *  dashboard a repeated accent stops being an accent. */
function Band({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <h2 className="eyebrow shrink-0">{label}</h2>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      {action}
    </div>
  );
}

/** 16:9 lesson thumbnail with a duration stamp and an optional resume bar. */
function Thumb({
  topicId,
  seconds,
  watched = 0,
  className,
  big,
  /** `aspect-video` sizes from width — correct for a card, wrong for a side
   *  panel, where the grid sets the height and the aspect ratio then forces a
   *  width that overflows the track. Pass `aspect-auto` there. */
  aspect = "aspect-video",
}: {
  topicId: string;
  seconds: number;
  watched?: number;
  className?: string;
  big?: boolean;
  aspect?: string;
}) {
  const pct = seconds ? (watched / seconds) * 100 : 0;
  return (
    <span className={cx("relative block overflow-hidden bg-black ring-1 ring-line", aspect, className)}>
      <LessonArt topicId={topicId} className="transition-transform duration-500 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span
        className={cx(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-transform duration-200 group-hover:scale-110",
          big ? "size-14" : "size-9",
        )}
      >
        <Play size={big ? 20 : 13} fill="currentColor" strokeWidth={0} className="ml-0.5" />
      </span>
      <span className="nums absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-white/90 backdrop-blur-sm">
        {formatDuration(seconds)}
      </span>
      {pct > 0 && (
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
          <span className="block h-full bg-brand" style={{ width: `${pct}%` }} />
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------- view */

export function DashboardView() {
  const greeting = useGreeting();
  const { program, byModule, modulesCompleted, currentPhase, byPhase, totals } = useRollups();
  const { topics, lastActiveMinutesAgo } = useProgress();
  const topic = useCurrentTopic();
  const queue = useUpNext(60);
  // One per module, so the queue doesn't just restate the hero's module.
  const upNext = React.useMemo(() => {
    const seen = new Set([topic.moduleId]);
    const out: typeof queue = [];
    for (const t of queue) {
      if (t.id === topic.id || seen.has(t.moduleId)) continue;
      seen.add(t.moduleId);
      out.push(t);
      if (out.length === 4) break;
    }
    return out;
  }, [queue, topic]);

  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const phaseRollup = byPhase.get(currentPhase.id)!;
  const tp = topics[topic.id];

  const quizTopics = ALL_TOPICS.filter((t) => t.assignment);
  const quizzesDone = quizTopics.filter((t) => topics[t.id]?.assignment === "completed").length;
  const phasesDone = PHASES.filter((p) => byPhase.get(p.id)!.percent === 100).length;
  const videoPct = ((tp?.videoPosition ?? 0) / topic.videoSeconds) * 100;
  const modRollup = byModule.get(mod.id)!;
  const lastSeen = lastActiveMinutesAgo === 0 ? "just now" : `${lastActiveMinutesAgo} min ago`;

  const STATS = [
    { label: "Topics", done: program.completed, total: program.total },
    { label: "Modules", done: modulesCompleted, total: totals.modules },
    { label: "Quizzes", done: quizzesDone, total: quizTopics.length },
    { label: "Phases", done: phasesDone, total: totals.phases },
  ];

  return (
    <Page className="space-y-10">
      {/* =============================================== 0 · who and where */}
      <header className="min-w-0">
        <h1 className="display text-[30px] font-light leading-[1.05] text-ink sm:text-[36px]">
          {greeting}, <span className="text-brand-ink">{USER.firstName}</span>
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-ink-3">
          <span className="nums text-ink-2">{program.percent}% complete</span>
          <span className="size-0.5 rounded-full bg-ink-4" aria-hidden="true" />
          <span>Phase {currentPhase.code} · {currentPhase.title}</span>
          <span className="size-0.5 rounded-full bg-ink-4" aria-hidden="true" />
          <span className="nums">{program.total - program.completed} topics to go</span>
        </p>
      </header>

      {/* ======================================= 1 · the lesson, then progress
          Reading order is the priority order: what to open first, how far along
          second. Both cards are kept short on purpose — when the progress card
          was tall it stretched the lesson thumbnail beside it into a portrait
          strip, and left a void in each. */}
      <div className="grid gap-x-6 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* ------------------------------------------- what do I open */}
        <section className="flex min-w-0 flex-col">
          <Band label="Continue learning" />
          <div className="h-full rounded-[var(--radius-xl)] border border-line bg-card p-5 sm:p-6">
            {/* The thumbnail is inset and keeps a true 16:9. Previously it was
                bled to the card edges and stretched to the card's height, which
                cropped a 16:9 still into a near-square and cut the right third
                of the artwork off. */}
            <div className="grid h-full gap-5 sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)] sm:gap-6">
              <Link
                href={`/learn/${topic.id}`}
                className="group relative block aspect-video self-center overflow-hidden rounded-[var(--radius-lg)] bg-black ring-1 ring-line"
                aria-label={`Resume ${topic.title}`}
              >
                <LessonArt
                  topicId={topic.id}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_28px_rgba(230,22,31,.45)] transition-transform duration-200 group-hover:scale-110">
                  <Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                </span>
                <span className="nums absolute bottom-2 right-2.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-white/90 backdrop-blur-sm">
                  {formatDuration(tp?.videoPosition ?? 0)} / {formatDuration(topic.videoSeconds)}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                  <span className="block h-full bg-brand" style={{ width: `${videoPct}%` }} />
                </span>
              </Link>

              <div className="flex min-w-0 flex-col gap-4">
                <div className="min-w-0">
                  <p className="eyebrow">Video lesson · {formatMinutes(topic.videoSeconds)}</p>
                  <h3 className="display mt-2 text-[22px] leading-tight text-ink">{topic.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                    {mod.code} {mod.title} · Topic {topic.index} of {mod.topics.length} · Last watched {lastSeen}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3">
                  <Link
                    href={`/learn/${topic.id}`}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-hi"
                  >
                    Resume lesson <ArrowRight size={14} />
                  </Link>
                  <Link
                    href={`/curriculum?phase=${phase.id}&module=${mod.id}`}
                    className="text-[13px] text-ink-3 transition-colors hover:text-ink"
                  >
                    View module · {modRollup.percent}% done
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- how far am I */}
        <section className="flex min-w-0 flex-col">
          <Band
            label="Your progress"
            action={
              <Link href="/certification" className="shrink-0 text-[12px] text-ink-3 transition-colors hover:text-ink">
                Certificate
              </Link>
            }
          />
          <div className="flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-card p-6">
            <div className="flex items-center gap-5">
              <ProgressRing value={program.percent} size={96} stroke={4} sublabel="Complete" />
              <div className="min-w-0 flex-1">
                <div className="flex gap-1.5" aria-hidden="true">
                  {PHASES.map((p) => {
                    const r = byPhase.get(p.id)!;
                    return (
                      <span
                        key={p.id}
                        className="h-2 flex-1 overflow-hidden rounded-full bg-card-hi2"
                        title={`Phase ${p.code} — ${r.percent}%`}
                      >
                        <span
                          className={cx("block h-full rounded-full", r.percent === 100 ? "bg-ink-2" : "bg-brand")}
                          style={{ width: `${r.percent}%` }}
                        />
                      </span>
                    );
                  })}
                </div>
                <div className="mt-2.5 flex items-baseline justify-between gap-3">
                  <span className="eyebrow">Phase 01 → 09</span>
                  <span className="nums text-[12px] text-ink-3">
                    <span className="text-ink-2">{phasesDone}</span> of {totals.phases} done
                  </span>
                </div>
              </div>
            </div>

            {/* Counts only — the ring and the phase strip already carry the
                proportions, so a bar under every number was repeating them. */}
            <dl className="mt-auto grid grid-cols-2 gap-x-8 gap-y-3 border-t border-line pt-5">
              {STATS.map((st) => (
                <div key={st.label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-[13px] text-ink-3">{st.label}</dt>
                  <dd className="nums text-[14px] text-ink">
                    {st.done}
                    <span className="text-[12px] text-ink-4">/{st.total}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      {/* =================================================== 2 · the queue
          One lesson per module: the raw "next four topics" were all from the
          module already showing in the hero, so the queue repeated it three
          times. Cards are borderless — the artwork is the card. */}
      {upNext.length > 0 && (
        <section>
          <Band
            label="Up next"
            action={
              <Link href="/videos" className="shrink-0 text-[12px] text-ink-3 transition-colors hover:text-ink">
                All lessons
              </Link>
            }
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {upNext.map((t) => {
              const m = MODULE_BY_ID.get(t.moduleId)!;
              const p = PHASE_BY_ID.get(t.phaseId)!;
              return (
                <li key={t.id}>
                  <Link href={`/learn/${t.id}`} className="group block">
                    <Thumb
                      topicId={t.id}
                      seconds={t.videoSeconds}
                      className="rounded-[var(--radius-lg)]"
                    />
                    <p className="eyebrow mt-3">
                      P{p.code} · {m.code}
                    </p>
                    <h3 className="mt-1.5 line-clamp-2 text-[14px] leading-snug text-ink transition-colors group-hover:text-brand-ink">
                      {t.title}
                    </h3>
                    <p className="nums mt-1 truncate text-[12px] text-ink-3">
                      {m.title} · {formatMinutes(t.videoSeconds)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* =============================================== 3 · where am I */}
      <section>
        <Band
          label={`Phase ${currentPhase.code} · ${currentPhase.title}`}
          action={
            <Link href={`/curriculum?phase=${currentPhase.id}`} className="shrink-0 text-[12px] text-ink-3 transition-colors hover:text-ink">
              Open phase
            </Link>
          }
        />
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-[13px] text-ink-3">
              <span className="nums text-ink">{phaseRollup.completed}</span> of {phaseRollup.total} topics ·{" "}
              {currentPhase.modules.length} modules
            </p>
            <p className="nums display text-[18px] text-ink">{phaseRollup.percent}%</p>
          </div>
          <ul className="divide-y divide-line-soft">
            {currentPhase.modules.map((m) => {
              const r = byModule.get(m.id)!;
              const done = r.percent === 100;
              const active = m.id === mod.id;
              return (
                <li key={m.id}>
                  <Link
                    href={`/curriculum?phase=${currentPhase.id}&module=${m.id}`}
                    className={cx(
                      "-mx-3 flex items-center gap-4 rounded-[var(--radius-md)] px-3 py-3.5 transition-colors hover:bg-card",
                      active && "bg-card",
                    )}
                  >
                    <span
                      className={cx(
                        "flex size-[18px] shrink-0 items-center justify-center rounded-full",
                        done ? "bg-ink text-panel" : active ? "ring-2 ring-brand" : "ring-1 ring-line-hi",
                      )}
                    >
                      {done && <Check size={10} strokeWidth={3.5} />}
                    </span>
                    <span className="mono hidden shrink-0 text-[11px] text-ink-4 sm:block">{m.code}</span>
                    <span className={cx("min-w-0 flex-1 truncate text-[14px]", done ? "text-ink-2" : "text-ink")}>
                      {m.title}
                    </span>
                    <Bar value={r.percent} tone={done ? "bg-ink-2" : "bg-brand"} className="hidden w-28 shrink-0 md:block" />
                    <span className="nums w-12 shrink-0 text-right text-[12px] text-ink-3">
                      {r.completed}/{r.total}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ================================================= 4 · momentum */}
      <section>
        <Band label="Momentum" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* streak */}
          <div className="plume edge-lit overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card p-5">
            <StreakPanel compact />
          </div>

          {/* this week */}
          <div className="rounded-[var(--radius-lg)] border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="eyebrow">This week</p>
              <p className="nums text-[12px] text-ink-3">
                <span className="text-ink">{Math.floor(WEEK_TOTAL / 60)}h {WEEK_TOTAL % 60}m</span> of learning
              </p>
            </div>
            <div className="mt-5 flex h-[108px] items-end gap-2">
              {WEEK.map((w, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={cx("w-full rounded-t-[4px]", i === TODAY ? "bg-brand/40" : w.min ? "bg-ink-2/70" : "bg-card-hi2")}
                    style={{ height: `${Math.max(4, (w.min / WEEK_MAX) * 84)}px` }}
                    title={`${w.min} min`}
                  />
                  <span className={cx("text-[10px]", i === TODAY ? "text-ink" : "text-ink-4")}>{w.d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* community */}
          <div className="flex flex-col justify-between rounded-[var(--radius-lg)] bg-[#25D366]/[0.07] p-5 ring-1 ring-[#25D366]/20 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                  <WhatsAppIcon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink">FDE community</p>
                  <p className="nums text-[12px] text-ink-3">
                    {COMMUNITY_STATS.members.toLocaleString("en-IN")}+ members · {COMMUNITY_STATS.online} online
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-ink-3">
                Ask questions, share what you build and get unstuck faster than you would alone.
              </p>
            </div>
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-[#25D366] py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
            >
              Join on WhatsApp <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

    </Page>
  );
}
