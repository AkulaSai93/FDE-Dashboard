"use client";

/* ============================================================================
 * FDE LMS — COMPONENT PRIMITIVES
 * Every surface, control and state in the product is composed from these.
 * Dark only: nothing here has a light variant.
 * ========================================================================= */

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Check, ChevronRight, Lock, Play, Circle, Loader2, X, ChevronDown } from "lucide-react";

export { cx } from "@/lib/cx";
import { cx } from "@/lib/cx";

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger-quiet";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,transform] duration-150 " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-40";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hi active:bg-brand-lo",
  secondary: "bg-card-hi text-ink border border-line-hi hover:bg-card-hi2 hover:border-[#333]",
  outline: "border border-line-hi text-ink-2 hover:text-ink hover:border-[#3a3a3a] hover:bg-card",
  ghost: "text-ink-2 hover:text-ink hover:bg-card-hi",
  "danger-quiet": "text-brand-ink hover:bg-brand/10 border border-brand/25 hover:border-brand/45",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9.5 px-4 text-sm",
  lg: "h-11 px-5 text-[15px]",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({ variant = "secondary", size = "md", loading, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cx(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)} {...rest}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cx(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------- Card */

export function Card({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return <As className={cx("rounded-xl border border-line bg-card", className)}>{children}</As>;
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-center justify-between gap-4 px-5 py-4", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        {title && <h2 className="display truncate text-[15px] text-ink">{title}</h2>}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------------------------------- Section heading */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <div className="eyebrow mb-2.5">{eyebrow}</div>}
        <h1 className="display text-[26px] leading-tight text-ink sm:text-[30px]">{title}</h1>
        {description && <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------------------------------------- Progress */

export function ProgressBar({
  value,
  tone = "brand",
  size = "md",
  animated = false,
  className,
}: {
  value: number;
  tone?: "brand" | "muted" | "done";
  size?: "xs" | "sm" | "md";
  animated?: boolean;
  className?: string;
}) {
  const h = size === "xs" ? "h-[3px]" : size === "sm" ? "h-1" : "h-1.5";
  const fill =
    tone === "muted" ? "bg-ink-4" : tone === "done" ? "bg-brand/55" : "bg-brand";
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("w-full overflow-hidden rounded-full bg-[#1c1c1c]", h, className)}
    >
      <div
        className={cx("h-full rounded-full transition-[width] duration-500 ease-out", fill, animated && "bar-sheen")}
        style={{ width: `${Math.min(100, Math.max(value, value > 0 ? 2 : 0))}%` }}
      />
    </div>
  );
}

/** Segmented bar — one notch per phase. Reads as "where am I in the whole
 *  programme" in a way a continuous bar can't. */
export function SegmentedProgress({
  segments,
  className,
}: {
  segments: Array<{ id: string; percent: number; label: string }>;
  className?: string;
}) {
  return (
    <div className={cx("flex gap-1", className)}>
      {segments.map((s) => (
        <div key={s.id} className="group/seg relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#1c1c1c]" title={s.label}>
          <div
            className={cx("h-full rounded-full transition-[width] duration-500", s.percent === 100 ? "bg-brand/55" : "bg-brand")}
            style={{ width: `${s.percent}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 112,
  stroke = 6,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c1c1c" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="display nums text-[26px] leading-none text-ink">{label ?? `${Math.round(value)}%`}</span>
        {sublabel && <span className="eyebrow mt-1.5">{sublabel}</span>}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Statuses */

export type StatusKind =
  | "completed" | "in-progress" | "not-started" | "upcoming" | "locked"
  | "submitted" | "evaluated" | "review";

const STATUS_LABEL: Record<StatusKind, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
  upcoming: "Upcoming",
  locked: "Locked",
  submitted: "Submitted",
  evaluated: "Evaluated",
  review: "In Review",
};

const STATUS_STYLE: Record<StatusKind, string> = {
  completed: "border-brand/30 bg-brand/8 text-brand-ink",
  "in-progress": "border-brand/45 bg-brand/12 text-brand-ink",
  "not-started": "border-line-hi bg-card-hi text-ink-2",
  upcoming: "border-line-hi bg-card-hi text-ink-2",
  locked: "border-line bg-[#0f0f0f] text-ink-4",
  submitted: "border-line-hi bg-card-hi text-ink",
  evaluated: "border-brand/30 bg-brand/8 text-brand-ink",
  review: "border-line-hi bg-card-hi text-ink",
};

export function StatusBadge({ status, className }: { status: StatusKind; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        STATUS_STYLE[status],
        className,
      )}
    >
      {status === "completed" || status === "evaluated" ? <Check size={11} strokeWidth={3} /> : null}
      {status === "in-progress" ? <span className="size-1.5 rounded-full bg-brand" /> : null}
      {status === "locked" ? <Lock size={10} /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}

/** The small circular marker that precedes every topic row. */
export function StatusDot({ status, size = 16 }: { status: StatusKind; size?: number }) {
  if (status === "completed" || status === "evaluated") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-brand text-white"
        style={{ width: size, height: size }}
      >
        <Check size={size * 0.62} strokeWidth={3.5} />
      </span>
    );
  }
  if (status === "in-progress" || status === "submitted" || status === "review") {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-brand text-brand"
        style={{ width: size, height: size }}
      >
        <Play size={size * 0.42} fill="currentColor" strokeWidth={0} className="ml-px" />
      </span>
    );
  }
  if (status === "locked") {
    return <Lock size={size * 0.8} className="shrink-0 text-ink-4" />;
  }
  return <Circle size={size} strokeWidth={1.5} className="shrink-0 text-ink-4" />;
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "quiet";
  className?: string;
}) {
  const tones = {
    neutral: "border-line-hi bg-card-hi text-ink-2",
    brand: "border-brand/30 bg-brand/8 text-brand-ink",
    quiet: "border-line bg-transparent text-ink-3",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- Tabs */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ value: T; label: string; count?: number; icon?: React.ReactNode }>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cx("flex items-center gap-1 overflow-x-auto border-b border-line", className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cx(
              "relative -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors",
              active
                ? "border-brand text-ink"
                : "border-transparent text-ink-3 hover:text-ink-2",
            )}
          >
            {t.icon}
            {t.label}
            {typeof t.count === "number" && (
              <span className={cx("nums rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-brand/15 text-brand-ink" : "bg-card-hi text-ink-3")}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- Filter chips */

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-center gap-1.5", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cx(
              "rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              active
                ? "border-brand/40 bg-brand/10 text-brand-ink"
                : "border-line bg-transparent text-ink-3 hover:border-line-hi hover:text-ink-2",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Dropdown */

export function Dropdown({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label?: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cx("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-9 items-center gap-2 rounded-md border border-line bg-card px-3 text-[13px] text-ink-2 transition-colors hover:border-line-hi hover:text-ink"
      >
        {label && <span className="text-ink-3">{label}</span>}
        <span className="text-ink">{current?.label ?? value}</span>
        <ChevronDown size={14} className={cx("text-ink-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="animate-fade absolute right-0 z-40 mt-1.5 min-w-[200px] overflow-hidden rounded-lg border border-line-hi bg-surface p-1 shadow-2xl shadow-black/60">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cx(
                "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors",
                o.value === value ? "bg-card-hi text-ink" : "text-ink-2 hover:bg-card-hi hover:text-ink",
              )}
            >
              <span className="truncate">{o.label}</span>
              {o.value === value && <Check size={13} className="shrink-0 text-brand-ink" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Breadcrumbs */

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 overflow-hidden">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} className="shrink-0 text-ink-4" />}
          {it.href && i < items.length - 1 ? (
            <Link
              href={it.href}
              className="mono shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-ink-2"
            >
              {it.label}
            </Link>
          ) : (
            <span
              className={cx(
                "mono truncate text-[11px] uppercase tracking-[0.1em]",
                i === items.length - 1 ? "text-ink-2" : "text-ink-3",
              )}
            >
              {it.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------- Empty & locked */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
      {icon && <div className="mb-4 text-ink-4">{icon}</div>}
      <p className="display text-[15px] text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-3">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Modal */

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  // Portalled to <body> so an animated (transformed) ancestor can't turn
  // `fixed` into "fixed to that ancestor" and push the dialog off-centre.
  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="animate-fade absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          "animate-rise relative w-full overflow-hidden rounded-xl border border-line-hi bg-surface shadow-2xl shadow-black/80",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
            <h2 className="display text-[16px] text-ink">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-ink-3 transition-colors hover:bg-card-hi hover:text-ink">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line bg-bg-sub px-5 py-3.5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ Stats */

export function StatTile({
  value,
  label,
  sub,
  accent,
}: {
  value: React.ReactNode;
  label: string;
  sub?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-card px-5 py-4.5">
      <div className={cx("display nums text-[25px] leading-none", accent ? "text-brand-ink" : "text-ink")}>{value}</div>
      <div className="eyebrow mt-2.5">{label}</div>
      {sub && <div className="mt-2.5">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------- Asset indicators */

export function AssetChips({
  video,
  notes,
  assignment,
  resources,
  className,
}: {
  video?: string;
  notes?: boolean;
  assignment?: boolean;
  resources?: number;
  className?: string;
}) {
  const item = "inline-flex items-center gap-1.5 text-[11px] text-ink-3";
  return (
    <div className={cx("flex flex-wrap items-center gap-x-3.5 gap-y-1", className)}>
      {video && (
        <span className={item}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden><rect x="0.5" y="1.5" width="11" height="9" rx="1.5" stroke="currentColor" /><path d="M5 4.5 8 6 5 7.5V4.5Z" fill="currentColor" /></svg>
          <span className="nums">{video}</span>
        </span>
      )}
      {notes && (
        <span className={item}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden><rect x="1.5" y="0.5" width="9" height="11" rx="1.5" stroke="currentColor" /><path d="M3.5 3.5h5M3.5 6h5M3.5 8.5h3" stroke="currentColor" strokeLinecap="round" /></svg>
          Notes
        </span>
      )}
      {assignment && (
        <span className={item}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2.5 1.5h7v9h-7z" stroke="currentColor" /><path d="M4.5 4.5h3M4.5 7h3" stroke="currentColor" strokeLinecap="round" /></svg>
          Assignment
        </span>
      )}
      {!!resources && (
        <span className={item}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M5 7a2 2 0 0 0 3 .3l1.5-1.5a2.1 2.1 0 0 0-3-3L5.7 3.6M7 5a2 2 0 0 0-3-.3L2.5 6.2a2.1 2.1 0 0 0 3 3L6.3 8.4" stroke="currentColor" strokeLinecap="round" /></svg>
          {resources} {resources === 1 ? "resource" : "resources"}
        </span>
      )}
    </div>
  );
}
