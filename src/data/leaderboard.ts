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

/* ---------------------------------------------------------------------------
 * Seeded cohort.
 *
 * Sized to the cohort the rest of the product describes rather than to what
 * fits on screen: the community page states 1,240+ members, so a twelve-person
 * ranking read as a demo. Sixty is enough for the list to need paging and for
 * a mid-table position to mean something, without pretending to be the whole
 * programme.
 *
 * Names and scores are generated from a fixed seed so the board is identical
 * on the server and the client, and the same on every visit.
 * ------------------------------------------------------------------------ */

const FIRST = [
  "Aditya", "Raman", "Swarup", "Lakhwinder", "Priya", "Mohit", "Fatima", "Dev",
  "Ananya", "Karthik", "Neha", "Rahul", "Sneha", "Arjun", "Ishaan", "Meera",
  "Vikram", "Tanvi", "Rohit", "Kavya", "Siddharth", "Diya", "Nikhil", "Pooja",
  "Harsh", "Aisha", "Varun", "Ritika", "Aman", "Shreya", "Gaurav", "Nandini",
  "Imran", "Pallavi", "Yash", "Divya", "Sameer", "Anjali", "Kabir", "Sanya",
];

const LAST = [
  "Vyas", "Dahiya", "Das", "Singh", "Nair", "Gupta", "Rizvi", "Mehta",
  "Shetty", "Iyer", "Bansal", "Kulkarni", "Reddy", "Chawla", "Pillai", "Joshi",
  "Rao", "Sharma", "Bose", "Menon", "Kapoor", "Desai", "Sethi", "Khanna",
];

/** Descending scores with a little jitter, so gaps between ranks vary the way
 *  real ones do instead of stepping uniformly. The jitter is kept below the
 *  step (40 < 62) so the sequence stays strictly descending, and surnames
 *  advance until the full name is unused — a board with two "Rahul Sharma"
 *  rows reads as a bug, not as a coincidence. */
export const COHORT: Learner[] = (() => {
  const taken = new Set<string>();
  return Array.from({ length: 60 }, (_, i) => {
    const seed = `lb-${i}`;
    const first = FIRST[hash(seed + "f") % FIRST.length];
    let name = "";
    for (let k = 0; k < LAST.length; k++) {
      const candidate = `${first} ${LAST[(hash(seed + "l") + k) % LAST.length]}`;
      if (!taken.has(candidate)) {
        name = candidate;
        break;
      }
    }
    // Every surname is taken for this first name — fall back to another.
    if (!name) name = `${FIRST[(hash(seed + "f") + 1) % FIRST.length]} ${LAST[hash(seed + "l") % LAST.length]}`;
    taken.add(name);

    return {
      id: `l-${String(i + 1).padStart(2, "0")}`,
      name,
      allTime: 4820 - i * 62 - (hash(seed + "s") % 40),
    };
  });
})();

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
