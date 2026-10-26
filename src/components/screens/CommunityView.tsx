"use client";

import {
  ArrowUpRight, Briefcase, HelpCircle, Megaphone, Sparkles,
} from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { WhatsAppIcon } from "@/components/ui";
import { COMMUNITY_STATS, WHATSAPP_COMMUNITY_URL } from "@/data/activity";

/* ============================================================================
 * COMMUNITY
 *
 * This page has exactly one job: get the learner into the WhatsApp group.
 * It used to spend three stacked rows of equal-weight cards doing it — four
 * perks with paragraph-length bodies, a three-step how-to and four house rules,
 * each in its own bordered box. That is a landing page, not a product page.
 *
 * Now: one hero that carries the action, four one-line perks as plain rows, and
 * the rules folded into small print beneath. Roughly half the height, same
 * information.
 * ========================================================================= */

const PERKS = [
  { icon: HelpCircle, title: "Get unstuck", body: "Answers on labs, quizzes and projects, from peers and mentors." },
  { icon: Megaphone, title: "Announcements", body: "Live sessions, new content and deadlines land here first." },
  { icon: Sparkles, title: "Show your work", body: "Share projects and see how others solved the same problem." },
  { icon: Briefcase, title: "Jobs & referrals", body: "Openings and interview tips from alumni and hiring partners." },
];

/** Joining and conduct: necessary, but not headline material. */
const SMALL_PRINT = [
  "Join the Announcements group so you never miss an update, then introduce yourself in General.",
  "Keep threads on topic and use the right group. No full quiz answers, no spam, no unsolicited DMs.",
];

export function CommunityView() {
  return (
    <Page className="space-y-8">
      {/* ------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-line bg-card">
        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="eyebrow">Community</p>
            <h1 className="display mt-3 text-[28px] font-light leading-tight text-ink sm:text-[34px]">
              Join the FDE WhatsApp community
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
              {COMMUNITY_STATS.members.toLocaleString("en-IN")}+ learners working through the same AI deployment
              journey. Ask questions, share what you build, get unstuck faster.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[#25D366] px-5 py-3 text-[14px] font-medium text-black transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon size={16} /> Join on WhatsApp <ArrowUpRight size={15} />
              </a>
              <span className="flex items-center gap-2 text-[13px] text-ink-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366]/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#25D366]" />
                </span>
                {COMMUNITY_STATS.online} online now
              </span>
            </div>
          </div>

          <div className="shrink-0 lg:text-right">
            <p className="display nums text-[48px] font-light leading-none text-ink sm:text-[56px]">
              {COMMUNITY_STATS.members.toLocaleString("en-IN")}+
            </p>
            <p className="eyebrow mt-2.5">Members joined</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- what it's for */}
      <section>
        <div className="mb-4 flex items-center gap-4">
          <h2 className="eyebrow shrink-0">What it&apos;s for</h2>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>
        {/* Plain rows rather than four bordered boxes: the icon and the label
            carry it, and the page stops looking like a pricing table. */}
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {PERKS.map((p) => (
            <li key={p.title} className="flex gap-3.5">
              <p.icon size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-brand-ink" />
              <span className="min-w-0">
                <span className="block text-[14px] text-ink">{p.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ small print */}
      <section className="border-t border-line pt-6">
        <h2 className="eyebrow">Before you join</h2>
        <ul className="mt-3 space-y-2">
          {SMALL_PRINT.map((line) => (
            <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-3">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-ink-4" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
