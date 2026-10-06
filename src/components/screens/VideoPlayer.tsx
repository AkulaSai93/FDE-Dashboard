"use client";

import * as React from "react";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Check,
} from "lucide-react";
import { cx } from "@/components/ui";
import { formatDuration } from "@/data/curriculum";

/**
 * Dark video player.
 *
 * The programme's lessons live on YouTube, so this prototype ships the full
 * player chrome and progress model against a simulated clock rather than a
 * real media file. Swapping the clock for a <video> element means replacing
 * `tick` with `timeupdate` — the controls, progress reporting and completion
 * behaviour above it are unchanged.
 */
export function VideoPlayer({
  title,
  durationSeconds,
  position,
  onPosition,
  onEnded,
  completed,
}: {
  title: string;
  durationSeconds: number;
  position: number;
  onPosition: (seconds: number) => void;
  onEnded?: () => void;
  completed?: boolean;
}) {
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(0.8);
  const [full, setFull] = React.useState(false);
  const [scrub, setScrub] = React.useState<number | null>(null);
  const [chromeVisible, setChromeVisible] = React.useState(true);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const shown = scrub ?? position;
  const pct = (shown / durationSeconds) * 100;

  // Simulated playhead.
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = Math.min(durationSeconds, position + speed);
      onPosition(next);
      if (next >= durationSeconds) {
        setPlaying(false);
        onEnded?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [playing, position, speed, durationSeconds, onPosition, onEnded]);

  React.useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const nudgeChrome = () => {
    setChromeVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeVisible(false), 2600);
  };

  const seek = (clientX: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * durationSeconds);
  };

  const skip = (delta: number) =>
    onPosition(Math.min(durationSeconds, Math.max(0, position + delta)));

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else shellRef.current?.requestFullscreen?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") { e.preventDefault(); setPlaying((p) => !p); }
    if (e.key === "ArrowRight") { e.preventDefault(); skip(10); }
    if (e.key === "ArrowLeft") { e.preventDefault(); skip(-10); }
    if (e.key === "m") setMuted((m) => !m);
    if (e.key === "f") toggleFullscreen();
  };

  return (
    <div
      ref={shellRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={nudgeChrome}
      onMouseLeave={() => playing && setChromeVisible(false)}
      aria-label={`Video player: ${title}`}
      className="group/player relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black outline-none"
    >
      {/* Stage. A real deployment renders the <video>/embed here. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid-field absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(230,22,31,0.07),transparent_70%)]" />
        <div className="relative px-8 text-center">
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-ink-4">FDE Program · Lesson</p>
          <p className="display mt-3 max-w-xl text-[20px] leading-snug text-ink-2 sm:text-[24px]">{title}</p>
          {completed && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-[11px] text-brand-ink">
              <Check size={11} strokeWidth={3} /> Watched
            </p>
          )}
        </div>
      </div>

      {/* Big centre affordance when paused */}
      {!playing && (
        <button
          onClick={() => { setPlaying(true); nudgeChrome(); }}
          aria-label="Play"
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-black/60 transition-transform duration-200 hover:scale-105 active:scale-95">
            <Play size={24} fill="currentColor" strokeWidth={0} className="ml-1" />
          </span>
        </button>
      )}
      {playing && (
        <button onClick={() => setPlaying(false)} aria-label="Pause" className="absolute inset-0 z-10" />
      )}

      {/* Controls */}
      <div
        className={cx(
          "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/85 to-transparent px-3 pb-2.5 pt-10 transition-opacity duration-200 sm:px-4",
          chromeVisible || !playing ? "opacity-100" : "opacity-0 group-hover/player:opacity-100",
        )}
      >
        {/* Timeline */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={durationSeconds}
          aria-valuenow={Math.round(shown)}
          onMouseDown={(e) => { const el = e.currentTarget; setScrub(seek(e.clientX, el)); }}
          onMouseMove={(e) => scrub !== null && setScrub(seek(e.clientX, e.currentTarget))}
          onMouseUp={() => { if (scrub !== null) onPosition(scrub); setScrub(null); }}
          onMouseLeave={() => { if (scrub !== null) { onPosition(scrub); setScrub(null); } }}
          onClick={(e) => onPosition(seek(e.clientX, e.currentTarget))}
          className="group/bar relative -mx-1 cursor-pointer px-1 py-2"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/18 transition-[height] group-hover/bar:h-1.5">
            <div className="h-full rounded-full bg-brand transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
          <span
            className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-0 transition-opacity group-hover/bar:opacity-100"
            style={{ left: `calc(${pct}% )` }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="rounded p-1.5 text-white/85 transition-colors hover:text-white">
            {playing ? <Pause size={17} fill="currentColor" strokeWidth={0} /> : <Play size={17} fill="currentColor" strokeWidth={0} />}
          </button>
          <button onClick={() => skip(-10)} aria-label="Back 10 seconds" className="rounded p-1.5 text-white/70 transition-colors hover:text-white">
            <SkipBack size={15} />
          </button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds" className="rounded p-1.5 text-white/70 transition-colors hover:text-white">
            <SkipForward size={15} />
          </button>

          <div className="group/vol flex items-center gap-1.5">
            <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="rounded p-1.5 text-white/70 transition-colors hover:text-white">
              {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(+e.target.value); setMuted(+e.target.value === 0); }}
              aria-label="Volume"
              className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/25 opacity-0 transition-all duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100 [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          <span className="mono ml-1 select-none text-[11px] tabular-nums text-white/70">
            {formatDuration(Math.floor(shown))} <span className="text-white/35">/ {formatDuration(durationSeconds)}</span>
          </span>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSpeed((s) => ({ 0.75: 1, 1: 1.25, 1.25: 1.5, 1.5: 2, 2: 0.75 } as Record<number, number>)[s] ?? 1)}
              aria-label={`Playback speed ${speed}x`}
              className="mono rounded px-2 py-1 text-[11px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {speed}×
            </button>
            <button onClick={toggleFullscreen} aria-label={full ? "Exit fullscreen" : "Fullscreen"} className="rounded p-1.5 text-white/70 transition-colors hover:text-white">
              {full ? <Minimize size={15} /> : <Maximize size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
