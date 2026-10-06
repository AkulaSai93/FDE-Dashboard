/* Projects — titles, categories and domains are taken from the "What you'll
 * ship" section of the FDE landing page, plus the Autonomous Business
 * Operations Agent capstone named in the site's FAQ. Stage breakdowns and
 * phase mapping are the LMS's own structure. */

export type ProjectStatus = "locked" | "not-started" | "in-progress" | "submitted" | "review" | "completed";

export interface ProjectStage {
  key: "research" | "build" | "deploy" | "document";
  label: string;
}

export const PROJECT_STAGES: ProjectStage[] = [
  { key: "research", label: "Research" },
  { key: "build", label: "Build" },
  { key: "deploy", label: "Deploy" },
  { key: "document", label: "Document" },
];

export interface Project {
  id: string;
  title: string;
  short: string;
  category: string;
  domain: string;
  phaseId: string;
  summary: string;
  stack: string[];
  /** Index into PROJECT_STAGES: how many stages are done. */
  stagesComplete: number;
  status: ProjectStatus;
  capstone?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "pr-ats",
    title: "AI Resume/Job-Description Matcher (ATS Scorer)",
    short: "ATS Scorer",
    category: "AI Application",
    domain: "Recruiting",
    phaseId: "p-02",
    summary:
      "Score a resume against a job description the way a real ATS does — parse both sides, embed and match on meaning rather than keywords, and return an explainable score a recruiter can defend.",
    stack: ["Python", "FastAPI", "Embeddings", "Structured output"],
    stagesComplete: 4,
    status: "completed",
  },
  {
    id: "pr-pickflick",
    title: "PickFlick — Group Movie Night Decision Solver",
    short: "PickFlick",
    category: "Decision Solver",
    domain: "Entertainment",
    phaseId: "p-02",
    summary:
      "A constraint solver with a language front end: collect messy human preferences from a group, turn them into hard and soft constraints, and produce a defensible single answer.",
    stack: ["Python", "LLM APIs", "Constraint solving", "React"],
    stagesComplete: 4,
    status: "completed",
  },
  {
    id: "pr-a11y",
    title: "AI Accessibility Auditor",
    short: "A11y Auditor",
    category: "AI Application",
    domain: "Web Accessibility",
    phaseId: "p-03",
    summary:
      "Crawl a site, run deterministic WCAG checks, then use an agent to triage what's left — the judgement calls a rule engine can't make — and emit a prioritised remediation report.",
    stack: ["Agents", "LangGraph", "Playwright", "Report generation"],
    stagesComplete: 4,
    status: "completed",
  },
  {
    id: "pr-mindmap",
    title: "MindMapAI — AI Idea-to-Structure Visual Thinking Tool",
    short: "MindMapAI",
    category: "AI Application",
    domain: "Productivity",
    phaseId: "p-05",
    summary:
      "Take unstructured thinking — a transcript, a brain dump, a meeting — and render it as a navigable structure. Streaming output, incremental layout, and an interface that stays responsive.",
    stack: ["React", "Streaming", "Structured output", "Canvas"],
    stagesComplete: 2,
    status: "in-progress",
  },
  {
    id: "pr-payroll",
    title: "Employee Attendance & Payroll Processing Engine",
    short: "Payroll Engine",
    category: "Processing Engine",
    domain: "HR & Payroll",
    phaseId: "p-06",
    summary:
      "A batch engine where correctness is non-negotiable: ingest attendance from three incompatible sources, reconcile it, apply policy, and produce an auditable payroll run you can re-run deterministically.",
    stack: ["Python", "Data pipelines", "Postgres", "Docker"],
    stagesComplete: 1,
    status: "in-progress",
  },
  {
    id: "pr-health",
    title: "Healthcare Appointment & Patient Queue Management System",
    short: "Patient Queue",
    category: "Management System",
    domain: "Healthcare",
    phaseId: "p-07",
    summary:
      "Real-time queue management under load, with the constraints healthcare actually imposes — PII handling, role-based access, and an availability target you have to design for rather than hope for.",
    stack: ["FastAPI", "Event-driven", "RBAC", "Real-time dashboards"],
    stagesComplete: 0,
    status: "not-started",
  },
  {
    id: "pr-capstone",
    title: "Autonomous Business Operations Agent",
    short: "Capstone",
    category: "Capstone",
    domain: "Enterprise AI",
    phaseId: "p-09",
    summary:
      "The programme capstone. Run a full engagement end to end: discovery with a stakeholder, a scoped SOW, an agent built on the client's data and systems, deployed into their environment behind SSO, with evals, guardrails, cost monitoring and a handoff.",
    stack: ["Agents", "MCP", "RAG", "AWS", "Terraform", "LLMOps"],
    stagesComplete: 0,
    status: "locked",
    capstone: true,
  },
];

export const PROJECT_BY_ID = new Map(PROJECTS.map((p) => [p.id, p]));
