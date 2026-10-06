# FDE Learning Platform

The post-purchase LMS for the **AI Forward Deployed Engineer** program by upGrad School of
Technology — what a learner sees after the ₹99 unlock on
[fdelandingpage.vercel.app](https://fdelandingpage.vercel.app).

It is a continuation of that site, not a second product: same near-black surfaces, same FDE red,
same Urbanist + Inter type stack. **Dark theme only** — there is no light mode, no theme switcher
and no `prefers-color-scheme` branch anywhere in the codebase.

```bash
npm install
npm run dev     # http://localhost:3100
npm run build
```

---

## Screens

| Route | Screen | Notes |
|---|---|---|
| `/unlocked` | Payment hand-off | The bridge from the ₹99 modal into the platform |
| `/dashboard` | Dashboard | Continue Learning, stats, current phase, activity, up next |
| `/journey` | My Journey | Vertical roadmap across all 9 phases |
| `/curriculum` | Curriculum | **Source of truth** — phase → module → topic, search + filters |
| `/learn/[topicId]` | Learning workspace | Player, Overview / Notes / Resources / Assignment, module nav |
| `/videos` | Videos | Flat index of all 371 lessons |
| `/notes`, `/notes/[topicId]` | Notes | Browse by phase/module; documentation-style reader |
| `/assignments` | Assignments | Lab board with status, difficulty, phase filters |
| `/projects`, `/projects/[id]` | Projects | Portfolio with Research → Build → Deploy → Document stages |
| `/certification` | Certification | Locked certificate + requirements; unlocks at 100% |
| `/community` | Community | Discussions, events, announcements |
| `/jobs` | Job Portal | **Locked by design** — visible, aspirational, progress-driven |
| `/settings`, `/help` | Settings, Help | Preferences, FAQ, shortcuts |

The sidebar is persistent across all of them. On mobile it becomes a drawer plus a four-item
bottom bar (Dashboard / Journey / Curriculum / Projects).

---

## Design system

All tokens live in [`src/app/globals.css`](src/app/globals.css) under Tailwind v4's `@theme`.
Nothing in the product hardcodes a hex value outside that file.

**Surfaces** — `bg #050505` · `bg-sub #080808` · `surface #0D0D0D` · `card #111111` ·
`card-hi #141414` · `card-hi2 #191919`
**Borders** — `line #222222` · `line-hi #292929` · `line-soft #1A1A1A`
**Text** — `ink #FFFFFF` · `ink-2 #A1A1A1` · `ink-3 #666666` · `ink-4 #3D3D3D`
**Brand** — `brand #E6161F` (taken from the landing page) · `brand-hi #F23A42` ·
`brand-lo #B81118` · `brand-ink #FF6B71` (red text that stays legible on dark)

Red is an accent, never a background. It appears on the primary CTA, the active-nav indicator
bar, progress fills, completion marks, focus rings and selected states — and nowhere else. The
only red *fields* in the product are three `brand-wash` radial gradients (Continue Learning,
certificate, job-portal lock), each under 13% opacity.

**Type** — Urbanist for display (`display` utility), Inter for body, system mono for the small
uppercase `eyebrow` labels and all numerics (`nums` → tabular figures, so progress numbers don't
jitter as they animate).

**Primitives** — [`src/components/ui/index.tsx`](src/components/ui/index.tsx): `Button`,
`ButtonLink`, `Card`, `SectionHeading`, `ProgressBar`, `SegmentedProgress`, `ProgressRing`,
`StatusBadge`, `StatusDot`, `Badge`, `Tabs`, `FilterChips`, `Dropdown`, `Breadcrumbs`,
`EmptyState`, `Modal`, `StatTile`, `AssetChips`. Toasts live in
[`ui/toast.tsx`](src/components/ui/toast.tsx).

**Status system** — one vocabulary everywhere: `completed · in-progress · not-started ·
upcoming · locked · submitted · evaluated · review`. `StatusBadge` and `StatusDot` render it, so
a topic row, a module header, a phase card and an assignment card all read the same way.

---

## Data & progress model

```
User → Program → Phase → Module → Topic → { video, notes, resources, assignment }
```

[`src/data/curriculum.ts`](src/data/curriculum.ts) is the curriculum. Every phase, module and
topic name is transcribed verbatim from the landing page — **9 phases, 47 modules, 371 topics**.
Nothing is invented.

Per-topic assets (video length, resources, which topics carry a lab) aren't published on the
marketing site, so they're derived deterministically from the topic id via an FNV-1a hash. That
keeps server and client markup identical, and makes `deriveAssets` the single function to replace
with a real API response. Seven marquee labs have hand-written briefs in `ASSIGNMENT_OVERRIDES`.

[`src/state/progress.tsx`](src/state/progress.tsx) holds learner state. Two rules:

1. **Only topic state is stored.** Module, phase and program progress are always *derived*
   (`useRollups`), so no two screens can disagree about a number.
2. **One dial controls the whole product.** `SEED_COMPLETED_TOPICS = 237` puts the learner at
   **64%** — Phases 01–06 complete, Phase 07 (System Design at Scale) in progress on
   *Partitioning*. That single constant drives the dashboard, the roadmap, certificate
   eligibility (6/9 phases) and the Job Portal lock. Move it and everything follows.

Progress persists to `localStorage` under `fde-lms:progress:v1`, rehydrated in an effect so the
first paint always matches the server.

> The brief's example screens used 64% alongside "Phase 02" and "6/9 phases completed". Those
> can't both be true of one learner, so the seed honours the headline numbers (64%, 6 of 9
> phases) and the current phase follows from them.

### Swapping in a backend

- `GET /me/progress` → replace `seed()` in `src/state/progress.tsx`
- `GET /curriculum` → replace `build()` and `deriveAssets()` in `src/data/curriculum.ts`
- `GET /topics/:id/notes` → replace `buildNote()` in `src/lib/notes.ts`
- `PATCH /me/topics/:id` → the store's `patch()` is already the single write path

No component reads anything but these, and no component stores derived state.

---

## Implementation notes

- **The video player** ([`VideoPlayer.tsx`](src/components/screens/VideoPlayer.tsx)) ships the
  full chrome — timeline scrub, 0.75×–2× speed, volume, fullscreen, keyboard (`space`/`k`,
  `←`/`→`, `m`, `f`) — against a simulated clock, because the lessons live on YouTube. Swapping
  the `setInterval` for a `<video>` `timeupdate` listener is the whole change; completion
  reporting and progress roll-up sit above it already.
- **Notes** are generated per topic by `buildNote()` so all 371 topics have a complete,
  well-shaped document rather than a handful of real ones and 364 empty states.
- **Curriculum deep links** — `/curriculum?phase=p-07&module=m-7.2` opens and scrolls to that
  node. The dashboard, journey and ⌘K search all use it.
- **Search** is ⌘K / Ctrl+K anywhere, over pages, phases, modules and all 371 topics.
- **Accessibility** — `aria-current` on nav, `role="tablist"`/`"progressbar"`/`"switch"`,
  focus-visible rings, `prefers-reduced-motion` honoured globally. One known trade-off: the
  specified muted grey `#666666` on `#111111` is ~3.4:1, below WCAG AA for small text. It's only
  used on secondary metadata; raising `--color-ink-3` to `#767676` clears AA in one line without
  changing the design's character.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.
`npm run build` prerenders 765 static pages — the whole curriculum, every lesson and every note.
