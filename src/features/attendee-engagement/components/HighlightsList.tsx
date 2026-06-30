import type { ReactNode } from "react";
import { TRANSCRIPT, clamp } from "../data/transcript";
import { REACT4 } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { useHapticRef } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * The body of the "My Highlights" panel: one card per saved line, each with the four
 * expressive reactions (👍 👎 💡 ❓) and a remove button. `emptyState` overrides the
 * default empty hint (B1 uses it to show a how-to coach card).
 */
export function HighlightsList({
  hl,
  emptyState,
}: {
  hl: Highlights;
  emptyState?: ReactNode;
}) {
  const hapticRef = useHapticRef();
  if (!hl.count) {
    return (
      <>
        {emptyState ?? (
          <div
            style={{
              padding: "4px 2px",
              fontSize: 13,
              color: "var(--fg-3)",
              lineHeight: 1.5,
            }}
          >
            Lines you save or react to are kept here.
          </div>
        )}
      </>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hl.sorted.map((s) => {
        const b = TRANSCRIPT.find((t) => t.id === s.id);
        if (!b) return null;
        return (
          <div
            key={s.id}
            style={{
              position: "relative",
              background: "#fff",
              border: "1px solid var(--border-1)",
              borderRadius: 14,
              padding: "10px 11px",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <button
              ref={hapticRef}
              onClick={() => hl.remove(s.id)}
              aria-label="Remove"
              className={styles.hitArea}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              {/* fg-3, not fg-4: an icon must clear 3:1 (WCAG 1.4.11). */}
              <Icon d={ICON.x} size={15} color="var(--fg-3)" />
            </button>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.45,
                color: "var(--fg-1)",
                marginBottom: 10,
                paddingRight: 22,
              }}
            >
              {clamp(b.text)}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {REACT4.map((r) => {
                const on = s.tag === r.e;
                return (
                  <button
                    key={r.e}
                    ref={hapticRef}
                    className={styles.rxEmoji}
                    onClick={() => hl.react(s.id, r.e)}
                    aria-label={r.l}
                    title={r.l}
                    style={{
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                      border: `1px solid ${on ? r.cbdr : "var(--border-1)"}`,
                      background: on ? r.cbg : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {/* colour-coded: icon always in the reaction's colour; the active
                        reaction also gets its tinted background + border. */}
                    <Icon d={r.icon} size={19} color={r.c} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
