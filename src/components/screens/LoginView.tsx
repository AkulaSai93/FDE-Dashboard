"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Lock, Mail, MapPin, User } from "lucide-react";
import { cx } from "@/components/ui";

/** Where the student lands after signing in: the locked profile page, which leads on
 *  to payment → access → the LMS dashboard. In production this is the real profile route. */
const AFTER_LOGIN = "/zz-profile-preview.html";

const POINTS = [
  "All lectures, notes & projects in one place",
  "Lifetime access for a one-time ₹99",
  "Learner community + completion certificate",
];

function UpgradMark() {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className="text-[26px] font-extrabold tracking-[-0.03em] text-brand">upGrad</span>
      <span className="mt-0.5 pl-6 text-[11px] font-semibold text-ink">School of Technology</span>
    </span>
  );
}

function Field({
  label, icon, optional, ...input
}: { label: string; icon?: React.ReactNode; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[13px] text-ink-2">
        {label} {optional && <span className="text-ink-4">(optional)</span>}
      </span>
      <span className="relative mt-2 block">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3">{icon}</span>}
        <input
          {...input}
          className={cx(
            "h-12 w-full rounded-[var(--radius-md)] border border-line-hi bg-bg px-4 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-brand",
            !!icon && "pl-11",
          )}
        />
      </span>
    </label>
  );
}

export function LoginView() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [busy, setBusy] = React.useState(false);

  // Mock sign-in: no account is created or checked — the preview simply moves on.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => router.push(AFTER_LOGIN), 500);
  };

  return (
    <main className="grid min-h-dvh bg-bg lg:grid-cols-2">
      {/* ------------------------------------------------ brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-panel p-12 lg:flex">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-brand/25 blur-[120px]" />
        <div className="relative"><UpgradMark /></div>

        <div className="relative max-w-lg">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-ink">Join the platform</p>
          <h1 className="display mt-5 text-[44px] font-light leading-[1.05] text-ink">
            The lectures got you started. The platform gets you <span className="text-brand-ink">deployed.</span>
          </h1>
          <ul className="mt-8 space-y-3.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-ink-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-brand/15 text-[14px] font-semibold text-brand-ink ring-1 ring-brand/30">VM</span>
          <div>
            <p className="display text-[15px] text-ink">Vishwa Mohan</p>
            <p className="text-[12px] text-ink-3">Founder &amp; CEO, upGrad School of Technology</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ form */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden"><UpgradMark /></div>

          <div role="tablist" aria-label="Account" className="mb-8 grid grid-cols-2 rounded-[var(--radius-lg)] bg-card p-1 ring-1 ring-line">
            {([["login", "Log in"], ["signup", "Create account"]] as const).map(([v, label]) => (
              <button
                key={v}
                role="tab"
                aria-selected={mode === v}
                onClick={() => setMode(v)}
                className={cx(
                  "h-10 rounded-[var(--radius-md)] text-[14px] transition-colors",
                  mode === v ? "bg-card-hi2 text-ink" : "text-ink-3 hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <h2 className="display text-[32px] font-light leading-tight text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-[14px] text-ink-3">
            {mode === "login" ? "Log in to continue your FDE journey." : "Capture your spot — it takes less than a minute."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === "signup" && (
              <Field label="Full name" icon={<User size={16} />} placeholder="Aditi Sharma" autoComplete="name" required />
            )}
            <Field label="Email address" icon={<Mail size={16} />} type="email" placeholder="you@example.com" autoComplete="email" required />
            {mode === "signup" && (
              <>
                <label className="block">
                  <span className="text-[13px] text-ink-2">Mobile number</span>
                  <span className="mt-2 flex h-12 items-center rounded-[var(--radius-md)] border border-line-hi bg-bg focus-within:border-brand">
                    <span className="pl-4 pr-2 text-[14px] text-ink-3">+91</span>
                    <input type="tel" placeholder="98765 43210" autoComplete="tel" required className="h-full flex-1 bg-transparent pr-4 text-[14px] text-ink outline-none placeholder:text-ink-4" />
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City" optional icon={<MapPin size={16} />} placeholder="Bengaluru" autoComplete="address-level2" />
                  <label className="block">
                    <span className="text-[13px] text-ink-2">You are a</span>
                    <select className="mt-2 h-12 w-full rounded-[var(--radius-md)] border border-line-hi bg-bg px-4 text-[14px] text-ink outline-none focus:border-brand">
                      <option>Student</option>
                      <option>Working professional</option>
                      <option>Founder</option>
                    </select>
                  </label>
                </div>
              </>
            )}
            <Field
              label="Password"
              icon={<Lock size={16} />}
              type="password"
              placeholder={mode === "login" ? "Your password" : "Minimum 6 characters"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            {mode === "login" && (
              <div className="-mt-1 flex justify-end">
                <button type="button" className="text-[13px] text-ink-3 transition-colors hover:text-ink">Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={busy} className="group flex w-full disabled:opacity-70">
              <span className="mr-0.5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-brand text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                  <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
                </svg>
              </span>
              <span className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-brand text-[15px] font-medium text-white transition-colors group-hover:bg-brand-hi">
                {busy ? "Signing you in…" : mode === "login" ? "Log in" : "Create account"}
                {!busy && <ArrowRight size={15} />}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-3">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-medium text-brand-ink hover:text-brand-hi">
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
