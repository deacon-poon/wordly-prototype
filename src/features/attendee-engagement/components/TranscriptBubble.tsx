import { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import type { CSSProperties } from "react";
import type { Bubble } from "../data/transcript";
import { SPK } from "../data/transcript";
import { REACT5, ICON_FOR } from "../lib/reactions-data";
import { Icon } from "../lib/icons";
import { Words } from "./Words";
import { haptic } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

const RADIUS = "6px 20px 20px 20px";

/**
 * A single transcript line.
 *  - one click  → save / un-save (plain 📌)
 *  - long-press (or tapping the corner chip) → reaction rail (👍 👎 💡 ❓ 📌)
 *  - saved lines get a soft blue ring + a corner chip; reacted lines tint to the
 *    reaction's colour. Ported from the Claude Design "Current version" board.
 */
export function TranscriptBubble({
  bubble,
  count,
  done,
  isLatest,
  hl,
  showName,
  showCaret,
  maxWidth = "80%",
  fontSize = 14.5,
}: {
  bubble: Bubble;
  count: number;
  done: boolean;
  isLatest: boolean;
  hl: Highlights;
  showName: boolean;
  showCaret: boolean;
  maxWidth?: number | string;
  fontSize?: number;
}) {
  const [hover, setHover] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);

  const saved = hl.get(bubble.id);
  const reacted = !!saved && saved.tag !== "📌";
  const r = saved ? ICON_FOR[saved.tag] : null;

  const bg =
    reacted && r ? r.cbg2 || r.cbg : saved ? "var(--primary-blue-25)" : "#fff";
  const ring =
    reacted && r
      ? `0 0 0 2px ${r.cbdr}`
      : saved
        ? "0 0 0 1.5px var(--border-brand)"
        : "var(--shadow-xs)";
  const lift = hover && !saved ? "0 7px 20px rgba(1,124,255,.20)" : null;

  const bubbleStyle: CSSProperties = {
    position: "relative",
    background: bg,
    borderRadius: RADIUS,
    padding: "10px 14px",
    fontSize,
    lineHeight: 1.46,
    color: "var(--fg-1)",
    cursor: "pointer",
    boxShadow: lift || ring,
    transform: lift ? "translateY(-2px)" : "none",
    transition: "box-shadow .18s ease, transform .18s ease",
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  const onBubbleClick = () => {
    if (lpFired.current) {
      lpFired.current = false;
      return;
    }
    hl.toggleSave(bubble.id);
  };
  const startLp = () => {
    lpFired.current = false;
    clearTimeout(lpTimer.current as never);
    lpTimer.current = setTimeout(() => {
      lpFired.current = true;
      haptic("medium"); // confirm the long-press gesture registered
      setRailOpen(true);
    }, 450);
  };
  const cancelLp = () => clearTimeout(lpTimer.current as never);

  const chipR = r ?? ICON_FOR["📌"];

  return (
    <div
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
          {SPK(bubble).name}
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

      <Popover.Root open={railOpen} onOpenChange={setRailOpen}>
        <Popover.Anchor asChild>
          <div style={{ position: "relative", maxWidth }}>
            <div
              style={bubbleStyle}
              onClick={onBubbleClick}
              onPointerDown={startLp}
              onPointerUp={cancelLp}
              onPointerLeave={() => {
                cancelLp();
                setHover(false);
              }}
              onMouseEnter={() => setHover(true)}
            >
              <Words bubble={bubble} count={count} done={done} />
            </div>

            {saved ? (
              <button
                className={styles.rxChip}
                title={
                  reacted
                    ? `Change reaction · ${chipR.l}`
                    : "Saved · tap to react"
                }
                aria-label={reacted ? "Change reaction" : "React"}
                onClick={(e) => {
                  e.stopPropagation();
                  haptic("light");
                  setRailOpen(true);
                }}
                style={{
                  position: "absolute",
                  bottom: -9,
                  right: -7,
                  zIndex: 5,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "#fff",
                  border: `1px solid ${chipR.cbdr}`,
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  animation: "wEngPopIn .22s ease-out",
                }}
              >
                <Icon d={chipR.icon} size={13} color={chipR.c} />
              </button>
            ) : null}
          </div>
        </Popover.Anchor>

        <Popover.Portal>
          <Popover.Content
            side="right"
            align="end"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
            // styles.root re-declares the DS tokens: Radix portals this content to
            // <body>, outside the feature root, so without it every var(--…) the
            // reaction icons/colours reference would be undefined (invisible rail).
            className={styles.root}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 3,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid var(--border-1)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 60,
            }}
          >
            {REACT5.map((opt) => {
              const on = saved?.tag === opt.e;
              return (
                <button
                  key={opt.e}
                  className={styles.rxEmoji}
                  title={opt.l}
                  aria-label={opt.l}
                  onClick={() => {
                    hl.react(bubble.id, opt.e);
                    setRailOpen(false);
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    border: `1px solid ${on ? opt.cbdr : "transparent"}`,
                    background: on ? opt.cbg : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {/* always rendered in the reaction's own colour so the rail reads
                      as colour-coded; the active one also gets a tinted pill. */}
                  <Icon d={opt.icon} size={16} color={opt.c} />
                </button>
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
