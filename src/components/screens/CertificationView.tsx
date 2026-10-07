"use client";

import * as React from "react";
import { Award, Check, Download, Eye, Lock, Share2 } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import {
  Badge, Button, ButtonLink, Card, CardHeader, Modal, ProgressBar, SectionHeading, cx,
} from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ALL_TOPICS, PHASES, TOTALS } from "@/data/curriculum";
import { PROJECTS } from "@/data/projects";
import { USER } from "@/data/user";
import { useProgress, useRollups } from "@/state/progress";

function LinkedInMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.8 8.65 22 10.9 22 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" />
    </svg>
  );
}

/* ------------------------------------------------------------ certificate */

function Certificate({ locked }: { locked?: boolean }) {
  return (
    <div className={cx("relative overflow-hidden rounded-xl border border-line-hi bg-[#0a0a0a]", locked && "select-none")}>
      <div className="grid-field pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,rgba(230,22,31,0.10),transparent_65%)]" />
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent" />

      <div className={cx("relative px-6 py-10 text-center sm:px-12 sm:py-14", locked && "blur-[3px] opacity-45")}>
        <div className="eyebrow">Certificate of completion</div>

        <h2 className="display mt-6 text-[26px] leading-tight text-ink sm:text-[34px]">
          AI Forward Deployed Engineer
        </h2>
        <div className="mx-auto mt-5 h-px w-20 bg-brand/50" />

        <p className="mt-7 text-[12px] uppercase tracking-[0.16em] text-ink-3">Awarded to</p>
        <p className="display mt-3 text-[24px] text-ink sm:text-[28px]">{USER.name}</p>

        <p className="mx-auto mt-7 max-w-md text-[13px] leading-relaxed text-ink-2">
          for completing all {TOTALS.phases} phases, {TOTALS.modules} modules and {TOTALS.topics} topics
          of the AI Forward Deployed Engineer programme, including {PROJECTS.length} shipped projects.
        </p>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6 text-left">
          <div>
            <p className="display text-[14px] text-ink">Vishwa Mohan</p>
            <p className="mt-1 text-[11px] text-ink-3">Founder &amp; CEO, upGrad School of Technology</p>
          </div>
          <div className="text-right">
            <p className="mono text-[10px] uppercase tracking-[0.12em] text-ink-3">Credential ID</p>
            <p className="mono mt-1 text-[12px] text-ink-2">FDE-C04-{USER.initials}-00{PROJECTS.length}</p>
          </div>
        </div>
      </div>

      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-line-hi bg-surface">
            <Lock size={17} className="text-ink-3" />
          </span>
          <p className="display text-[15px] text-ink">Certificate locked</p>
          <p className="max-w-sm text-[13px] leading-relaxed text-ink-2">
            Complete the required curriculum and projects to unlock your certificate.
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- view */

export function CertificationView() {
  const { program, byPhase, phasesCompleted, totals } = useRollups();
  const { topics } = useProgress();
  const [preview, setPreview] = React.useState(false);
  const { push } = useToast();

  const quizTopics = ALL_TOPICS.filter((t) => t.assignment);
  const quizzesDone = quizTopics.filter((t) => topics[t.id]?.assignment === "completed").length;
  const requirements = [
    { label: `Complete all ${totals.phases} phases`, done: phasesCompleted, total: totals.phases },
    { label: `Complete all ${totals.topics} topics`, done: program.completed, total: program.total },
    { label: `Complete all ${quizTopics.length} assignments`, done: quizzesDone, total: quizTopics.length },
  ];
  const eligible = requirements.every((r) => r.done >= r.total);

  return (
    <Page className="space-y-6">
      <SectionHeading
        eyebrow="Certification"
        title={eligible ? "Your certificate is ready" : "Certificate of completion"}
        description={
          eligible
            ? "You&apos;ve completed the AI Forward Deployed Engineer programme. Download it, share it, add it to your profile."
            : "Finish the programme and earn a certificate you can add to your resume and LinkedIn profile."
        }
        action={
          <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3">
            <Award size={16} className={eligible ? "text-brand-ink" : "text-ink-3"} />
            <div>
              <div className="eyebrow mb-1">Eligibility</div>
              <p className="nums text-[13px] text-ink-2">{program.percent}% complete</p>
            </div>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Certificate locked={!eligible} />

          <div className="flex flex-wrap items-center gap-2.5">
            {eligible ? (
              <>
                <Button variant="primary" onClick={() => push({ tone: "success", title: "Certificate downloaded", description: "FDE-Certificate.pdf saved to your device." })}>
                  <Download size={14} /> Download certificate
                </Button>
                <Button variant="secondary" onClick={() => push({ title: "Share link copied", description: "Anyone with the link can verify your credential." })}>
                  <Share2 size={14} /> Share certificate
                </Button>
                <Button variant="outline" onClick={() => push({ title: "Opening LinkedIn", description: "Add this credential to your profile." })}>
                  <LinkedInMark /> Add to LinkedIn
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setPreview(true)}>
                  <Eye size={14} /> Preview the certificate
                </Button>
                <ButtonLink href="/curriculum" variant="primary">
                  Continue learning →
                </ButtonLink>
              </>
            )}
          </div>
        </div>

        {/* ------------------------------------------------- requirements */}
        <div className="space-y-4">
          <Card>
            <CardHeader eyebrow="Requirements" title="What's left to unlock it" />
            <ul className="divide-y divide-[#1a1a1a] border-t border-line">
              {requirements.map((r) => {
                const met = r.done >= r.total;
                return (
                  <li key={r.label} className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cx(
                          "flex size-5 shrink-0 items-center justify-center rounded-full",
                          met ? "bg-brand text-white" : "border border-line-hi",
                        )}
                      >
                        {met ? <Check size={11} strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-ink-4" />}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] text-ink-2">{r.label}</span>
                      <span className="nums shrink-0 text-[12px] text-ink-3">{r.done}/{r.total}</span>
                    </div>
                    <ProgressBar value={(r.done / r.total) * 100} size="xs" className="ml-8 mt-2.5 w-[calc(100%-2rem)]" tone={met ? "done" : "brand"} />
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader eyebrow="Phase completion" title={`${phasesCompleted} of ${totals.phases} phases`} />
            <ul className="divide-y divide-[#1a1a1a] border-t border-line">
              {PHASES.map((p) => {
                const r = byPhase.get(p.id)!;
                const done = r.percent === 100;
                return (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                    <span className={cx("flex size-4 shrink-0 items-center justify-center rounded-full", done ? "bg-brand text-white" : "border border-line-hi")}>
                      {done && <Check size={9} strokeWidth={3.5} />}
                    </span>
                    <span className="mono shrink-0 text-[10px] tracking-[0.08em] text-ink-3">P{p.code}</span>
                    <span className={cx("min-w-0 flex-1 truncate text-[12.5px]", done ? "text-ink-2" : "text-ink-3")}>{p.title}</span>
                    <span className="nums shrink-0 text-[11px] text-ink-3">{r.percent}%</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {!eligible && (
            <Card className="brand-wash p-5">
              <Badge tone="brand">Also unlocks</Badge>
              <p className="display mt-3 text-[15px] leading-snug text-ink">The Job Portal opens with your certificate</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                Curated AI and FDE roles, shared with engineers who&apos;ve finished the programme.
              </p>
              <ButtonLink href="/jobs" size="sm" variant="outline" className="mt-4">See what&apos;s waiting →</ButtonLink>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        eyebrow="Preview"
        title="Your certificate, once you finish"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPreview(false)}>Close</Button>
            <ButtonLink href="/curriculum" variant="primary" size="sm">Continue learning →</ButtonLink>
          </>
        }
      >
        <Certificate />
        <p className="mt-4 text-center text-[12px] text-ink-3">
          This is how your certificate will look. {program.percent}% complete — {100 - program.percent}% to go.
        </p>
      </Modal>
    </Page>
  );
}
