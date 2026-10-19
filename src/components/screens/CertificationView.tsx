"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Check, Download, Lock, Share2 } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Button, ButtonLink, Doodles, cx } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ALL_TOPICS } from "@/data/curriculum";
import { useProgress, useRollups } from "@/state/progress";

function LinkedInMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.8 8.65 22 10.9 22 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" />
    </svg>
  );
}

export function CertificationView() {
  const { program, phasesCompleted, totals } = useRollups();
  const { topics } = useProgress();
  const { push } = useToast();

  const quizTopics = ALL_TOPICS.filter((t) => t.assignment);
  const quizzesDone = quizTopics.filter((t) => topics[t.id]?.assignment === "completed").length;
  const requirements = [
    { label: "Phases", done: phasesCompleted, total: totals.phases },
    { label: "Topics", done: program.completed, total: program.total },
    { label: "Assignments", done: quizzesDone, total: quizTopics.length },
  ];
  const eligible = requirements.every((r) => r.done >= r.total);

  return (
    <Page className="flex flex-col gap-10 lg:min-h-[calc(100dvh-4.5rem)]">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <Doodles variant="award" className="-top-6 max-w-[48%]" />
        <div className="relative">
          <p className="eyebrow">Certification</p>
          <h1 className="display relative mt-3 text-[34px] font-light leading-[1.05] text-ink sm:text-[42px]">
            {eligible ? (
              <>Your certificate is <span className="text-brand-ink">ready.</span></>
            ) : (
              <>Finish the program. <span className="text-brand-ink">Earn the certificate.</span></>
            )}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-3">
            {eligible
              ? "Download it, share it and add it to your LinkedIn profile."
              : "Complete every phase, topic and assignment and upGrad School of Technology issues a certificate with your name on it."}
          </p>

          <div className="mt-7 flex items-end gap-4">
            <p className="display nums text-[56px] font-light leading-none text-ink">
              {program.percent}
              <span className="text-[26px] text-ink-3">%</span>
            </p>
            <p className="pb-2 text-[13px] text-ink-3">{eligible ? "complete" : `${100 - program.percent}% to go`}</p>
          </div>
          <span className="mt-3 block h-1.5 max-w-md overflow-hidden rounded-full bg-card-hi2">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${program.percent}%` }} />
          </span>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {eligible ? (
              <>
                <Button variant="primary" onClick={() => push({ tone: "success", title: "Certificate downloaded", description: "FDE-Certificate.pdf saved to your device." })}>
                  <Download size={14} /> Download
                </Button>
                <Button variant="secondary" onClick={() => push({ title: "Share link copied" })}>
                  <Share2 size={14} /> Share
                </Button>
                <Button variant="outline" onClick={() => push({ title: "Opening LinkedIn" })}>
                  <LinkedInMark /> Add to LinkedIn
                </Button>
              </>
            ) : (
              <ButtonLink href="/curriculum" variant="primary" size="lg">
                Continue learning <ArrowRight size={15} />
              </ButtonLink>
            )}
          </div>

        </div>

        {/* certificate artwork — the programme's real design, locked until eligible */}
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] ring-1 ring-line-hi">
          <Image
            src="/certificate-sample.png"
            alt="AI Forward Deployed Engineer certificate"
            width={2000}
            height={1414}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className={cx("h-auto w-full", !eligible && "scale-[1.02] blur-[3px] brightness-50")}
            priority
          />
          {!eligible && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-black/70 ring-1 ring-tint-line">
                <Lock size={18} className="text-white" />
              </span>
              <p className="text-[14px] font-medium text-white">Unlocks at 100%</p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- requirements */}
      <section>
        <h2 className="display flex items-center gap-2.5 text-[20px] text-ink">
          <span className="size-2 rounded-full bg-brand" aria-hidden="true" /> What&apos;s left
        </h2>
        <div className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-line sm:grid-cols-3">
          {requirements.map((r) => {
            const met = r.done >= r.total;
            return (
              <div key={r.label} className="bg-panel p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ink-3">{r.label}</span>
                  {met && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-ink-2">
                      <Check size={12} strokeWidth={3} /> Done
                    </span>
                  )}
                </div>
                <p className="display nums mt-2 text-[28px] font-light leading-none text-ink">
                  {r.done}
                  <span className="text-[16px] text-ink-3"> / {r.total}</span>
                </p>
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-card-hi2">
                  <span className={cx("block h-full rounded-full", met ? "bg-ink-2" : "bg-brand")} style={{ width: `${(r.done / r.total) * 100}%` }} />
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </Page>
  );
}
