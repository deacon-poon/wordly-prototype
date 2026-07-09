import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Bubble } from "../data/transcript";
import { SPK } from "../data/transcript";
import { ICON_FOR, ICON, REACT5 } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { Words } from "./Words";
import {
  pulseHaptic,
  pulseIOSHaptic,
  hapticTrigger,
  useHapticRef,
  haptic,
} from "../lib/haptics";
import type { SavedItem } from "../lib/useHighlights";
import styles from "../engagement.module.css";

// Speech-bubble corners: the small corner sits at the top inline-start (the speaker
// side) — logical radii so the shape mirrors automatically under dir="rtl".
const RADII: CSSProperties = {
  borderStartStartRadius: 6,
  borderStartEndRadius: 20,
  borderEndEndRadius: 20,
  borderEndStartRadius: 20,
};

// Swipe-to-react: drag a bubble toward the rail side (right in LTR, LEFT in RTL);
// past the threshold it springs back and opens the reaction rail. (An alternative
// to long-press.)
const MAX_DRAG = 70; // visual cap — the bubble never travels further than this
const SWIPE_THRESHOLD = 60; // raw finger distance (px) needed to commit
const MOVE_SLOP = 8;
// A near-diagonal flick is a SCROLL, not a swipe: horizontal must clearly dominate
// (1.5×) before we claim the gesture, otherwise scrolls that start on a bubble get
// stolen and rubber-band the bubble sideways — the "janky scroll on bubbles" bug.
const H_AXIS_BIAS = 1.5;
// Press-lift is deferred a beat so a scroll flick that starts on a bubble never
// paints the lift (a re-render + shadow paint at the most frame-critical moment).
const PRESS_LIFT_MS = 80;
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
 *    reaction rail; this bubble marks itself as its target with an elevated
 *    "selected" highlight (a stronger lift + a brand-blue ring).
 *  - saved + reacted lines share one treatment: the bubble stays white with a
 *    coloured border in the state's colour + a corner icon chip.
 *
 * PERF: memoized — the transcript re-renders every word-tick (~5×/s), so with dozens
 * of lines on screen the bubbles MUST bail out. All props are stable except the
 * streaming line's `count` and the targeted line's `railOpen`/`saved`; callbacks are
 * id-taking and useCallback-stable in the parents.
 */
export const TranscriptBubble = memo(function TranscriptBubble({
  bubble,
  count,
  done,
  isLatest,
  saved,
  onToggleSave,
  onReact,
  showName,
  showCaret,
  dir = "ltr",
  speakerName,
  maxWidth = "80%",
  fontSize = 14.5,
  railOpen,
  onRailChange,
  onHoverOpen,
  onHoverClose,
}: {
  bubble: Bubble;
  count: number;
  done: boolean;
  isLatest: boolean;
  /** This line's saved/reaction state (undefined = not saved). Value-stable. */
  saved: SavedItem | undefined;
  onToggleSave: (id: number) => void;
  onReact: (id: number, tag: string) => void;
  showName: boolean;
  showCaret: boolean;
  /** This line's own direction — bubbles can mix LTR/RTL after a language switch. */
  dir?: "ltr" | "rtl";
  /** Speaker name in this bubble's language (falls back to the global speaker). */
  speakerName?: string;
  maxWidth?: number | string;
  fontSize?: number;
  /** Whether the shared rail is currently targeting THIS line (drives the highlight). */
  railOpen: boolean;
  onRailChange: (id: number, open: boolean) => void;
  /** Desktop hover opens the rail on this line; leaving schedules a close. */
  onHoverOpen?: (id: number) => void;
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
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const swipedRef = useRef(false);
  const dragRef = useRef<{
    x: number;
    y: number;
    axis: "h" | "v" | null;
    dx: number;
    /** +1 LTR / −1 RTL: "toward the rail" — read from the live computed direction. */
    sign: 1 | -1;
  } | null>(null);
  const hapticRef = useHapticRef();
  const wrapRef = useRef<HTMLDivElement>(null);

  const onRail = (open: boolean) => onRailChange(bubble.id, open);

  // Dismiss the embedded reaction bar on outside pointer-down or Escape. Attached on
  // the next tick so the gesture that opened it (long-press release / swipe) doesn't
  // instantly close it again.
  useEffect(() => {
    if (!railOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node))
        onRailChange(bubble.id, false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRailChange(bubble.id, false);
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
  }, [railOpen, onRailChange, bubble.id]);

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
  // the active target); a press lifts next.
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
  // The bubble does NOT move or scale on hover/selection — the transcript stays
  // perfectly still (readability). Hover/selected feedback is shadow + ring only;
  // the only translation is the deliberate swipe gesture.
  // dragX is the damped travel toward the rail; the sign maps it back to screen-x.
  const dragSign = dragRef.current?.sign ?? 1;
  const transform = dragX ? `translate(${dragX * dragSign}px, 0)` : "none";
  const transition = draggingH
    ? "box-shadow .16s ease" // follow the finger while dragging (no transform easing)
    : releasing
      ? "transform .34s cubic-bezier(.22,1,.36,1), box-shadow .16s ease" // natural settle back
      : "box-shadow .16s ease, transform .16s ease";

  const bubbleStyle: CSSProperties = {
    position: "relative",
    background: bg,
    ...RADII,
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

  const clearTimers = () => {
    clearTimeout(lpTimer.current as never);
    clearTimeout(pressTimer.current as never);
  };

  // A tap saves; but suppress it if the gesture was a long-press or a swipe.
  const onBubbleClick = () => {
    if (lpFired.current || swipedRef.current) {
      lpFired.current = false;
      swipedRef.current = false;
      return;
    }
    onToggleSave(bubble.id);
    // A tap that saves also dismisses an open reaction rail — e.g. long-press to open
    // the rail, then tap the line to save: the rail should close, not linger.
    if (railOpen) onRail(false);
  };

  const onDown = (e: React.PointerEvent) => {
    const sign: 1 | -1 =
      getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1;
    dragRef.current = { x: e.clientX, y: e.clientY, axis: null, dx: 0, sign };
    lpFired.current = false;
    swipedRef.current = false;
    setReleasing(false);
    // Deferred press-lift: a scroll flick starting on the bubble abandons the gesture
    // within PRESS_LIFT_MS, so scrolling never pays for a lift render/paint. A real
    // hold still gets feedback fast. (No vibrate here — scroll-starts must be silent;
    // the tap/long-press paths carry their own haptics.)
    clearTimers();
    pressTimer.current = setTimeout(() => setPressing(true), PRESS_LIFT_MS);
    // NOTE: pointer capture is claimed only once we know it's a horizontal swipe (in
    // onMove) — capturing on pointerdown would retarget the click to this div and the
    // iOS haptic overlay (the <input switch>) would never toggle on tap/long-press.
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
      // Horizontal must clearly dominate to count as a swipe — near-diagonal
      // movement is a scroll and must stay one.
      d.axis = Math.abs(dx) > Math.abs(dy) * H_AXIS_BIAS ? "h" : "v";
      clearTimers(); // any drag cancels the hold + pending press-lift
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
      // Track travel toward the rail side (right in LTR, left in RTL).
      d.dx = dx * d.sign;
      setDragX(rubber(d.dx)); // damped, resistance-y travel (magnitude)
    }
  };

  const endGesture = (commit: boolean) => {
    clearTimers();
    const d = dragRef.current;
    const wasSwipe = d?.axis === "h";
    if (wasSwipe && commit && (d?.dx ?? 0) >= SWIPE_THRESHOLD) {
      swipedRef.current = true;
      pulseHaptic("light"); // subtle tap as the rail renders from a swipe
      onRail(true);
    }
    // Long-press → rail is showing: fire the iOS Taptic on RELEASE. Safari gates the
    // pulse on user activation, which the 450ms timer lacks but this pointerup has —
    // Android already buzzed at rail-display via the timer.
    if (commit && lpFired.current) pulseIOSHaptic();
    if (wasSwipe) {
      setReleasing(true);
      setDragX(0); // spring back
    }
    dragRef.current = null;
    setPressing(false);
  };

  return (
    <div
      dir={dir}
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
          {speakerName ?? SPK(bubble).name}
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

      <div
        ref={wrapRef}
        // Hover lives on the WRAPPER (bubble + embedded reaction bar + chip): moving
        // the pointer from the bubble onto the bar never leaves it, so there's no
        // gap to lose hover across — the bar is anchored to the bubble itself.
        onMouseEnter={() => {
          setHover(true);
          if (canHover) onHoverOpen?.(bubble.id);
        }}
        onMouseLeave={() => {
          setHover(false);
          if (canHover) onHoverClose?.();
        }}
        style={{
          position: "relative",
          maxWidth,
          // No reserved space, no push: the transcript layout NEVER moves when the
          // panel opens. The frosted panel is a pure overlay above the bubble — it
          // briefly floats over the older (already-read) line, whose text stays
          // legible through the blur.
        }}
      >
        {/* peek hint revealed as the bubble is dragged toward the rail */}
        {dragX > 0 ? (
          <div
            style={{
              position: "absolute",
              insetInlineStart: 6,
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
        >
          <Words bubble={bubble} count={count} done={done} />
        </div>

        {railOpen ? (
          /* Reaction panel — floats just ABOVE the bubble's top inline-end corner
             ("Lift + float · blue field", Hover State Explorations): a frosted
             blue pill with white circular buttons, as a pure overlay (no layout
             push). Touch-target sizing is per pointer type: 44px on touch
             (WCAG 2.5.5), a compact 30px on hover-capable fine pointers (well
             above 2.5.8's 24px floor) so the pill sits in the inter-bubble gap
             instead of covering the line above. */
          <div
            role="menu"
            aria-label="React to this line"
            style={{
              position: "absolute",
              // Flip BELOW the bubble when it sits near the viewport top —
              // otherwise the rail lands under the translucent header, which
              // swallows the clicks (found while verifying the 7/8 round).
              ...((wrapRef.current?.getBoundingClientRect().top ?? Infinity) <
              120
                ? { top: "calc(100% + 6px)" }
                : { bottom: "calc(100% + 6px)" }),
              // End-anchored on normal bubbles; on SHORT bubbles (live non-final
              // phrases can be a word or two) the panel is wider than the bubble
              // and would overflow off-screen toward the column start — flip the
              // anchor so it grows into the open column instead.
              ...((wrapRef.current?.offsetWidth ?? Infinity) <
              (canHover ? 186 : 260)
                ? { insetInlineStart: 0 }
                : { insetInlineEnd: 0 }),
              zIndex: 7,
              display: "flex",
              gap: canHover ? 3 : 4,
              padding: canHover ? 4 : 5,
              borderRadius: 999,
              // ONE visual system with the hovered bubble (Graham, 7/8 round):
              // solid white like the bubble + the SAME brand blue as its ring for
              // the border; no frosted tint, no backdrop blur, and a tight shadow
              // that doesn't cast down over the bubble's top edge. The buttons sit
              // borderless on the shared white surface (hover/selected states
              // carry the affordance).
              background: "#fff",
              border: "1px solid var(--primary-blue-400)",
              boxShadow: "0 4px 12px rgba(0,99,204,.18)",
              animation: "wEngPopIn .18s ease-out",
            }}
          >
            {REACT5.map((opt) => {
              const on = saved?.tag === opt.e;
              return (
                <button
                  key={opt.e}
                  ref={hapticRef}
                  className={styles.rxEmoji}
                  role="menuitemradio"
                  aria-checked={on}
                  title={opt.l}
                  aria-label={opt.l}
                  onClick={() => {
                    onReact(bubble.id, opt.e);
                    onRail(false);
                  }}
                  style={{
                    width: canHover ? 30 : 44,
                    height: canHover ? 30 : 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    // Borderless on the rail's shared white surface — resting
                    // borders/shadows per button were part of the hover-cluster
                    // noise. Selected keeps its tint + colour ring (state must
                    // stay visible); hover feedback comes from .rxEmoji.
                    background: on ? opt.cbg : "transparent",
                    border: "none",
                    boxShadow: on ? `0 0 0 2px ${opt.cbdr}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <Icon d={opt.icon} size={canHover ? 17 : 20} color={opt.c} />
                </button>
              );
            })}
          </div>
        ) : null}

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
              insetInlineEnd: -7,
              zIndex: 5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 22,
              minWidth: 22,
              padding: "0 4px",
              borderRadius: 999,
              background: "#fff",
              border: `1px solid ${chipR.cbdr}`,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              animation: "wEngPopIn .22s ease-out",
            }}
          >
            {/* Icon-only status (Graham, 7/8 round): no chevron here — on desktop
                the rail is already open on hover, so the chevron promised a menu
                that never visibly appeared. Tapping still opens the rail (touch);
                the highlight-card chip keeps its chevron, where it opens a real
                picker. */}
            <Icon d={chipR.icon} size={13} color={chipR.c} />
          </button>
        ) : null}
      </div>
    </div>
  );
});
