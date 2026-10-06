/* ============================================================================
 * FDE PROGRAM — CURRICULUM SOURCE OF TRUTH
 *
 * Phase / Module / Topic names are transcribed verbatim from the live FDE
 * landing page (https://fdelandingpage.vercel.app) — 9 phases, 47 modules,
 * 371 topics. Nothing here is invented.
 *
 * Per-topic learning assets (video length, notes, assignment, resources) are
 * not published on the marketing site, so they are derived deterministically
 * from the topic id (see `deriveAssets`). Swap `deriveAssets` for a real API
 * response and every screen in the product keeps working unchanged.
 * ========================================================================= */

export type AssetKind = "video" | "notes" | "assignment" | "resources";

export interface Resource {
  label: string;
  kind: "doc" | "repo" | "paper" | "tool";
  href: string;
}

export interface Assignment {
  id: string;
  title: string;
  brief: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estMinutes: number;
}

export interface Topic {
  id: string;          // e.g. "t-2.3.8"
  title: string;
  index: number;       // 1-based position inside the module
  globalIndex: number; // 1..371 — programme-wide order
  moduleId: string;
  phaseId: string;
  videoSeconds: number;
  hasNotes: boolean;
  assignment: Assignment | null;
  resources: Resource[];
}

export interface Module {
  id: string;          // e.g. "m-2.3"
  code: string;        // e.g. "2.3"
  title: string;
  phaseId: string;
  topics: Topic[];
}

export interface Phase {
  id: string;          // e.g. "p-02"
  code: string;        // e.g. "02"
  number: number;
  title: string;
  summary: string;
  modules: Module[];
}

/* ---------------------------------------------------------------- raw data */

type RawModule = [code: string, title: string, topics: string[]];
type RawPhase = [title: string, summary: string, modules: RawModule[]];

const RAW: RawPhase[] = [
  [
    "Production Software & Data Engineering",
    "The engineering floor the rest of the programme is built on: what the FDE role actually is, then Python from fundamentals through production services.",
    [
      ["1.1", "What is a Forward Deployed Engineer?", ["FDE Role", "FDE Responsibilities", "FDE Mindset"]],
      ["1.2", "Python Fundamentals", ["Python Basics", "Control Flow", "Data Structures", "Functions", "Modules & Packages", "Working with Data", "Error Handling", "API Basics", "Object-Oriented Programming"]],
      ["1.3", "Python Advanced", ["Python Project Development", "Pydantic", "FastAPI", "Debugging & Logging", "Advanced Python Concepts", "Async Programming"]],
    ],
  ],
  [
    "Applied AI I: LLM + RAG",
    "How large language models actually behave, how to drive them through APIs, how to engineer prompts and context as code, and how to build retrieval systems that hold up in an enterprise.",
    [
      ["2.1", "LLM Engineering", ["LLM fundamentals", "Tokens", "Context windows", "Transformers — conceptual understanding", "Embeddings", "Inference", "Model capabilities", "Open vs proprietary models"]],
      ["2.2", "LLM APIs", ["API calls", "Streaming", "Structured output", "Function calling", "Tool calling", "Error handling", "Model fallback"]],
      ["2.3", "Prompt & Context Engineering", ["System prompts", "User prompts", "Few-shot prompting", "Structured prompts", "Output schemas", "Prompt versioning", "Prompt testing", "Context engineering", "Prompt optimization", "Treat prompts as code", "Regression test prompts"]],
      ["2.4", "Model Selection", ["Decision Factors", "Model selection lab"]],
      ["2.5", "RAG Engineering", ["Fundamentals", "Advanced RAG", "Enterprise RAG", "AI Evaluation", "AI Guardrails"]],
    ],
  ],
  [
    "Applied AI II: Agents & MCP",
    "Agents that do real work: architecture, LangGraph, the Model Context Protocol, enterprise integration, and the data and systems groundwork an FDE needs on a client site.",
    [
      ["3.1", "Workflows vs Agents", ["What is an agent?", "What is a workflow?", "Agent vs chatbot", "Agent vs deterministic workflow", "When to use an agent", "When NOT to use an agent", "Reliability vs flexibility"]],
      ["3.2", "Agent Architecture", ["Tool calling", "State", "Memory", "Planning", "ReAct", "Router", "Planner/executor", "Supervisor", "Sequential agents", "Parallel agents", "Multi-agent systems", "Human-in-the-loop"]],
      ["3.3", "LangGraph", ["Graph architecture", "State", "Nodes", "Edges", "Conditional routing", "Persistence", "Human approval", "Error recovery", "Retry", "Agent evaluation"]],
      ["3.4", "MCP", ["MCP fundamentals", "MCP architecture", "MCP client", "MCP server", "Tools", "Resources", "Prompts", "Tool schemas", "Authentication", "Authorization", "Secure tool execution"]],
      ["3.5", "Enterprise Agent Integration", ["CRM", "Jira", "Slack", "PostgreSQL", "Email", "REST APIs", "SOAP", "Knowledge base"]],
      ["3.6", "Enterprise Data", ["SQL", "Database Investigation", "Data Modeling"]],
      ["3.7", "Data Engineering for FDEs", ["ETL", "ELT", "Data ingestion", "Data validation", "Data cleaning", "Deduplication", "Schema mapping", "Data transformation", "Batch processing", "Data pipelines", "Failure recovery", "PySpark", "Distributed data processing", "dbt concepts", "Data warehouse concepts"]],
      ["3.8", "Git & GitHub Basics", ["Git Fundamentals", "Working with Changes", "Branching", "Remote Repository"]],
      ["3.9", "Networking Basics", ["Networking Fundamentals I: Physical Connectivity & Network Types", "Networking Fundamentals II: Device Identification & Core Protocols", "Networking Fundamentals III: OSI Model & Data Communication", "IP Address Fundamentals", "Subnetting & CIDR", "Gateway & Practical IP Addressing", "TCP & UDP", "DNS", "Network Troubleshooting"]],
      ["3.10", "Linux Basics", ["Introduction to UNIX & Linux", "Linux Architecture", "Environment Setup", "Linux terminal and shell concepts", "Essential Linux Commands"]],
      ["3.11", "Web & APIs", ["Web Fundamentals", "HTML Basics", "CSS Basics", "JavaScript Basics"]],
    ],
  ],
  [
    "Backend & Enterprise Integration",
    "Production API engineering, the integration surface of a real enterprise — REST, SOAP, legacy, CRM, ticketing — and the event-driven backbone underneath it.",
    [
      ["4.1", "Production API Engineering", ["REST API design", "API contracts", "OpenAPI", "Authentication", "Authorization", "OAuth2", "JWT", "RBAC", "Multi-tenancy", "Pagination", "Rate limiting", "Retries", "Timeouts", "Idempotency", "API versioning", "Webhooks"]],
      ["4.2", "Enterprise Integration", ["REST APIs", "SOAP", "XML", "Webhooks", "Third-party APIs", "Legacy systems", "CRM systems", "Ticketing systems", "Slack-style integrations", "Database integrations", "Integration Patterns"]],
      ["4.3", "State & Event-Driven Systems", ["Order and Workflow State", "Messaging Infrastructure", "Event-Driven Basics", "Kafka Basics"]],
    ],
  ],
  [
    "Frontend & Operational Applications",
    "Enough frontend to ship the interface a client actually uses, and the operational dashboards that make a deployed system observable to the business.",
    [
      ["5.1", "Frontend for FDEs", ["React", "API Integration", "Authentication", "Authorization", "Error Handling"]],
      ["5.2", "Operational Dashboards", ["Dashboard Fundamentals", "Business Views", "Real-Time Operations", "Role-Based Operations"]],
    ],
  ],
  [
    "Cloud, DevOps & LLMOps",
    "Containers, AWS, infrastructure as code and CI/CD — then the operational layer specific to AI: prompt and model versioning, tracing, cost, drift and regression.",
    [
      ["6.1", "Docker", ["Docker images", "Containers", "Dockerfiles", "Multi-container applications", "Networking", "Volumes", "Secrets", "Container security", "Production hardening"]],
      ["6.2", "AWS", ["IAM", "VPC", "Networking", "EC2", "ECS", "RDS", "S3", "Load Balancer", "CloudWatch", "Secrets Manager"]],
      ["6.3", "Terraform", ["Infrastructure as Code", "Providers", "Resources", "Variables", "Outputs", "State", "Modules", "Environment management"]],
      ["6.4", "CI/CD", ["GitHub Actions", "Automated tests", "Build", "Docker image", "Security scan", "Deployment", "Environment management", "Rollback", "Release strategy"]],
      ["6.5", "LLMOps", ["Prompt versioning", "Model versioning", "Evaluation", "Tracing", "Token monitoring", "Cost monitoring", "Latency", "Model routing", "Guardrails", "AI regression", "Drift"]],
    ],
  ],
  [
    "System Design at Scale",
    "Designing for scale and failure — distributed systems, database scaling, microservices — and the specific economics and reliability problems of serving AI at scale.",
    [
      ["7.1", "System Design", ["Scalability", "Availability", "Load Balancing", "Caching", "Asynchronous Processing", "Distributed Systems", "API Reliability", "Fault Tolerance", "Architecture Trade-offs"]],
      ["7.2", "Database Scaling", ["Read replicas", "Sharding", "Partitioning", "Indexing", "Database bottlenecks", "Distributed databases"]],
      ["7.3", "Distributed Systems", ["Distributed Identities", "Message Guarantees", "Distributed Transactions"]],
      ["7.4", "Microservices", ["Architecture Evolution", "Service Design", "Reliability", "Architecture Decisions"]],
      ["7.5", "AI at Scale", ["Model gateways", "Model routing", "GPU capacity", "Inference scaling", "AI caching", "Batch inference", "Canary model releases", "AI drift", "AI reliability"]],
    ],
  ],
  [
    "Security, Reliability & Governance",
    "What it takes to be allowed into production: application and AI security, agent governance, SRE practice, and running an incident when the system you deployed breaks.",
    [
      ["8.1", "Application Security", ["OWASP Top 10", "Authentication", "Authorization", "RBAC", "Secrets", "API security", "Input validation", "Data protection"]],
      ["8.2", "AI Security Review & Agent Governance", ["Indirect injection", "Excessive agency", "Tool abuse", "Secure RAG", "Agent permissions"]],
      ["8.3", "SRE & Reliability", ["SLAs", "SLOs", "SLIs", "Availability", "Reliability", "Disaster recovery", "Backups", "Incident management", "Postmortems"]],
      ["8.4", "Incident Response", ["Incident detection", "Severity", "Incident commander", "Communication", "Mitigation", "Root-cause analysis", "Recovery", "Postmortem", "Prevention"]],
    ],
  ],
  [
    "The FDE Craft",
    "The half of the job that isn't code: discovery, problem framing, architecture, scope and SOW, customer communication, ROI, adoption and handoff — ending in a full build-and-deploy.",
    [
      ["9.1", "Technical Discovery", ["Discovery frameworks", "Stakeholder interviews", "Business process mapping", "Technical discovery", "System discovery", "Data discovery", "Constraint discovery", "Success metrics"]],
      ["9.2", "Problem Framing", ["Problem statement", "User personas", "Current state", "Future state", "Pain points", "Requirements", "Assumptions", "Constraints", "Risks", "Success metrics"]],
      ["9.3", "Solution Architecture", ["Architecture diagrams", "Data flows", "Sequence diagrams", "API architecture", "AI architecture", "Security architecture", "Infrastructure architecture", "ADRs", "Technology selection"]],
      ["9.4", "Scope & SOW", ["POC", "Prototype", "MVP", "Production", "Scope definition", "Milestones", "Dependencies", "Estimates", "Risks", "Statement of Work", "Acceptance criteria"]],
      ["9.5", "Customer Communication", ["Technical communication", "Executive communication", "Architecture presentation", "Demo", "Incident communication", "Stakeholder updates", "Expectation management", "Scope negotiation", "Handling objections", "Explaining AI limitations"]],
      ["9.6", "Business Value & ROI", ["Business KPIs", "Technical KPIs", "Baseline", "Target", "ROI", "Cost savings", "Time savings", "Revenue impact", "Productivity", "Error reduction", "Adoption"]],
      ["9.7", "Adoption & Handoff", ["UAT", "User training", "Documentation", "Operational handoff", "Change management", "Adoption measurement", "Support model", "Knowledge transfer", "Post-deployment roadmap"]],
      ["9.8", "Discovery & Design", ["Discover", "Define", "Design", "Deliverables"]],
      ["9.9", "Build & Deploy", ["Backend", "Frontend", "AI", "RAG", "Agent", "Integration", "Dockerize", "Deploy", "Monitor", "Evaluate", "Secure"]],
    ],
  ],
];

/* ------------------------------------------------------- deterministic rng */

/** FNV-1a — stable across runs, so server and client render identical markup. */
export function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const pick = <T,>(seed: string, arr: readonly T[]): T => arr[hash(seed) % arr.length];
const range = (seed: string, min: number, max: number) => min + (hash(seed) % (max - min + 1));

/* ------------------------------------------- per-topic asset derivation */

const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"] as const;

const RESOURCE_SHAPES: ReadonlyArray<[string, Resource["kind"]]> = [
  ["Reference documentation", "doc"],
  ["Starter repository", "repo"],
  ["Worked example repo", "repo"],
  ["Original paper", "paper"],
  ["Spec & schema reference", "doc"],
  ["Tooling walkthrough", "tool"],
  ["Checklist (PDF)", "doc"],
  ["Production playbook", "doc"],
];

/** Lab briefs vary by shape rather than being one sentence with the topic
 *  swapped in, so the Assignments board reads like a real backlog. */
const BRIEF_SHAPES: ReadonlyArray<(topic: string, module: string) => string> = [
  (t, m) => `Take a working ${m} setup and extend it with ${t}. Submit the diff, plus a note on what you'd have done differently with twice the time.`,
  (t) => `A client's system is failing because ${t} was never handled properly. Reproduce the failure, fix it, and prove the fix with a test.`,
  (t, m) => `Build the smallest thing that demonstrates ${t} end to end, inside the ${m} codebase. No framework you can't explain line by line.`,
  (t) => `Instrument ${t} so you can measure it. Capture a baseline, make one change, and show the before and after.`,
  (t, m) => `Write the ${m} runbook for ${t}: what it does, how it fails, and what the on-call engineer should do at 3am.`,
  (t) => `Review a deliberately flawed implementation of ${t}, list every problem you find in severity order, and ship the corrected version.`,
];

function deriveAssets(id: string, title: string, moduleTitle: string) {
  const videoSeconds = range(id + "v", 7, 34) * 60 + range(id + "s", 0, 59);
  const hasAssignment = hash(id + "a") % 100 < 38;
  const resourceCount = range(id + "r", 1, 3);
  const resources: Resource[] = Array.from({ length: resourceCount }, (_, i) => {
    const [label, kind] = pick(id + "rs" + i, RESOURCE_SHAPES);
    return { label: `${title} — ${label}`, kind, href: "#" };
  });

  const assignment: Assignment | null = hasAssignment
    ? {
        id: "a" + id.slice(1),
        title: `${title} — Lab`,
        brief: pick(id + "br", BRIEF_SHAPES)(title.toLowerCase(), moduleTitle),
        difficulty: DIFFICULTY[hash(id + "d") % 3],
        estMinutes: range(id + "e", 3, 14) * 15,
      }
    : null;

  return { videoSeconds, hasNotes: true, assignment, resources };
}

/** Hand-written briefs for the marquee labs, so the Assignments screen leads
 *  with real work rather than generated copy. Keyed by topic id. */
const ASSIGNMENT_OVERRIDES: Record<string, Partial<Assignment>> = {
  "t-1.2.9": { title: "Python CLI Utility", brief: "Build a command-line utility in Python that ingests a messy CSV of client records, validates it, and emits a clean, typed report. Package it so a non-engineer can run it." },
  "t-2.3.8": { title: "Context Engineering Harness", brief: "Build a harness that assembles context for a support assistant from three sources, measures token cost per request, and proves a measurable quality lift over a naive prompt." },
  "t-2.5.1": { title: "RAG Pipeline from Scratch", brief: "Chunk by meaning, embed, retrieve and re-rank over a real document set. Every answer must cite its source." },
  "t-3.4.4": { title: "Build an MCP Server", brief: "Expose three internal tools over the Model Context Protocol with typed schemas, auth, and a safe execution boundary." },
  "t-6.1.9": { title: "Harden a Production Image", brief: "Take a working Dockerfile to a hardened, non-root, multi-stage production image and document every change you made and why." },
  "t-7.2.3": { title: "Partition a Hot Table", brief: "Take a 400M-row orders table that is timing out under load, design a partitioning strategy, migrate it with zero downtime, and show the before/after query plans." },
  "t-9.4.10": { title: "Write a Real Statement of Work", brief: "Turn a discovery transcript into a scoped SOW with milestones, dependencies, estimates, risks and acceptance criteria a client would actually sign." },
};

/* -------------------------------------------------------------- assembled */

function build(): Phase[] {
  let globalIndex = 0;
  return RAW.map(([title, summary, modules], pi) => {
    const number = pi + 1;
    const code = String(number).padStart(2, "0");
    const phaseId = `p-${code}`;
    return {
      id: phaseId,
      code,
      number,
      title,
      summary,
      modules: modules.map(([mcode, mtitle, topics]) => {
        const moduleId = `m-${mcode}`;
        return {
          id: moduleId,
          code: mcode,
          title: mtitle,
          phaseId,
          topics: topics.map((ttitle, ti) => {
            const id = `t-${mcode}.${ti + 1}`;
            const assets = deriveAssets(id, ttitle, mtitle);
            const override = ASSIGNMENT_OVERRIDES[id];
            const assignment =
              override
                ? {
                    id: "a" + id.slice(1),
                    title: ttitle + " — Lab",
                    brief: "",
                    difficulty: "Intermediate" as const,
                    estMinutes: 120,
                    ...assets.assignment,
                    ...override,
                  }
                : assets.assignment;
            globalIndex += 1;
            return {
              id,
              title: ttitle,
              index: ti + 1,
              globalIndex,
              moduleId,
              phaseId,
              ...assets,
              assignment,
            };
          }),
        };
      }),
    };
  });
}

export const PHASES: Phase[] = build();

/* ---------------------------------------------------------------- indexes */

export const ALL_MODULES: Module[] = PHASES.flatMap((p) => p.modules);
export const ALL_TOPICS: Topic[] = ALL_MODULES.flatMap((m) => m.topics);

export const PHASE_BY_ID = new Map(PHASES.map((p) => [p.id, p]));
export const MODULE_BY_ID = new Map(ALL_MODULES.map((m) => [m.id, m]));
export const TOPIC_BY_ID = new Map(ALL_TOPICS.map((t) => [t.id, t]));

export const TOTALS = {
  phases: PHASES.length,
  modules: ALL_MODULES.length,
  topics: ALL_TOPICS.length,
};

/* ------------------------------------------------------------- navigation */

export function topicNeighbours(topicId: string) {
  const i = ALL_TOPICS.findIndex((t) => t.id === topicId);
  return {
    prev: i > 0 ? ALL_TOPICS[i - 1] : null,
    next: i >= 0 && i < ALL_TOPICS.length - 1 ? ALL_TOPICS[i + 1] : null,
  };
}

export function topicPath(topicId: string) {
  const topic = TOPIC_BY_ID.get(topicId);
  if (!topic) return null;
  const parentModule = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  return { phase, module: parentModule, topic };
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatMinutes(seconds: number) {
  return `${Math.round(seconds / 60)} min`;
}
