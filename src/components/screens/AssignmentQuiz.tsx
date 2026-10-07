"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, RotateCcw, X } from "lucide-react";
import { Button, cx } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import type { Topic } from "@/data/curriculum";
import { useProgress, useTopicProgress } from "@/state/progress";

const LETTERS = ["A", "B", "C", "D", "E"];
/** Stored for questions left blank, so they grade as wrong. */
const SKIPPED = -1;

type Filter = "all" | "unanswered" | "review" | "wrong";

/**
 * Exam-style MCQ: one question on screen, a numbered palette to jump around,
 * mark-for-review, and a confirm step that lists what's still unanswered.
 * Scales to any number of questions.
 */
export function AssignmentQuiz({ topic }: { topic: Topic }) {
  const questions = topic.assignment!.questions;
  const { submitQuiz, retakeQuiz } = useProgress();
  const tp = useTopicProgress(topic.id);
  const { push } = useToast();
  const result = tp.quiz;

  const [picked, setPicked] = React.useState<Array<number | undefined>>([]);
  const [review, setReview] = React.useState<Set<number>>(new Set());
  const [current, setCurrent] = React.useState(0);
  const [confirming, setConfirming] = React.useState(false);
  const [filter, setFilter] = React.useState<Filter>("all");

  const isAnswered = (i: number) => (result ? result.answers[i] !== SKIPPED : picked[i] !== undefined);
  const isWrong = (i: number) => !!result && result.answers[i] !== questions[i].answer;
  const answered = questions.filter((_, i) => isAnswered(i)).length;
  const unanswered = questions.length - answered;

  const q = questions[current];
  const chosenNow = result ? result.answers[current] : picked[current];

  const go = (i: number) => setCurrent(Math.max(0, Math.min(questions.length - 1, i)));

  const choose = (oi: number) => {
    if (result) return;
    setPicked((p) => { const n = [...p]; n[current] = oi; return n; });
  };

  const toggleReview = () =>
    setReview((r) => { const n = new Set(r); if (n.has(current)) n.delete(current); else n.add(current); return n; });

  const submit = () => {
    const answers = questions.map((_, i) => picked[i] ?? SKIPPED);
    const r = submitQuiz(topic.id, answers);
    setConfirming(false);
    setCurrent(0);
    setFilter("all");
    push({ tone: "success", title: "Assignment submitted", description: `You scored ${r.correct} / ${r.total}.` });
  };

  const retake = () => {
    setPicked([]);
    setReview(new Set());
    setCurrent(0);
    setFilter("all");
    retakeQuiz(topic.id);
  };

  // Keyboard: ←/→ to move, A–D to answer.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") go(current + 1);
      else if (e.key === "ArrowLeft") go(current - 1);
      else {
        const oi = LETTERS.indexOf(e.key.toUpperCase());
        if (oi >= 0 && oi < q.options.length) choose(oi);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const visible = questions
    .map((_, i) => i)
    .filter((i) =>
      filter === "unanswered" ? !isAnswered(i)
        : filter === "review" ? review.has(i)
          : filter === "wrong" ? isWrong(i)
            : true,
    );

  const filters: Array<{ value: Filter; label: string; count: number }> = result
    ? [
        { value: "all", label: "All", count: questions.length },
        { value: "wrong", label: "Wrong", count: questions.filter((_, i) => isWrong(i)).length },
      ]
    : [
        { value: "all", label: "All", count: questions.length },
        { value: "unanswered", label: "Not answered", count: unanswered },
        { value: "review", label: "Review", count: review.size },
      ];

  return (
    <div className="space-y-4">
      {result && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-line-hi bg-card px-4 py-3.5">
          <div>
            <p className="eyebrow">Your result</p>
            <p className="display nums mt-1 text-[22px] text-ink">
              {result.correct} / {result.total}
              <span className="ml-2 text-[14px] text-ink-2">({Math.round((result.correct / result.total) * 100)}%)</span>
            </p>
          </div>
          <div className="nums flex gap-4 text-[12px] text-ink-2">
            <span><span className="text-emerald-400">{result.correct}</span> correct</span>
            <span><span className="text-red-400">{result.answers.filter((a, i) => a !== SKIPPED && a !== questions[i].answer).length}</span> wrong</span>
            <span><span className="text-ink">{result.answers.filter((a) => a === SKIPPED).length}</span> skipped</span>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={retake}>
            <RotateCcw size={13} /> Retake
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        {/* ---------------------------------------------------- question */}
        <div className="flex flex-col rounded-lg border border-line bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
              Question {current + 1} of {questions.length}
            </span>
            {!result && (
              <button
                onClick={toggleReview}
                className={cx(
                  "ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                  review.has(current) ? "border-amber-500/50 bg-amber-500/10 text-amber-300" : "border-line text-ink-3 hover:text-ink",
                )}
              >
                <Bookmark size={11} fill={review.has(current) ? "currentColor" : "none"} />
                {review.has(current) ? "Marked for review" : "Mark for review"}
              </button>
            )}
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-ink">{q.question}</p>

          <div className="mt-4 space-y-2" role="radiogroup" aria-label={`Question ${current + 1}`}>
            {q.options.map((opt, oi) => {
              const chosen = chosenNow === oi;
              const correct = result && oi === q.answer;
              const wrong = result && chosen && oi !== q.answer;
              return (
                <button
                  key={oi}
                  type="button"
                  role="radio"
                  aria-checked={chosen}
                  disabled={!!result}
                  onClick={() => choose(oi)}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-[13px] transition-colors",
                    correct
                      ? "border-emerald-500/50 bg-emerald-500/10 text-ink"
                      : wrong
                        ? "border-red-500/50 bg-red-500/10 text-ink"
                        : chosen
                          ? "border-brand/50 bg-brand/8 text-ink"
                          : "border-line bg-bg-sub text-ink-2",
                    !result && "hover:border-line-hi hover:text-ink",
                  )}
                >
                  <span
                    className={cx(
                      "mono flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      correct
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : wrong
                          ? "border-red-500 bg-red-500 text-white"
                          : chosen
                            ? "border-brand bg-brand text-white"
                            : "border-line-hi text-ink-3",
                    )}
                  >
                    {correct ? <Check size={11} strokeWidth={3} /> : wrong ? <X size={11} strokeWidth={3} /> : LETTERS[oi]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {result && result.answers[current] === SKIPPED && (
            <p className="mt-3 text-[12px] text-ink-3">You skipped this question.</p>
          )}

          <div className="mt-auto flex items-center gap-2 pt-5">
            <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => go(current - 1)}>
              <ArrowLeft size={13} /> Previous
            </Button>
            {!result && picked[current] !== undefined && (
              <button
                onClick={() => setPicked((p) => { const n = [...p]; n[current] = undefined; return n; })}
                className="text-[12px] text-ink-3 hover:text-ink"
              >
                Clear answer
              </button>
            )}
            <Button
              variant={current === questions.length - 1 ? "secondary" : "primary"}
              size="sm"
              className="ml-auto"
              disabled={current === questions.length - 1}
              onClick={() => go(current + 1)}
            >
              Next <ArrowRight size={13} />
            </Button>
          </div>
        </div>

        {/* ----------------------------------------------------- palette */}
        <aside className="flex flex-col rounded-lg border border-line bg-card p-3">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cx(
                  "nums rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                  filter === f.value ? "border-line-hi bg-card-hi text-ink" : "border-transparent text-ink-3 hover:text-ink",
                )}
              >
                {f.label} {f.count}
              </button>
            ))}
          </div>

          <div className="mt-3 grid max-h-[260px] grid-cols-5 gap-1.5 overflow-y-auto pr-1">
            {visible.map((i) => {
              const answeredI = isAnswered(i);
              const tone = result
                ? !answeredI
                  ? "border-line bg-bg-sub text-ink-3"
                  : isWrong(i)
                    ? "border-red-500/60 bg-red-500/15 text-red-300"
                    : "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                : review.has(i)
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                  : answeredI
                    ? "border-brand/50 bg-brand/15 text-ink"
                    : "border-line bg-bg-sub text-ink-3";
              return (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to question ${i + 1}`}
                  aria-current={i === current}
                  className={cx(
                    "nums h-8 rounded-md border text-[11px] transition-colors hover:border-line-hi",
                    tone,
                    i === current && "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
            {visible.length === 0 && <p className="col-span-5 py-3 text-center text-[12px] text-ink-3">None</p>}
          </div>

          <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11px] text-ink-3">
            {(result
              ? [["bg-emerald-500/40", "Correct"], ["bg-red-500/40", "Wrong"], ["bg-bg-sub border border-line", "Skipped"]]
              : [["bg-brand/40", `Answered (${answered})`], ["bg-bg-sub border border-line", `Not answered (${unanswered})`], ["bg-amber-500/40", `Marked for review (${review.size})`]]
            ).map(([cls, label]) => (
              <li key={label} className="flex items-center gap-2"><span className={cx("size-3 rounded-sm", cls)} />{label}</li>
            ))}
          </ul>

          {!result && (
            <Button variant="primary" size="sm" className="mt-3 w-full justify-center" onClick={() => setConfirming(true)}>
              Submit quiz
            </Button>
          )}
        </aside>
      </div>

      {confirming && (
        <div className="rounded-lg border border-line-hi bg-card-hi p-4">
          <p className="display text-[15px] text-ink">Submit your answers?</p>
          <p className="nums mt-1.5 text-[13px] text-ink-2">
            {answered} answered · {unanswered} not answered · {review.size} marked for review.
            {unanswered > 0 && " Unanswered questions count as wrong."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {unanswered > 0 && (
              <Button variant="secondary" size="sm" onClick={() => { setConfirming(false); setFilter("unanswered"); go(questions.findIndex((_, i) => !isAnswered(i))); }}>
                Go to unanswered
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Keep working</Button>
            <Button variant="primary" size="sm" className="ml-auto" onClick={submit}>Submit now</Button>
          </div>
        </div>
      )}
    </div>
  );
}
