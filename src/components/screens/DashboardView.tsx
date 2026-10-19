"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, Flame, Play,
} from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { LessonPoster, WhatsAppIcon, cx } from "@/components/ui";
import { lessonThumbnail } from "@/lib/media";
import {
  ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration, formatMinutes, hash,
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

/** Placeholder week position until study sessions are tracked: today is
 *  Friday and the learner hasn't studied yet, so the streak is "at risk". */
const TODAY = 4;
const STUDIED_TODAY = false;
const WEEK = ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => ({
  d,
  min: i < TODAY || (i === TODAY && STUDIED_TODAY) ? 15 + (hash(`wk${i}`) % 70) : 0,
}));

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
      {/* Poster sits behind as the fallback, so a thumbnail that fails to
          load degrades to the lesson's plate rather than a black rectangle. */}
      <LessonPoster topicId={topicId} />
      {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder thumbnail */}
      <img
        src={lessonThumbnail(topicId)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span
        className={cx(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-transform duration-200 group-hover:scale-110",
          big ? "size-14" : "size-9",
        )}
      >
        <Play size={big ? 20 : 13} fill="currentColor" strokeWidth={0} className="ml-0.5" />
      </span>
      <span className="nums absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-ink-2 backdrop-blur-sm">
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
  const upNext = useUpNext(4).filter((t) => t.id !== topic.id).slice(0, 3);

  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const phaseRollup = byPhase.get(currentPhase.id)!;
  const tp = topics[topic.id];

  const quizTopics = ALL_TOPICS.filter((t) => t.assignment);
  const quizzesDone = quizTopics.filter((t) => topics[t.id]?.assignment === "completed").length;
  const phasesDone = PHASES.filter((p) => byPhase.get(p.id)!.percent === 100).length;
  const lastSeen = lastActiveMinutesAgo === 0 ? "just now" : `${lastActiveMinutesAgo} min ago`;
  const weekMax = Math.max(...WEEK.map((w) => w.min), 1);
  const weekTotal = WEEK.reduce((a, w) => a + w.min, 0);

  const STATS = [
    { label: "Topics", done: program.completed, total: program.total },
    { label: "Modules", done: modulesCompleted, total: totals.modules },
    { label: "Quizzes", done: quizzesDone, total: quizTopics.length },
    { label: "Phases", done: phasesDone, total: totals.phases },
  ];

  return (
    <Page className="space-y-10">
      {/* =============================================== 0 · who and where */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
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
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-ink-2 ring-1 ring-inset ring-white/10">
          <Flame size={13} /> {USER.streakDays}-day streak
        </span>
      </header>

      {/* ================================================= 1 · do this now */}
      <section>
        <Band
          label="Continue learning"
          action={
            <Link href={`/curriculum?phase=${phase.id}&module=${mod.id}`} className="shrink-0 text-[12px] text-ink-3 transition-colors hover:text-ink">
              View module
            </Link>
          }
        />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          {/* the lesson */}
          {/* Thumbnail sits beside the copy rather than above it: stacked, a
              full-width 16:9 pushed this card past 900px tall on a desktop. */}
          <Link
            href={`/learn/${topic.id}`}
            className="group edge-lit grid overflow-hidden rounded-[var(--radius-xl)] border border-line bg-card transition-colors hover:border-line-hi sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
          >
            <Thumb
              topicId={topic.id}
              seconds={topic.videoSeconds}
              watched={tp?.videoPosition ?? 0}
              aspect="aspect-video sm:aspect-auto"
              className="min-w-0 sm:h-full"
              big
            />
            <div className="flex flex-col justify-center gap-4 p-5">
              <div>
                <p className="eyebrow">
                  Phase {phase.code} · {mod.code} {mod.title}
                </p>
                <h3 className="display mt-2 text-[22px] leading-tight text-ink sm:text-[26px]">{topic.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12px] text-ink-3">
                  <span className="nums">
                    <span className="text-ink-2">{formatDuration(tp?.videoPosition ?? 0)}</span> / {formatDuration(topic.videoSeconds)}
                  </span>
                  <span className="size-0.5 rounded-full bg-ink-4" aria-hidden="true" />
                  <span>Topic {topic.index} of {mod.topics.length}</span>
                  <span className="size-0.5 rounded-full bg-ink-4" aria-hidden="true" />
                  <span>{lastSeen}</span>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[13px] font-medium text-white transition-colors group-hover:bg-brand-hi">
                Resume lesson <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* the number */}
          <div className="plume flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-card p-5">
            <div>
              <p className="eyebrow">Your progress</p>
              <p className="display nums mt-2 text-[44px] font-light leading-none text-ink">
                {program.percent}<span className="text-[22px] text-ink-3">%</span>
              </p>
              {/* One notch per phase: the whole programme at a glance. */}
              <div className="mt-4 flex gap-1" aria-hidden="true">
                {PHASES.map((p) => {
                  const r = byPhase.get(p.id)!;
                  return (
                    <span key={p.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-card-hi2" title={`Phase ${p.code} — ${r.percent}%`}>
                      <span
                        className={cx("block h-full rounded-full", r.percent === 100 ? "bg-ink-2" : "bg-brand")}
                        style={{ width: `${r.percent}%` }}
                      />
                    </span>
                  );
                })}
              </div>
              <p className="eyebrow mt-2.5">Phase 01 → 09</p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-line pt-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="nums mt-1.5 text-[16px] text-ink">
                    {s.done}
                    <span className="text-[12px] text-ink-4"> / {s.total}</span>
                  </dd>
                  <Bar value={(s.done / s.total) * 100} tone="bg-ink-2" className="mt-2 h-1" />
                </div>
              ))}
            </dl>

            {/* The payoff for that number, so the panel ends on the reason to
                keep going rather than on a statistic. */}
            <Link
              href="/certification"
              className="group mt-auto flex items-center gap-3 border-t border-line pt-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-ink transition-colors group-hover:text-brand-ink">
                  Certificate of completion
                </span>
                <span className="nums mt-0.5 block text-[12px] text-ink-3">
                  Unlocks at 100% · {100 - program.percent}% to go
                </span>
              </span>
              <ArrowRight size={14} className="shrink-0 text-ink-4 transition-colors group-hover:text-brand-ink" />
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================== 2 · the queue */}
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upNext.map((t, i) => {
              const m = MODULE_BY_ID.get(t.moduleId)!;
              const p = PHASE_BY_ID.get(t.phaseId)!;
              return (
                <li key={t.id}>
                  <Link
                    href={`/learn/${t.id}`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-hi"
                  >
                    <Thumb topicId={t.id} seconds={t.videoSeconds} />
                    <div className="p-4">
                      <p className="eyebrow">
                        {String(i + 1).padStart(2, "0")} · P{p.code} · {m.code}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-[14px] leading-snug text-ink transition-colors group-hover:text-brand-ink">
                        {t.title}
                      </h3>
                      <p className="nums mt-1.5 truncate text-[12px] text-ink-3">
                        {m.title} · {formatMinutes(t.videoSeconds)}
                      </p>
                    </div>
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
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4">
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
                      "flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-card-hi",
                      active && "bg-white/[0.02]",
                    )}
                  >
                    <span
                      className={cx(
                        "flex size-[18px] shrink-0 items-center justify-center rounded-full",
                        done ? "bg-ink text-black" : active ? "ring-2 ring-brand" : "ring-1 ring-line-hi",
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
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-ink">
                <Flame size={22} fill="currentColor" strokeWidth={1.5} />
              </span>
              <div>
                <p className="display nums text-[28px] font-light leading-none text-ink">
                  {USER.streakDays}
                  <span className="ml-1.5 text-[14px] text-ink-3">day streak</span>
                </p>
                <p className="nums mt-1.5 text-[12px] text-ink-3">Best: {USER.bestStreakDays} days</p>
              </div>
            </div>
            <ol className="mt-5 grid grid-cols-7 gap-1.5">
              {WEEK.map((w, i) => {
                const today = i === TODAY;
                const done = i < TODAY || (today && STUDIED_TODAY);
                return (
                  <li key={i} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cx(
                        "flex size-8 items-center justify-center rounded-full",
                        done ? "bg-ink text-black" : today ? "text-brand-ink ring-2 ring-brand" : "bg-card-hi2 text-ink-4",
                      )}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : <Flame size={13} />}
                    </span>
                    <span className={cx("text-[10px]", today ? "text-ink" : "text-ink-4")}>{w.d}</span>
                  </li>
                );
              })}
            </ol>
            {!STUDIED_TODAY && (
              <p className="mt-4 text-[12px] text-ink-3">
                Finish one lesson today to make it <span className="nums text-ink">{USER.streakDays + 1} days</span>.
              </p>
            )}
          </div>

          {/* this week */}
          <div className="rounded-[var(--radius-lg)] border border-line bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="eyebrow">This week</p>
              <p className="nums text-[12px] text-ink-3">
                <span className="text-ink">{Math.floor(weekTotal / 60)}h {weekTotal % 60}m</span> of learning
              </p>
            </div>
            <div className="mt-5 flex h-[108px] items-end gap-2">
              {WEEK.map((w, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={cx("w-full rounded-t-[4px]", i === TODAY ? "bg-brand/40" : w.min ? "bg-ink-2/70" : "bg-card-hi2")}
                    style={{ height: `${Math.max(4, (w.min / weekMax) * 84)}px` }}
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
