"use client";

import { useEffect, useRef, useState } from "react";
import { useViewportSize } from "@/hooks/use-mobile";
import { Icon } from "./lib/icons";
import { ICON } from "./lib/reactions-data";
import { useTranscriptStream } from "./lib/useTranscriptStream";
import { useHighlights } from "./lib/useHighlights";
import { useFadeScroll } from "./lib/useFadeScroll";
import { haptic } from "./lib/haptics";
import { setTranscriptLang } from "./data/transcript";
import { isRTLLang, captionLangFor } from "./data/languages";
import { Transcript } from "./components/Transcript";
import { ReactionRail } from "./components/ReactionRail";
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
}: {
  coach?: CoachVariant;
  /** Demo shortcut (?demo=end): start on the final line so the session ends in seconds. */
  demoEnd?: boolean;
  /** Initial attend language (?lang=ar → Arabic captions + RTL layout). */
  initialLang?: string;
}) {
  const { width } = useViewportSize();
  const device: Device =
    width === 0 || width >= 1024
      ? "desktop"
      : width >= 768
        ? "tablet"
        : "phone";
  const isWide = device !== "phone";

  const { eng, last, ended } = useTranscriptStream({
    active: true,
    wordMs: 206,
    demoEnd,
  });
  const hl = useHighlights();
  const panelScroll = useFadeScroll();
  const sheetScroll = useFadeScroll();
  const [shareOpen, setShareOpen] = useState(false);

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
  const clearRailTimer = () => {
    if (railTimer.current) {
      clearTimeout(railTimer.current);
      railTimer.current = null;
    }
  };
  const openRail = (id: number | null) => {
    clearRailTimer();
    setRailId(id);
  };
  const closeRail = () => {
    clearRailTimer();
    setRailId(null);
  };
  const scheduleRailClose = () => {
    clearRailTimer();
    railTimer.current = setTimeout(() => setRailId(null), 240);
  };

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

  // ── Attend language + RTL (spec §1: bubble alignment, rail placement, panel all
  //    mirror for RTL languages). Captions swap synchronously BEFORE the re-render
  //    so the transcript, cards, and share text all read the new language at once. ──
  const [lang, setLang] = useState(() => {
    const l = initialLang ?? "English (US)";
    setTranscriptLang(captionLangFor(l));
    return l;
  });
  const rtl = isRTLLang(lang);
  const dir = rtl ? "rtl" : "ltr";
  const onLang = (l: string) => {
    setTranscriptLang(captionLangFor(l));
    setLang(l);
  };
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

  // ── Wide: transcript + floating right panel ──────────────────────────────────
  if (isWide) {
    const panelW = device === "desktop" ? 348 : 290;
    // Transcript metrics, shared with the rail so it can sit right beside the bubble
    // column (not floating out by the panel).
    const tPadLeft = device === "desktop" ? 34 : 26;
    const tPad = device === "desktop" ? "78px 34px 28px" : "70px 26px 26px";
    const vw = width || 1280;
    // Fluid bubbles: cap at 80% of the transcript REGION (not a fixed px column), so
    // large screens don't strand a lane of empty space beside the conversation.
    const tW = vw - panelW;
    const bubbleMax = Math.round((tW - tPadLeft * 2) * 0.8);
    // Rail hugs the bubbles' edge: just past their max width in LTR; in RTL the
    // bubbles right-align within the transcript, so the rail mirrors to their left.
    const railLeft = Math.min(tPadLeft + bubbleMax + 14, tW - 64);
    const railLeftRtl = Math.max(12, tW - tPadLeft - bubbleMax - 62);
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
            dir={dir}
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
                <HighlightsList
                  hl={hl}
                  emptyState={emptyState}
                  railId={railId}
                  onEditReaction={openRail}
                />
              </div>
              {/* Soft "more below" veil — shows only while cards continue past the fold. */}
              <div
                className={styles.scrollFade}
                style={{ borderRadius: "0 0 18px 18px" }}
              />
            </div>
          </div>
        </div>
        <Header
          logoHeight="22px"
          onLeave={openLeave}
          lang={lang}
          onLang={onLang}
        />
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
        <ReactionRail
          bubbleId={railId}
          hl={hl}
          // Fixed just to the right of the bubble column, vertically centred — a
          // stable spot right beside the lines, not per-bubble.
          // Beside the bubbles: past their right edge in LTR; in RTL (bubbles
          // right-aligned) mirrored to their left edge.
          positionStyle={{
            left: rtl ? railLeftRtl : railLeft,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onClose={closeRail}
          onHoverKeep={clearRailTimer}
          onHoverLeave={scheduleRailClose}
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

  // Opening the rail while the sheet is full leaves no room above it for the rail, so
  // drop to peek first — the transcript (and rail) get space, the card stays in view.
  const openRailPhone = (id: number | null) => {
    if (id != null && detent === "full") setDetent("peek");
    openRail(id);
  };

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
          maxWidth="80%"
          dir={dir}
          fontSize={15}
          padding="70px 18px 22px"
          openRailId={railId}
          onRail={openRailPhone}
          onHoverOpen={openRailPhone}
          onHoverClose={scheduleRailClose}
        />
      </div>
      <Header
        logoHeight="20px"
        compact
        onLeave={openLeave}
        lang={lang}
        onLang={onLang}
      />
      <Coach variant={coach} hasSaved={hl.count > 0} />

      {/* Bottom sheet. A thin brand-gradient accent (.auraGlow) hugs the top edge —
          subtle, not a glowing halo — and the lift shadow is soft + lightly blue so it
          doesn't haze the transcript gray behind it. */}
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
          className={styles.shinyBorder}
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
              <PanelHeader count={hl.count} />
              {/* Comfortable separation between the share tap-target and the
                  accordion chevron (they were nearly touching). */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {hl.count > 0 ? (
                  // Stop the handle's drag/tap-to-cycle from firing on the share tap.
                  <span
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShareButton compact onClick={() => setShareOpen(true)} />
                  </span>
                ) : null}
                {/* Accordion indicator: chevron points down at collapsed/peek
                    (expand) and flips up at full (collapse). */}
                <Icon
                  d={ICON.chevron}
                  size={18}
                  color="var(--fg-3)"
                  style={{
                    transform: detent === "full" ? "rotate(180deg)" : "none",
                    transition: "transform .2s ease",
                  }}
                />
              </div>
            </div>
          </div>
          {detent !== "collapsed" ? (
            <>
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
                  railId={railId}
                  onEditReaction={openRailPhone}
                  // Peek detent: show the newest highlight + a "+N more" pill that expands
                  // the sheet to full. Full detent: the complete scrollable list.
                  peek={detent === "peek"}
                  onExpand={() => {
                    haptic("selection");
                    setDetent("full");
                  }}
                />
              </div>
              {/* Soft "more below" veil — same pattern as the desktop panel. */}
              <div className={styles.scrollFade} />
            </>
          ) : null}
        </div>
      </div>

      <ReactionRail
        bubbleId={railId}
        hl={hl}
        // Fixed on the right edge, vertically centred in the transcript area (the space
        // above the current sheet detent). Editing a card first drops the sheet to peek
        // (see openRailPhone), so the rail always has room here.
        positionStyle={{
          ...(rtl ? { left: 12 } : { right: 12 }),
          top: `${(vh - sheetH) / 2}px`,
          transform: "translateY(-50%)",
        }}
        onClose={closeRail}
        onHoverKeep={clearRailTimer}
        onHoverLeave={scheduleRailClose}
      />
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
