"use client";

import * as React from "react";
import { ChevronDown, Crown, Minus, TrendingUp } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { cx } from "@/components/ui";
import { ALL_TOPICS } from "@/data/curriculum";
import { USER } from "@/data/user";
import { COHORT, XP, initialsOf, type Learner } from "@/data/leaderboard";
import { useProgress, useRollups } from "@/state/progress";

/* ============================================================================
 * LEADERBOARD
 *
 * Medal colour is the one place this product spends hue outside the two-value
 * rule, because here it carries meaning: gold, silver and bronze *are* the
 * rank. Everything below third is neutral, and the signed-in learner's row is
 * brand red — the same "this is the thing in flight" the rest of the LMS uses.
 * ========================================================================= */

/* A colour per place, first in the brand. Red is reserved for the top of the
   board; second and third take their own hues so the podium separates at a
   glance rather than reading as one colour at three opacities. */
const MEDAL = [
  {
    hex: "#e6161f",
    ring: "ring-brand",
    chip: "bg-brand text-white",
    tint: "text-brand-ink",
    step: "bg-gradient-to-b from-brand/30 to-transparent",
  },
  {
    hex: "#e8b33c",
    ring: "ring-[#e8b33c]",
    chip: "bg-[#e8b33c] text-black",
    tint: "text-[#e8b33c]",
    step: "bg-gradient-to-b from-[#e8b33c]/28 to-transparent",
  },
  {
    hex: "#5b93c7",
    ring: "ring-[#5b93c7]",
    chip: "bg-[#5b93c7] text-black",
    tint: "text-[#5b93c7]",
    step: "bg-gradient-to-b from-[#5b93c7]/26 to-transparent",
  },
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
      .map((l) => ({ ...l, score: l.allTime }))
      .sort((a, b) => b.score - a.score)
      .map((l, i) => ({ ...l, rank: i + 1 }));
  }, [you.allTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const podium = ranked.slice(0, 3);
  const yourRow = ranked.find((l) => l.isYou)!;
  // Podium reading order places first in the middle, as a podium does.
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  const [showAll, setShowAll] = React.useState(false);

  /* Ten by default. If the learner ranks below the cut they are appended after
     a break, so the board always answers "where am I" without expanding. */
  const TOP_N = 10;
  const head = showAll ? ranked : ranked.slice(0, TOP_N);
  const youBelowCut = !showAll && yourRow.rank > TOP_N;

  return (
    <Page className="space-y-9">
      {/* ------------------------------------------------------------ podium */}
      <section className="relative isolate overflow-hidden px-2 pb-2 pt-4 sm:px-4">
        <div className="relative">
          {/* A podium with actual steps: first stands higher, flanked by
              laurels and lit by its own halo. */}
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {podiumOrder.map((l, i) => {
              const place = l.rank - 1;
              const m = MEDAL[place];
              const first = l.rank === 1;
              return (
                <div
                  key={l.id}
                  className="animate-pop flex min-w-0 flex-1 flex-col items-center sm:max-w-[200px]"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {first && (
                    <Crown size={22} className="mb-2 text-brand drop-shadow-[0_0_10px_rgba(230,22,31,0.5)]" aria-hidden="true" />
                  )}

                  <span className={cx("relative flex items-center justify-center", m.tint)}>
                    <span className={cx("medal-glow", first && "medal-glow-lg")}>
                      <Avatar
                        name={l.name}
                        size={first ? 86 : 62}
                        className={cx("ring-2 ring-offset-2 ring-offset-panel", m.ring)}
                      />
                    </span>
                    <span
                      className={cx(
                        "absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full font-bold shadow-lg",
                        first ? "size-7 text-[12px]" : "size-6 text-[11px]",
                        m.chip,
                      )}
                    >
                      {l.rank}
                    </span>
                  </span>

                  <p className={cx("display mt-5 w-full truncate text-center text-ink", first ? "text-[18px]" : "text-[15px]")}>
                    {l.name.split(" ")[0]}
                  </p>
                  <p className="nums mt-0.5 text-[13px] text-ink-2">{l.score.toLocaleString("en-IN")} XP</p>

                  {/* the step itself */}
                  <div
                    className={cx(
                      "mt-3 w-full rounded-t-[var(--radius-md)] border border-b-0 border-line",
                      m.step,
                    )}
                    style={{ height: first ? 132 : l.rank === 2 ? 98 : 74 }}
                  />
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
          <h2 className="eyebrow shrink-0">Standings</h2>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="eyebrow shrink-0">{ranked.length} learners</span>
        </div>

        <ol className="space-y-1">
          {(youBelowCut ? [...head, yourRow] : head).map((l, idx) => {
            const place = l.rank - 1;
            const m = place < 3 ? MEDAL[place] : null;
            return (
              <li
                key={l.id}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(idx, 11) * 45}ms` }}
              >
                {youBelowCut && l.isYou && (
                  <p className="eyebrow py-2 text-center">· · ·</p>
                )}
                <div
                  className={cx(
                    "flex items-center gap-4 rounded-[var(--radius-md)] px-4 py-3 transition-colors",
                    // First place gets the sweep; it is the only row that does.
                    l.rank === 1 && "shine",
                    l.isYou
                      ? "bg-brand/[0.08] ring-1 ring-inset ring-brand/25"
                      : "hover:bg-card",
                  )}
                >
                  <span
                    className={cx(
                      "nums flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                      l.isYou ? "bg-brand text-white" : m ? cx(m.chip, "shadow-md") : "bg-card-hi2 text-ink-3",
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

        {ranked.length > TOP_N && (
          <button
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-line py-3 text-[13px] text-ink-2 transition-colors hover:border-line-hi hover:bg-card hover:text-ink"
          >
            {showAll ? "Show less" : `Show all ${ranked.length} learners`}
            <ChevronDown size={14} className={cx("transition-transform", showAll && "rotate-180")} />
          </button>
        )}

        <p className="mt-5 flex items-center gap-2 text-[12px] text-ink-3">
          <Minus size={12} />
          Ranks refresh as you complete topics, quizzes and projects.
        </p>
      </section>
    </Page>
  );
}
