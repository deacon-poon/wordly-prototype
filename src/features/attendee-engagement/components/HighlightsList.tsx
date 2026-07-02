import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { TRANSCRIPT } from "../data/transcript";
import { ICON, ICON_FOR, REACT5 } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { haptic, useHapticRef } from "../lib/haptics";
import type { Highlights, SavedItem } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * Reusable Wordly empty-state illustration (house line-art style, teal accents;
 * generated via ChatGPT like the rest of public/asset/illustration). Until the
 * asset lands the <img> hides itself on error, so the empty state degrades to
 * text-only instead of a broken-image icon.
 */
export function EmptyIllustration({ width = 170 }: { width?: number }) {
  return (
    // Decorative — the adjacent text carries the meaning, so hide it from AT.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/asset/illustration/my-highlights-empty.png"
      alt=""
      aria-hidden
      width={width}
      style={{ display: "block", margin: "0 auto", maxWidth: "78%" }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

/** Default "My Highlights" empty state: illustration + one-line hint. */
function EmptyHighlights() {
  return (
    <div style={{ padding: "14px 8px 10px", textAlign: "center" }}>
      <EmptyIllustration />
      <div
        dir="auto"
        style={{
          marginTop: 10,
          fontSize: 13,
          color: "var(--fg-3)",
          lineHeight: 1.5,
        }}
      >
        Lines you save or react to are kept here.
      </div>
    </div>
  );
}

/**
 * The body of the "My Highlights" panel. Cards mirror the transcript bubble — white,
 * a coloured ring in the item's colour, a subtle drop shadow.
 *
 * A card shows only its CURRENT reaction as a compact chip. Tapping the chip expands
 * it INLINE into the full 5-reaction row inside the card (no jump out to the fixed
 * rail); the editing card takes the "selected" highlight (brand-blue ring + lift) and
 * picking a reaction collapses back to the chip.
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
  // Which card has its reaction picker open (one at a time). The picker is a frosted
  // pill OVERLAY that grows out of the chip's corner — the card never changes height.
  const [editingId, setEditingId] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  // Per-pointer sizing, same rule as the transcript panel: 44px touch targets,
  // compact 30px on hover-capable fine pointers.
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false
    );
  }, []);
  // Dismiss the open picker on outside pointer-down or Escape.
  useEffect(() => {
    if (editingId == null) return;
    const onDown = (e: PointerEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setEditingId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingId(null);
    };
    const t = setTimeout(() => {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("keydown", onKey);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [editingId]);

  if (!hl.count) {
    return <>{emptyState ?? <EmptyHighlights />}</>;
  }

  // Most-recent first.
  const items = hl.sorted.slice().reverse();

  const card = (s: SavedItem, clampLines?: number) => {
    const b = TRANSCRIPT.find((t) => t.id === s.id);
    if (!b) return null;
    const chipR = ICON_FOR[s.tag];
    const selected = editingId === s.id;
    const textStyle: CSSProperties = {
      fontSize: 14,
      lineHeight: 1.45,
      color: "var(--fg-1)",
      marginBottom: 10,
      // Clears the ✕ (top inline-end) even when RTL text starts at that corner.
      paddingInlineEnd: 28,
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
          // language as the saved bubble). Editing (inline picker open): the bubble's
          // brand-blue ring + a pronounced lift, so the active card reads clearly.
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
            insetInlineEnd: 6,
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
        <div dir="auto" style={textStyle}>
          {b.text}
        </div>
        {/* Current reaction chip — bottom inline-end, matching the bubble's corner
            placement. The card keeps this height even while the picker is open. */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            ref={hapticRef}
            className={`${styles.morePill} ${styles.hitArea}`}
            onClick={() => {
              haptic("light");
              setEditingId(selected ? null : s.id);
            }}
            aria-label={`Reaction: ${chipR.l}. Tap to change.`}
            aria-expanded={selected}
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

        {selected ? (
          /* Picker: the same frosted pill as the transcript panel, OVERLAID on the
             card and growing out of the chip's corner (transform-origin bottom
             inline-end) — continuity from the chip, zero height change. */
          <div
            ref={pickerRef}
            role="menu"
            aria-label="Change reaction"
            style={{
              position: "absolute",
              bottom: 7,
              insetInlineEnd: 7,
              zIndex: 6,
              display: "flex",
              gap: fine ? 3 : 4,
              padding: fine ? 4 : 5,
              borderRadius: 999,
              background:
                "color-mix(in srgb, var(--primary-blue-50) 92%, transparent)",
              border: "1px solid rgba(255,255,255,.65)",
              boxShadow: "0 10px 24px rgba(0,99,204,.26)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              transformOrigin: "100% 100%",
              animation: "wEngPopIn .18s ease-out",
            }}
          >
            {REACT5.map((r) => {
              const on = s.tag === r.e;
              return (
                <button
                  key={r.e}
                  ref={hapticRef}
                  className={styles.rxEmoji}
                  role="menuitemradio"
                  aria-checked={on}
                  onClick={() => {
                    hl.react(s.id, r.e);
                    setEditingId(null);
                  }}
                  aria-label={r.l}
                  title={r.l}
                  style={{
                    width: fine ? 30 : 44,
                    height: fine ? 30 : 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    background: on ? r.cbg : "#fff",
                    border: "1px solid rgba(255,255,255,.7)",
                    boxShadow: on
                      ? `0 0 0 2px ${r.cbdr}`
                      : "0 1px 3px rgba(15,23,42,.14)",
                    cursor: "pointer",
                  }}
                >
                  <Icon d={r.icon} size={fine ? 17 : 20} color={r.c} />
                </button>
              );
            })}
          </div>
        ) : null}
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
              dir="auto"
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
