"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { cx } from "./index";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  tone?: "default" | "success";
}

const Ctx = React.createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);

  const push = React.useCallback((t: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((all) => [...all.slice(-2), { ...t, id }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 5200);
  }, []);

  const dismiss = (id: number) => setToasts((all) => all.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-200 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast pointer-events-auto flex items-start gap-3 rounded-lg border border-line-hi bg-surface p-3.5 shadow-2xl shadow-black/70"
          >
            <span
              className={cx(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                t.tone === "success" ? "bg-brand text-white" : "bg-card-hi text-ink-2",
              )}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[12px] leading-snug text-ink-3">{t.description}</p>}
              {t.action && (
                <Link
                  href={t.action.href}
                  className="mt-2 inline-block text-[12px] font-medium text-brand-ink transition-colors hover:text-brand-hi"
                >
                  {t.action.label} →
                </Link>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="rounded p-0.5 text-ink-4 transition-colors hover:text-ink-2"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
}
