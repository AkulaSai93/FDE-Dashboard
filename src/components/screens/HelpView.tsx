"use client";

import * as React from "react";
import { ChevronDown, LifeBuoy, Mail, MessageSquare, Keyboard } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, Card, CardHeader, SectionHeading, cx } from "@/components/ui";
import { useToast } from "@/components/ui/toast";

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
    a: "Hands-on labs across the phases, plus the projects in your Projects tab — from an ATS scorer and an accessibility auditor through to a full Autonomous Business Operations Agent capstone.",
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

const SHORTCUTS: Array<[string, string]> = [
  ["⌘K / Ctrl+K", "Open search"],
  ["Space / K", "Play or pause the lesson"],
  ["← / →", "Skip 10 seconds"],
  ["M", "Mute"],
  ["F", "Fullscreen"],
  ["Esc", "Close any dialog"],
];

export function HelpView() {
  const [open, setOpen] = React.useState<number | null>(0);
  const { push } = useToast();

  return (
    <Page className="max-w-[900px] space-y-6">
      <SectionHeading
        eyebrow="Help"
        title="Help & support"
        description="Answers to the questions people ask most, plus a direct line to the team if you&apos;re stuck."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => push({ title: "Opening the community", description: "Ask in #help — the fastest route to an answer." })}
          className="flex items-center gap-3.5 rounded-xl border border-line bg-card p-5 text-left transition-colors hover:border-line-hi hover:bg-card-hi"
        >
          <MessageSquare size={17} className="shrink-0 text-brand-ink" />
          <span>
            <span className="block text-[13.5px] text-ink">Ask the community</span>
            <span className="mt-1 block text-[12px] text-ink-3">Usually answered within the hour</span>
          </span>
        </button>
        <button
          onClick={() => push({ title: "Opening your mail client", description: "support@upgradsot.com" })}
          className="flex items-center gap-3.5 rounded-xl border border-line bg-card p-5 text-left transition-colors hover:border-line-hi hover:bg-card-hi"
        >
          <Mail size={17} className="shrink-0 text-ink-3" />
          <span>
            <span className="block text-[13.5px] text-ink">Email support</span>
            <span className="mt-1 block text-[12px] text-ink-3">For account and access issues</span>
          </span>
        </button>
      </div>

      <Card>
        <CardHeader eyebrow="FAQ" title="Frequently asked questions" />
        <ul className="divide-y divide-[#1a1a1a] border-t border-line">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-card-hi"
              >
                <span className="flex-1 text-[13.5px] text-ink">{f.q}</span>
                <ChevronDown size={15} className={cx("shrink-0 text-ink-3 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <p className="animate-fade max-w-[72ch] px-5 pb-5 text-[13.5px] leading-[1.75] text-ink-2">{f.a}</p>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader eyebrow="Keyboard" title={<span className="flex items-center gap-2"><Keyboard size={15} /> Shortcuts</span>} />
        <ul className="grid gap-px border-t border-line bg-[#1a1a1a] sm:grid-cols-2">
          {SHORTCUTS.map(([k, v]) => (
            <li key={k} className="flex items-center justify-between gap-4 bg-card px-5 py-3">
              <span className="text-[13px] text-ink-2">{v}</span>
              <kbd className="mono shrink-0 rounded border border-line-hi bg-bg-sub px-2 py-1 text-[11px] text-ink-3">{k}</kbd>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <LifeBuoy size={17} className="shrink-0 text-ink-3" />
          <p className="text-[13px] text-ink-2">Still stuck? Reach the team directly and we&apos;ll come back to you.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => push({ title: "Support request started" })}>Contact support</Button>
      </Card>
    </Page>
  );
}
