# Attendee Engagement — accessibility gate

A zero-dependency WCAG 2.1 AA audit, kept deliberately separate from the UI so it
can gate changes without being entangled in them.

```bash
node src/features/attendee-engagement/a11y/gate.mjs          # human report, exits 1 on any violation
node src/features/attendee-engagement/a11y/gate.mjs --json   # machine-readable
```

## What it checks

| Category     | Rule                              | Threshold                                                                       |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------- |
| `contrast`   | WCAG 1.4.3 text · 1.4.11 non-text | 4.5:1 text, 3:1 large text & icons/UI                                           |
| `target`     | WCAG 2.5.5 touch target           | ≥ 44×44 px (2.5.8's hard floor is 24; we hold 44 for a touch-first attendee UI) |
| `legibility` | project rule layered on WCAG      | body ≥ 15px, secondary ≥ 13px                                                   |

## How it stays honest

- **Colours are measured live.** The gate resolves every token from
  `engagement.module.css` and computes real contrast ratios — change a token to a
  weaker value and the gate catches it, no spec edit needed.
- **Sizes are declared.** Touch-target and font sizes live in the `SPEC` block in
  `gate.mjs`. They mirror what the components actually render, with a `ref` pointing
  at the source. **When you resize an interactive control or change a font size,
  update its entry here** — that keeps the gate measuring reality and turns it into a
  regression guard.

Run it after any change to the feature's UI; it should print `PASS`.
