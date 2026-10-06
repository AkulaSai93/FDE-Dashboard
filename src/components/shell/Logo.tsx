import { cx } from "@/lib/cx";

/** FDE mark — the programme's monogram in the landing page's red. */
export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <span
      className={cx("relative flex shrink-0 items-center justify-center rounded-md bg-brand", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path d="M3 13V3h9M3 8h6.5" stroke="#fff" strokeWidth="2" strokeLinecap="square" />
      </svg>
    </span>
  );
}

export function Wordmark({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Logo />
      {!collapsed && (
        <div className="min-w-0 leading-none">
          <div className="display text-[13px] tracking-tight text-ink">FDE PROGRAM</div>
          <div className="mono mt-1 truncate text-[9px] uppercase tracking-[0.14em] text-ink-3">upGrad School of Tech</div>
        </div>
      )}
    </div>
  );
}
