
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
 * Rankings are all-time. There is no weekly or monthly view because the
 * product records no session history to build one from — an earlier revision
 * faked it by scaling the all-time score, which is worse than not offering it.
 * Replace `COHORT` with the rankings endpoint and the screen is unchanged.
 * ========================================================================= */

export const XP = { topic: 10, quiz: 50 } as const;

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

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
