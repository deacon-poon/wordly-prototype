import { useEffect, useState } from "react";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic, useHapticRef } from "../lib/haptics";
import { EmptyIllustration } from "./HighlightsList";
import styles from "../engagement.module.css";

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

const GESTURE = "Tap any line to save it · press & hold to react";

/** B1 empty-state — the how-to card shown inside My Highlights until the first save. */
export function CoachPanelCard() {
  return (
    <div
      style={{
        border: "1px dashed var(--border-2)",
        borderRadius: 14,
        padding: "14px 13px",
        background: "var(--primary-blue-25)",
        color: "var(--fg-2)",
      }}
    >
      <EmptyIllustration width={150} />
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
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.6 }}>
        <li>
          <strong>Tap any line</strong> in the transcript to save it here.
        </li>
        <li>
          <strong>Press &amp; hold</strong> a line (or tap its chip) to react.
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
        <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
          {GESTURE}
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
            <strong>Tap any line</strong> to keep it in My Highlights.
            <br />
            <strong>Press &amp; hold</strong> a line to react with 👍 💡 ❓ and
            more.
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
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-2)" }}>
        {GESTURE}
      </span>
    </div>
  );
}
