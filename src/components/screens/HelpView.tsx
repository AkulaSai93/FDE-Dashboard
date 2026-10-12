"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { SectionHeading, cx } from "@/components/ui";

/* Answers are taken from the FAQ on the FDE landing page, adapted for someone
 * who has already unlocked the programme. */
const FAQ = [
  {
    q: "What does the ₹99 unlock give me?",
    a: "The whole course stays free on YouTube. ₹99 adds everything that turns watching into doing: structured notes for every topic, hands-on practice projects, this learning platform with your progress, the community, and the programme certificate.",
  },
  {
    q: "How is the programme structured?",
    a: "Nine phases, 47 modules and 371 topics. Phases 01–02 build the engineering and LLM foundations, 03–06 cover agents, integration and deployment, 07–08 are scale and security, and Phase 09 is the FDE craft — discovery, scoping, communication and handoff.",
  },
  {
    q: "Do I need prior AI or machine learning experience?",
    a: "No. The curriculum starts with the FDE role and Python fundamentals, then builds up through LLMs, RAG and agents to deployment, system design and the FDE craft.",
  },
  {
    q: "What will I build?",
    a: "The six projects in your Projects tab — from an AI resume/ATS scorer and an accessibility auditor to a payroll engine and a healthcare patient-queue system — each with a problem statement, walkthrough videos and resources.",
  },
  {
    q: "How does progress tracking work?",
    a: "Progress rolls up from topics. Finishing a topic's video marks it complete, which moves its module, then its phase, then the programme percentage you see in the sidebar. Certificate and Job Portal eligibility are both calculated from that same number.",
  },
  {
    q: "When does the Job Portal unlock?",
    a: "At 100% programme completion. It stays visible in the sidebar so you can see what you're working toward.",
  },
  {
    q: "Who teaches the programme?",
    a: "Vishwa Mohan, Founder & CEO of upGrad School of Technology. Before that he worked at Oracle, Walmart, PayPal, LinkedIn and PW.",
  },
];

export function HelpView() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <Page className="max-w-[860px] space-y-8">
      <SectionHeading
        eyebrow="Help"
        title="Frequently asked questions"
        description="Quick answers about the programme, your access and how progress works."
      />

      <ul className="divide-y divide-line border-y border-line">
        {FAQ.map((f, i) => (
          <li key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center gap-4 py-5 text-left"
            >
              <span className={cx("nums w-6 shrink-0 text-[12px]", open === i ? "text-brand-ink" : "text-ink-4")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cx("flex-1 text-[16px] transition-colors", open === i ? "text-ink" : "text-ink-2 hover:text-ink")}>{f.q}</span>
              <span
                className={cx(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border transition-all",
                  open === i ? "rotate-45 border-brand bg-brand text-white" : "border-line-hi text-ink-3",
                )}
              >
                <Plus size={14} />
              </span>
            </button>
            {open === i && (
              <p className="animate-fade max-w-[68ch] pb-6 pl-10 text-[14px] leading-[1.75] text-ink-3">{f.a}</p>
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}
