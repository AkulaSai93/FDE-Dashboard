"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/shell/Logo";
import { TOTALS } from "@/data/curriculum";
import { PROJECTS } from "@/data/projects";
import { USER } from "@/data/user";

/**
 * The hand-off screen between the ₹99 unlock modal on the marketing site and
 * the platform itself. It exists so the transition reads as "I just entered
 * the FDE platform" rather than "I got redirected somewhere else".
 */
const UNLOCKED = [
  { label: "Full course videos", detail: `${TOTALS.topics} lessons across ${TOTALS.phases} phases` },
  { label: "Structured notes", detail: "Module-by-module, written like documentation" },
  { label: "Hands-on projects", detail: `${PROJECTS.length} projects including the capstone` },
  { label: "Learning platform", detail: "Progress tracked at every level" },
  { label: "Community", detail: "1,240+ engineers on the same path" },
  { label: "Program certificate", detail: "Unlocks when you finish" },
];

export function UnlockedView() {
  const router = useRouter();

  React.useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-4 py-14">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(230,22,31,0.12),transparent_70%)]" />

      <div className="animate-rise relative w-full max-w-xl">
        <div className="flex flex-col items-center text-center">
          <Logo size={40} />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5">
            <Check size={11} strokeWidth={3} className="text-brand-ink" />
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-brand-ink">Payment successful · ₹99</span>
          </span>

          <h1 className="display mt-7 text-[32px] leading-tight text-ink sm:text-[40px]">
            You&apos;re in, {USER.firstName}.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">
            The AI Forward Deployed Engineer platform is unlocked. Everything below is yours from here on — no
            subscription, no renewal.
          </p>
        </div>

        <ul className="mt-9 grid gap-px overflow-hidden rounded-xl border border-line bg-[#1a1a1a] sm:grid-cols-2">
          {UNLOCKED.map((u) => (
            <li key={u.label} className="flex items-start gap-3 bg-card px-4 py-3.5">
              <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check size={10} strokeWidth={3.5} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-ink">{u.label}</span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">{u.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href="/dashboard" variant="primary" size="lg" className="w-full sm:w-auto sm:px-8">
            Enter the FDE platform <ArrowRight size={15} />
          </ButtonLink>
          <p className="text-[12px] text-ink-3">
            Starts you on Phase 01 — What is a Forward Deployed Engineer?
          </p>
        </div>
      </div>
    </main>
  );
}
