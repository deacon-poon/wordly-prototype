import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [spacer, setSpacer] = useState(0);
  const { ref: scrollRef, onScroll } = useFadeScroll(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 36);
  });

  // Deterministic bottom-anchor: measure free space and insert a top spacer so the
  // newest line sits exactly `padBottom` above the panel — the SAME gap whether 1 line
  // or 50 have streamed in. (justify-content/auto margins were ignored in this scroll
  // container, hence the explicit measurement.)
  const padTop = parseInt(padding.split(" ")[0], 10) || 0;
  const padBottom =
    parseInt(padding.split(" ")[2] ?? padding.split(" ")[0], 10) || 0;
  useLayoutEffect(() => {
    if (!anchorBottom) {
      setSpacer(0);
      return;
    }
    const sc = scrollRef.current;
    const ct = contentRef.current;
    if (!sc || !ct) return;
    const free = sc.clientHeight - padTop - padBottom - ct.offsetHeight;
    setSpacer(Math.max(0, Math.round(free)));
  }, [eng.bi, eng.wi, anchorBottom, padTop, padBottom, scrollRef]);

  // Re-pin to the bottom on new words / spacer changes. In the bottom-anchored phone
  // view we ALWAYS pin (so the gap stays constant even as content crosses from
  // "fits" to "overflows"); the wide view only pins when already at the bottom.
  useEffect(() => {
    if (!anchorBottom && !atBottom) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [eng.bi, eng.wi, atBottom, anchorBottom, padding, spacer, scrollRef]);

  // Re-pin when the transcript area itself resizes (e.g. the sheet detent grows/shrinks
  // the available height), so the newest line keeps sitting just above the sheet.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if ((anchorBottom || atBottom) && scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [atBottom, anchorBottom, scrollRef]);

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
        {/* measured spacer pushes the newest line to a constant gap above the panel */}
        <div style={{ flexShrink: 0, height: spacer }} aria-hidden />
        <div
          ref={contentRef}
          style={{ display: "flex", flexDirection: "column" }}
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
          })}
        </div>
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
