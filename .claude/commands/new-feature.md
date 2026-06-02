# /new-feature — start a new prototype

Scaffold a new in-app prototype feature for a contributor.

## Steps

1. **Pick a semantic name.** Kebab-case, describing *what it is*, never a person's name
   (good: `attendee-highlights`, `session-recap`; bad: `justin-prototype`). Confirm with
   the user.

2. **Scaffold.** Run `npm run create-feature <name> [github-owner]`. This copies
   `src/features/_template/`, fills in id/title/owner, and regenerates the registry so the
   feature appears in the sidebar and at `/lab/<name>`.

3. **Choose chrome.** Edit `src/features/<name>/feature.config.ts`:
   - `chrome: "portal"` — admin/portal feature (renders in the dashboard shell).
   - `chrome: "standalone"` — attendee/public end-user experience (full-screen, no shell;
     add a "← Portal" link back to `/dashboard`).
   - Set `nav.group` / `nav.label` / `nav.icon` (a lucide-react icon name) for where it
     belongs in the sidebar.

4. **Build** inside `src/features/<name>/` only, reusing `@/components/ui/*` and brand
   tokens. Preview with `npm run dev` → `http://localhost:3000/lab/<name>`.

5. When ready, use `/ship`.

See `CLAUDE.md` → "Wordly Lab — Collaboration Architecture" for the full contract.
