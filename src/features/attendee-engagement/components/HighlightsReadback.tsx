import { TRANSCRIPT } from "../data/transcript";
import { ICON, ICON_FOR } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { haptic } from "../lib/haptics";
import { EmptyIllustration } from "./HighlightsList";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * The Figma share/session-end read-back: "My Highlights (N)" then one card per saved
 * line — text + current-reaction chip (icon + colour only) + remove ✕. Shared by the
 * Share sheet and the Session-complete sheet so both match the design exactly.
 */
export function HighlightsReadback({
  hl,
  emptyText = "Nothing saved yet.",
}: {
  hl: Highlights;
  emptyText?: string;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-1)" }}>
          My Highlights
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-3)" }}>
          ({hl.count})
        </span>
      </div>

      {hl.count === 0 ? (
        <div style={{ textAlign: "center", padding: "6px 0 4px" }}>
          <EmptyIllustration width={150} />
          <div
            dir="auto"
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "var(--fg-3)",
              lineHeight: 1.5,
            }}
          >
            {emptyText}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hl.sorted.map((s) => {
            const b = TRANSCRIPT.find((t) => t.id === s.id);
            if (!b) return null;
            const chipR = ICON_FOR[s.tag];
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  borderRadius: 12,
                  padding: "10px 12px",
                  // Same language as the panel cards: white + a ring in the
                  // item's own colour.
                  boxShadow: `0 0 0 1.5px ${chipR.cbdr}, var(--shadow-xs)`,
                }}
              >
                <div
                  dir="auto"
                  style={{
                    flex: 1,
                    fontSize: 13,
                    lineHeight: 1.45,
                    color: "var(--fg-1)",
                  }}
                >
                  {b.text}
                </div>
                {/* current reaction — icon + colour only (no wording) */}
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    border: `1px solid ${chipR.cbdr}`,
                    background: chipR.cbg,
                  }}
                >
                  <Icon d={chipR.icon} size={15} color={chipR.c} />
                </span>
                <button
                  onClick={() => {
                    haptic("selection");
                    hl.remove(s.id);
                  }}
                  aria-label="Remove"
                  className={`${styles.iconBtn} ${styles.hitArea}`}
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <Icon d={ICON.x} size={15} color="var(--fg-3)" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
