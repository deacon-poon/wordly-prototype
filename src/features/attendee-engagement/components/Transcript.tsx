import { useCallback, useEffect, useState } from "react";
import {
  TRANSCRIPT,
  SPK,
  scriptFor,
  speakerNameFor,
  isCaptionRTL,
  type TranscriptLang,
} from "../data/transcript";
import { isRTLCode } from "../data/languages";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { TranscriptBubble } from "./TranscriptBubble";
import { useFadeScroll } from "../lib/useFadeScroll";
import { haptic, useHapticRef } from "../lib/haptics";
import type { StreamState } from "../lib/useTranscriptStream";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/** The streaming transcript column — auto-scrolls while pinned to the bottom (via
 *  `column-reverse`) and shows a "jump to latest" affordance when the user scrolls up. */
export function Transcript({
  eng,
  last,
  hl,
  live = false,
  bubbleLang,
  maxWidth,
  fontSize,
  padding,
  openRailId,
  onRail,
  onHoverOpen,
  onHoverClose,
}: {
  eng: StreamState;
  last: number;
  hl: Highlights;
  /** LIVE session (?code=): bubbles come from the live-fed TRANSCRIPT — each stamped
   *  with the language it streamed in — instead of the demo's per-language snapshots. */
  live?: boolean;
  /** DEMO: caption language per bubble index. Each bubble renders in its own language +
   *  direction (spec §14), so a mid-session switch mixes LTR + RTL. Only the transcript
   *  mirrors per-bubble; the surrounding chrome (header/panel) stays LTR. */
  bubbleLang: TranscriptLang[];
  maxWidth: number | string;
  fontSize: number;
  padding: string;
  /** Lifted single-open reaction-rail state so only one bubble's rail shows. */
  openRailId: number | null;
  onRail: (id: number | null) => void;
  /** Desktop hover on a line opens the shared rail for it; leaving schedules a close. */
  onHoverOpen: (id: number) => void;
  onHoverClose: () => void;
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
  // Guarded — a redundant scrollTop write every word-tick interrupts iOS momentum
  // scrolling/bounce and reads as jank.
  useEffect(() => {
    if (!atBottom) return;
    const el = scrollRef.current;
    if (el && el.scrollTop !== 0) el.scrollTop = 0;
  }, [eng.bi, eng.wi, atBottom, scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const cur = scrollRef.current;
      if (atBottom && cur && cur.scrollTop !== 0) cur.scrollTop = 0;
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

  // Stable, id-taking callbacks so the memoized bubbles bail out of the word-tick
  // re-render storm (fresh per-bubble closures would defeat React.memo entirely).
  const onRailChange = useCallback(
    (id: number, open: boolean) => onRail(open ? id : null),
    [onRail]
  );

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
          // NO mask on the scroller: masking a scroll container forces expensive
          // per-frame compositing on mobile Safari (measured scroll jank). The
          // header's gradient scrim already fades content at the top edge.
        }}
      >
        {Array.from({ length: last + 1 }, (_, idx) => {
          // Render each bubble in the language it was streamed in (spec §14). LIVE
          // bubbles carry their own text + language stamp (the feed already serves
          // the phrase translated); demo bubbles read the per-language snapshots.
          const lang = bubbleLang[idx] ?? "en";
          const src = live ? TRANSCRIPT : scriptFor(lang);
          const b = src[idx];
          if (!b) return null;
          const prev = idx > 0 ? src[idx - 1] : null;
          const speakerChanged = !prev || prev.sp !== b.sp; // sp is language-independent
          const rtl = live ? isRTLCode(b.lang) : isCaptionRTL(lang);
          return (
            <TranscriptBubble
              key={b.id}
              bubble={b}
              dir={rtl ? "rtl" : "ltr"}
              speakerName={live ? SPK(b).name : speakerNameFor(lang, b.sp).name}
              count={idx < eng.bi ? 9999 : eng.wi}
              done={idx < eng.bi}
              isLatest={b.id === latestId}
              saved={hl.get(b.id)}
              onToggleSave={hl.toggleSave}
              onReact={hl.react}
              showName={idx === 0}
              showCaret={speakerChanged && idx !== 0}
              maxWidth={maxWidth}
              fontSize={fontSize}
              railOpen={openRailId === b.id}
              onRailChange={onRailChange}
              onHoverOpen={onHoverOpen}
              onHoverClose={onHoverClose}
            />
          );
          // column-reverse renders DOM-first at the bottom, so reverse to keep
          // natural reading order (oldest at top → newest at bottom).
        }).reverse()}
      </div>

      {!atBottom ? (
        <button
          ref={hapticRef}
          onClick={jump}
          aria-label="Jump to latest"
          title="Jump to latest"
          style={{
            position: "absolute",
            insetInlineEnd: 20,
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
