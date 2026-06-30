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
}: {
  eng: StreamState;
  last: number;
  hl: Highlights;
  maxWidth: number | string;
  fontSize: number;
  padding: string;
}) {
  const [atBottom, setAtBottom] = useState(true);
  const hapticRef = useHapticRef();
  const { ref: scrollRef, onScroll } = useFadeScroll(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 36);
  });

  useEffect(() => {
    if (!atBottom) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [eng.bi, eng.wi, atBottom, scrollRef]);

  const jump = () => {
    haptic("light");
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
          flexDirection: "column",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, #000 18px)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 18px)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "center",
            zIndex: 3,
            marginBottom: 4,
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
            />
          );
        })}
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
