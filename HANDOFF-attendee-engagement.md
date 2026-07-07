# Handoff — Attendee Engagement prototype (Wordly Lab)

Native React prototype in **wordly-prototype** (Next.js 15 App Router, TS, Tailwind).
Feature: `src/features/attendee-engagement/`, route `/lab/attendee-engagement`
(chrome `standalone`). Live-translation attendee experience: streaming transcript +
"My Highlights" with one-tap save and 5 reactions (👍 Agree · 👎 Disagree · 💡 Insight ·
❓ Question · 📌 Save). Variants `?v=b1..b4` (first-run coaching; switch in ⌘K spotlight).

## The two-app model (IMPORTANT)

- **wordly-prototype (this repo) = THE DESIGN.** Source of truth for the engagement
  experience. Fast iteration, feedback board, Vercel previews.
- **wordly-attend = THE IMPLEMENTATION.** Joelle's React migration of Attend (based on
  present / `wordly_present`). The design is ported there as a fourth view tree
  (`?mode=engagement`) on the production provider stack — local branch
  `feat/engagement-view`, patches in `Repository/wordly-attend-handoff/`, analysis:
  Notion "Attend Handoff — Engagement on Production Logic".
- Rhythm: design changes land HERE first → validated with Justin/Graham → ported to
  wordly-attend. Shared atoms should graduate to `wordly-react-components-lib`.

## Workflow (IMPORTANT)

- Rapid prototyping; Deacon owns the repo. **Commit + push straight to `main`** (no PRs).
- commitlint: header ≤100 chars, type must be feat/fix/chore/etc (no `wip`). lint-staged
  runs prettier on commit.
- Prod: **https://wordly-prototype.vercel.app/lab/attendee-engagement** (auto-deploys
  from main, ~1–2 min). Ignore the `wordly-prototype-design` / `-storybook` Vercel checks
  (separate projects, always fail) — only `wordly-prototype` matters.
- Verify with Playwright headless vs `localhost:3000` (dev server runs). Take screenshots
  and READ them. Buttons with the iOS-haptic overlay need `click({force:true})` or raw
  `page.mouse` coords (an `<input switch>` intercepts pointer events).

## Product rules (don't regress)

- **No reaction wording anywhere** (icon + colour only) — localization. Corner chip is
  icon + chevron; rail is icons. aria-labels are fine.
- Reaction colours are distinct hues: Agree green · Disagree orange · Insight **amber** ·
  Question **violet** · Save **blue** (scoped tokens in `engagement.module.css`).
- Indicators must be indicative + accessible: state lives ON the control (e.g. TTS
  pulse on the audio toggle), never a floating/decorative adornment; respect
  `prefers-reduced-motion`; 44px touch targets on mobile (why the mobile picker is
  bigger than desktop — deliberate, don't "fix").
- Don't hardcode hex; use the feature-scoped CSS vars / DS tokens. Stay inside the
  feature folder (shared `src/shell|components|app/*` are owner-gated).

## Design-review round — CLOSED 2026-07-07

Notion board: https://app.notion.com/p/Prototype-Feedback-3914442e1fc6804086afca5e6da42ac3
**17 shipped + verified, 3 resolved-without-change** (flush panel — kept margin by
design call; native share-sheet title — OS-controlled; mobile picker size — 44px WCAG
floor). Highlights of the round:

- Expand/collapse chevron points in the **direction of the action** (up when
  collapsed/peek, down at full).
- My Highlights sorts **chronologically** (newest appended at bottom) + auto-scrolls.
- Language selector: **native language name** when collapsed; hover/pressed states
  match DS Figma 911-1868 (root cause: Radix portals the menu outside the feature
  `.root`, so scoped tokens must be re-declared on `SelectContent`; target
  `data-[highlighted]`, not `:focus`).
- **Mid-session language switch affects only later bubbles** (per-bubble caption
  language + direction → mixed LTR/RTL sessions).
- Reaction chip placement **unified** (corner icon+chevron chip on bubbles AND
  highlight cards); Question icon is a Lucide-style question mark.
- TTS "reading aloud" = animated live pulse **on the audio control** (a11y'd).
- Device-aware coaching copy (Click/Hover vs Tap/Long-press) + an **animated how-to
  loop** (`HowtoAnimation.tsx`) built from the real UI language, reduced-motion safe.
- Top fade is a pure gradient (no blur); `?demo=end` leaves ~5s to react.

## Still OPEN / pending

- **iOS long-press haptic**: a haptic the moment the rail renders on long-press doesn't
  fire on iOS (Safari gates mid-gesture Taptic on user activation). Options: pre-warm
  the pulse switch, fire from a real pointer event, or accept the release haptic.
- **Slack share to the team** — prototype + attend-demo URLs; draft prepared, Deacon to
  send when ready.

## Key files

- `EngagementApp.tsx` — responsive shell, detents/sheet, rail state, per-bubble language.
- `components/Transcript.tsx` — column-reverse streaming column (per-bubble dir).
- `components/TranscriptBubble.tsx` — bubble, save/react, long-press+swipe, corner chip.
- `components/HighlightsList.tsx` — cards, corner chip + inline picker, peek "+N more".
- `components/Header.tsx` — logo, language Select (DS states, native label), TTS pulse,
  ⋮ menu (Help/Settings/Leave).
- `components/HowtoAnimation.tsx` — the animated how-to loop (coach card).
- `components/Overlay.tsx` / `HelpSheet.tsx` / `SettingsSheet.tsx` / `ShareSheet.tsx` /
  `SessionEndedSheet.tsx` / `Coach.tsx` (device-aware copy).
- `data/languages.ts` (LANGS + RTL + wordly codes), `data/transcript*.ts` (en/ar/he +
  per-language accessors), `lib/reactions-data.ts` (ICON + REACT5), `lib/haptics.ts`,
  `lib/useTranscriptStream.ts`, `lib/useAttendStream.ts` (real /attend WS protocol),
  `lib/useHighlights.ts`, `engagement.module.css`.

## Gotcha

- A hydration mismatch from the **Grammarly** browser extension (`data-gr-*` on `<body>`)
  can wedge Fast-Refresh in a tab so changes "don't show". Fix: hard-refresh / incognito /
  disable Grammarly on localhost. The dev server serves the latest — verify with a clean
  Playwright browser before assuming a code problem.
