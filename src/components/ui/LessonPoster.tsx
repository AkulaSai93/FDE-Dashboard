import { MODULE_BY_ID, PHASE_BY_ID, TOPIC_BY_ID, hash } from "@/data/curriculum";
import { cx } from "@/lib/cx";

/* ============================================================================
 * LESSON POSTER
 *
 * Thumbnails were stock video stills picked by a hash, so a lesson called
 * "Partitioning" could show "The Complete Python Course for Beginners". Any
 * placeholder image pool has that problem — the picture is never about the
 * lesson.
 *
 * This draws the poster from the lesson's own metadata instead: the module
 * code, the title, the phase. It is always correct, needs no network request,
 * and renders identically on the server and the client.
 *
 * Variation is by luminance and angle only, never hue — a grid of these still
 * has to obey the two-colour rule.
 *
 * When real lesson artwork exists, this becomes the fallback: render the image
 * and drop this in behind it as the poster.
 * ========================================================================= */

export function LessonPoster({
  topicId,
  className,
  /** Small rows (recent activity) only have room for the code. */
  compact,
}: {
  topicId: string;
  className?: string;
  compact?: boolean;
}) {
  const topic = TOPIC_BY_ID.get(topicId);
  const mod = topic ? MODULE_BY_ID.get(topic.moduleId) : undefined;
  const phase = topic ? PHASE_BY_ID.get(topic.phaseId) : undefined;

  const h = hash(topicId);
  const angle = 120 + (h % 110);          // 120°–230°
  const lift = 5 + (h % 7);               // 5%–11% highlight
  const originX = 18 + (hash(topicId + "x") % 64);
  const originY = 12 + (hash(topicId + "y") % 46);

  return (
    <span
      aria-hidden="true"
      className={cx("relative block h-full w-full overflow-hidden bg-[#0e1116]", className)}
    >
      {/* directional wash — the only thing that differs between lessons */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, rgba(255,255,255,${lift / 100}) 0%, rgba(255,255,255,0.015) 46%, rgba(0,0,0,0.3) 100%)`,
        }}
      />
      {/* hairline grid, as on the hero surfaces */}
      <span
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: compact ? "14px 14px" : "28px 28px",
        }}
      />
      {/* soft key light, placed per lesson so a grid doesn't look stamped */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(60% 70% at ${originX}% ${originY}%, rgba(255,255,255,0.07), transparent 70%)`,
        }}
      />

      {/* Deliberately no lesson title: every surface that uses a poster prints
          the title in its own caption, so repeating it here just doubled the
          text. The poster carries position only — which phase, which module. */}
      {compact ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="mono text-[12px] font-medium text-ink-3">{mod?.code ?? "FDE"}</span>
        </span>
      ) : (
        <span className="absolute inset-0 flex flex-col justify-between p-4">
          <span className="flex items-baseline justify-between gap-3">
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              Phase {phase?.code}
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-4">FDE</span>
          </span>
          <span className="display block text-[44px] font-light leading-none text-white/[0.16]">
            {mod?.code}
          </span>
        </span>
      )}
    </span>
  );
}
