"use client";

/* ============================================================================
 * PROGRESS STATE
 *
 * One store, shaped the way a real backend would return it, so swapping the
 * seed for `GET /api/v1/me/progress` is a one-function change:
 *
 *   User → Program → Phase → Module → Topic → { video, notes, assignment }
 *
 * Phase/module/program progress are never stored — they are always derived
 * from topic state, so the numbers on every screen agree by construction.
 * ========================================================================= */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ALL_TOPICS,
  MODULE_BY_ID,
  PHASES,
  TOPIC_BY_ID,
  TOTALS,
  type Module,
  type Phase,
  type Topic,
  hash,
} from "@/data/curriculum";

export type TopicStatus = "not-started" | "in-progress" | "completed";
export type AssignmentStatus = "not-started" | "in-progress" | "submitted" | "evaluated" | "completed";
export type PhaseStatus = "completed" | "in-progress" | "upcoming" | "locked";

export interface TopicProgress {
  status: TopicStatus;
  /** Seconds of the video watched. */
  videoPosition: number;
  assignment: AssignmentStatus;
  bookmarked: boolean;
}

export interface ProgressState {
  topics: Record<string, TopicProgress>;
  /** Topic the learner was last inside — drives "Continue Learning". */
  lastTopicId: string;
  /** Minutes since the last session, frozen at seed time so SSR and the
   *  client render the same string. */
  lastActiveMinutesAgo: number;
}

/* ------------------------------------------------------------------- seed */

/**
 * Seeded so the programme sits at the 64% the landing page advertises:
 * Phases 01–06 complete, Phase 07 (System Design at Scale) in progress.
 * `SEED_COMPLETED_TOPICS` is the single dial — move it and every screen,
 * stat, badge and lock in the product follows.
 */
export const SEED_COMPLETED_TOPICS = 237; // of 371 → 63.9%

const SUBMITTED_ASSIGNMENTS = new Set(["t-7.1.4", "t-6.5.3", "t-6.4.1"]);

function seed(): ProgressState {
  const topics: Record<string, TopicProgress> = {};
  for (const t of ALL_TOPICS) {
    const done = t.globalIndex <= SEED_COMPLETED_TOPICS;
    const current = t.globalIndex === SEED_COMPLETED_TOPICS + 1;

    let assignment: AssignmentStatus = "not-started";
    if (t.assignment) {
      if (SUBMITTED_ASSIGNMENTS.has(t.id)) assignment = "submitted";
      else if (done) assignment = hash(t.id + "ev") % 5 === 0 ? "evaluated" : "completed";
      else if (current) assignment = "in-progress";
    }

    topics[t.id] = {
      status: done ? "completed" : current ? "in-progress" : "not-started",
      videoPosition: done
        ? t.videoSeconds
        : current
          ? Math.floor(t.videoSeconds * 0.62)
          : 0,
      assignment,
      bookmarked: hash(t.id + "bm") % 23 === 0 && done,
    };
  }
  return {
    topics,
    lastTopicId: ALL_TOPICS[SEED_COMPLETED_TOPICS].id,
    lastActiveMinutesAgo: 18,
  };
}

/* ---------------------------------------------------------------- derived */

export interface Rollup {
  total: number;
  completed: number;
  inProgress: number;
  percent: number;
}

const rollup = (topics: Topic[], state: ProgressState): Rollup => {
  let completed = 0;
  let inProgress = 0;
  for (const t of topics) {
    const s = state.topics[t.id]?.status;
    if (s === "completed") completed++;
    else if (s === "in-progress") inProgress++;
  }
  return {
    total: topics.length,
    completed,
    inProgress,
    percent: topics.length ? Math.round((completed / topics.length) * 100) : 0,
  };
};

/* ------------------------------------------------------------------ store */

interface Store extends ProgressState {
  ready: boolean;
  setTopicStatus: (topicId: string, status: TopicStatus) => void;
  toggleComplete: (topicId: string) => void;
  setVideoPosition: (topicId: string, seconds: number) => void;
  setAssignmentStatus: (topicId: string, status: AssignmentStatus) => void;
  toggleBookmark: (topicId: string) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);
const STORAGE_KEY = "fde-lms:progress:v1";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  // Always render the seed first so server and client markup match, then
  // rehydrate from localStorage in an effect.
  const [state, setState] = useState<ProgressState>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState;
        // localStorage is an external store that can't be read during render
        // without breaking hydration — a deliberate post-mount sync.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed?.topics) setState((cur) => ({ ...cur, ...parsed, topics: { ...cur.topics, ...parsed.topics } }));
      }
    } catch {
      /* storage unavailable — the seed is a perfectly good fallback */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — progress simply isn't persisted */
    }
  }, [state, ready]);

  const patch = useCallback((topicId: string, p: Partial<TopicProgress>, lastTopic = true) => {
    setState((s) => ({
      ...s,
      lastTopicId: lastTopic ? topicId : s.lastTopicId,
      lastActiveMinutesAgo: lastTopic ? 0 : s.lastActiveMinutesAgo,
      topics: { ...s.topics, [topicId]: { ...s.topics[topicId], ...p } },
    }));
  }, []);

  const value = useMemo<Store>(() => {
    const setTopicStatus = (topicId: string, status: TopicStatus) => {
      const t = TOPIC_BY_ID.get(topicId);
      patch(topicId, {
        status,
        videoPosition: status === "completed" ? (t?.videoSeconds ?? 0) : status === "not-started" ? 0 : undefined,
      } as Partial<TopicProgress>);
    };
    return {
      ...state,
      ready,
      setTopicStatus,
      toggleComplete: (topicId) =>
        setTopicStatus(topicId, state.topics[topicId]?.status === "completed" ? "in-progress" : "completed"),
      setVideoPosition: (topicId, seconds) => {
        const t = TOPIC_BY_ID.get(topicId);
        const cur = state.topics[topicId];
        const complete = t ? seconds >= t.videoSeconds - 1 : false;
        patch(topicId, {
          videoPosition: seconds,
          status: complete ? "completed" : cur?.status === "completed" ? "completed" : "in-progress",
        });
      },
      setAssignmentStatus: (topicId, status) => patch(topicId, { assignment: status }),
      toggleBookmark: (topicId) => patch(topicId, { bookmarked: !state.topics[topicId]?.bookmarked }, false),
      reset: () => setState(seed()),
    };
  }, [state, ready, patch]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress must be used inside <ProgressProvider>");
  return v;
}

export function useTopicProgress(topicId: string): TopicProgress {
  const { topics } = useProgress();
  return topics[topicId] ?? { status: "not-started", videoPosition: 0, assignment: "not-started", bookmarked: false };
}

/* --------------------------------------------------------- selector hooks */

export function useRollups() {
  const state = useProgress();

  return useMemo(() => {
    const program = rollup(ALL_TOPICS, state);

    const byPhase = new Map<string, Rollup>();
    const byModule = new Map<string, Rollup>();
    for (const p of PHASES) {
      byPhase.set(p.id, rollup(p.modules.flatMap((m) => m.topics), state));
      for (const m of p.modules) byModule.set(m.id, rollup(m.topics, state));
    }

    const modulesCompleted = [...byModule.values()].filter((r) => r.percent === 100).length;
    const phasesCompleted = [...byPhase.values()].filter((r) => r.percent === 100).length;

    const phaseStatus = (phase: Phase): PhaseStatus => {
      const r = byPhase.get(phase.id)!;
      if (r.percent === 100) return "completed";
      if (r.completed > 0 || r.inProgress > 0) return "in-progress";
      const prev = PHASES[phase.number - 2];
      if (!prev) return "upcoming";
      // Upcoming phases stay browsable; only phases two or more ahead of the
      // frontier read as locked, so the roadmap still shows where you're going.
      const prevR = byPhase.get(prev.id)!;
      return prevR.completed > 0 ? "upcoming" : "locked";
    };

    const currentPhase =
      PHASES.find((p) => phaseStatus(p) === "in-progress") ??
      PHASES.find((p) => phaseStatus(p) === "upcoming") ??
      PHASES[PHASES.length - 1];

    return {
      program,
      byPhase,
      byModule,
      modulesCompleted,
      phasesCompleted,
      phaseStatus,
      currentPhase,
      totals: TOTALS,
    };
  }, [state]);
}

export function moduleStatus(r: Rollup | undefined): TopicStatus {
  if (!r || r.completed === 0) return r && r.inProgress > 0 ? "in-progress" : "not-started";
  if (r.percent === 100) return "completed";
  return "in-progress";
}

/** The next few things worth doing, in curriculum order. */
export function useUpNext(count = 4): Topic[] {
  const state = useProgress();
  return useMemo(() => {
    const out: Topic[] = [];
    for (const t of ALL_TOPICS) {
      const s = state.topics[t.id]?.status ?? "not-started";
      if (s === "completed") continue;
      out.push(t);
      if (out.length >= count) break;
    }
    return out;
  }, [state, count]);
}

export function useCurrentTopic(): Topic {
  const state = useProgress();
  return TOPIC_BY_ID.get(state.lastTopicId) ?? ALL_TOPICS[0];
}

export function useCurrentModule(): Module {
  const topic = useCurrentTopic();
  return MODULE_BY_ID.get(topic.moduleId)!;
}
