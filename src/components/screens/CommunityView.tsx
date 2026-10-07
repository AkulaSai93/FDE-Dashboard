"use client";

import {
  ArrowUpRight, Briefcase, Check, HelpCircle, Megaphone, MessageCircle, Sparkles, Users,
} from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Card, CardHeader } from "@/components/ui";
import { COMMUNITY_STATS } from "@/data/activity";

/** Invite link for the FDE WhatsApp community — replace with the real one. */
const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/your-invite-code";

const PERKS = [
  { icon: HelpCircle, title: "Get unstuck fast", body: "Post a question about a lab, quiz or project and get answers from peers and mentors." },
  { icon: Megaphone, title: "Programme announcements", body: "Live sessions, new content drops and deadline reminders land here first." },
  { icon: Sparkles, title: "Share what you build", body: "Show your projects, get feedback and see how others approached the same problem." },
  { icon: Briefcase, title: "Jobs & referrals", body: "Openings, referrals and interview tips shared by alumni and hiring partners." },
];

const STEPS = [
  "Tap “Join on WhatsApp” — it opens the community invite.",
  "Join the Announcements group so you never miss an update.",
  "Introduce yourself in the General group: name, role and what you want to build.",
];

const RULES = [
  "Be kind and constructive — everyone is learning.",
  "Keep threads on topic; use the right group for your question.",
  "Don't share full quiz answers or project solutions.",
  "No spam, promotions or unsolicited DMs.",
];

function JoinButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_COMMUNITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[14px] font-medium text-black transition-opacity hover:opacity-90 ${className}`}
    >
      <MessageCircle size={16} /> Join on WhatsApp <ArrowUpRight size={15} />
    </a>
  );
}

export function CommunityView() {
  return (
    <Page className="space-y-6">
      {/* ------------------------------------------------------------- hero */}
      <Card className="brand-wash relative overflow-hidden border-line-hi">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex flex-col gap-8 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
          <div className="max-w-xl">
            <div className="eyebrow text-brand-ink">Community</div>
            <h1 className="display mt-3.5 text-[28px] leading-tight text-ink sm:text-[34px]">Join the FDE WhatsApp community</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              Connect with learners working through the same AI deployment journey. Ask questions, share what you build,
              and get unstuck faster than you would alone.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <JoinButton />
              <span className="flex items-center gap-2 text-[12px] text-ink-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366]/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#25D366]" />
                </span>
                {COMMUNITY_STATS.online} members online now
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-8">
            <div>
              <div className="display nums text-[46px] leading-none text-ink">{COMMUNITY_STATS.members.toLocaleString("en-IN")}+</div>
              <div className="eyebrow mt-2.5">Members joined</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------ perks */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PERKS.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-5">
            <span className="flex size-9 items-center justify-center rounded-md border border-line bg-bg-sub text-brand-ink">
              <Icon size={16} />
            </span>
            <h2 className="display mt-4 text-[15px] text-ink">{title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{body}</p>
          </Card>
        ))}
      </div>

      {/* ------------------------------------------------- steps + rules */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader eyebrow="Getting started" title="Join in three steps" />
          <ol className="space-y-4 border-t border-line px-5 py-5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3.5">
                <span className="nums flex size-6 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-[11px] text-brand-ink">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed text-ink-2">{s}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <CardHeader eyebrow="House rules" title="Keep it useful for everyone" />
          <ul className="space-y-3.5 border-t border-line px-5 py-5">
            {RULES.map((r) => (
              <li key={r} className="flex gap-3 text-[13px] leading-relaxed text-ink-2">
                <Check size={14} strokeWidth={3} className="mt-[3px] shrink-0 text-[#25D366]" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ------------------------------------------------------------ footer */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <Users size={18} className="shrink-0 text-ink-3" />
          <div>
            <p className="display text-[14px] text-ink">{COMMUNITY_STATS.members.toLocaleString("en-IN")}+ learners are already in</p>
            <p className="mt-1 text-[13px] text-ink-2">It takes one tap to join — you can mute groups any time.</p>
          </div>
        </div>
        <JoinButton />
      </Card>
    </Page>
  );
}
