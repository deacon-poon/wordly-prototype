# Angular Frontend Clone — Architecture

> **📍 See [`frontend-architecture.md`](./frontend-architecture.md) for the current,
> authoritative guide** (the legacy/rebrand chrome swap, URLs, how to add screens).
> This file is the original planning doc / port inventory and is kept for history.

> Goal: a **1:1 code copy of the Angular portal frontend** inside this prototype,
> for **code-based design handoff** (replacing Figma handoff). Same fidelity rule
> as the Design-System / Storybook effort: exact copies of the Angular UI + stories,
> pulled from real source (`wordly_portal@origin/main`), not bespoke rebuilds.
>
> **Scope order:** start with the **workspace** surface, then expand outward.

## Source of truth

`wordly_portal` @ `origin/main`. Always `git pull --ff-only origin main` before porting.
Each ported file documents its exact Angular origin path in a header comment (same
convention as `workspace-manager.tsx`).

## The composability requirement

Two things must be independently swappable:

1. **Site navigation (chrome)** — today's deployed Angular nav (`app-navigator`) is the
   _legacy_ nav; the prototype's existing rebrand sidebar is the _rebrand_ nav. We must be
   able to swap one for the other without touching page content.
2. **Page content / containers** — every screen must render under _either_ nav unchanged
   ("importable both ways"). No page imports a nav.

## Layered architecture

```
src/legacy/                              ← self-contained 1:1 Angular clone (mirrors portal tree)
├── models/navigator.ts                  Navigator / NavigatorSection / AccessType
├── services/nav-context.tsx             mock NavContext (role, isSSO, isSharedWorkspace, flags)
└── components/
    ├── navigator/   LegacyNav.tsx + legacy-nav.module.css + nav-data.ts + stories
    │                 (1:1 of navigator.component.*)
    ├── header/      LegacyHeader.tsx + legacy-header.module.css
    │                 (1:1 of header.component.*: centered logo + user cluster)
    └── shell/       LegacyShell.tsx + legacy-shell.module.css
                      (1:1 of app.component.*: 210px nav + 70px header bar + route-content)

src/components/site-nav/SiteNav.tsx      ← holds SITE_NAV_VARIANT flag (legacy | rebrand)
src/components/layouts/AppShellProvider   ← swaps whole shell: LegacyShell vs AppShell
src/app/<route>/page.tsx                  ← chrome-agnostic pages (render in either shell)
```

**Separate legacy layout.** Legacy is a full self-contained shell (nav + header +
content column), NOT the rebrand AppShell with a swapped sidebar. `AppShellProvider`
picks `LegacyShell` when `SITE_NAV_VARIANT === "legacy"`. Page content is unchanged
and renders in either shell.

**Layout spec (app.component):** nav column **210px**; main-content = remainder; a
**70px** `page-background` bar (primary, swapped to `#017CFF`) behind the header; the
nav's blue `.header-icon` block lines up with it to form one continuous top strip;
the centered white logo lives in the header (the nav's own logo is hidden, per Angular).

**Three layers, cleanly separated:**

- **Data** (`model` + `nav-data`) — one source of nav truth; add a nav item once → both navs show it.
- **Chrome** (`legacy/` vs `rebrand/`) — two renderers over that data. Swap = one flag.
- **Content** (route pages) — nav-agnostic. `AppShell({ sidebar })` already slots the chrome.

## 1:1 token map (deployed Angular nav → rebranded)

Structure/layout is 1:1 with the deployed Angular nav, but **`$primary` is swapped from
the deployed teal `#128197` → our rebrand blue `#017CFF`** (`primary-blue-400`). This is
the only intentional deviation from the Angular source; everything else is exact.

| SCSS var                 | Deployed             | **Use in clone**        | Purpose               |
| ------------------------ | -------------------- | ----------------------- | --------------------- |
| `$primary` / `$teal-500` | `#128197`            | **`#017CFF`** (swapped) | active item bg + icon |
| `$gray-100`              | `#eef0f2`            | hover bg                |
| `$gray-300`              | `#cdd2d7`            | nav right border        |
| `$gray-600`              | `#495057`            | "Workspace:" label      |
| `$orange-700`            | `#c2410c`            | badge bg                |
| `$header-height`         | `70px`               | logo header             |
| breakpoints              | md `768` / lg `1024` | responsive              |

## Workspace surface — port inventory

| Angular source                                     | Type                         | Status                      |
| -------------------------------------------------- | ---------------------------- | --------------------------- |
| `components/navigator/`                            | Site nav                     | ⏳ Phase 1–2                |
| `libs/.../wordly-workspace-manager/`               | combobox + create dialog     | ✅ `workspace-manager.tsx`  |
| `libs/.../wordly-workspace-selector/`              | selector                     | ✅ `workspace-selector.tsx` |
| `modules/v2/workspace-users/`                      | screen `/workspace-users`    | ⏳                          |
| `modules/v2/sessions-default/`                     | screen `/wssessions-default` | ⏳                          |
| `services/v2/workspaces/` + `models/v2/workspace/` | state + model                | ⏳ (mock-driven)            |

> **Edit/Delete Workspace does not exist in Angular** — net-new design, built on the
> faithful clone once the above is in place ([WS] Edit & Delete Workspaces ticket).

## Phases

| Phase | Deliverable                                                 | State |
| ----- | ----------------------------------------------------------- | ----- |
| 1     | `model.ts` + `nav-data.ts` + `nav-context.tsx`              | ✅    |
| 2     | `legacy/LegacyNav.tsx` + css module + story (exact 1:1)     | ✅    |
| 3     | `RebrandNav` refactor onto model; `SiteNav` switch; stories |       |
| 4     | Verify every page renders identically under both navs       |       |
| 5     | Port workspace screens (workspace-users, sessions-default)  |       |
| 6     | Design [WS] Edit & Delete Workspaces on top                 |       |
