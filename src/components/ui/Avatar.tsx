import { hash } from "@/data/curriculum";
import { cx } from "@/lib/cx";

/* ============================================================================
 * AVATAR — deterministic gradient identicons.
 *
 * A flat grey circle with initials is the cheapest thing in a dark UI and it
 * looks it. These give every person a two-stop gradient derived from their
 * name, so a list of people carries colour and each face stays recognisable
 * across the product. Same name always yields the same gradient, on the server
 * and on the client.
 * ========================================================================= */

/** Harmonised pairs: saturated but all at a similar lightness, so no single
 *  avatar shouts louder than the rest of the list. */
const GRADIENTS: ReadonlyArray<[string, string]> = [
  ["#34d399", "#2563eb"], // mint → blue
  ["#f97316", "#db2777"], // orange → pink
  ["#60a5fa", "#7c3aed"], // sky → violet
  ["#fbbf24", "#f43f5e"], // amber → rose
  ["#2dd4bf", "#0ea5e9"], // teal → cyan
  ["#a78bfa", "#ec4899"], // violet → pink
  ["#4ade80", "#14b8a6"], // green → teal
  ["#fb7185", "#f59e0b"], // rose → amber
];

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  size = 32,
  initials,
  className,
  ring,
}: {
  name: string;
  size?: number;
  /** Override the derived initials (e.g. the data already carries them). */
  initials?: string;
  className?: string;
  /** Soft outline, for avatars sitting on a tinted row. */
  ring?: boolean;
}) {
  const [from, to] = GRADIENTS[hash(name) % GRADIENTS.length];
  const angle = 115 + (hash(name + "a") % 130);

  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-black/80",
        ring && "ring-2 ring-white/10",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
    >
      {initials ?? initialsOf(name)}
    </span>
  );
}
