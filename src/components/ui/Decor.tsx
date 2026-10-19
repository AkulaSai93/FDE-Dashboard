import { cx } from "@/lib/cx";

/* ============================================================================
 * DECOR — faint line-art behind page headers.
 *
 * Every page header gets a motif that belongs to its subject, drawn as hairline
 * strokes at very low opacity. It reads as texture rather than illustration:
 * close up you can tell it's a lightbulb, at a glance it just stops the top of
 * the page being an empty black band.
 *
 * Pure inline SVG with `currentColor` strokes — no image requests, no layout
 * cost, and it inherits whatever text colour the wrapper sets.
 * ========================================================================= */

export type DoodleVariant =
  | "ideas"      // curriculum, library — lightbulbs
  | "study"      // notes — books, atoms
  | "build"      // projects — blocks, tools
  | "award"      // certification — ribbons, stars
  | "people"     // community — figures, speech
  | "career";    // job portal — arrows, targets

/** Each variant is a set of <g> children drawn in a 400×200 viewBox. */
function paths(variant: DoodleVariant) {
  switch (variant) {
    case "ideas":
      return (
        <>
          <g transform="translate(40 52)">
            <path d="M22 44a22 22 0 1 1 22 0c-3 2-4 5-4 8h-14c0-3-1-6-4-8Z" />
            <path d="M29 60h12M31 66h8" />
            <path d="M33 10v-9M12 24l-7-5M54 24l7-5M10 44H2M64 44h-8" />
          </g>
          <g transform="translate(168 24) scale(0.72)">
            <path d="M22 44a22 22 0 1 1 22 0c-3 2-4 5-4 8h-14c0-3-1-6-4-8Z" />
            <path d="M29 60h12M31 66h8" />
          </g>
          <g transform="translate(272 70) scale(0.9)">
            <path d="M22 44a22 22 0 1 1 22 0c-3 2-4 5-4 8h-14c0-3-1-6-4-8Z" />
            <path d="M29 60h12" />
            <path d="M33 10v-7M13 25l-6-4M53 25l6-4" />
          </g>
          <path d="M120 150c18-14 36-14 54 0s36 14 54 0" />
        </>
      );
    case "study":
      return (
        <>
          <g transform="translate(36 56)">
            <path d="M4 12c16-8 32-8 44 0v56c-12-8-28-8-44 0V12Z" />
            <path d="M48 12c12-8 28-8 44 0v56c-16-8-32-8-44 0" />
            <path d="M48 12v56" />
          </g>
          <g transform="translate(206 40)">
            <circle cx="34" cy="34" r="7" />
            <ellipse cx="34" cy="34" rx="33" ry="13" />
            <ellipse cx="34" cy="34" rx="33" ry="13" transform="rotate(60 34 34)" />
            <ellipse cx="34" cy="34" rx="33" ry="13" transform="rotate(120 34 34)" />
          </g>
          <g transform="translate(316 96)">
            <path d="M0 26h40M8 14h24M12 38h16" />
          </g>
        </>
      );
    case "build":
      return (
        <>
          <g transform="translate(44 46)">
            <path d="M30 2 56 17v30L30 62 4 47V17L30 2Z" />
            <path d="M30 32 4 17M30 32l26-15M30 32v30" />
          </g>
          <g transform="translate(172 72) scale(0.8)">
            <path d="M30 2 56 17v30L30 62 4 47V17L30 2Z" />
            <path d="M30 32 4 17M30 32l26-15M30 32v30" />
          </g>
          <g transform="translate(288 38)">
            <rect x="2" y="2" width="38" height="38" rx="5" />
            <rect x="48" y="2" width="38" height="38" rx="5" />
            <rect x="25" y="52" width="38" height="38" rx="5" />
          </g>
        </>
      );
    case "award":
      return (
        <>
          <g transform="translate(48 40)">
            <circle cx="36" cy="34" r="26" />
            <path d="M22 58 14 96l22-12 22 12-8-38" />
            <path d="m36 20 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10Z" />
          </g>
          <g transform="translate(196 54) scale(0.75)">
            <path d="m36 20 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10Z" />
          </g>
          <g transform="translate(286 34)">
            <path d="M4 60c20-6 40-6 60 0M14 86c16-5 32-5 48 0" />
            <path d="m34 10 5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2 5-11Z" />
          </g>
        </>
      );
    case "people":
      return (
        <>
          <g transform="translate(44 48)">
            <circle cx="26" cy="20" r="13" />
            <path d="M4 68c0-13 10-23 22-23s22 10 22 23" />
          </g>
          <g transform="translate(112 62) scale(0.85)">
            <circle cx="26" cy="20" r="13" />
            <path d="M4 68c0-13 10-23 22-23s22 10 22 23" />
          </g>
          <g transform="translate(220 40)">
            <path d="M4 14a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H32L16 64V52h-4a8 8 0 0 1-8-8V14Z" />
            <path d="M22 24h36M22 36h22" />
          </g>
          <g transform="translate(320 96) scale(0.7)">
            <path d="M4 14a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H32L16 64V52h-4a8 8 0 0 1-8-8V14Z" />
          </g>
        </>
      );
    case "career":
      return (
        <>
          <g transform="translate(46 48)">
            <circle cx="36" cy="36" r="34" />
            <circle cx="36" cy="36" r="21" />
            <circle cx="36" cy="36" r="8" />
          </g>
          <g transform="translate(176 54)">
            <path d="M2 62 62 6M40 6h22v22" />
          </g>
          <g transform="translate(268 40)">
            <rect x="2" y="18" width="76" height="52" rx="6" />
            <path d="M28 18v-8a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v8M2 40h76" />
          </g>
        </>
      );
  }
}

/**
 * Decorative only — `aria-hidden`, never announced, never interactive.
 * Sits behind content; give the parent `relative` and the content `relative`.
 */
export function Doodles({
  variant,
  className,
}: {
  variant: DoodleVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute right-0 top-0 h-[190px] w-[400px] max-w-[62%] text-ink opacity-[0.055]",
        className,
      )}
    >
      {paths(variant)}
    </svg>
  );
}

/**
 * Page header with its motif behind it. Used at the top of every section page
 * so the pages feel related.
 */
export function PageHeader({
  eyebrow,
  title,
  sub,
  variant,
  action,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  variant: DoodleVariant;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden">
      <Doodles variant={variant} />
      <div className="relative flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0 max-w-2xl">
          {eyebrow && <div className="eyebrow mb-2.5">{eyebrow}</div>}
          <h1 className="display text-[30px] font-light leading-tight text-ink sm:text-[34px]">{title}</h1>
          {sub && <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{sub}</p>}
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
