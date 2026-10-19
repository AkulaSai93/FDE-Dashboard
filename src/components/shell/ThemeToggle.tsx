"use client";

import { Moon, Sun } from "lucide-react";
import { cx } from "@/lib/cx";
import { useTheme } from "@/state/theme";

/** Two-state switch in the topbar. Labelled for screen readers and reflects
 *  state through aria-pressed rather than icon alone. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cx(
        "flex size-9 items-center justify-center rounded-full border border-line bg-card text-ink-3 transition-colors hover:border-line-hi hover:text-ink",
        className,
      )}
    >
      {isDark ? <Moon size={15} strokeWidth={1.75} /> : <Sun size={15} strokeWidth={1.75} />}
    </button>
  );
}
