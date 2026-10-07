/* Projects — titles, categories and domains are taken from the "What you'll
 * ship" section of the FDE landing page, plus the Autonomous Business
 * Operations Agent capstone named in the site's FAQ. Stage breakdowns and
 * phase mapping are the LMS's own structure. */

export interface ProjectVideo {
  title: string;
  /** Playable video URL. */
  src: string;
}

/* Placeholder clips until the real project recordings are uploaded. */
const SAMPLE_VIDEOS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
];

export interface ProjectResource {
  label: string;
  kind: "doc" | "repo" | "paper" | "tool";
  href: string;
}

/** A project is a problem statement plus the material to tackle it with —
 *  an optional walkthrough video and a resource list. Nothing is submitted. */
export interface Project {
  id: string;
  title: string;
  short: string;
  category: string;
  domain: string;
  phaseId: string;
  summary: string;
  stack: string[];
  /** Cover image from the FDE landing page; the capstone falls back to generated art. */
  thumbnail?: string;
  /** Walkthrough videos, played in order on the project page. */
  videos: ProjectVideo[];
  resources: ProjectResource[];
  capstone?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "pr-ats",
    thumbnail: "/projects/pr-ats.webp",
    title: "AI Resume/Job-Description Matcher (ATS Scorer)",
    short: "ATS Scorer",
    category: "AI Application",
    domain: "Recruiting",
    phaseId: "p-02",
    summary:
      "Score a resume against a job description the way a real ATS does — parse both sides, embed and match on meaning rather than keywords, and return an explainable score a recruiter can defend.",
    stack: ["Python", "FastAPI", "Embeddings", "Structured output"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[0] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[1] },
      { title: "Building the core", src: SAMPLE_VIDEOS[0] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[1] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },
  {
    id: "pr-pickflick",
    thumbnail: "/projects/pr-pickflick.webp",
    title: "PickFlick — Group Movie Night Decision Solver",
    short: "PickFlick",
    category: "Decision Solver",
    domain: "Entertainment",
    phaseId: "p-02",
    summary:
      "A constraint solver with a language front end: collect messy human preferences from a group, turn them into hard and soft constraints, and produce a defensible single answer.",
    stack: ["Python", "LLM APIs", "Constraint solving", "React"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[0] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[1] },
      { title: "Building the core", src: SAMPLE_VIDEOS[0] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[1] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },
  {
    id: "pr-a11y",
    thumbnail: "/projects/pr-a11y.webp",
    title: "AI Accessibility Auditor",
    short: "A11y Auditor",
    category: "AI Application",
    domain: "Web Accessibility",
    phaseId: "p-03",
    summary:
      "Crawl a site, run deterministic WCAG checks, then use an agent to triage what's left — the judgement calls a rule engine can't make — and emit a prioritised remediation report.",
    stack: ["Agents", "LangGraph", "Playwright", "Report generation"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[0] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[1] },
      { title: "Building the core", src: SAMPLE_VIDEOS[0] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[1] },
      { title: "Deploy & demo", src: SAMPLE_VIDEOS[0] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },
  {
    id: "pr-mindmap",
    thumbnail: "/projects/pr-mindmap.webp",
    title: "MindMapAI — AI Idea-to-Structure Visual Thinking Tool",
    short: "MindMapAI",
    category: "AI Application",
    domain: "Productivity",
    phaseId: "p-05",
    summary:
      "Take unstructured thinking — a transcript, a brain dump, a meeting — and render it as a navigable structure. Streaming output, incremental layout, and an interface that stays responsive.",
    stack: ["React", "Streaming", "Structured output", "Canvas"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[1] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[0] },
      { title: "Building the core", src: SAMPLE_VIDEOS[1] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[0] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },
  {
    id: "pr-payroll",
    thumbnail: "/projects/pr-payroll.webp",
    title: "Employee Attendance & Payroll Processing Engine",
    short: "Payroll Engine",
    category: "Processing Engine",
    domain: "HR & Payroll",
    phaseId: "p-06",
    summary:
      "A batch engine where correctness is non-negotiable: ingest attendance from three incompatible sources, reconcile it, apply policy, and produce an auditable payroll run you can re-run deterministically.",
    stack: ["Python", "Data pipelines", "Postgres", "Docker"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[1] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[0] },
      { title: "Building the core", src: SAMPLE_VIDEOS[1] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[0] },
      { title: "Deploy & demo", src: SAMPLE_VIDEOS[1] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },
  {
    id: "pr-health",
    thumbnail: "/projects/pr-health.webp",
    title: "Healthcare Appointment & Patient Queue Management System",
    short: "Patient Queue",
    category: "Management System",
    domain: "Healthcare",
    phaseId: "p-07",
    summary:
      "Real-time queue management under load, with the constraints healthcare actually imposes — PII handling, role-based access, and an availability target you have to design for rather than hope for.",
    stack: ["FastAPI", "Event-driven", "RBAC", "Real-time dashboards"],
    videos: [
      { title: "Problem walkthrough", src: SAMPLE_VIDEOS[0] },
      { title: "Architecture & approach", src: SAMPLE_VIDEOS[1] },
      { title: "Building the core", src: SAMPLE_VIDEOS[0] },
      { title: "Testing & edge cases", src: SAMPLE_VIDEOS[1] },
      { title: "Deploy & demo", src: SAMPLE_VIDEOS[0] },
    ],
    resources: [
      { label: "Problem statement (PDF)", kind: "doc", href: "#" },
      { label: "Starter repository", kind: "repo", href: "#" },
      { label: "Reference architecture", kind: "paper", href: "#" },
    ],
  },

];

export const PROJECT_BY_ID = new Map(PROJECTS.map((p) => [p.id, p]));
