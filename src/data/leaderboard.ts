import { hash } from "@/data/curriculum";

/* ============================================================================
 * LEADERBOARD
 *
 * The programme had no XP notion, so one is defined here from work actually
 * completed — nothing is awarded for logging in or keeping a streak:
 *
 *   topic completed   10 XP
 *   quiz passed       50 XP
 *
 * Projects are deliberately not scored: they carry no completion state in the
 * data model (they are problem statements with material, nothing is submitted),
 * so there is nothing truthful to count. Add a term here if that changes.
 *
 * The signed-in learner's score is computed from their real progress at render
 * time, so their row and rank are true. Everyone else is seeded.
 *
 * Time ranges are derived deterministically from the all-time score rather
 * than from real session history, which the product does not record yet.
 * Replace `COHORT` and `scoreFor` with the rankings endpoint and the rest of
 * the screen is unchanged.
 * ========================================================================= */

export const XP = { topic: 10, quiz: 50 } as const;

export type Range = "all" | "month" | "week" | "day";

export const RANGES: ReadonlyArray<{ value: Range; label: string }> = [
  { value: "all", label: "All time" },
  { value: "month", label: "This month" },
  { value: "week", label: "This week" },
  { value: "day", label: "Today" },
];

export interface Learner {
  id: string;
  name: string;
  /** Cohort members carry a fixed all-time score; the signed-in learner's is
   *  computed from their progress and injected at render time. */
  allTime: number;
  isYou?: boolean;
}

/** Seeded cohort. Scores bracket a learner sitting at roughly two-thirds of
 *  the programme, so the signed-in row lands mid-table rather than always
 *  first or last. */
export const COHORT: Learner[] = [
  { id: "l-01", name: "Aditya Vyas", allTime: 4820 },
  { id: "l-02", name: "Raman Dahiya", allTime: 4465 },
  { id: "l-03", name: "Swarup Das", allTime: 4120 },
  { id: "l-04", name: "Lakhwinder Singh", allTime: 3890 },
  { id: "l-05", name: "Priya Nair", allTime: 3540 },
  { id: "l-06", name: "Mohit Gupta", allTime: 3310 },
  { id: "l-07", name: "Fatima Rizvi", allTime: 2980 },
  { id: "l-08", name: "Dev Mehta", allTime: 2795 },
  { id: "l-09", name: "Ananya Shetty", allTime: 2610 },
  { id: "l-10", name: "Karthik Iyer", allTime: 2340 },
  { id: "l-11", name: "Neha Bansal", allTime: 2105 },
  { id: "l-12", name: "Rahul Kulkarni", allTime: 1870 },
];

/** A shorter window is a fraction of the all-time score, varied per learner so
 *  the order genuinely reshuffles between tabs instead of staying fixed. */
export function scoreFor(learner: Learner, range: Range): number {
  if (range === "all") return learner.allTime;
  const share = { month: 0.34, week: 0.12, day: 0.03 }[range];
  const wobble = 0.72 + (hash(learner.id + range) % 57) / 100; // 0.72–1.28
  return Math.round((learner.allTime * share * wobble) / 5) * 5;
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
