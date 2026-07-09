import { useEffect, useState, type CSSProperties } from "react";
import { Icon } from "../lib/icons";
import { ICON, REACT5, ICON_FOR, type Reaction } from "../lib/reactions-data";
import styles from "../engagement.module.css";

/**
 * "How highlights work" — a looping, wordless demo built from the REAL UI language
 * (a transcript bubble, the frosted reaction rail with the five brand-hued icons, and
 * the corner reaction chip). It tells the full story on a 5s loop:
 *   tap the line → it saves (📌 chip)  →  hold/hover → the reaction rail opens →
 *   pick a reaction (Insight) → the chip becomes that reaction.
 * Pure CSS keyframes (see engagement.module.css); pauses under prefers-reduced-motion
 * (shows a static composed state). Decorative — the card copy carries the meaning.
 */

// Small bubble corners echo the transcript bubble (tight top-start, round elsewhere).
const RADII: CSSProperties = {
  borderStartStartRadius: 6,
  borderStartEndRadius: 16,
  borderEndEndRadius: 16,
  borderEndStartRadius: 16,
};

const SAVE = ICON_FOR["📌"]; // blue bookmark
const INSIGHT = REACT5[2]; // amber bulb

function CornerChip({ r, className }: { r: Reaction; className: string }) {
  return (
    <span
      className={className}
      style={{
        position: "absolute",
        bottom: -9,
        insetInlineEnd: -7,
        zIndex: 3,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        height: 20,
        padding: "0 5px 0 6px",
        borderRadius: 999,
        background: "#fff",
        border: `1px solid ${r.cbdr}`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <Icon d={r.icon} size={12} color={r.c} />
      <Icon d={ICON.chevron} size={10} color={r.c} />
    </span>
  );
}

export function HowtoAnimation() {
  // Fixed 210×150 stage scaled down so the whole coach card (art + instructions) fits
  // the mobile bottom-sheet peek without clipping. DOM/vector, so it stays crisp.
  // 0.74 → 0.66 (Deacon 2026-07-08): slightly smaller art buys the centered copy
  // room above the fold at the peek detent.
  const S = 0.66;
  // The story loops TWICE, then freezes on the composed end state (rail + picked
  // reaction) — continual motion in the always-visible panel is peripheral noise
  // (Graham). 2 × the 5s loop; .hsDone swaps in the static frame.
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 10_000);
    return () => clearTimeout(t);
  }, []);
  const ring: CSSProperties = {
    position: "absolute",
    left: 43,
    top: -3,
    width: 64,
    height: 64,
    borderRadius: 999,
    pointerEvents: "none",
  };
  return (
    <div
      aria-hidden
      className={done ? styles.hsDone : undefined}
      style={{
        position: "relative",
        width: 210 * S,
        height: 150 * S,
        margin: "0 auto",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 210,
          height: 150,
          transform: `scale(${S})`,
          transformOrigin: "top left",
        }}
      >
        {/* the caption line (transcript bubble) */}
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 60,
            width: 150,
            height: 58,
            background: "#fff",
            boxShadow: "var(--shadow-xs)",
            ...RADII,
          }}
        >
          {/* placeholder caption text (abstract bars — no words) */}
          <div
            style={{
              padding: "13px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            <div
              style={{
                height: 7,
                width: "82%",
                borderRadius: 4,
                background: "var(--gray-200)",
              }}
            />
            <div
              style={{
                height: 7,
                width: "56%",
                borderRadius: 4,
                background: "var(--gray-200)",
              }}
            />
          </div>

          {/* reaction rail — floats above the bubble (same frosted pill as the real UI) */}
          <div
            className={styles.hsRail}
            style={{
              position: "absolute",
              // Kisses ~10px into the bubble's top padding — mirrors the real
              // rail's overlap-without-covering-text placement (Justin/Deacon 7/9).
              top: -32,
              left: "50%",
              marginLeft: -83,
              width: 166,
              display: "flex",
              gap: 4,
              padding: 5,
              borderRadius: 999,
              // Mirrors the REAL rail (unified with the bubble in the 7/8 round):
              // solid white, brand-blue border, tight shadow, borderless buttons.
              background: "#fff",
              border: "1px solid var(--primary-blue-400)",
              boxShadow: "0 4px 12px rgba(0,99,204,.18)",
            }}
          >
            {REACT5.map((opt, i) => (
              <span
                key={opt.e}
                // Insight (index 2) is the one that gets "picked" — it pulses selected.
                className={i === 2 ? styles.hsReactBtn : undefined}
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background: "transparent",
                  border: "none",
                }}
              >
                <Icon d={opt.icon} size={16} color={opt.c} />
              </span>
            ))}
          </div>

          {/* tap ripple + long-press/hold ring, centered on the line */}
          <span
            className={styles.hsTap}
            style={{ ...ring, border: "5px solid var(--primary-blue-400)" }}
          />
          <span
            className={styles.hsHold}
            style={{ ...ring, border: "4px solid var(--primary-blue-300)" }}
          />

          {/* corner chip: saves as 📌 first, then becomes the Insight reaction */}
          <CornerChip r={SAVE} className={styles.hsChipSave} />
          <CornerChip r={INSIGHT} className={styles.hsChipReact} />
        </div>
      </div>
    </div>
  );
}
