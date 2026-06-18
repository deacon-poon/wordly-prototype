# Frontend Architecture — Legacy & Rebrand Chrome

> **For agents and prototype creators.** This repo runs **two interchangeable app
> frontends ("chrome") over one shared set of pages**:
>
> - **`legacy`** — a 1:1 code clone of the **deployed Angular portal** (`wordly_portal`).
> - **`rebrand`** — the **new design** (the prototype's original sidebar/shell).
>
> Same URLs, same page content. You switch the frontend at runtime. The page body
> ("container") is chrome-agnostic — it renders inside whichever wrapper is active.

---

## 1. Switching between the two frontends

There is **no separate URL per frontend** — both live at the same routes. The active
chrome is resolved on load as: **`?chrome=` URL param → `localStorage` → default (`legacy`)**.

| Action                  | How                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Default                 | `legacy` (the deployed-portal clone)                                                                                                           |
| Pin a link to a version | `?chrome=legacy` or `?chrome=rebrand` — e.g. `/workspace/settings?chrome=rebrand`. The param wins and **persists** (sticky across navigation). |
| Toggle live             | Bottom-right **`Legacy / Rebrand`** switcher                                                                                                   |
| Change the default      | `DEFAULT_CHROME` in `src/components/chrome/chrome-context.tsx`                                                                                 |

Examples:

- `http://localhost:3000/dashboard` → legacy
- `http://localhost:3000/dashboard?chrome=rebrand` → rebrand
- `http://localhost:3000/workspace/settings?chrome=legacy` → legacy

> One-at-a-time per tab (it's a setting, not a path). Genuine side-by-side would need
> a path prefix like `/legacy/*` — not built; ask if you need it.

---

## 2. File map

```
src/components/chrome/                 ← the version-control seam
  chrome-context.tsx     ChromeProvider + useChrome — resolves ?chrome → localStorage → default
  shell-registry.tsx     SHELLS = { legacy: LegacyShell, rebrand: RebrandShell }
  ChromeSwitcher.tsx     live dev toggle (bottom-right)

src/components/layouts/                ← rebrand chrome + the swap host
  app-shell-context.tsx  shared right-panel context (its own module → no circular import)
  AppShellProvider.tsx   resolves chrome → renders SHELLS[chrome]({children})
  RebrandShell.tsx       rebrand app-layout wrapper — takes {children}
  AppShell / AppSidebar / AppHeader   rebrand pieces

src/legacy/                            ← legacy chrome (self-contained 1:1 Angular clone)
  models/navigator.ts                  Navigator / NavigatorSection / AccessType
  services/nav-context.tsx             mock for keycloak/feature/workspace DI
  components/
    navigator/  LegacyNav + legacy-nav.module.css + nav-data.ts + stories
    header/     LegacyHeader + legacy-header.module.css
    shell/      LegacyShell + legacy-shell.module.css   ← legacy app-layout wrapper, takes {children}

src/app/<route>/page.tsx               ← chrome-agnostic pages (the shared container)
src/app/not-found.tsx                  ← graceful "screen not ported yet" placeholder
```

**The swap, in one line:** `AppShellProvider` reads `useChrome()` and renders
`SHELLS[chrome]({children})`. Both shells take only `{children}`, so the page is
identical across versions. **Add a new chrome** = new `*Shell.tsx` wrapper +
one `shell-registry` entry + add to the `ChromeVariant` union and switcher.

---

## 3. How to add a screen (creators & agents)

1. Create a normal Next route: `src/app/<path>/page.tsx` with `"use client"` and a default export.
   It renders inside whichever chrome is active — **don't import any nav/header/shell**.
2. **Reuse shared UI**: `@/components/ui/*` (ShadCN atoms) and the ported workspace
   components in `@/components/workspace/*` (selectors, dialogs, `MainContainer`, etc.).
3. **For legacy parity, use the Angular route path 1:1** (e.g. `/workspace-users`,
   `/wssessions-default`) so the legacy nav links resolve.
4. Unported routes automatically show the **graceful placeholder** (`src/app/not-found.tsx`)
   inside the active shell — no bare 404s.

> Both wrappers expose the same page area, so a screen built once works under legacy
> and rebrand. Only difference: the rebrand `AppShell` has a resizable right panel
> (`useAppShell().openRightPanel`); legacy ignores it.

---

## 4. Legacy clone — fidelity rules & spec

Source of truth: **`wordly_portal` @ `origin/main`** (`git pull --ff-only origin main`
before porting). Each ported file documents its exact Angular origin in a header comment.

**Only intentional deviation:** the deployed `$primary` teal `#128197` is swapped to the
rebrand blue **`#017CFF`** everywhere. Everything else is 1:1.

| Element             | Spec (measured from deployed portal)                                                         |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Nav column width    | **210px** (`app.component.scss`)                                                             |
| Header bar height   | **70px** (`page-background`, primary color)                                                  |
| **Nav item height** | **53.5px** — `padding: 8px 0` + a `font-size: 25px × line-height 1.5 = 37.5px` icon line box |
| Nav icon            | lucide default **24px**                                                                      |
| Active item         | full primary-blue bg, white icon/label                                                       |

> ⚠️ **Gotcha (don't regress):** Tailwind preflight sets `svg { display: block }`,
> which removes the icon from its line box and collapses nav items to 40px. The legacy
> nav forces `.lucid-icon { display: inline-block }` so the 37.5px line box (→ 53.5px row)
> forms. See the comment in `legacy-nav.module.css`.

Angular DI (keycloak, i18next, services) is dropped in every port — data is mock state
driven by `src/legacy/services/nav-context.tsx` (toggle persona/feature flags there).

---

## 5. Verify visually (don't trust compile alone)

Playwright + chromium are installed. Screenshot any route/element:

```bash
node scripts/shot.mjs <url> <out.png> [width] [height] [css-selector]
# e.g.
node scripts/shot.mjs http://localhost:3000/dashboard /tmp/d.png 1440 900
node scripts/shot.mjs http://localhost:3000/dashboard /tmp/nav.png 1440 900 "[class*='dynamic-nav']"
```

`scripts/measure.mjs` reports nav item/icon dimensions; `scripts/console.mjs <url>`
captures console errors/warnings (catches hydration bugs).

---

## 6. Status — port inventory

| Item                                                   | Status                      |
| ------------------------------------------------------ | --------------------------- |
| Legacy site nav (`navigator`)                          | ✅ 1:1                      |
| Legacy header (`header`)                               | ✅ 1:1                      |
| Legacy shell (`app.component`)                         | ✅ 1:1                      |
| Chrome swap (param + registry + switcher)              | ✅                          |
| `/workspace/settings` — edit & delete (net-new design) | ✅                          |
| `/workspace-users`                                     | ✅ 1:1                      |
| `/wssessions-default` (Session Defaults)               | ✅ 1:1                      |
| Other nav targets (usage, accounts, org-usage, admin…) | ⏳ placeholder until ported |

Related: `docs/clone-architecture.md` (original plan), `docs/decision.md` (decision log).
