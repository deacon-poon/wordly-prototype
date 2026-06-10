/**
 * Conventional Commits, enforced via the Husky `commit-msg` hook.
 * Keeps a clean, scannable history: `type(scope): summary`
 *   e.g. feat(attendee-highlights): add one-tap react
 *        fix(events): correct session time zone
 *        docs(lab): clarify the four verbs
 *
 * Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
 * A few rules are relaxed so detailed, multi-line bodies (often written by the
 * agent) aren't rejected — we care about the trace, not pedantry.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Agents write descriptive bodies/footers — don't hard-wrap or block on length.
    "body-max-line-length": [0, "always"],
    "footer-max-line-length": [0, "always"],
    // Allow any-case subjects (e.g. proper nouns, file names, "Vercel").
    "subject-case": [0, "never"],
    // Subjects can run a little long for clarity.
    "header-max-length": [2, "always", 100],
  },
};
