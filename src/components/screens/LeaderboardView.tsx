"use client";

import * as React from "react";
import { Crown, Minus, TrendingUp } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Doodles, cx } from "@/components/ui";
import { ALL_TOPICS } from "@/data/curriculum";
import { USER } from "@/data/user";
import {
  COHORT, RANGES, XP, initialsOf, scoreFor, type Learner, type Range,
} from "@/data/leaderboard";
import { useProgress, useRollups } from "@/state/progress";

/* ============================================================================
 * LEADERBOARD
 *
 * Medal colour is the one place this product spends hue outside the two-value
 * rule, because here it carries meaning: gold, silver and bronze *are* the
 * rank. Everything below third is neutral, and the signed-in learner's row is
 * brand red — the same "this is the thing in flight" the rest of the LMS uses.
 * ========================================================================= */

/* Medal colour lives on filled chips and rings only. As *text* it was a pale
   metallic on a pale surface in the light theme — the XP values washed out —
   so scores stay in the normal ink ramp and the rank carries the colour. */
const MEDAL = [
  { ring: "ring-[#d4a63c]", bg: "bg-[#d4a63c]/10", chip: "bg-[#d4a63c] text-black" },
  { ring: "ring-[#9aa4b0]", bg: "bg-[#9aa4b0]/10", chip: "bg-[#9aa4b0] text-black" },
  { ring: "ring-[#b07a4a]", bg: "bg-[#b07a4a]/10", chip: "bg-[#b07a4a] text-black" },
] as const;

function Avatar({ name, size, className }: { name: string; size: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex shrink-0 select-none items-center justify-center rounded-full bg-card-hi2 font-semibold text-ink-2",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {initialsOf(name)}
    </span>
  );
}

export function LeaderboardView() {
  const [range, setRange] = React.useState<Range>("all");
  const { program } = useRollups();
  const { topics } = useProgress();

  // Your score is real: it comes from the same progress state as every other
  // number in the product, not from a seed.
  const quizzesDone = React.useMemo(
    () => ALL_TOPICS.filter((t) => t.assignment && topics[t.id]?.assignment === "completed").length,
    [topics],
  );
  const yourXp = program.completed * XP.topic + quizzesDone * XP.quiz;

  const you: Learner = { id: "you", name: USER.name, allTime: yourXp, isYou: true };

  const ranked = React.useMemo(() => {
    return [...COHORT, you]
      .map((l) => ({ ...l, score: scoreFor(l, range) }))
      .sort((a, b) => b.score - a.score)
      .map((l, i) => ({ ...l, rank: i + 1 }));
  }, [range, you.allTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const podium = ranked.slice(0, 3);
  const yourRow = ranked.find((l) => l.isYou)!;
  // Podium reading order places first in the middle, as a podium does.
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <Page className="space-y-9">
      {/* ------------------------------------------------------------ podium */}
      <section className="relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-line bg-card px-6 py-9 sm:px-8">
        <Doodles variant="award" className="top-0 opacity-[0.045]" />

        <div className="relative">
          <div className="flex items-end justify-center gap-5 sm:gap-10">
            {podiumOrder.map((l) => {
              const place = l.rank - 1;
              const m = MEDAL[place];
              const first = l.rank === 1;
              return (
                <div key={l.id} className={cx("flex min-w-0 flex-col items-center", first ? "pb-2" : "pb-0")}>
                  {first && <Crown size={20} className="mb-2 text-[#e0b451]" aria-hidden="true" />}
                  <span className="relative">
                    <Avatar
                      name={l.name}
                      size={first ? 84 : 62}
                      className={cx("ring-2 ring-offset-2 ring-offset-card", m.ring)}
                    />
                    <span
                      className={cx(
                        "absolute -bottom-1.5 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full text-[11px] font-bold",
                        m.chip,
                      )}
                    >
                      {l.rank}
                    </span>
                  </span>
                  <p className={cx("display mt-4 max-w-[9rem] truncate text-center text-ink", first ? "text-[18px]" : "text-[15px]")}>
                    {l.name.split(" ")[0]}
                  </p>
                  <p className="nums mt-1 text-[13px] text-ink-2">{l.score.toLocaleString("en-IN")} XP</p>
                </div>
              );
            })}
          </div>

          <h1 className="display mt-8 text-center text-[34px] font-light leading-none text-ink sm:text-[44px]">
            Leaderboard
          </h1>
          <p className="mt-3 text-center text-[13px] text-ink-3">
            Ranked by XP earned across the programme — {XP.topic} per topic completed,{" "}
            {XP.quiz} per quiz passed.
          </p>

          {/* -------------------------------------------------------- ranges */}
          <div
            role="tablist"
            aria-label="Leaderboard range"
            className="mx-auto mt-7 flex w-fit items-center gap-1 rounded-full border border-line bg-bg-sub p-1"
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                role="tab"
                aria-selected={range === r.value}
                onClick={() => setRange(r.value)}
                className={cx(
                  "rounded-full px-4 py-1.5 text-[13px] transition-colors",
                  range === r.value ? "bg-card-hi font-medium text-ink" : "text-ink-3 hover:text-ink-2",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- your standing */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-brand/25 bg-brand/[0.06] px-5 py-4">
        <div className="flex items-center gap-3.5">
          <span className="nums flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
            {yourRow.rank}
          </span>
          <div>
            <p className="text-[14px] text-ink">
              You&apos;re <span className="nums font-medium">#{yourRow.rank}</span> of {ranked.length}
            </p>
            <p className="nums mt-0.5 text-[12px] text-ink-3">
              {yourRow.score.toLocaleString("en-IN")} XP · {program.completed} topics · {quizzesDone} quizzes
            </p>
          </div>
        </div>
        {yourRow.rank > 1 && (
          <p className="nums flex items-center gap-1.5 text-[12.5px] text-ink-3">
            <TrendingUp size={14} className="text-brand-ink" />
            {(ranked[yourRow.rank - 2].score - yourRow.score).toLocaleString("en-IN")} XP to pass{" "}
            <span className="text-ink-2">{ranked[yourRow.rank - 2].name.split(" ")[0]}</span>
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------- table */}
      <section>
        <div className="mb-3 flex items-center gap-4">
          <h2 className="eyebrow shrink-0">{RANGES.find((r) => r.value === range)!.label}</h2>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="eyebrow shrink-0">{ranked.length} learners</span>
        </div>

        <ol className="space-y-1">
          {ranked.map((l) => {
            const place = l.rank - 1;
            const m = place < 3 ? MEDAL[place] : null;
            return (
              <li key={l.id}>
                <div
                  className={cx(
                    "flex items-center gap-4 rounded-[var(--radius-md)] px-4 py-3 transition-colors",
                    l.isYou
                      ? "bg-brand/[0.08] ring-1 ring-inset ring-brand/25"
                      : m
                        ? cx(m.bg, "hover:bg-card-hi")
                        : "hover:bg-card",
                  )}
                >
                  <span
                    className={cx(
                      "nums flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                      l.isYou ? "bg-brand text-white" : m ? m.chip : "bg-card-hi2 text-ink-3",
                    )}
                  >
                    {l.rank}
                  </span>

                  <Avatar name={l.name} size={32} className={m ? cx("ring-1", m.ring) : undefined} />

                  <span className="min-w-0 flex-1 truncate text-[14px] text-ink">
                    {l.name}
                    {l.isYou && <span className="ml-2 text-[12px] text-brand-ink">You</span>}
                  </span>

                  <span className={cx("nums shrink-0 text-[13.5px]", m || l.isYou ? "text-ink" : "text-ink-2")}>
                    {l.score.toLocaleString("en-IN")}
                    <span className="ml-1 text-[11px] text-ink-4">XP</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-5 flex items-center gap-2 text-[12px] text-ink-3">
          <Minus size={12} />
          Ranks refresh as you complete topics, quizzes and projects.
        </p>
      </section>
    </Page>
  );
}
