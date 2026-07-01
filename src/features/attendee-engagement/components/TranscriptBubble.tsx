import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Bubble } from "../data/transcript";
import { SPK } from "../data/transcript";
import { ICON_FOR, ICON } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { Words } from "./Words";
import {
  haptic,
  pulseHaptic,
  hapticTrigger,
  useHapticRef,
} from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

const RADIUS = "6px 20px 20px 20px";

// Swipe-right-to-react: drag a bubble rightward; past the threshold it springs back
// and opens the reaction rail. (An alternative to long-press.)
const MAX_DRAG = 70; // visual cap — the bubble never travels further than this
const SWIPE_THRESHOLD = 60; // raw finger distance (px) needed to commit
const MOVE_SLOP = 8;
// Rubber-band resistance: the bubble eases toward MAX_DRAG and never exceeds it, so a
// long finger drag still only nudges the bubble — it feels like pulling against tension
// rather than the bubble sticking to the finger.
const rubber = (dx: number) => {
  const x = Math.max(0, dx);
  return Math.round(MAX_DRAG * (1 - Math.exp(-x / MAX_DRAG)));
};

/**
 * A single transcript line.
 *  - one click  → save / un-save (plain 📌)
 *  - long-press, swipe-right, hover (desktop), or tapping the corner chip → open the
 *    reaction rail. The rail is a single screen-fixed bar (see ReactionRail); this
 *    bubble marks itself as its target with an elevated "selected" highlight (a
 *    stronger lift + a brand-blue ring) so it's clear which line the rail acts on.
 *  - saved + reacted lines share one treatment: the bubble stays white with a
 *    coloured border in the state's colour + a corner icon chip. Ported from the
 *    "Current version" board.
 */
export function TranscriptBubble({
  bubble,
  count,
  done,
  isLatest,
  hl,
  showName,
  showCaret,
  maxWidth = "80%",
  fontSize = 14.5,
  railOpen,
  onRail,
  onHoverOpen,
  onHoverClose,
}: {
  bubble: Bubble;
  count: number;
  done: boolean;
  isLatest: boolean;
  hl: Highlights;
  showName: boolean;
  showCaret: boolean;
  maxWidth?: number | string;
  fontSize?: number;
  /** Whether the shared rail is currently targeting THIS line (drives the highlight). */
  railOpen: boolean;
  onRail: (open: boolean) => void;
  /** Desktop hover opens the rail on this line; leaving schedules a close. */
  onHoverOpen?: () => void;
  onHoverClose?: () => void;
}) {
  const [hover, setHover] = useState(false);
  // Hover only opens the rail on real hover-capable pointers (not synthetic touch
  // mouseenter). Resolved on mount to avoid an SSR/first-paint mismatch.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false
    );
  }, []);
  const [pressing, setPressing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [releasing, setReleasing] = useState(false);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const swipedRef = useRef(false);
  const dragRef = useRef<{
    x: number;
    y: number;
    axis: "h" | "v" | null;
    dx: number;
  } | null>(null);
  const hapticRef = useHapticRef();

  const saved = hl.get(bubble.id);
  const r = saved ? ICON_FOR[saved.tag] : null;
  const chipR = r ?? ICON_FOR["📌"];
  const reacted = !!saved && saved.tag !== "📌";

  // Saved and reacted share ONE consistent treatment: the bubble stays WHITE and gets
  // a coloured BORDER in the state's colour (📌 = brand blue, each reaction = its own),
  // plus the corner icon chip. No background fill.
  const bg = "#fff";
  const savedRing = saved ? `0 0 0 1.5px ${chipR.cbdr}` : "";

  // `selected` = the shared reaction rail is currently targeting this line. Since the
  // rail no longer sits beside the bubble, this highlight is what ties the two
  // together: a pronounced lift + a solid brand-blue ring that reads as "this one".
  const selected = railOpen;

  // Hover / long-press / selection all lift the bubble. Selection lifts hardest (it's
  // the active target); a press lifts next (immediate "it registered" feedback).
  const lifted = hover || pressing || dragX > 0 || selected;
  const liftShadow = selected
    ? "0 16px 40px rgba(1,124,255,.32)"
    : pressing
      ? "0 12px 30px rgba(1,124,255,.30)"
      : "0 7px 20px rgba(1,124,255,.20)";
  const baseShadow = lifted ? liftShadow : "var(--shadow-xs)";
  // When selected, a solid 2px brand ring replaces the subtler saved ring.
  const ring = selected ? "0 0 0 2px var(--primary-blue-400)" : savedRing;

  const draggingH = dragRef.current?.axis === "h";
  const liftY = pressing || selected ? -3 : lifted ? -2 : 0;
  const scale = (pressing || selected) && !dragX ? " scale(1.01)" : "";
  const transform =
    dragX || lifted ? `translate(${dragX}px, ${liftY}px)${scale}` : "none";
  const transition = draggingH
    ? "box-shadow .16s ease" // follow the finger while dragging (no transform easing)
    : releasing
      ? "transform .34s cubic-bezier(.22,1,.36,1), box-shadow .16s ease" // natural settle back
      : "box-shadow .16s ease, transform .16s ease";

  const bubbleStyle: CSSProperties = {
    position: "relative",
    background: bg,
    borderRadius: RADIUS,
    padding: "10px 14px",
    fontSize,
    lineHeight: 1.46,
    color: "var(--fg-1)",
    cursor: "pointer",
    boxShadow: ring ? `${ring}, ${baseShadow}` : baseShadow,
    transform,
    transition,
    // Lift the selected line above its neighbours so the ring + big shadow aren't
    // clipped by the bubbles stacked around it.
    zIndex: selected ? 5 : undefined,
    touchAction: "pan-y", // let vertical scroll pass; we own horizontal swipes
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  // A tap saves; but suppress it if the gesture was a long-press or a swipe.
  const onBubbleClick = () => {
    if (lpFired.current || swipedRef.current) {
      lpFired.current = false;
      swipedRef.current = false;
      return;
    }
    hl.toggleSave(bubble.id);
  };

  const onDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, axis: null, dx: 0 };
    lpFired.current = false;
    swipedRef.current = false;
    setReleasing(false);
    setPressing(true); // immediate lift feedback the moment you hold
    haptic("light"); // Android tick on press-start (iOS taps via the overlay)
    // NOTE: pointer capture is claimed only once we know it's a horizontal swipe (in
    // onMove) — capturing on pointerdown would retarget the click to this div and the
    // iOS haptic overlay (the <input switch>) would never toggle on tap/long-press.
    clearTimeout(lpTimer.current as never);
    lpTimer.current = setTimeout(() => {
      lpFired.current = true;
      pulseHaptic("light"); // subtle tap as the reaction rail renders (iOS + Android)
      onRail(true);
    }, 450);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (
      d.axis === null &&
      (Math.abs(dx) > MOVE_SLOP || Math.abs(dy) > MOVE_SLOP)
    ) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      clearTimeout(lpTimer.current as never); // any drag cancels the hold timer
      if (d.axis === "v") {
        // vertical = scroll; abandon the gesture and let the list scroll
        dragRef.current = null;
        setPressing(false);
        return;
      }
      // horizontal swipe: now capture so tracking survives the finger leaving the box
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
    }
    if (d.axis === "h") {
      d.dx = dx;
      setDragX(rubber(dx)); // damped, resistance-y travel
    }
  };

  const endGesture = (commit: boolean) => {
    clearTimeout(lpTimer.current as never);
    const d = dragRef.current;
    const wasSwipe = d?.axis === "h";
    if (wasSwipe && commit && (d?.dx ?? 0) >= SWIPE_THRESHOLD) {
      swipedRef.current = true;
      pulseHaptic("light"); // subtle tap as the rail renders from a swipe
      onRail(true);
    }
    if (wasSwipe) {
      setReleasing(true);
      setDragX(0); // spring back
    }
    dragRef.current = null;
    setPressing(false);
  };

  return (
    <div
      ref={(el) => {
        if (el && isLatest) el.dataset.latest = "1";
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginTop: showName ? 0 : showCaret ? 18 : 8,
      }}
    >
      {showName ? (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--fg-1)",
            margin: "0 2px 6px",
          }}
        >
          {SPK(bubble).name}
        </div>
      ) : showCaret ? (
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: ".04em",
            color: "var(--fg-3)",
            margin: "0 2px 4px 4px",
          }}
        >
          {">>"}
        </div>
      ) : null}

      <div style={{ position: "relative", maxWidth }}>
        {/* peek hint revealed as the bubble is dragged right */}
        {dragX > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              opacity: Math.min(1, dragX / SWIPE_THRESHOLD),
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 999,
                background:
                  dragX >= SWIPE_THRESHOLD
                    ? "var(--primary-blue-400)"
                    : "var(--primary-blue-25)",
              }}
            >
              <Icon
                d={ICON.smilePlus}
                size={17}
                color={
                  dragX >= SWIPE_THRESHOLD ? "#fff" : "var(--primary-blue-500)"
                }
              />
            </span>
          </div>
        ) : null}
        <div
          ref={hapticTrigger}
          style={bubbleStyle}
          onClick={onBubbleClick}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => endGesture(true)}
          onPointerCancel={() => endGesture(false)}
          onMouseEnter={() => {
            setHover(true);
            if (canHover) onHoverOpen?.();
          }}
          onMouseLeave={() => {
            setHover(false);
            if (canHover) onHoverClose?.();
          }}
        >
          <Words bubble={bubble} count={count} done={done} />
        </div>

        {saved ? (
          <button
            ref={hapticRef}
            className={styles.rxChip}
            title={
              reacted ? `Change reaction · ${chipR.l}` : "Saved · tap to react"
            }
            aria-label={reacted ? "Change reaction" : "React"}
            onClick={(e) => {
              e.stopPropagation();
              haptic("light");
              onRail(true);
            }}
            style={{
              position: "absolute",
              bottom: -9,
              right: -7,
              zIndex: 5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 999,
              background: "#fff",
              border: `1px solid ${chipR.cbdr}`,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              animation: "wEngPopIn .22s ease-out",
            }}
          >
            <Icon d={chipR.icon} size={13} color={chipR.c} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
