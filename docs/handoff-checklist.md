# Handoff Checklist

Fill this out before opening a PR to graduate a prototype to engineering.

## The prototype

- [ ] **Prototype name / app folder:** `apps/___________`
- [ ] **Question it was answering:** ___________
- [ ] **Validation signal:** (user session / internal demo / data / judgment call): ___________

## Code quality

- [ ] All components used exist in `packages/ui` with Storybook stories
- [ ] No local component one-offs inside the app folder
- [ ] Estimated production reusability: ___% (target ≥ 70%)
- [ ] TypeScript strict — no `any` types
- [ ] Tokens used from `@wordly/tokens` — no hardcoded hex values

## Engineering context

- [ ] PR description explains what the prototype was testing and what was learned
- [ ] Equivalent engineering Storybook component(s) identified: ___________
- [ ] Engineering contact identified:
  - React → Grace
  - Angular → Javier
  - Storybook / integration → Rob
  - Coordination → Jo (Justin to start async thread)

## Sharing

- [ ] Vercel preview URL included in the PR
- [ ] Storybook stories visible at the public Storybook URL
- [ ] Posted to Notion Wordly Lab page under the relevant project

## Sign-offs

- [ ] Deacon (code quality, DS alignment)
- [ ] Graham (user question answered, validation complete)
- [ ] Justin (scope right, graduation criteria met)
