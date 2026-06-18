# Centralized Design System — Migration Plan (Portal → wordly-prototype)

- **Status**: Proposed (awaiting review)
- **Date**: 2026-06-09
- **Owner**: Deacon Poon
- **Decision-log entry**: DEC-019
- **Goal**: Make `wordly-prototype` the single React source of truth for the Wordly
  design system, reproducing the production portal's component set so prototyping and
  engineering handoff share one library.

---

## 1. The decisive finding

The production portal (`wordly-inc/wordly_portal`, Angular 20) builds its **28 core
primitives on Spartan UI** (`@spartan-ng/brain` + `@spartan-ng/helm` — confirmed across
all 28 `libs/components/core/*` dirs; e.g. `wordly-button` wraps `BrnButtonImports`).

**Spartan UI is "shadcn/ui for Angular":** `brain` = headless behavior (the Radix
equivalent), `helm` = Tailwind-styled output (the shadcn equivalent). This repo already
uses shadcn/Radix (DEC-003) and ships ~18 of those same primitives in `@/components/ui/*`.

> **Portal and Lab are the same design system in two frameworks.** Reproducing the
> portal in React is a _transliteration between sibling libraries_ — same primitive
> names, same Tailwind class structure, same composition model — not a rewrite.

## 2. Approach decision: rebuild 1:1, do NOT render Angular in React

We evaluated embedding the real Angular components in React (via `@angular/elements`
Web Components, Webpack/Native Module Federation, or single-spa) versus rebuilding on
shadcn.

| Axis                                               | Render Angular in React                              | **Rebuild 1:1 on shadcn (chosen)** |
| -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| Ships Angular + zone.js runtime                    | Yes (~100KB+ baseline)                               | No                                 |
| Works with Next.js SSR / RSC                       | No — client-only custom elements, hydration mismatch | Yes — native                       |
| React forms / react-hook-form                      | No — CustomEvents, awkward bindings                  | Yes — native                       |
| Tailwind token theming                             | Fights Shadow-DOM encapsulation                      | Same token system                  |
| Needs the GCP private registry (currently blocked) | Yes — must build+publish Angular lib                 | No — source-only                   |
| Feeds the reusability flywheel                     | No — black-box wrappers                              | Yes — curatable React components   |

Render-in-React is the right tool for strangler-fig migration of a _running_ app you
can't rewrite. For a Next.js prototyping DS whose React twins largely already exist, it
is strictly worse. **Decision: rebuild 1:1 on shadcn/Radix.** A key consequence — because
this is source-only, the unresolved portal GCP Artifact Registry auth blocker does **not**
block this work.

## 3. Canonical tokens — Brand Blue `#017CFF`

Primary = Wordly **Brand Blue `#017CFF`** (per `.claude/CLAUDE.md`), encoded in the lab's
existing `src/components/ui/design-tokens.tsx` + Tailwind theme. This diverges from the
current prod portal primary (Teal `#128197`) — that gap is intentional and noted for
engineering at handoff. Supporting tokens: Action Teal `#1BC3E4`, Accent Green `#15B743`,
Navy `#0051A8`, Error `#E62D21`; Roboto type.

## 4. Phased plan

### Phase 0 — Tokens (gate)

Encode the Brand-Blue canonical palette + Roboto scale into `design-tokens.tsx` and
Tailwind config so every component below inherits it.

### Phase 1 — Parity sweep of existing primitives (theme + verify, not build)

~18 portal core primitives already exist in `@/components/ui/*`. Work = re-theme to
canonical tokens + diff each against the portal `.stories.ts` for variant/API parity.
Produces a per-component gap matrix.

### Phase 2 — Build net-new core primitives (~10)

combobox, date-range-picker, time-picker, chip / chip-input / chip-selector,
file-uploader, infinite-scroll, load-more, item, main-container (may map to existing
AppShell). Spec = portal source + stories.

### Phase 3 — Business composites (14)

The `wordly-*-selector` family etc. — pure compositions of Phase 1–2 primitives. Build
after core is stable.

### Phase 4 — Experience components (later)

Transcript / summary / participant pieces. Port from `wordly-react-components-lib`
(already React; MUI → shadcn restyle), NOT from Angular.

## 5. Per-component mapping

### Core (28) — portal `libs/components/core/*`

| Portal (Spartan)      | Lab `@/components/ui/*` status                        | Phase |
| --------------------- | ----------------------------------------------------- | ----- |
| button                | ✅ button.tsx                                         | 1     |
| input                 | ✅ input.tsx                                          | 1     |
| select                | ✅ select.tsx                                         | 1     |
| combobox              | ⚠️ build (command + popover)                          | 2     |
| checkbox              | ✅ checkbox.tsx                                       | 1     |
| radio-group           | ✅ radio-group.tsx                                    | 1     |
| tabs                  | ✅ tabs.tsx                                           | 1     |
| breadcrumb            | ✅ breadcrumb.tsx                                     | 1     |
| dialog                | ✅ dialog.tsx                                         | 1     |
| wordly-confirm-dialog | ✅ confirmation-dialog.tsx                            | 1     |
| card                  | ✅ card.tsx                                           | 1     |
| accordion             | ✅ accordion.tsx                                      | 1     |
| badge                 | ✅ badge.tsx                                          | 1     |
| alert                 | ✅ alert.tsx                                          | 1     |
| chip                  | ⚠️ build (badge + dismiss)                            | 2     |
| chip-input            | ⚠️ build                                              | 2     |
| chip-selector         | ⚠️ build                                              | 2     |
| table                 | ✅ table.tsx / data-table.tsx                         | 1     |
| date-picker           | ⚠️ partial (calendar / datetime-picker)               | 1/2   |
| date-range-picker     | ⚠️ build (calendar range)                             | 2     |
| time-picker           | ⚠️ partial (datetime-picker)                          | 2     |
| dropdown-menu         | ✅ dropdown-menu.tsx                                  | 1     |
| item                  | ⚠️ build (list-item primitive)                        | 2     |
| infinite-scroll       | ⚠️ build (hook; spec in docs/infinite-scroll-spec.md) | 2     |
| load-more             | ⚠️ build (trivial)                                    | 2     |
| file-uploader         | ⚠️ build                                              | 2     |
| icon                  | ✅ lucide (in use)                                    | 1     |
| main-container        | ⚠️ map to AppShell or build                           | 2     |

### Business (14) — portal `libs/components/business/*` → all Phase 3

account-selector, workspace-selector, locale-selector, language-selector,
voice-selector, transcript-selector, glossary-selector, timezone-selector,
room-selector, user-selector-dialog, workspace-manager, custom-fields, filter, api-key.
(Each composes combobox/command + data + business rules.)

### Experience (from `wordly-react-components-lib`, MUI) → Phase 4

Participant / ParticipantName / WordlyAvatar, transcript bubbles, published-summary
modules, branding/footer/logo. Restyle MUI → shadcn rather than rebuild from Angular.

## 6. Transliteration workflow (per component)

1. Read the portal `wordly-<name>.component.ts` + `.html`/`.scss` + the `.stories.ts`
   (Overview / ReactiveForms / BindingExamples).
2. Identify the Spartan `brain`/`helm` primitive it wraps → map to the Radix/shadcn twin.
3. Emit `@/components/ui/<name>.tsx` + `<name>.stories.tsx`, themed to canonical tokens.
4. Verify variants/props against the portal story matrix; surface anything net-new to
   Deacon for promotion into the shared library (the reusability flywheel).

## 7. Guardrails

- All work lands in `@/components/ui/*` / feature folders — owner-gated shared paths
  changed only via Deacon's review (CODEOWNERS).
- No private `@wordly`-scoped installs required; source-only reproduction.
- No hardcoded hex — tokens only.

## 8. Open items

- Resolve portal GCP Artifact Registry access (João) — needed only to _run_ the portal
  Storybook as a visual oracle; not a blocker for the rebuild.
- Decide whether the centralized lib stays in-app (`@/components/ui/*`, Track A) or also
  publishes to `packages/ui` (`@wordly/ui`, Track B) for `apps/*` reuse.
