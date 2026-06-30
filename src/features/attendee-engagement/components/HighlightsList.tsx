import type { ReactNode } from "react";
import { TRANSCRIPT, clamp } from "../data/transcript";
import { REACT4 } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
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
  if (!hl.count) {
    return (
      <>
        {emptyState ?? (
          <div
            style={{
              padding: "4px 2px",
              fontSize: 12,
              color: "var(--fg-4)",
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
              onClick={() => hl.remove(s.id)}
              aria-label="Remove"
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
              <Icon d={ICON.x} size={14} color="var(--fg-4)" />
            </button>
            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.42,
                color: "var(--fg-1)",
                marginBottom: 10,
                paddingRight: 20,
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
                    className={styles.rxEmoji}
                    onClick={() => hl.react(s.id, r.e)}
                    aria-label={r.l}
                    title={r.l}
                    style={{
                      width: 32,
                      height: 32,
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
                    <Icon d={r.icon} size={15} color={r.c} />
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
