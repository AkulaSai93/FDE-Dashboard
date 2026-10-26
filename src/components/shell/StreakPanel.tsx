"use client";

import { Check, Flame } from "lucide-react";
import { cx } from "@/lib/cx";
import { USER } from "@/data/user";
import { STUDIED_TODAY, WEEK, WEEK_TOTAL, formatMinutes } from "@/data/streak";

/* The streak, as one component. The topbar popover and the dashboard card show
 * the same thing, so they share it rather than drawing the week twice. */
export function StreakPanel({ compact }: { compact?: boolean }) {
  return (
    <div>
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
        {WEEK.map((w, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span
              className={cx(
                "flex size-8 items-center justify-center rounded-full",
                w.done
                  ? "bg-ink text-panel"
                  : w.isToday
                    ? "text-brand-ink ring-2 ring-brand"
                    : "bg-card-hi2 text-ink-4",
              )}
            >
              {w.done ? <Check size={14} strokeWidth={3} /> : <Flame size={13} />}
            </span>
            <span className={cx("text-[10px]", w.isToday ? "text-ink" : "text-ink-4")}>{w.d}</span>
          </li>
        ))}
      </ol>

      {!STUDIED_TODAY && (
        <p className="mt-4 text-[12px] text-ink-3">
          Finish one lesson today to make it{" "}
          <span className="nums text-ink">{USER.streakDays + 1} days</span>.
        </p>
      )}

      {!compact && (
        <p className="nums mt-3 border-t border-line pt-3 text-[12px] text-ink-3">
          <span className="text-ink-2">{formatMinutes(WEEK_TOTAL)}</span> of learning this week
        </p>
      )}
    </div>
  );
}
