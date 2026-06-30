import type { CSSProperties, ReactNode } from "react";
import { TRANSCRIPT } from "../data/transcript";
import { REACT5, ICON, ICON_FOR } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { useHapticRef } from "../lib/haptics";
import type { Highlights, SavedItem } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * The body of the "My Highlights" panel. Cards mirror the transcript bubble — white,
 * a coloured ring in the item's colour, a subtle drop shadow — each with the five
 * reactions (👍 👎 💡 ❓ 📌) and remove.
 *
 * Two layouts (ported from the design's DetentPanel):
 *  - default (full / desktop): every saved line, most-recent first, full text.
 *  - `peek`: the most-recent line in full (clamped to 3 lines), then a faded preview of
 *    the next with a "+N more" pill that expands the sheet (via `onExpand`). So the
 *    newest highlight is always shown and the rest stay one tap away.
 */
export function HighlightsList({
  hl,
  emptyState,
  peek = false,
  onExpand,
}: {
  hl: Highlights;
  emptyState?: ReactNode;
  peek?: boolean;
  onExpand?: () => void;
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

  // Most-recent first.
  const items = hl.sorted.slice().reverse();

  const card = (s: SavedItem, clampLines?: number) => {
    const b = TRANSCRIPT.find((t) => t.id === s.id);
    if (!b) return null;
    const chipR = ICON_FOR[s.tag];
    const textStyle: CSSProperties = {
      fontSize: 14,
      lineHeight: 1.45,
      color: "var(--fg-1)",
      marginBottom: 10,
      paddingRight: 22,
    };
    if (clampLines) {
      Object.assign(textStyle, {
        display: "-webkit-box",
        WebkitLineClamp: clampLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      });
    }
    return (
      <div
        key={s.id}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 14,
          padding: "10px 11px",
          // Same language as the saved bubble: white + a coloured ring in the item's
          // colour + a subtle drop shadow (no flat grey container border).
          boxShadow: `0 0 0 1.5px ${chipR.cbdr}, var(--shadow-sm)`,
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
          <Icon d={ICON.x} size={15} color="var(--fg-3)" />
        </button>
        <div style={textStyle}>{b.text}</div>
        <div style={{ display: "flex", gap: 6 }}>
          {REACT5.map((r) => {
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
                <Icon d={r.icon} size={19} color={r.c} />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Full / desktop: all cards, full text ──────────────────────────────────────
  if (!peek) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((s) => card(s))}
      </div>
    );
  }

  // ── Peek: newest in full (3-line clamp) + "+N more" fade affordance ────────────
  const top = items[0];
  const next = items[1];
  const remaining = hl.count - 1;
  const nextBody = next ? TRANSCRIPT.find((t) => t.id === next.id)?.text : "";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {card(top, 3)}
      {remaining > 0 ? (
        <div
          onClick={onExpand}
          role="button"
          title="Show all highlights"
          style={{ position: "relative", cursor: "pointer", marginTop: 8 }}
        >
          {/* faded preview of the next card */}
          <div
            style={{
              height: 38,
              overflow: "hidden",
              borderRadius: 14,
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, #000 28%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 28%, transparent 100%)",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "10px 11px",
                boxShadow: `0 0 0 1.5px ${ICON_FOR[next!.tag].cbdr}, var(--shadow-sm)`,
                fontSize: 14,
                lineHeight: 1.45,
                color: "var(--fg-1)",
              }}
            >
              {nextBody}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              className={styles.morePill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 13px",
                borderRadius: 999,
                background: "#fff",
                border: "1px solid var(--border-1)",
                boxShadow: "var(--shadow-sm)",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary-blue-600)",
              }}
            >
              +{remaining} more
              <Icon
                d={ICON.chevron}
                size={13}
                color="var(--primary-blue-600)"
                style={{ transform: "rotate(180deg)" }}
              />
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
