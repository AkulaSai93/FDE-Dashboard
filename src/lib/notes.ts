import { MODULE_BY_ID, PHASE_BY_ID, hash, type Topic } from "@/data/curriculum";

/** Structured note document for a topic.
 *  Generated from the curriculum so every one of the 371 topics has a complete,
 *  well-shaped note. Replace `buildNote` with a CMS fetch and the reader,
 *  the Notes index and the workspace tab all keep working. */
export interface NoteBlock {
  kind: "p" | "h2" | "bullets" | "code" | "callout" | "table";
  text?: string;
  items?: string[];
  lang?: string;
  rows?: Array<[string, string]>;
}

export interface Note {
  topicId: string;
  title: string;
  phaseLabel: string;
  moduleLabel: string;
  readMinutes: number;
  blocks: NoteBlock[];
}

const OBJECTIVE_VERBS = ["Recognise", "Apply", "Diagnose", "Design", "Justify"];

const PITFALLS = [
  "Optimising this before you have a measurement. Get a baseline first — otherwise you can't tell improvement from noise.",
  "Treating the happy path as the design. On a client site the interesting cases are the malformed ones.",
  "Hiding the failure. Surface it, bound it, and make the next person's debugging cheap.",
  "Copying a pattern from a blog post without its constraints. The constraints are the pattern.",
  "Leaving it undocumented. If you're the only person who can operate it, you haven't deployed it.",
];

export function buildNote(topic: Topic): Note {
  const mod = MODULE_BY_ID.get(topic.moduleId)!;
  const phase = PHASE_BY_ID.get(topic.phaseId)!;
  const h = hash(topic.id);
  const t = topic.title;

  const blocks: NoteBlock[] = [
    {
      kind: "p",
      text: `${t} sits inside ${mod.title}, in Phase ${phase.code} — ${phase.title}. These notes follow the lesson video beat for beat, so you can revise in minutes instead of rewatching.`,
    },
    { kind: "h2", text: "What you'll learn" },
    {
      kind: "bullets",
      items: OBJECTIVE_VERBS.slice(0, 3 + (h % 2)).map(
        (v, i) =>
          `${v} ${t.toLowerCase()} ${["in a production context", "when the inputs are imperfect", "under a real deadline", "against a client's existing systems"][i % 4]}.`,
      ),
    },
    { kind: "h2", text: "Key concepts" },
    {
      kind: "p",
      text: `Most engineers meet ${t.toLowerCase()} as a definition. An FDE meets it as a constraint: something that decides whether the system you're deploying survives contact with the customer's environment. Work through the mental model below before you touch code.`,
    },
    {
      kind: "table",
      rows: [
        ["Concept", `The core idea behind ${t.toLowerCase()}`],
        ["Why it matters", `What breaks in production when it's wrong`],
        ["Where it shows up", `${mod.title} — and again in Phase 09, The FDE Craft`],
        ["How it's assessed", topic.assignment ? topic.assignment.title : "Covered in the module lab"],
      ],
    },
    { kind: "h2", text: "In practice" },
    {
      kind: "code",
      lang: "python",
      text: `# ${t} — the shape you'll actually write\nfrom typing import Any\n\n\ndef handle(payload: dict[str, Any]) -> dict[str, Any]:\n    """Validate at the boundary, fail loudly, log enough to debug."""\n    data = validate(payload)          # never trust the caller\n    result = process(data)            # the part this lesson is about\n    return serialise(result)          # a contract the client can rely on`,
    },
    {
      kind: "callout",
      text: `Common pitfall — ${PITFALLS[h % PITFALLS.length]}`,
    },
    { kind: "h2", text: "Important takeaways" },
    {
      kind: "bullets",
      items: [
        `${t} is a production concern, not an academic one.`,
        `You should be able to explain it to a non-engineering stakeholder in two sentences.`,
        `If you can't measure it, you can't claim you improved it.`,
        ...(topic.assignment ? [`Prove it in the lab: ${topic.assignment.title}.`] : []),
      ],
    },
  ];

  return {
    topicId: topic.id,
    title: topic.title,
    phaseLabel: `Phase ${phase.code} · ${phase.title}`,
    moduleLabel: `${mod.code} ${mod.title}`,
    readMinutes: 4 + (h % 7),
    blocks,
  };
}
