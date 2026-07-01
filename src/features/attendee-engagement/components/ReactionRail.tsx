import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { REACT5 } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { useHapticRef } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * The reaction rail as a SINGLE screen-fixed bar (not a per-bubble popover).
 *
 * Only one is ever mounted; `bubbleId` is the line it currently acts on. The rail no
 * longer chases the individual bubble — it sits at a STABLE spot on the right side of
 * the transcript (vertically centred), and the *bubble* shows an elevated "selected"
 * highlight (see TranscriptBubble) so it's clear which line the rail acts on. That
 * keeps the rail from clipping at screen edges and from jumping line to line.
 *
 * Portalled to <body> so `position: fixed` is truly viewport-relative even if an
 * ancestor establishes a containing block; `styles.root` re-declares the DS tokens
 * the icons reference (they'd be undefined outside the feature root otherwise).
 */
export function ReactionRail({
  bubbleId,
  hl,
  positionStyle,
  onClose,
  onHoverKeep,
  onHoverLeave,
}: {
  /** The line the rail acts on, or null when closed. */
  bubbleId: number | null;
  hl: Highlights;
  /** Fixed placement of the centring wrapper (left/bottom + translateX(-50%)). */
  positionStyle: CSSProperties;
  onClose: () => void;
  /** Pointer entered the rail — cancel any pending hover-close (desktop). */
  onHoverKeep: () => void;
  /** Pointer left the rail — schedule a hover-close (desktop). */
  onHoverLeave: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hapticRef = useHapticRef();
  const open = bubbleId != null;

  // Dismiss on outside pointer-down or Escape. Attach on the next tick so the same
  // gesture that opened the rail (long-press release / swipe) doesn't instantly close it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const saved = hl.get(bubbleId);

  return createPortal(
    <div
      ref={wrapRef}
      className={styles.root}
      onPointerEnter={onHoverKeep}
      onPointerLeave={onHoverLeave}
      style={{ position: "fixed", zIndex: 60, ...positionStyle }}
    >
      <div
        role="menu"
        aria-label="React to this line"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 3,
          borderRadius: 14,
          background: "#fff",
          border: "1px solid var(--border-1)",
          boxShadow: "var(--shadow-lg)",
          animation: "wEngRailIn .18s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {REACT5.map((opt) => {
          const on = saved?.tag === opt.e;
          return (
            <button
              key={opt.e}
              ref={hapticRef}
              className={styles.rxEmoji}
              role="menuitem"
              title={opt.l}
              aria-label={opt.l}
              onClick={() => {
                hl.react(bubbleId, opt.e);
                onClose();
              }}
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: `1px solid ${on ? opt.cbdr : "transparent"}`,
                background: on ? opt.cbg : "transparent",
                cursor: "pointer",
              }}
            >
              <Icon d={opt.icon} size={20} color={opt.c} />
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
