import { useEffect, useState } from "react";
import { TRANSCRIPT } from "../data/transcript";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { TranscriptBubble } from "./TranscriptBubble";
import { useFadeScroll } from "../lib/useFadeScroll";
import { haptic, useHapticRef } from "../lib/haptics";
import type { StreamState } from "../lib/useTranscriptStream";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/** The streaming transcript column — auto-scrolls while pinned to the bottom, shows a
 *  "jump to latest" affordance when the user scrolls up, and a LIVE status pill. */
export function Transcript({
  eng,
  last,
  hl,
  maxWidth,
  fontSize,
  padding,
  anchorBottom = false,
  openRailId,
  onRail,
}: {
  eng: StreamState;
  last: number;
  hl: Highlights;
  maxWidth: number | string;
  fontSize: number;
  padding: string;
  /** Stick the newest line to the bottom (above the dynamic sheet gap) — phone. */
  anchorBottom?: boolean;
  /** Lifted single-open reaction-rail state so only one bubble's rail shows. */
  openRailId: number | null;
  onRail: (id: number | null) => void;
}) {
  const [atBottom, setAtBottom] = useState(true);
  const hapticRef = useHapticRef();
  const { ref: scrollRef, onScroll } = useFadeScroll(() => {
    const el = scrollRef.current;
    if (!el) return;
    // `column-reverse`: the bottom (newest) is scrollTop ≈ 0; scrolling up toward
    // older lines grows |scrollTop|. Browsers differ on the sign, so use magnitude.
    setAtBottom(Math.abs(el.scrollTop) < 36);
  });

  // The scroll container is `flex-direction: column-reverse`, so the first child in
  // DOM order is rendered at the BOTTOM and the column packs upward. That gives a
  // rock-solid bottom anchor for free: the newest line always sits exactly
  // `padding-bottom` above the panel — the SAME gap whether 1 line or 50 have
  // streamed — and the browser keeps the bottom pinned as content grows. No spacer
  // measurement, no manual scroll math (which earlier drifted as content overflowed).

  // Belt-and-braces re-pin: when already at the bottom, snap scrollTop to 0 (the
  // newest line) after new words arrive or the area resizes (e.g. a sheet detent
  // change), in case the browser's native column-reverse anchoring lags a frame.
  useEffect(() => {
    if (!atBottom) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, [eng.bi, eng.wi, atBottom, scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (atBottom && scrollRef.current) scrollRef.current.scrollTop = 0;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [atBottom, scrollRef]);

  const jump = () => {
    haptic("light");
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
    setAtBottom(true);
  };

  const latestId = TRANSCRIPT[last]?.id;

  return (
    <div
      style={{ flex: 1, minWidth: 0, position: "relative", display: "flex" }}
    >
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={styles.appleScroll}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          background: "#F0F7FF",
          padding,
          display: "flex",
          // Newest line pinned to the bottom: render bubbles newest-first (below) and
          // reverse the column so DOM-first sits at the bottom and packs upward.
          flexDirection: "column-reverse",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, #000 18px)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 18px)",
        }}
      >
        {Array.from({ length: last + 1 }, (_, idx) => {
          const b = TRANSCRIPT[idx];
          const prev = idx > 0 ? TRANSCRIPT[idx - 1] : null;
          const speakerChanged = !prev || prev.sp !== b.sp;
          return (
            <TranscriptBubble
              key={b.id}
              bubble={b}
              count={idx < eng.bi ? 9999 : eng.wi}
              done={idx < eng.bi}
              isLatest={b.id === latestId}
              hl={hl}
              showName={idx === 0}
              showCaret={speakerChanged && idx !== 0}
              maxWidth={maxWidth}
              fontSize={fontSize}
              railOpen={openRailId === b.id}
              onRail={(open) => onRail(open ? b.id : null)}
            />
          );
          // column-reverse renders DOM-first at the bottom, so reverse to keep
          // natural reading order (oldest at top → newest at bottom).
        }).reverse()}
      </div>

      {/* LIVE pill — floats at the top of the transcript area, out of the scroll flow,
          so bottom-anchored bubbles never push it around. */}
      <div
        style={{
          position: "absolute",
          top: anchorBottom ? 70 : 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        <div
          style={{
            padding: "2px 10px",
            borderRadius: 999,
            background: "var(--accent-green-50)",
            border: "1px solid var(--accent-green-200)",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".04em",
            color: "var(--accent-green-700)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--accent-green-500)",
              animation: "wEngPulseDot 1.2s infinite",
            }}
          />
          LIVE · interpreting
        </div>
      </div>

      {!atBottom ? (
        <button
          ref={hapticRef}
          onClick={jump}
          aria-label="Jump to latest"
          title="Jump to latest"
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 6,
            width: 46,
            height: 46,
            borderRadius: 999,
            border: "none",
            background: "var(--primary-blue-400)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(1,124,255,.4)",
            animation: "wEngPopIn .18s ease-out",
          }}
        >
          <Icon d={ICON.arrowdown} size={22} color="#fff" sw={2.2} />
        </button>
      ) : null}
    </div>
  );
}
