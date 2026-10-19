"use client";

import * as React from "react";

/* ============================================================================
 * THEME
 *
 * Dark is the default and the brand's native mode. The choice is explicit and
 * remembered — this deliberately does not follow prefers-color-scheme, so a
 * learner who picked light keeps light on a machine set to dark.
 *
 * The attribute is written to <html> by an inline script before first paint
 * (see ThemeScript), so there is never a flash of the wrong theme. React then
 * adopts whatever that script set rather than re-deciding.
 * ========================================================================= */

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "fde-lms:theme";

/**
 * Runs before paint, in <head>. Kept tiny and dependency-free on purpose: it
 * blocks rendering, so anything slow here is felt on every page load.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

interface Store {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = React.createContext<Store | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server-renders as the default; the effect below adopts what the inline
  // script already put on <html>, so markup matches on hydration either way.
  const [theme, setThemeState] = React.useState<Theme>("dark");

  React.useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (attr === "light" || attr === "dark") setThemeState(attr);
  }, []);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* private mode or blocked storage — the choice just won't persist */
    }
  }, []);

  const value = React.useMemo<Store>(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside <ThemeProvider>");
  return v;
}
