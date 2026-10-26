import { hash } from "@/data/curriculum";

/* ============================================================================
 * STREAK
 *
 * Placeholder week position until study sessions are tracked: today is Friday
 * and the learner hasn't studied yet, so the streak is "at risk".
 *
 * Shared rather than defined per screen — the dashboard card and the topbar
 * popover render the same week, so they have to agree about which day is today
 * and how many minutes each day holds.
 * ========================================================================= */

/** Index into WEEK. 0 = Monday. */
export const TODAY = 4;
export const STUDIED_TODAY = false;

export interface StreakDay {
  d: string;
  min: number;
  /** Studied: a past day in the run, or today once a lesson is finished. */
  done: boolean;
  isToday: boolean;
}

export const WEEK: StreakDay[] = ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
  const done = i < TODAY || (i === TODAY && STUDIED_TODAY);
  return { d, done, isToday: i === TODAY, min: done ? 15 + (hash(`wk${i}`) % 70) : 0 };
});

export const WEEK_TOTAL = WEEK.reduce((a, w) => a + w.min, 0);
export const WEEK_MAX = Math.max(...WEEK.map((w) => w.min), 1);

/** "3h 22m" */
export function formatMinutes(total: number) {
  return `${Math.floor(total / 60)}h ${total % 60}m`;
}
