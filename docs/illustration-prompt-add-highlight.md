# Illustration prompt — "Add highlight" instruction

For the empty-state **"How highlights work"** card (`CoachPanelCard`).
Drop the finished asset at: `public/asset/illustration/my-highlights-empty.png`
(the card already loads that path and hides on error). Card bg is light blue
`#F0F7FF`, so export a **transparent PNG**.

---

## 1) Static illustration — tap → save (primary)

```
Flat vector UI illustration, clean and modern, for a translation app onboarding card.
Subject: a single rounded-corner chat/speech bubble (EMPTY — no text inside),
representing a caption line, with a simple stylized hand — only the index finger
extended — gently tapping the center of the bubble. A soft circular ripple radiates
from the fingertip to show the tap. At the bubble's bottom-right corner, a small
circular badge holding a bookmark icon pops in, showing the line was just saved; the
bubble's outline glows a subtle blue to confirm.
Style: minimal, friendly, rounded 2px line work with soft flat fills, generous
padding, centered. NOT 3D, no gradients, no photorealism, no heavy drop shadows.
Color palette: primary blue #017CFF (bubble outline + bookmark), light blue #F0F7FF
fills, white bubble, one small accent-green #15B743 touch.
IMPORTANT: absolutely NO text, letters, numbers, or words anywhere in the image.
Output: transparent background, PNG, square 1:1, crisp vector look.
```

### Optional add-on — also hint long-press → react

Paste this line into the prompt above, right before "Style:":

```
Above the bubble, a small floating pill shows five ICON-ONLY reaction buttons in
distinct colors — green thumbs-up, orange thumbs-down, amber lightbulb, violet
question mark, blue bookmark — no labels or text.
```

---

## 2) Animated GIF — motion prompt (Sora / Runway / Kling / Pika)

```
2-second seamless loop, flat 2D vector motion graphic, transparent background.
A rounded chat bubble sits centered. A stylized hand (index finger only) taps it
once — finger presses down, a soft ripple ring expands — then a small bookmark badge
springs onto the bubble's bottom-right corner and the bubble's outline briefly glows
blue to confirm "saved." Brief hold, reset, loop. Snappy friendly easing, brand blue
#017CFF and light blue #F0F7FF, no text, no words.
```

---

## 3) GIF via 3 keyframes (DALL·E / ChatGPT, then stitch in ezgif/Photopea)

Generate each with the **same** style/color rules as prompt #1, changing only the action:

- **Frame 1:** empty rounded chat bubble, a stylized index finger approaching from below.
- **Frame 2:** the finger tapping the bubble's center, a soft ripple ring expanding.
- **Frame 3:** a bookmark badge popped onto the bubble's bottom-right corner, the
  bubble outline glowing blue ("saved").
- (Optional 4–5:) long-press → a floating pill of 5 icon-only reactions slides in.

Then stitch the frames into a looping GIF (ezgif.com, Photopea, or After Effects).

---

## 4) Recommended: build it in-app instead (best "GIF")

Ask Claude to build an animated SVG/CSS version of this in the coach card. It reuses
the real bubble + corner chip + reaction hues, stays crisp at any size, is tiny (no
asset), localizable, loops forever, and can respect `prefers-reduced-motion`. It can
show both beats in sequence: tap → bookmark appears, then long-press → reaction rail
slides in.

Brand reference (for any path):

- Brand blue `#017CFF` · light blue `#F0F7FF` · accent green `#15B743`
- Reaction hues: Agree green · Disagree orange · Insight amber · Question violet · Save blue
- Icon-only, no text labels (localization).
