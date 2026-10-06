"use client";

import { ArrowRight, Calendar, MessageSquare, Megaphone, Users } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, Button, ButtonLink, Card, CardHeader, StatTile } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ANNOUNCEMENTS, COMMUNITY_STATS, DISCUSSIONS, EVENTS } from "@/data/activity";

export function CommunityView() {
  const { push } = useToast();

  return (
    <Page className="space-y-6">
      {/* ------------------------------------------------------------- hero */}
      <Card className="brand-wash relative overflow-hidden border-line-hi">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
          <div className="max-w-xl">
            <div className="eyebrow text-brand-ink">Community</div>
            <h1 className="display mt-3.5 text-[28px] leading-tight text-ink sm:text-[34px]">Build with other FDEs</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              Connect with learners working through the same AI deployment journey. Ask questions, share what you build,
              and get unstuck faster than you would alone.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={() => push({ title: "Opening the community", description: "The FDE community opens in a new tab." })}>
                Join community <ArrowRight size={15} />
              </Button>
              <span className="flex items-center gap-2 text-[12px] text-ink-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-brand/50" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand" />
                </span>
                {COMMUNITY_STATS.online} members online now
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <div className="display nums text-[46px] leading-none text-ink">{COMMUNITY_STATS.members.toLocaleString("en-IN")}+</div>
            <div className="eyebrow mt-2.5">Learners in the programme</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile value={`${COMMUNITY_STATS.members.toLocaleString("en-IN")}+`} label="Members" accent />
        <StatTile value={`${COMMUNITY_STATS.postsThisWeek}`} label="Posts this week" />
        <StatTile value={`${EVENTS.length}`} label="Upcoming events" />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ------------------------------------------------- discussions */}
        <Card className="lg:col-span-3">
          <CardHeader
            eyebrow="Recent discussions"
            title="What people are working through"
            action={<Button size="sm" variant="ghost" onClick={() => push({ title: "Opening the community" })}>View all</Button>}
          />
          <ul className="divide-y divide-[#1a1a1a] border-t border-line">
            {DISCUSSIONS.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => push({ title: "Opening discussion", description: d.title })}
                  className="flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors hover:bg-card-hi"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-hi bg-card-hi text-[11px] font-semibold text-ink-2">
                    {d.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] leading-snug text-ink">{d.title}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-3">
                      <span>{d.author}</span>
                      <span className="size-0.5 rounded-full bg-ink-4" />
                      <span className="mono uppercase tracking-[0.08em]">{d.tag}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-2">
                      <MessageSquare size={11} /> <span className="nums">{d.replies}</span>
                    </span>
                    <span className="text-[11px] text-ink-3">{d.when}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* ----------------------------------------- events + announcements */}
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader eyebrow="Upcoming" title="Events" />
            <ul className="divide-y divide-[#1a1a1a] border-t border-line">
              {EVENTS.map((e) => (
                <li key={e.id} className="flex gap-3.5 px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-sub text-ink-3">
                    <Calendar size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Badge tone="quiet" className="mb-2">{e.kind}</Badge>
                    <span className="block text-[13px] leading-snug text-ink">{e.title}</span>
                    <span className="nums mt-1.5 block text-[11px] text-ink-3">{e.date} · {e.time} · {e.host}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader eyebrow="From the team" title="Announcements" />
            <ul className="divide-y divide-[#1a1a1a] border-t border-line">
              {ANNOUNCEMENTS.map((a) => (
                <li key={a.id} className="flex gap-3.5 px-5 py-4">
                  <Megaphone size={14} className="mt-0.5 shrink-0 text-brand-ink" />
                  <span className="min-w-0">
                    <span className="block text-[13px] text-ink">{a.title}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-ink-3">{a.body}</span>
                    <span className="eyebrow mt-2 block">{a.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3.5">
          <Users size={18} className="shrink-0 text-ink-3" />
          <div>
            <p className="display text-[14px] text-ink">The community is included in your ₹99 unlock</p>
            <p className="mt-1 text-[13px] text-ink-2">No extra cost, no separate signup — it&apos;s part of the programme.</p>
          </div>
        </div>
        <ButtonLink href="/dashboard" size="sm" variant="outline">Back to dashboard</ButtonLink>
      </Card>
    </Page>
  );
}
