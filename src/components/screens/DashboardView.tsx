"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Boxes, Check, ClipboardList, FileText, Flame, Play, Sparkles,
} from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { WhatsAppIcon, cx } from "@/components/ui";
import {
  ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatDuration, formatMinutes, hash,
} from "@/data/curriculum";
import { COMMUNITY_STATS, RECENT_ACTIVITY, WHATSAPP_COMMUNITY_URL } from "@/data/activity";
import { USER } from "@/data/user";
import { useCurrentTopic, useProgress, useRollups } from "@/state/progress";
import { lessonThumbnail } from "@/lib/media";

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

/** One hue per kind of learning — see the content-type tokens in globals.css. */
const KIND = {
  video: { icon: Play, text: "text-video", bg: "bg-video/12", bar: "bg-video" },
  notes: { icon: FileText, text: "text-notes", bg: "bg-notes/12", bar: "bg-notes" },
  quiz: { icon: ClipboardList, text: "text-quiz", bg: "bg-quiz/12", bar: "bg-quiz" },
  project: { icon: Boxes, text: "text-project", bg: "bg-project/12", bar: "bg-project" },
  done: { icon: Check, text: "text-done", bg: "bg-done/12", bar: "bg-done" },
} as const;

const ACTIVITY_KIND = {
  completed: KIND.done,
  watched: KIND.video,
  submitted: KIND.quiz,
  started: KIND.project,
  unlocked: { icon: Sparkles, text: "text-brand-ink", bg: "bg-brand/12", bar: "bg-brand" },
} as const;

/** Placeholder week position until study sessions are tracked: today is
 *  Friday and the learner hasn't studied yet, so the streak is "at risk". */
const TODAY = 4;
const STUDIED_TODAY = false;
/** Minutes studied per weekday — seeded so it is stable across renders;
 *  today (until they study) and the rest of the week are empty. */
const WEEK = ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => ({
  d,
  min: i < TODAY || (i === TODAY && STUDIED_TODAY) ? 15 + (hash(`wk${i}`) % 70) : 0,
}));

function Bar({ value, className, tone = "bg-brand" }: { value: number; className?: string; tone?: string }) {
  return (
    <span className={cx("block h-1.5 overflow-hidden rounded-full bg-card-hi2", className)}>
      <span className={cx("block h-full rounded-full", tone)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </span>
  );
}

/** Section heading: the site's red-dot label style, an Urbanist title and a
 *  one-line description, with an optional action on the right. */
function SectionTitle({
  title, sub, action, small,
}: { title: string; sub?: React.ReactNode; action?: React.ReactNode; small?: boolean }) {
  return (
    <div className={cx("flex items-end justify-between gap-4", small ? "mb-3.5" : "mb-4")}>
      <div className="min-w-0">
        <h2 className={cx("display flex items-center gap-2.5 leading-tight text-ink", small ? "text-[17px]" : "text-[22px]")}>
          <span className="size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
          {title}
        </h2>
        {sub && <p className="mt-1 pl-[18px] text-[13px] text-ink-3">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const linkCls = "inline-flex items-center gap-1 text-[13px] text-ink-3 transition-colors hover:text-ink";

export function DashboardView() {
  const greeting = useGreeting();
  const { program, byModule, modulesCompleted, currentPhase, byPhase, totals } = useRollups();
  const { topics, lastActiveMinutesAgo } = useProgress();
  const topic = useCurrentTopic();

  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const modRollup = byModule.get(mod.id)!;
  const phaseRollup = byPhase.get(currentPhase.id)!;
  const tp = topics[topic.id];
  const videoPct = ((tp?.videoPosition ?? 0) / topic.videoSeconds) * 100;

  const quizTopics = ALL_TOPICS.filter((t) => t.assignment);
  const quizzesDone = quizTopics.filter((t) => topics[t.id]?.assignment === "completed").length;
  const lastSeen = lastActiveMinutesAgo === 0 ? "just now" : `${lastActiveMinutesAgo} min ago`;
  const weekMax = Math.max(...WEEK.map((w) => w.min));
  const weekTotal = WEEK.reduce((a, w) => a + w.min, 0);


  return (
    <Page>
      <div className="grid gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* =============================================== main column */}
        <div className="min-w-0 space-y-10">
          {/* ---------------------------------------------- header */}
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="display text-[32px] font-light leading-[1.05] text-ink sm:text-[40px]">
                {greeting}, <span className="text-brand-ink">{USER.firstName}</span>
              </h1>
              <p className="mt-2 text-[15px] text-ink-3">
                Here&apos;s your hub for the AI Forward Deployed Engineer program — you&apos;re{" "}
                <span className="nums text-ink-2">{program.percent}%</span> of the way there.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-quiz/12 px-3 py-1.5 text-[12px] font-medium text-quiz">
              <Flame size={13} /> {USER.streakDays}-day streak
            </span>
          </header>

          {/* ---------------------------------------------- continue */}
          <div>
          <SectionTitle title="Continue learning" sub="Pick up exactly where you left off" />
          <section className="edge-lit overflow-hidden rounded-[var(--radius-xl)] border border-line bg-card">
            <div className="grid sm:grid-cols-[240px_minmax(0,1fr)]">
              <Link
                href={`/learn/${topic.id}`}
                className="group relative flex aspect-video items-center justify-center overflow-hidden bg-black sm:aspect-auto"
                aria-label={`Resume ${topic.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote placeholder thumbnail */}
                <img src={lessonThumbnail(topic.id)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                <span className="halo relative flex size-12 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_30px_rgba(230,22,31,.5)] transition-transform group-hover:scale-105">
                  <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                </span>
                <span className="nums absolute bottom-2.5 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-ink-2">
                  {formatDuration(tp?.videoPosition ?? 0)} / {formatDuration(topic.videoSeconds)}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                  <span className="block h-full bg-brand" style={{ width: `${videoPct}%` }} />
                </span>
              </Link>
              <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
                <div>
                  <p className="text-[12px] font-medium text-video">Video lesson · {formatMinutes(topic.videoSeconds)}</p>
                  <h3 className="display mt-1.5 text-[22px] leading-tight text-ink">{topic.title}</h3>
                  <p className="mt-1.5 text-[13px] text-ink-3">
                    {mod.code} {mod.title} · Topic {topic.index} of {mod.topics.length} · Last watched {lastSeen}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
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
          </section>
          </div>

          {/* ---------------------------------------------- current phase modules */}
          <section>
            <SectionTitle
              title="Current phase"
              sub={`Phase ${currentPhase.code} · ${currentPhase.title} · ${phaseRollup.percent}% complete`}
              action={<Link href={`/curriculum?phase=${currentPhase.id}`} className={linkCls}>Open phase <ArrowRight size={13} /></Link>}
            />
            <div className="divide-y divide-line border-y border-line">
              {currentPhase.modules.map((m) => {
                const r = byModule.get(m.id)!;
                const done = r.percent === 100;
                const active = !done && r.completed + r.inProgress > 0;
                return (
                  <Link
                    key={m.id}
                    href={`/curriculum?phase=${currentPhase.id}&module=${m.id}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-2 py-3.5 transition-colors hover:bg-card/60 sm:grid-cols-[minmax(0,1fr)_180px_90px]"
                  >
                    <span className="min-w-0">
                      <span className="mono mr-2 text-[11px] text-ink-4">{m.code}</span>
                      <span className="text-[14px] text-ink">{m.title}</span>
                    </span>
                    <span className="col-span-2 row-start-2 flex items-center gap-3 sm:col-span-1 sm:row-start-auto">
                      <Bar value={r.percent} tone={done ? "bg-done" : "bg-brand"} className="flex-1" />
                      <span className="nums w-14 text-right text-[12px] text-ink-3">{r.completed}/{r.total}</span>
                    </span>
                    <span
                      className={cx(
                        "justify-self-end rounded-full px-2.5 py-1 text-[11px] font-medium",
                        done ? "bg-done/12 text-done" : active ? "bg-brand/12 text-brand-ink" : "bg-card-hi text-ink-3",
                      )}
                    >
                      {done ? "Completed" : active ? "In progress" : "Not started"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ---------------------------------------------- activity */}
          <section>
            <SectionTitle title="Recent activity" sub="Your last few sessions on the platform" />
            <ol className="relative space-y-5 border-l border-line pl-6">
              {RECENT_ACTIVITY.map((a) => {
                const k = ACTIVITY_KIND[a.kind];
                return (
                  <li key={a.id} className="relative">
                    <span className={cx("absolute -left-[33px] top-0.5 flex size-[18px] items-center justify-center rounded-full ring-4 ring-panel", k.bg, k.text)}>
                      <k.icon size={10} strokeWidth={2.5} />
                    </span>
                    <Link href={a.href} className="group block">
                      <span className="text-[14px] text-ink transition-colors group-hover:text-brand-ink">{a.title}</span>
                      <span className="mt-0.5 block text-[12px] text-ink-3">
                        {a.context} · {a.when}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* =============================================== right rail */}
        <aside className="space-y-8 xl:border-l xl:border-line xl:pl-8">
          {/* ---------------------------------------------- progress */}
          <section>
            <SectionTitle small title="Your progress" />
            <p className="display nums text-[44px] leading-none text-ink">
              {program.percent}<span className="text-[22px] text-ink-3">%</span>
            </p>
            <Bar value={program.percent} className="mt-3 h-2" />
            <dl className="mt-5 space-y-3.5">
              {[
                { label: "Topics", done: program.completed, total: program.total, tone: "bg-video" },
                { label: "Modules", done: modulesCompleted, total: totals.modules, tone: "bg-done" },
                { label: "Assignments", done: quizzesDone, total: quizTopics.length, tone: "bg-quiz" },
                { label: "Phases", done: PHASES.filter((p) => byPhase.get(p.id)!.percent === 100).length, total: totals.phases, tone: "bg-project" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <dt className="text-ink-2">{s.label}</dt>
                    <dd className="nums text-ink-3">
                      <span className="text-ink">{s.done}</span> / {s.total}
                    </dd>
                  </div>
                  <Bar value={(s.done / s.total) * 100} tone={s.tone} className="mt-1.5 h-1" />
                </div>
              ))}
            </dl>
          </section>

          {/* ---------------------------------------------- streak */}
          <section className="border-t border-line pt-7">
            <SectionTitle small title="Streak" sub="Study a little every day to keep it alive" />
            <div className="plume edge-lit flex items-center gap-4 overflow-hidden rounded-[var(--radius-lg)] bg-quiz/[0.07] p-4 ring-1 ring-quiz/20">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-quiz/15 text-quiz">
                <Flame size={24} fill="currentColor" strokeWidth={1.5} />
              </span>
              <div>
                <p className="display nums text-[30px] font-light leading-none text-ink">
                  {USER.streakDays}
                  <span className="ml-1.5 text-[14px] text-ink-3">day streak</span>
                </p>
                <p className="nums mt-1.5 text-[12px] text-ink-3">Best: {USER.bestStreakDays} days</p>
              </div>
            </div>
            <ol className="mt-4 grid grid-cols-7 gap-1.5">
              {WEEK.map((w, i) => {
                const today = i === TODAY;
                const done = i < TODAY || (today && STUDIED_TODAY);
                return (
                  <li key={i} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cx(
                        "flex size-8 items-center justify-center rounded-full",
                        done ? "bg-quiz text-black" : today ? "ring-2 ring-quiz text-quiz" : "bg-card-hi2 text-ink-4",
                      )}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : <Flame size={13} />}
                    </span>
                    <span className={cx("text-[10px]", today ? "font-medium text-ink" : "text-ink-4")}>{w.d}</span>
                  </li>
                );
              })}
            </ol>
            {!STUDIED_TODAY && (
              <p className="mt-3 text-[12px] text-ink-3">
                Finish one lesson today to make it <span className="nums text-quiz">{USER.streakDays + 1} days</span>.
              </p>
            )}
          </section>

          {/* ---------------------------------------------- this week */}
          <section className="border-t border-line pt-7">
            <SectionTitle small title="This week" sub={`${Math.floor(weekTotal / 60)}h ${weekTotal % 60}m of learning`} />
            <div className="flex h-24 items-end gap-2">
              {WEEK.map((w, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={cx("w-full rounded-t-[4px]", i === TODAY ? "bg-brand/40" : "bg-card-hi2")}
                    style={{ height: `${Math.max(4, (w.min / weekMax) * 72)}px` }}
                    title={`${w.min} min`}
                  />
                  <span className={cx("text-[10px]", i === TODAY ? "text-ink" : "text-ink-4")}>{w.d}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------- community */}
          <div className="border-t border-line pt-7">
          <SectionTitle small title="Community" />
          <section className="rounded-[var(--radius-lg)] bg-[#25D366]/[0.07] p-4 ring-1 ring-[#25D366]/20">
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
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-[#25D366] py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
            >
              Join on WhatsApp <ArrowUpRight size={14} />
            </a>
          </section>
          </div>

          {/* ---------------------------------------------- phases */}
          <section className="border-t border-line pt-7">
            <SectionTitle small title="Programme" sub="All nine phases" action={<Link href="/curriculum" className={linkCls}>Curriculum</Link>} />
            <ul className="space-y-1">
              {PHASES.map((p) => {
                const r = byPhase.get(p.id)!;
                const done = r.percent === 100;
                const current = p.id === currentPhase.id;
                return (
                  <li key={p.id}>
                    <Link
                      href={`/curriculum?phase=${p.id}`}
                      className={cx(
                        "flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors hover:bg-card",
                        current && "bg-card",
                      )}
                    >
                      <span
                        className={cx(
                          "flex size-4 shrink-0 items-center justify-center rounded-full",
                          done ? "bg-done text-black" : current ? "ring-2 ring-brand" : "ring-1 ring-line-hi",
                        )}
                      >
                        {done && <Check size={10} strokeWidth={3.5} />}
                      </span>
                      <span className={cx("min-w-0 flex-1 truncate text-[13px]", current ? "text-ink" : done ? "text-ink-2" : "text-ink-3")}>
                        {p.title}
                      </span>
                      <span className="nums text-[11px] text-ink-4">{r.percent}%</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>
    </Page>
  );
}
