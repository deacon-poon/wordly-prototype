"use client";

import { useRef, useState } from "react";
import { useViewportSize } from "@/hooks/use-mobile";
import { Icon } from "./lib/icons";
import { ICON } from "./lib/reactions-data";
import { useTranscriptStream } from "./lib/useTranscriptStream";
import { useHighlights } from "./lib/useHighlights";
import { useFadeScroll } from "./lib/useFadeScroll";
import { haptic } from "./lib/haptics";
import { Transcript } from "./components/Transcript";
import { HighlightsList } from "./components/HighlightsList";
import { Header } from "./components/Header";
import { Coach, CoachPanelCard, type CoachVariant } from "./components/Coach";
import styles from "./engagement.module.css";

const BLUE = "var(--primary-blue-400)";

/** Bookmark + "My Highlights" + count badge — the panel/sheet title row. */
function PanelHeader({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon d={ICON.lBookmark} size={17} color={BLUE} fill={BLUE} />
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
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 18,
          height: 18,
          padding: "0 5px",
          borderRadius: 999,
          background: BLUE,
          color: "#fff",
          fontSize: 10.5,
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    </div>
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
}: {
  coach?: CoachVariant;
}) {
  const { width } = useViewportSize();
  const device: Device =
    width === 0 || width >= 1024
      ? "desktop"
      : width >= 768
        ? "tablet"
        : "phone";
  const isWide = device !== "phone";

  const { eng, last } = useTranscriptStream({ active: true, wordMs: 206 });
  const hl = useHighlights();
  const panelScroll = useFadeScroll();
  const sheetScroll = useFadeScroll();

  const [detent, setDetent] = useState<DetentKey>(
    coach === "b1" ? "peek" : "collapsed"
  );
  const sheetDrag = useRef<{ y: number; h: number } | null>(null);
  const [dragH, setDragH] = useState<number | null>(null);

  const emptyState = coach === "b1" ? <CoachPanelCard /> : undefined;

  // ── Wide: transcript + floating right panel ──────────────────────────────────
  if (isWide) {
    const panelW = device === "desktop" ? 348 : 290;
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
            maxWidth={device === "desktop" ? 660 : 500}
            fontSize={14.5}
            padding={device === "desktop" ? "78px 34px 28px" : "70px 26px 26px"}
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
              <div style={{ flexShrink: 0, padding: "14px 15px 11px" }}>
                <PanelHeader count={hl.count} />
              </div>
              <div
                ref={panelScroll.ref}
                onScroll={panelScroll.onScroll}
                className={styles.appleScroll}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: "0 13px 14px",
                }}
              >
                <HighlightsList hl={hl} emptyState={emptyState} />
              </div>
            </div>
          </div>
        </div>
        <Header logoHeight="22px" />
        <Coach variant={coach} hasSaved={hl.count > 0} />
      </div>
    );
  }

  // ── Phone: transcript + bottom-sheet detents ─────────────────────────────────
  const vh = width === 0 ? 720 : Math.max(window?.innerHeight ?? 720, 480);
  const collapsedH = DETENTS.collapsed;
  const targetH =
    detent === "collapsed"
      ? collapsedH
      : detent === "peek"
        ? vh * DETENTS.peek
        : vh * DETENTS.full;
  const sheetH = dragH ?? targetH;

  const onHandleDown = (e: React.PointerEvent) => {
    sheetDrag.current = { y: e.clientY, h: sheetH };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    if (!sheetDrag.current) return;
    const dy = sheetDrag.current.y - e.clientY;
    setDragH(
      Math.min(vh * 0.9, Math.max(collapsedH, sheetDrag.current.h + dy))
    );
  };
  const onHandleUp = () => {
    if (dragH != null) {
      // snap to nearest detent
      const opts: [DetentKey, number][] = [
        ["collapsed", collapsedH],
        ["peek", vh * DETENTS.peek],
        ["full", vh * DETENTS.full],
      ];
      let best = opts[0];
      for (const o of opts)
        if (Math.abs(o[1] - dragH) < Math.abs(best[1] - dragH)) best = o;
      haptic("selection");
      setDetent(best[0]);
    }
    sheetDrag.current = null;
    setDragH(null);
  };
  const cycle = () => {
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
      <Transcript
        eng={eng}
        last={last}
        hl={hl}
        maxWidth="80%"
        fontSize={13.5}
        padding={`70px 18px ${collapsedH + 18}px`}
      />
      <Header logoHeight="20px" compact />
      <Coach variant={coach} hasSaved={hl.count > 0} />

      {/* Bottom sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetH,
          background: "#fff",
          borderRadius: "18px 18px 0 0",
          boxShadow: "0 -8px 28px rgba(15,23,42,.16)",
          display: "flex",
          flexDirection: "column",
          transition: sheetDrag.current
            ? "none"
            : "height .26s cubic-bezier(.32,.72,0,1)",
          zIndex: 25,
        }}
      >
        {/* aurora glow along the sheet's top edge (parity with the desktop panel halo) */}
        <span className={styles.auraGlow} />
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
            <Icon
              d={detent === "full" ? ICON.minimize2 : ICON.maximize}
              size={16}
              color="var(--fg-3)"
            />
          </div>
        </div>
        {detent !== "collapsed" ? (
          <div
            ref={sheetScroll.ref}
            onScroll={sheetScroll.onScroll}
            className={styles.appleScroll}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "0 13px 16px",
            }}
          >
            <HighlightsList hl={hl} emptyState={emptyState} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
