"use client";

import { cx } from "@/components/ui";
import type { Note } from "@/lib/notes";
import { Info } from "lucide-react";

/** Premium developer-documentation reading experience. Dark, measured line
 *  length, generous leading, no decoration that isn't carrying information. */
export function NoteReader({ note, className }: { note: Note; className?: string }) {
  return (
    <article className={cx("max-w-[68ch]", className)}>
      {note.blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return (
              <h2 key={i} className="display mt-9 mb-3 text-[17px] text-ink first:mt-0">
                {b.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="mb-4 text-[14px] leading-[1.75] text-ink-2">
                {b.text}
              </p>
            );
          case "bullets":
            return (
              <ul key={i} className="mb-5 space-y-2">
                {b.items!.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[14px] leading-[1.7] text-ink-2">
                    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brand" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <div key={i} className="mb-5 overflow-hidden rounded-lg border border-line bg-bg-sub">
                <div className="flex items-center justify-between border-b border-line px-3.5 py-2">
                  <span className="mono text-[10px] uppercase tracking-[0.1em] text-ink-3">{b.lang}</span>
                  <span className="flex gap-1">
                    <span className="size-1.5 rounded-full bg-[#242424]" />
                    <span className="size-1.5 rounded-full bg-[#242424]" />
                    <span className="size-1.5 rounded-full bg-[#242424]" />
                  </span>
                </div>
                <pre className="overflow-x-auto px-3.5 py-3.5">
                  <code className="mono text-[12.5px] leading-[1.7] text-ink-2">{b.text}</code>
                </pre>
              </div>
            );
          case "callout":
            return (
              <div key={i} className="mb-5 flex gap-3 rounded-lg border border-brand/25 bg-brand/6 px-4 py-3.5">
                <Info size={15} className="mt-0.5 shrink-0 text-brand-ink" />
                <p className="text-[13.5px] leading-[1.7] text-ink-2">{b.text}</p>
              </div>
            );
          case "table":
            return (
              <div key={i} className="mb-5 overflow-hidden rounded-lg border border-line">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    {b.rows!.map(([k, v], j) => (
                      <tr key={j} className="border-b border-line last:border-0">
                        <th scope="row" className="w-[34%] bg-bg-sub px-3.5 py-3 align-top text-[12px] font-medium text-ink-2">
                          {k}
                        </th>
                        <td className="px-3.5 py-3 align-top text-[13px] leading-relaxed text-ink-2">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
