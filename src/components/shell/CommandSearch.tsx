"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { ALL_MODULES, ALL_TOPICS, MODULE_BY_ID, PHASES, PHASE_BY_ID, formatMinutes } from "@/data/curriculum";
import { ALL_NAV_ITEMS } from "./nav";
import { cx, StatusDot } from "@/components/ui";
import { useProgress } from "@/state/progress";

interface Hit {
  id: string;
  href: string;
  title: string;
  context: string;
  kind: "topic" | "module" | "phase" | "page";
  meta?: string;
}

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  // Cursor is stored with the query it belongs to, so a new query starts at the
  // first hit without a second render to correct it.
  const [cursorState, setCursorState] = React.useState<{ q: string; i: number }>({ q: "", i: 0 });
  const cursor = cursorState.q === q ? cursorState.i : 0;
  const setCursor = (fn: number | ((c: number) => number)) =>
    setCursorState({ q, i: typeof fn === "function" ? fn(cursor) : fn });

  const openSearch = React.useCallback(() => {
    setQ("");
    setCursorState({ q: "", i: 0 });
    setOpen(true);
  }, []);

  // The global shortcut listener is bound once; a ref keeps it reading the
  // current open state without rebinding on every toggle.
  const openRef = React.useRef(open);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);
  const router = useRouter();
  const { topics } = useProgress();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else openSearch();
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSearch]);

  React.useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const hits = React.useMemo<Hit[]>(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      return ALL_NAV_ITEMS.filter((n) => !n.locked)
        .slice(0, 7)
        .map((n) => ({ id: n.href, href: n.href, title: n.label, context: "Go to", kind: "page" as const }));
    }
    const out: Hit[] = [];
    for (const n of ALL_NAV_ITEMS) {
      if (n.label.toLowerCase().includes(needle)) out.push({ id: n.href, href: n.href, title: n.label, context: "Go to", kind: "page" });
    }
    for (const p of PHASES) {
      if (p.title.toLowerCase().includes(needle))
        out.push({ id: p.id, href: `/curriculum?phase=${p.id}`, title: p.title, context: `Phase ${p.code}`, kind: "phase" });
    }
    for (const m of ALL_MODULES) {
      if (m.title.toLowerCase().includes(needle)) {
        const p = PHASE_BY_ID.get(m.phaseId)!;
        out.push({ id: m.id, href: `/curriculum?phase=${p.id}&module=${m.id}`, title: m.title, context: `Phase ${p.code} · Module ${m.code}`, kind: "module" });
      }
    }
    for (const t of ALL_TOPICS) {
      if (t.title.toLowerCase().includes(needle)) {
        const m = MODULE_BY_ID.get(t.moduleId)!;
        const p = PHASE_BY_ID.get(t.phaseId)!;
        out.push({
          id: t.id,
          href: `/learn/${t.id}`,
          title: t.title,
          context: `Phase ${p.code} · ${m.title}`,
          kind: "topic",
          meta: formatMinutes(t.videoSeconds),
        });
      }
    }
    return out.slice(0, 30);
  }, [q]);

  const go = (h: Hit) => {
    setOpen(false);
    router.push(h.href);
  };

  return (
    <>
      <button
        onClick={openSearch}
        className="flex h-8.5 items-center gap-2 rounded-md border border-line bg-card px-2.5 text-[13px] text-ink-3 transition-colors hover:border-line-hi hover:text-ink-2 md:w-64 md:justify-between"
      >
        <span className="flex items-center gap-2">
          <Search size={14} />
          <span className="hidden md:inline">Search the programme…</span>
        </span>
        <kbd className="mono hidden rounded border border-line-hi bg-bg-sub px-1.5 py-0.5 text-[10px] text-ink-3 md:inline">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[12vh]">
          <div className="animate-fade absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="animate-rise relative flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line-hi bg-surface shadow-2xl shadow-black/80"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={15} className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, hits.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
                  if (e.key === "Enter" && hits[cursor]) { e.preventDefault(); go(hits[cursor]); }
                }}
                placeholder="Search phases, modules and topics…"
                className="h-12 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-4"
              />
              <kbd className="mono rounded border border-line-hi bg-bg-sub px-1.5 py-0.5 text-[10px] text-ink-3">ESC</kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-1.5">
              {hits.length === 0 ? (
                <p className="px-3 py-10 text-center text-[13px] text-ink-3">
                  Nothing matches “{q}”. Try a module or topic name.
                </p>
              ) : (
                hits.map((h, i) => (
                  <button
                    key={h.kind + h.id}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(h)}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                      i === cursor ? "bg-card-hi" : "hover:bg-card",
                    )}
                  >
                    {h.kind === "topic" ? (
                      <StatusDot status={topics[h.id]?.status ?? "not-started"} size={14} />
                    ) : (
                      <span className="mono w-[14px] shrink-0 text-center text-[9px] uppercase text-ink-4">
                        {h.kind === "page" ? "→" : h.kind === "phase" ? "P" : "M"}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{h.title}</span>
                      <span className="mono block truncate text-[10px] uppercase tracking-[0.08em] text-ink-3">{h.context}</span>
                    </span>
                    {h.meta && <span className="nums shrink-0 text-[11px] text-ink-3">{h.meta}</span>}
                    {i === cursor && <CornerDownLeft size={12} className="shrink-0 text-ink-4" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
