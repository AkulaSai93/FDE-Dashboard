import Link from "next/link";
import { Logo } from "@/components/shell/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <Logo size={36} />
      <p className="mono mt-7 text-[11px] uppercase tracking-[0.16em] text-ink-3">404</p>
      <h1 className="display mt-3 text-[26px] text-ink">That page isn&apos;t part of the programme</h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-2">
        The link may be out of date. The curriculum is the source of truth for everything in the platform.
      </p>
      <div className="mt-7 flex gap-2.5">
        <Link href="/dashboard" className="inline-flex h-9.5 items-center rounded-md bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hi">
          Back to dashboard
        </Link>
        <Link href="/curriculum" className="inline-flex h-9.5 items-center rounded-md border border-line-hi px-4 text-sm text-ink-2 transition-colors hover:text-ink">
          Browse curriculum
        </Link>
      </div>
    </main>
  );
}
