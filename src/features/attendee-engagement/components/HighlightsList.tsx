import type { CSSProperties, ReactNode } from "react";
import { TRANSCRIPT } from "../data/transcript";
import { ICON, ICON_FOR } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { useHapticRef } from "../lib/haptics";
import type { Highlights, SavedItem } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * The body of the "My Highlights" panel. Cards mirror the transcript bubble — white,
 * a coloured ring in the item's colour, a subtle drop shadow.
 *
 * A card shows only its CURRENT reaction as a labelled chip (not the always-on row of
 * five, which crowded the narrow panel). Tapping the chip opens the SAME screen-fixed
 * reaction rail used by the transcript, targeting this line, and the card takes on the
 * bubble's "selected" highlight (brand-blue ring + lift) so it's clear which one the
 * rail is editing — no reaction row ever has to overlap the panel.
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
  railId = null,
  onEditReaction,
}: {
  hl: Highlights;
  emptyState?: ReactNode;
  peek?: boolean;
  onExpand?: () => void;
  /** The line the shared rail is currently editing (drives the card's selected state). */
  railId?: number | null;
  /** Open the shared reaction rail on this line to change its reaction. */
  onEditReaction?: (id: number) => void;
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
    const selected = railId === s.id;
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
          // Resting: white + a coloured ring in the item's colour + a soft shadow (same
          // language as the saved bubble). Selected (the rail is editing this line):
          // the bubble's brand-blue ring + a pronounced lift, so the two read as linked.
          boxShadow: selected
            ? "0 0 0 2px var(--primary-blue-400), 0 14px 34px rgba(1,124,255,.28)"
            : `0 0 0 1.5px ${chipR.cbdr}, var(--shadow-sm)`,
          transform: selected ? "translateY(-2px)" : "none",
          transition: "box-shadow .16s ease, transform .16s ease",
          zIndex: selected ? 3 : undefined,
        }}
      >
        <button
          ref={hapticRef}
          onClick={() => hl.remove(s.id)}
          aria-label="Remove"
          className={`${styles.hitArea} ${styles.iconBtn}`}
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
        {/* Current reaction only — tap to change it via the shared fixed rail. */}
        <button
          ref={hapticRef}
          className={`${styles.morePill} ${styles.hitArea}`}
          onClick={() => onEditReaction?.(s.id)}
          aria-label={`Reaction: ${chipR.l}. Tap to change.`}
          title="Change reaction"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 8px 4px 9px",
            borderRadius: 999,
            border: `1px solid ${chipR.cbdr}`,
            background: chipR.cbg,
            cursor: "pointer",
          }}
        >
          <Icon d={chipR.icon} size={15} color={chipR.c} />
          <Icon d={ICON.chevron} size={12} color={chipR.c} />
        </button>
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
          {/* faded preview of the next card — a real card peeking (not just a line),
              clipped and faded at the bottom so it reads as "more cards below". Top +
              side padding gives the card's outset ring room so overflow:hidden doesn't
              shave its border; only the bottom is cut (and masked). */}
          <div
            style={{
              height: 80,
              overflow: "hidden",
              padding: "3px 3px 0",
              borderRadius: 17,
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
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
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
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
