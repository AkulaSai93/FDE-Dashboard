/* Placeholder lesson footage.
 *
 * The real lessons live on YouTube; until each topic has its own video URL,
 * every player and thumbnail in the LMS uses one of these public sample clips
 * so the interface reads like a real learning platform. Swap `lessonVideo`
 * for a per-topic lookup when the recordings are wired in. */

import { MODULE_BY_ID, TOPIC_BY_ID, hash } from "@/data/curriculum";

const SAMPLE_CLIPS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
];

export function lessonVideo(topicId: string): string {
  return SAMPLE_CLIPS[hash(topicId) % SAMPLE_CLIPS.length];
}

/** A URL that makes the browser paint a representative frame as a poster. */
export function lessonThumb(topicId: string): string {
  return `${lessonVideo(topicId)}#t=3`;
}

/* ---------------------------------------------------------------------------
 * Lesson thumbnails.
 *
 * The pool is real YouTube tutorial artwork, and it only covers four subjects:
 * Python, RAG, Docker/Kubernetes and agents/MCP/LangGraph. Previously a lesson
 * picked one at random, so "Python Basics" could show "RAG with Langchain".
 *
 * Now the subject is matched from the lesson's own module and topic titles,
 * falling back to the phase. A lesson whose subject has no artwork in the pool
 * returns null, and the caller renders <LessonPoster> instead of a picture that
 * is about something else.
 *
 * `mqdefault` is used rather than `hqdefault`: hqdefault is a 4:3 canvas with
 * black bars baked into the JPEG, which showed as letterboxing inside our 16:9
 * frames. mqdefault is a true 320×180.
 *
 * To add coverage: drop IDs into the relevant bucket, or add a bucket plus a
 * matcher. Nothing else needs to change.
 * ------------------------------------------------------------------------- */

const THUMBS = {
  python: [
    "rfscVS0vtbw", "eWRfhZUzrAc", "ERCMXc8x7mc", "qHx8if-2lPw", "Rq5gJVxz55Q",
    "lKJfUvS9rMU", "sxTmJE4k0ho", "XnSasPR2KJI", "_aWbUudZ5Yo",
  ],
  rag: [
    "qN_2fnOPY-M", "vAK0iqA6-QI", "RosLeHGBLoY", "YLPNA1j7kmQ", "gweRh5Xtkq0",
    "sVcwVQRHIc8", "LwPpGUYTb2E", "gYoIOb7q9A4",
  ],
  agents: [
    "TiLvrUxJEo4", "PInLETR-cKU", "O-LXtyjh1HM", "F9mgEFor0cA", "2QjrYLT9NMw",
    "BM39OouLNsM", "T9t9kDXY92U", "Iy1yF_SAmUY", "HKGJQknq4JE",
  ],
  devops: ["OvOQJba-edM", "BVnrTXPrHow", "h7xFlch7c_o", "kVGbMtH7PXI", "kTp5xUtcalw"],
} as const;

type Subject = keyof typeof THUMBS;

/** Word-boundary matchers, most specific first. */
const SUBJECT_RULES: ReadonlyArray<[Subject, RegExp]> = [
  ["devops", /\b(docker|kubernetes|k8s|container|image|dockerfile|terraform|ci\/cd|github actions|deploy|aws|ecs|ec2|vpc|iam)\b/i],
  ["agents", /\b(agent|agents|mcp|langgraph|tool calling|react|planner|supervisor|multi-agent|workflow|workflows)\b/i],
  ["rag", /\b(rag|retrieval|embedding|embeddings|vector|chunk|re-?rank|llm|llms|prompt|prompts|token|tokens|context window|inference|model)\b/i],
  ["python", /\b(python|pydantic|fastapi|async|oop|object-oriented|data structures|control flow|functions|modules|packages|error handling|debugging|logging)\b/i],
];

/**
 * Phase → subject, used when a lesson's titles don't name a subject.
 *
 * Four phases are exact: the pool genuinely contains Python, RAG, agents/MCP
 * and Docker/Kubernetes artwork, and phases 01, 02, 03 and 06 are about those
 * things.
 *
 * The other five have no true match — there is no system-design, backend,
 * frontend, security or consulting artwork in the pool — so they borrow the
 * nearest adjacent subject rather than fall through to a plate. These are
 * stand-ins, not correct: replace them (and add buckets to THUMBS) as soon as
 * the programme's own lesson artwork exists.
 */
const PHASE_SUBJECT: Record<string, Subject> = {
  "p-01": "python",   // exact — FDE role, Python fundamentals and advanced
  "p-02": "rag",      // exact — LLM + RAG
  "p-03": "agents",   // exact — agents & MCP
  "p-04": "devops",   // stand-in — APIs and enterprise integration
  "p-05": "python",   // stand-in — frontend and operational apps
  "p-06": "devops",   // exact — cloud, DevOps & LLMOps
  "p-07": "devops",   // stand-in — system design at scale
  "p-08": "devops",   // stand-in — security, reliability & governance
  "p-09": "agents",   // stand-in — the FDE craft
};

function subjectFor(topicId: string): Subject | null {
  const topic = TOPIC_BY_ID.get(topicId);
  if (!topic) return null;
  const mod = MODULE_BY_ID.get(topic.moduleId);
  const haystack = `${topic.title} ${mod?.title ?? ""}`;

  for (const [subject, re] of SUBJECT_RULES) {
    if (re.test(haystack)) return subject;
  }
  return PHASE_SUBJECT[topic.phaseId] ?? null;
}

/**
 * 16:9 thumbnail for a lesson. Every phase resolves to a subject, so this is
 * non-null in practice; the `null` branch stays for a topic id that isn't in
 * the curriculum, where <LessonPoster> shows through instead.
 */
export function lessonThumbnail(topicId: string): string | null {
  const topic = TOPIC_BY_ID.get(topicId);
  const subject = subjectFor(topicId);
  if (!topic || !subject) return null;
  const pool = THUMBS[subject];
  // Cycle by the lesson's position rather than hashing it: a hash collides, and
  // two lessons side by side in the same module showing the same cover is the
  // most visible way for placeholder artwork to look broken.
  const offset = hash(subject) % pool.length;
  return `https://i.ytimg.com/vi/${pool[(topic.globalIndex + offset) % pool.length]}/mqdefault.jpg`;
}
