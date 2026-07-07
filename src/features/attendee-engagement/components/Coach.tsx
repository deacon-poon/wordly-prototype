import { useEffect, useState } from "react";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic, useHapticRef } from "../lib/haptics";
import styles from "../engagement.module.css";

/**
 * Instructional illustration for the "How highlights work" card: the saved SVG scene
 * (bubble + tapping finger + bookmark) with a looping motion overlay — a tap ripple at
 * the fingertip + a subtle press, then a "saved" glow on the bookmark. The overlays are
 * positioned in the SVG's native 1024-space inside a fitted, cropped stage; CSS drives
 * the loop (see engagement.module.css) and pauses under prefers-reduced-motion.
 */
function HowtoIllustration() {
  // The SVG is cropped to this viewBox, so it renders at native display size (crisp) —
  // no 1024→small bitmap downscale. Overlays are placed in the same coordinate space.
  const VB = { x: 110, y: 215, w: 835, h: 600 };
  const W = 190;
  const H = Math.round((W * VB.h) / VB.w);
  const cx = (x: number) => ((x - VB.x) / VB.w) * W; // 1024-space → display px
  const cy = (y: number) => ((y - VB.y) / VB.h) * H;
  const d = (px: number) => (px / VB.w) * W; // length → display px
  // A centred round overlay whose transform stays free for the keyframe scale.
  const dot = (px: number, py: number, size: number): React.CSSProperties => ({
    position: "absolute",
    left: cx(px) - size / 2,
    top: cy(py) - size / 2,
    width: size,
    height: size,
    borderRadius: "50%",
    pointerEvents: "none",
  });
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: W,
        height: H,
        margin: "2px auto 0",
        overflow: "visible",
      }}
    >
      {/* base art — rendered at display size for crisp edges */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/asset/illustration/highlight-reaction.svg"
        alt=""
        className={styles.howtoPress}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transformOrigin: `${(((500 - VB.x) / VB.w) * 100).toFixed(1)}% ${(((405 - VB.y) / VB.h) * 100).toFixed(1)}%`,
        }}
      />
      {/* saved glow on the bookmark (center ≈ 856,546) */}
      <div
        className={styles.howtoGlowDisc}
        style={{
          ...dot(856, 546, d(170)),
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--accent-green-500) 45%, transparent), transparent)",
        }}
      />
      <div
        className={styles.howtoGlowRing}
        style={{
          ...dot(856, 546, d(230)),
          border: `${Math.max(2, d(9)).toFixed(1)}px solid var(--accent-green-500)`,
        }}
      />
      {/* tap ripple at the fingertip (center ≈ 500,405) */}
      <div
        className={styles.howtoRipple}
        style={{
          ...dot(500, 405, d(220)),
          border: `${Math.max(2, d(7)).toFixed(1)}px solid var(--primary-blue-400)`,
        }}
      />
    </div>
  );
}

const dismissHaptic = () => haptic("selection");

export type CoachVariant = "b1" | "b2" | "b3" | "b4";

export const COACH_META: Record<
  CoachVariant,
  { badge: string; title: string }
> = {
  b1: { badge: "B1", title: "Coached in My Highlights" },
  b2: { badge: "B2", title: "Dismissible coach pill" },
  b3: { badge: "B3", title: "First-run spotlight" },
  b4: { badge: "B4", title: "Slim static hint" },
};

/**
 * Coaching copy is phrased for the pointer the attendee actually has (Justin):
 *  - fine pointer / hover (desktop): "Click … Hover to react"
 *  - touch (mobile): "Tap … Long press to react"
 */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false
    );
  }, []);
  return fine;
}

const gestureLine = (fine: boolean) =>
  fine
    ? "Click a speech bubble to save it · Hover to react"
    : "Tap a speech bubble to save it · Long press to react";

/** B1 empty-state — the how-to card shown inside My Highlights until the first save. */
export function CoachPanelCard() {
  const fine = useFinePointer();
  return (
    <div
      dir="auto"
      style={{
        border: "1px dashed var(--border-2)",
        borderRadius: 14,
        padding: "14px 13px",
        background: "var(--primary-blue-25)",
        color: "var(--fg-2)",
      }}
    >
      <HowtoIllustration />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          margin: "10px 0 8px",
        }}
      >
        <Icon
          d={ICON.lBookmark}
          size={15}
          color="var(--primary-blue-600)"
          fill="var(--primary-blue-600)"
        />
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fg-1)" }}>
          How highlights work
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          paddingInlineStart: 16,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <li>
          <strong>{fine ? "Click" : "Tap"} a speech bubble</strong> to save it.
        </li>
        <li>
          <strong>{fine ? "Hover" : "Long press"}</strong> to react.
        </li>
      </ul>
      <div style={{ marginTop: 9, fontSize: 13, color: "var(--fg-3)" }}>
        Your saved lines will replace this card.
      </div>
    </div>
  );
}

/**
 * Overlay coaching for B2 (dismissible pill), B3 (first-run spotlight) and B4
 * (persistent pulsing hint banner). B1 is handled via <CoachPanelCard/> inside the
 * panel and renders nothing here.
 */
export function Coach({
  variant,
  hasSaved,
}: {
  variant: CoachVariant;
  hasSaved: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const hapticRef = useHapticRef();
  const fine = useFinePointer();

  // B2 auto-dismisses once the user saves their first line.
  useEffect(() => {
    if (variant === "b2" && hasSaved) setDismissed(true);
  }, [variant, hasSaved]);

  if (variant === "b1") return null;

  if (variant === "b2") {
    if (dismissed) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 86,
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          maxWidth: "88%",
          padding: "9px 10px 9px 13px",
          borderRadius: 999,
          background: "var(--primary-blue-500)",
          color: "#fff",
          boxShadow: "0 10px 24px rgba(1,124,255,.36)",
          animation: "wEngFade .3s ease",
        }}
      >
        <span
          dir="auto"
          style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}
        >
          {gestureLine(fine)}
        </span>
        <button
          ref={hapticRef}
          onClick={() => {
            dismissHaptic();
            setDismissed(true);
          }}
          aria-label="Dismiss"
          className={styles.hitArea}
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 999,
            background: "rgba(255,255,255,.2)",
            cursor: "pointer",
          }}
        >
          <Icon d={ICON.x} size={13} color="#fff" />
        </button>
        {/* little pointer toward the dock */}
        <span
          style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 10,
            height: 10,
            background: "var(--primary-blue-500)",
          }}
        />
      </div>
    );
  }

  if (variant === "b3") {
    if (dismissed) return null;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(18,20,22,.55)",
          backdropFilter: "blur(2px)",
          animation: "wEngFade .25s ease",
        }}
        onClick={() => {
          dismissHaptic();
          setDismissed(true);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(330px, 86%)",
            background: "#fff",
            borderRadius: 18,
            padding: "20px 18px 16px",
            boxShadow: "var(--shadow-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--primary-blue-25)",
            }}
          >
            <Icon
              d={ICON.smilePlus}
              size={24}
              color="var(--primary-blue-500)"
            />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--fg-1)",
              marginBottom: 6,
            }}
          >
            Save the moments that matter
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--fg-3)",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            <strong>{fine ? "Click" : "Tap"} a speech bubble</strong> to keep it
            in My Highlights.
            <br />
            <strong>{fine ? "Hover" : "Long press"}</strong> to react with 👍 💡
            ❓ and more.
          </div>
          <button
            ref={hapticRef}
            onClick={() => {
              haptic("success");
              setDismissed(true);
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "none",
              borderRadius: 10,
              background: "var(--primary-blue-500)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  // b4 — persistent pulsing hint banner just under the header.
  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 18,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 13px",
        borderRadius: 999,
        background: "#fff",
        border: "1px solid var(--border-brand)",
        boxShadow: "var(--shadow-sm)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: "var(--primary-blue-500)",
          animation: "wEngPulseDot 1.4s infinite",
        }}
      />
      <span
        dir="auto"
        style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-2)" }}
      >
        {gestureLine(fine)}
      </span>
    </div>
  );
}
