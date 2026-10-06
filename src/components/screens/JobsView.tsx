"use client";

import { ArrowRight, Briefcase, Building2, Lock, MapPin, Sparkles } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, ButtonLink, Card, CardHeader, ProgressBar, cx } from "@/components/ui";
import { PHASES, TOTALS } from "@/data/curriculum";
import { useRollups } from "@/state/progress";

/* The first two roles echo the ones surfaced on the FDE landing page. */
const ROLES = [
  { title: "Forward Deployed Engineer", team: "Applied AI", location: "Bengaluru", tag: "New role" },
  { title: "AI Solutions Engineer", team: "GenAI", location: "Remote", tag: "New role" },
  { title: "Deployment Engineer, Enterprise AI", team: "Platform", location: "Hyderabad", tag: "Hiring" },
  { title: "Applied AI Engineer", team: "Agents & MCP", location: "Remote · India", tag: "Hiring" },
];

const UNLOCKS = [
  { title: "Curated roles", body: "FDE and applied-AI openings from companies building deployment teams — not a generic job board." },
  { title: "Your portfolio, attached", body: "The projects you shipped in the programme go out with your profile, with repos and deployments." },
  { title: "Verified credential", body: "Your programme certificate is attached and verifiable by the hiring team." },
];

export function JobsView() {
  const { program, phasesCompleted } = useRollups();
  const remaining = program.total - program.completed;

  return (
    <Page className="space-y-6">
      {/* ------------------------------------------------------ locked hero */}
      <Card className="brand-wash relative overflow-hidden border-line-hi">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-hi bg-card px-3 py-1.5">
              <Lock size={11} className="text-ink-3" />
              <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Locked</span>
            </span>

            <h1 className="display mt-6 text-[30px] leading-tight text-ink sm:text-[40px]">
              Your next opportunity starts here
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              The Job Portal will unlock after you complete the required FDE journey. Finish the programme to get access
              to curated AI and FDE opportunities — with your projects and certificate attached.
            </p>

            <div className="mt-8 max-w-md">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Current progress</span>
                <span className="display nums text-[22px] text-ink">{program.percent}%</span>
              </div>
              <ProgressBar value={program.percent} className="mt-3" animated />
              <p className="nums mt-3 text-[12.5px] text-ink-2">
                {phasesCompleted} of {TOTALS.phases} phases done · {remaining} topics to go
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <ButtonLink href="/curriculum" variant="primary" size="lg">
                Continue learning <ArrowRight size={15} />
              </ButtonLink>
              <ButtonLink href="/journey" variant="outline" size="lg">
                See what&apos;s left
              </ButtonLink>
            </div>
          </div>
        </div>
      </Card>

      {/* --------------------------------------------------- what&apos;s waiting */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            eyebrow="A preview"
            title="Roles shared with FDE graduates"
            action={<Badge tone="quiet"><Lock size={10} /> Locked</Badge>}
          />
          <ul className="relative divide-y divide-[#1a1a1a] border-t border-line">
            {ROLES.map((r, i) => (
              <li
                key={r.title}
                className={cx("flex items-center gap-4 px-5 py-4", i > 0 && "blur-[3px] select-none opacity-45")}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-sub text-ink-3">
                  <Building2 size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] text-ink">{r.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-3">
                    <span>{r.team}</span>
                    <span className="size-0.5 rounded-full bg-ink-4" />
                    <span className="inline-flex items-center gap-1"><MapPin size={9} />{r.location}</span>
                  </span>
                </span>
                <Badge tone={i === 0 ? "brand" : "quiet"}>{r.tag}</Badge>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-4">
            <p className="text-[12.5px] leading-relaxed text-ink-3">
              You&apos;ll hear about FDE and applied-AI roles as you work through the programme. Full access to the portal —
              applications, referrals and your attached portfolio — opens at 100%.
            </p>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader eyebrow="On unlock" title="What you get" />
            <ul className="divide-y divide-[#1a1a1a] border-t border-line">
              {UNLOCKS.map((u) => (
                <li key={u.title} className="flex gap-3.5 px-5 py-4">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-brand-ink" />
                  <span className="min-w-0">
                    <span className="block text-[13px] text-ink">{u.title}</span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-3">{u.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="eyebrow mb-3.5">Remaining phases</div>
            <ul className="space-y-2">
              {PHASES.filter((p) => p.number > phasesCompleted).map((p) => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <span className="mono shrink-0 text-[10px] tracking-[0.08em] text-ink-4">P{p.code}</span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-3">{p.title}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/journey" size="sm" variant="outline" className="mt-4 w-full">
              <Briefcase size={13} /> Open My Journey
            </ButtonLink>
          </Card>
        </div>
      </div>
    </Page>
  );
}
