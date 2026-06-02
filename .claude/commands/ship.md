# /ship — push a prototype and get a preview URL

Ship the current feature work for review. You (the agent) do all the Git steps; the
contributor just says "ship my feature."

## Steps

1. **Identify the feature.** Determine which `src/features/<name>/` is being worked on
   (from the conversation or recent changes). Confirm with the user if ambiguous.

2. **Check scope.** Look at `git status`. The changes should live inside that feature's
   folder. If anything outside it changed (`src/shell/`, `src/components/`, `packages/`,
   layout, globals), warn the user: those are owner-gated by `.github/CODEOWNERS` and
   will require Deacon's review on the PR.

3. **Branch.** If on `main` (or a shared branch), create/switch to
   `feat/<person>-<feature>` (e.g. `feat/justin-attendee-highlights`). Ask for the
   person's name/handle if unknown.

4. **Commit.** Stage the feature's files and commit with a clear message
   (`feat(<name>): <what changed>`). Keep commits scoped to the feature.

5. **Push & PR.** Push the branch and open (or update) a PR into `main` with `gh`:
   - Title: `feat(<name>): <summary>`
   - Body: what the prototype is, how to view it (`/lab/<name>`), and any shared-file
     touches that need review.

6. **Preview URL.** Vercel's Git integration auto-builds a **preview deployment** for the
   PR and posts the URL as a PR comment. Wait for it, then **paste the preview URL back
   in chat** so the contributor can share it. If it doesn't appear within a couple of
   minutes, check the PR checks / Vercel dashboard and report status.

## Notes
- End commit messages with the Co-Authored-By trailer per the global Git rules.
- Never force-push a shared branch. Never commit unrelated pre-existing changes — stage
  only the feature's files.
- This repo deploys via Vercel's GitHub integration; you normally don't need the `vercel`
  CLI. Use it only if asked for an ad-hoc preview.
