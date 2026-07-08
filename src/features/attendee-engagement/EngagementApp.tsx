"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useViewportSize } from "@/hooks/use-mobile";
import { Icon } from "./lib/icons";
import { ICON } from "./lib/reactions-data";
import { useTranscriptStream } from "./lib/useTranscriptStream";
import { useHighlights } from "./lib/useHighlights";
import { useFadeScroll } from "./lib/useFadeScroll";
import { haptic } from "./lib/haptics";
import {
  setTranscriptLang,
  TRANSCRIPT,
  type TranscriptLang,
} from "./data/transcript";
import { captionLangFor, wordlyCodeFor } from "./data/languages";
import { useAttendStream, type AttendConfig } from "./lib/useAttendStream";
import { Transcript } from "./components/Transcript";
import { HighlightsList } from "./components/HighlightsList";
import { Header } from "./components/Header";
import { ShareSheet } from "./components/ShareSheet";
import { SessionEndedSheet } from "./components/SessionEndedSheet";
import { Coach, CoachPanelCard, type CoachVariant } from "./components/Coach";
import styles from "./engagement.module.css";

/** "My Highlights (9)" — the panel/sheet title row (no icon, plain parenthesised count). */
function PanelHeader({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--fg-1)",
          whiteSpace: "nowrap",
        }}
      >
        My Highlights
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-3)" }}>
        ({count})
      </span>
    </div>
  );
}

/** Share affordance in the "My Highlights" header — labelled pill (wide) or icon (phone). */
function ShareButton({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        aria-label="Share highlights"
        title="Share"
        className={`${styles.iconBtn} ${styles.hitArea}`}
        style={{
          width: 30,
          height: 30,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <Icon
          d={ICON.shareIos}
          size={17}
          color="var(--primary-blue-600)"
          sw={1.8}
        />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      aria-label="Share highlights"
      title="Share"
      className={`${styles.fieldBtn} ${styles.hitArea}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid var(--border-2)",
        background: "#fff",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--primary-blue-600)",
      }}
    >
      <Icon
        d={ICON.shareIos}
        size={15}
        color="var(--primary-blue-600)"
        sw={1.8}
      />
      Share
    </button>
  );
}

type Device = "phone" | "tablet" | "desktop";
const DETENTS = { collapsed: 56, peek: 0.46, full: 0.86 } as const;
type DetentKey = keyof typeof DETENTS;

/**
 * The full attendee engagement experience, responsive across phone / tablet / desktop.
 *  - Wide (tablet+desktop): transcript left, "My Highlights" floats as a right panel.
 *  - Phone: "My Highlights" is a bottom sheet with collapsed → peek → full detents.
 * `coach` selects the first-run coaching treatment (B1–B4).
 */
export default function EngagementApp({
  coach = "b1",
  demoEnd = false,
  initialLang,
  live,
}: {
  coach?: CoachVariant;
  /** Demo shortcut (?demo=end): start on the final line so the session ends in seconds. */
  demoEnd?: boolean;
  /** Initial attend language (?lang=ar → Arabic captions + RTL layout). */
  initialLang?: string;
  /** Live session (?code=XXXX-0000[&key=…]) — real /attend feed instead of the demo. */
  live?: AttendConfig;
}) {
  const { width } = useViewportSize();
  const device: Device =
    width === 0 || width >= 1024
      ? "desktop"
      : width >= 768
        ? "tablet"
        : "phone";
  const isWide = device !== "phone";

  const demo = useTranscriptStream({
    active: !live,
    wordMs: 206,
    demoEnd,
  });
  const attend = useAttendStream({
    config: live,
    initialLanguageCode: wordlyCodeFor(initialLang ?? "English (US)"),
  });
  const { eng, last, ended } = live ? attend : demo;
  const hl = useHighlights();
  const panelScroll = useFadeScroll();
  const sheetScroll = useFadeScroll();
  const [shareOpen, setShareOpen] = useState(false);
  // TTS/audio toggle lifted from the header so the transcript can mark the bubble
  // currently being read aloud (spec §4).
  const [audio, setAudio] = useState(false);

  // ── End-of-session flow (spec §2): on session end or early leave, the attendee
  //    gets their highlights and can copy them out. ─────────────────────────────
  const [endedOpen, setEndedOpen] = useState(false);
  const [endReason, setEndReason] = useState<"ended" | "leave">("ended");
  useEffect(() => {
    if (ended) {
      setEndReason("ended");
      setEndedOpen(true);
      haptic("success");
    }
  }, [ended]);
  const openLeave = () => {
    setEndReason("leave");
    setEndedOpen(true);
  };
  // Single shared reaction-rail state — one screen-fixed rail acting on `railId`.
  const [railId, setRailId] = useState<number | null>(null);
  // A short hover-close delay lets the pointer travel from a line to the fixed rail
  // (which sits away from the bubble) without the rail dismissing mid-journey.
  const railTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // useCallback-stable: these feed the memoized bubbles — fresh identities every
  // word-tick would defeat React.memo and re-render the whole transcript 5×/s.
  const openRail = useCallback((id: number | null) => {
    if (railTimer.current) clearTimeout(railTimer.current);
    railTimer.current = null;
    setRailId(id);
  }, []);
  const scheduleRailClose = useCallback(() => {
    if (railTimer.current) clearTimeout(railTimer.current);
    railTimer.current = setTimeout(() => setRailId(null), 240);
  }, []);

  const [detent, setDetent] = useState<DetentKey>(
    coach === "b1" ? "peek" : "collapsed"
  );
  const sheetDrag = useRef<{
    y: number;
    h: number;
    from: DetentKey;
  } | null>(null);
  // True once a press has moved far enough to count as a drag — used to suppress the
  // handle's tap-to-cycle so a swipe doesn't ALSO cycle the detent after snapping.
  const didDrag = useRef(false);
  const [dragH, setDragH] = useState<number | null>(null);

  const emptyState = coach === "b1" ? <CoachPanelCard /> : undefined;

  // Live connection pill — visible while connecting / on terminal errors.
  const liveBadge =
    live && attend.status !== "live" && !ended ? (
      <div
        dir="auto"
        style={{
          position: "absolute",
          top: 64,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          padding: "7px 14px",
          borderRadius: 999,
          background: "#fff",
          border: "1px solid var(--border-1)",
          boxShadow: "var(--shadow-sm)",
          fontSize: 13,
          fontWeight: 600,
          color:
            attend.status === "error" ? "var(--error, #E62D21)" : "var(--fg-3)",
          whiteSpace: "nowrap",
          maxWidth: "90%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {attend.status === "error"
          ? attend.errorMsg
          : `Connecting to ${live.code}…`}
      </div>
    ) : null;

  // ── Attend language + RTL (spec §1: bubble alignment, rail placement, panel all
  //    mirror for RTL languages). Captions swap synchronously BEFORE the re-render
  //    so the transcript, cards, and share text all read the new language at once. ──
  const [lang, setLang] = useState(() => {
    const l = initialLang ?? "English (US)";
    // Demo only — the live feed owns TRANSCRIPT (see the guard on the effect below).
    if (!live) setTranscriptLang(captionLangFor(l));
    return l;
  });
  // Per-bubble caption language (spec §14): a language switch applies only to bubbles
  // that stream AFTER it, so already-shown bubbles keep the language/direction they were
  // streamed in — a session can end up mixing LTR + RTL alignment.
  const [bubbleLang, setBubbleLang] = useState<TranscriptLang[]>(() =>
    Array(TRANSCRIPT.length).fill(captionLangFor(initialLang ?? "English (US)"))
  );
  const onLang = (l: string) => {
    if (live) attend.changeLanguage(wordlyCodeFor(l));
    const cap = captionLangFor(l);
    // Freeze everything up to and including the current line; switch only what's next.
    setBubbleLang((prev) => prev.map((v, i) => (i > last ? cap : v)));
    setLang(l);
  };
  // Keep the GLOBAL transcript (which the stream engine reads for reveal + word timing)
  // in the CURRENT bubble's language, so the engine's word counts match what's rendered.
  // Per-bubble rendering reads its own language snapshot, independent of this.
  // DEMO ONLY: setTranscriptLang refills TRANSCRIPT with the demo script — in live
  // mode that would wipe the live-fed phrases (the attend feed owns the array).
  useEffect(() => {
    if (live) return;
    setTranscriptLang(
      bubbleLang[Math.min(last, bubbleLang.length - 1)] ?? "en"
    );
  }, [live, last, bubbleLang]);
  // Mirroring is scoped to the CONTENT (the transcript column + reaction rail):
  // `dir` is applied on <Transcript> only. The chrome — header, highlights panel,
  // sheets, overlays — stays LTR (its copy is English); Arabic text inside cards
  // handles its own direction via dir="auto".

  // Re-check the "more below" fade whenever content height can change outside a
  // scroll event: cards added/removed, detent snap, viewport resize.
  useEffect(() => {
    panelScroll.check();
    sheetScroll.check();
  }, [hl.count, detent, width, panelScroll, sheetScroll]);

  // Newest highlight appends at the bottom of the list — bring it into view when the
  // count grows (desktop panel or mobile sheet). rAF lets the new card lay out first.
  const prevHlCount = useRef(0);
  useEffect(() => {
    if (hl.count > prevHlCount.current) {
      const el = isWide ? panelScroll.ref.current : sheetScroll.ref.current;
      requestAnimationFrame(() =>
        el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
      );
    }
    prevHlCount.current = hl.count;
  }, [hl.count, isWide, panelScroll, sheetScroll]);

  // ── Wide: transcript + floating right panel ──────────────────────────────────
  if (isWide) {
    const panelW = device === "desktop" ? 348 : 290;
    // Transcript metrics, shared with the rail so it can sit right beside the bubble
    // column (not floating out by the panel).
    const tPadLeft = device === "desktop" ? 34 : 26;
    // Tighter right padding closes the gutter between the transcript and the highlights
    // panel (Justin: too much space between the bubble and the panel).
    const tPad = device === "desktop" ? "78px 20px 28px" : "70px 16px 26px";
    const vw = width || 1280;
    // Fluid bubbles: cap at 80% of the transcript REGION (not a fixed px column), so
    // large screens don't strand a lane of empty space beside the conversation.
    const tW = vw - panelW;
    const bubbleMax = Math.round((tW - tPadLeft * 2) * 0.8);
    return (
      <div
        className={styles.root}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#F0F7FF",
        }}
      >
        <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
          <Transcript
            eng={eng}
            last={last}
            hl={hl}
            live={!!live}
            bubbleLang={bubbleLang}
            maxWidth={bubbleMax}
            fontSize={16}
            padding={tPad}
            openRailId={railId}
            onRail={openRail}
            onHoverOpen={openRail}
            onHoverClose={scheduleRailClose}
          />
          <div
            style={{
              width: panelW,
              flexShrink: 0,
              position: "relative",
              zIndex: 8,
              display: "flex",
              flexDirection: "column",
              padding:
                device === "desktop"
                  ? "96px 18px 18px 2px"
                  : "84px 16px 16px 2px",
            }}
          >
            <div
              className={styles.shinyBorder}
              style={{
                flex: 1,
                minHeight: 0,
                background: "#fff",
                borderRadius: 18,
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  padding: "14px 15px 11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <PanelHeader count={hl.count} />
                {hl.count > 0 ? (
                  <ShareButton onClick={() => setShareOpen(true)} />
                ) : null}
              </div>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  ref={panelScroll.ref}
                  onScroll={panelScroll.onScroll}
                  className={styles.appleScroll}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    // Top padding keeps the first card's outset ring from being clipped
                    // against / overlapping the header row above it.
                    padding: "7px 13px 14px",
                  }}
                >
                  <HighlightsList hl={hl} emptyState={emptyState} />
                </div>
                {/* Soft veils — below while more cards continue past the fold, above
                    once scrolled down (content above the fold). */}
                <div
                  className={styles.scrollFade}
                  style={{ borderRadius: "0 0 18px 18px" }}
                />
                <div className={styles.scrollFadeTop} />
              </div>
            </div>
          </div>
        </div>
        <Header
          logoHeight="22px"
          onLeave={openLeave}
          lang={lang}
          onLang={onLang}
          audio={audio}
          onAudio={setAudio}
        />
        {liveBadge}
        <Coach variant={coach} hasSaved={hl.count > 0} />
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          hl={hl}
        />
        <SessionEndedSheet
          open={endedOpen}
          onClose={() => setEndedOpen(false)}
          onLeave={() => (window.location.href = "/dashboard")}
          hl={hl}
          reason={endReason}
        />
      </div>
    );
  }

  // ── Phone: transcript + bottom-sheet detents ─────────────────────────────────
  const vh = width === 0 ? 720 : Math.max(window?.innerHeight ?? 720, 480);
  const collapsedH = DETENTS.collapsed;
  // Peek is a compact dock — just the newest highlight + the "+N more" affordance —
  // not a half-sheet, so plenty of transcript stays visible above it.
  const peekH = Math.min(300, Math.round(vh * 0.4));
  const targetH =
    detent === "collapsed"
      ? collapsedH
      : detent === "peek"
        ? peekH
        : vh * DETENTS.full;
  const sheetH = dragH ?? targetH;

  const onHandleDown = (e: React.PointerEvent) => {
    sheetDrag.current = { y: e.clientY, h: sheetH, from: detent };
    didDrag.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    if (!sheetDrag.current) return;
    const dy = sheetDrag.current.y - e.clientY;
    if (Math.abs(dy) > 6) didDrag.current = true;
    setDragH(
      Math.min(vh * 0.9, Math.max(collapsedH, sheetDrag.current.h + dy))
    );
  };
  const onHandleUp = () => {
    const drag = sheetDrag.current;
    if (dragH != null && drag) {
      const opts: [DetentKey, number][] = [
        ["collapsed", collapsedH],
        ["peek", peekH],
        ["full", vh * DETENTS.full],
      ];
      const startIdx = opts.findIndex((o) => o[0] === drag.from);
      // Nearest detent by height…
      let nearest = 0;
      for (let i = 1; i < opts.length; i++)
        if (Math.abs(opts[i][1] - dragH) < Math.abs(opts[nearest][1] - dragH))
          nearest = i;
      // …but a deliberate swipe always advances at least one detent in its direction,
      // so a short flick up out of collapsed opens rather than snapping back.
      let target = nearest;
      const movedUp = dragH > drag.h + 6;
      const movedDown = dragH < drag.h - 6;
      if (movedUp && target <= startIdx)
        target = Math.min(opts.length - 1, startIdx + 1);
      if (movedDown && target >= startIdx) target = Math.max(0, startIdx - 1);
      haptic("selection");
      setDetent(opts[target][0]);
    }
    sheetDrag.current = null;
    setDragH(null);
  };
  const cycle = () => {
    // Suppress the tap-to-cycle when the gesture was actually a drag/swipe (onHandleUp
    // already snapped to the right detent).
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    haptic("selection");
    setDetent((d) =>
      d === "collapsed" ? "peek" : d === "peek" ? "full" : "collapsed"
    );
  };

  return (
    <div
      className={styles.root}
      style={{
        position: "relative",
        height: "100%",
        background: "#F0F7FF",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* The transcript occupies only the space ABOVE the sheet (bottom = sheet
          height), so the newest line always sits just above it and is never rendered
          behind it. The area shrinks/grows with the sheet detents. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: sheetH,
          display: "flex",
          transition: sheetDrag.current
            ? "none"
            : "bottom .26s cubic-bezier(.32,.72,0,1)",
        }}
      >
        <Transcript
          eng={eng}
          last={last}
          hl={hl}
          live={!!live}
          maxWidth="80%"
          bubbleLang={bubbleLang}
          fontSize={15}
          padding="70px 18px 22px"
          openRailId={railId}
          onRail={openRail}
          onHoverOpen={openRail}
          onHoverClose={scheduleRailClose}
        />
      </div>
      <Header
        logoHeight="24px"
        compact
        onLeave={openLeave}
        lang={lang}
        onLang={onLang}
        audio={audio}
        onAudio={setAudio}
      />
      <Coach variant={coach} hasSaved={hl.count > 0} />

      {/* Bottom sheet. A thin brand-gradient accent (.auraGlow) hugs the top edge —
          subtle, not a glowing halo — and the lift shadow is soft + lightly blue so it
          doesn't haze the transcript gray behind it. (NOT .shinyBorder here: the blurred
          negative-z halo was near-invisible at rest on mobile and only surfaced via
          iOS sticky :hover while dragging — and its full-card blur fights the sheet's
          height animation. The desktop panel keeps the halo, where hover is real.) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetH,
          transition: sheetDrag.current
            ? "none"
            : "height .26s cubic-bezier(.32,.72,0,1)",
          zIndex: 25,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            background: "#fff",
            borderRadius: "18px 18px 0 0",
            boxShadow:
              "0 -1px 1px rgba(15,23,42,.04), 0 -10px 24px rgba(1,124,255,.07)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span className={styles.auraGlow} aria-hidden="true" />
          <div
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onClick={cycle}
            style={{
              flexShrink: 0,
              padding: "8px 15px 10px",
              cursor: "grab",
              touchAction: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 999,
                background: "var(--gray-300)",
                margin: "0 auto 10px",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Share sits WITH the title (the thing it acts on); the accordion
                  chevron stands alone at the far edge — a full row of separation
                  between the two tap targets, not just a wider gap. */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PanelHeader count={hl.count} />
                {hl.count > 0 ? (
                  // Stop the handle's drag/tap-to-cycle from firing on the share tap.
                  <span
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShareButton compact onClick={() => setShareOpen(true)} />
                  </span>
                ) : null}
              </div>
              {/* Accordion indicator points in the DIRECTION OF THE ACTION: chevron
                  up while collapsed/peek (tap to expand the sheet upward), down at
                  full (tap to collapse it back down). */}
              <Icon
                d={ICON.chevron}
                size={18}
                color="var(--fg-3)"
                style={{
                  transform: detent === "full" ? "none" : "rotate(180deg)",
                  transition: "transform .2s ease",
                }}
              />
            </div>
          </div>
          {detent !== "collapsed" ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                ref={sheetScroll.ref}
                onScroll={sheetScroll.onScroll}
                className={styles.appleScroll}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  // Top padding so the first card's outset ring clears the header row.
                  padding: "7px 13px 16px",
                }}
              >
                <HighlightsList
                  hl={hl}
                  emptyState={emptyState}
                  // Peek detent: show the newest highlight + a "+N more" pill that expands
                  // the sheet to full. Full detent: the complete scrollable list.
                  peek={detent === "peek"}
                  onExpand={() => {
                    haptic("selection");
                    setDetent("full");
                  }}
                />
              </div>
              {/* Soft veils — same pattern as the desktop panel. */}
              <div className={styles.scrollFade} />
              <div className={styles.scrollFadeTop} />
            </div>
          ) : null}
        </div>
      </div>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        compact
        hl={hl}
      />
      <SessionEndedSheet
        open={endedOpen}
        onClose={() => setEndedOpen(false)}
        onLeave={() => (window.location.href = "/dashboard")}
        compact
        hl={hl}
        reason={endReason}
      />
    </div>
  );
}
