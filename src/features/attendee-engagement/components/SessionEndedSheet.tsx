import { useState } from "react";
import type { CSSProperties } from "react";
import { Overlay } from "./Overlay";
import { buildShareText } from "./ShareSheet";
import { HighlightsReadback } from "./HighlightsReadback";
import { Icon } from "../lib/icons";
import { ICON } from "../lib/reactions-data";
import { haptic } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/**
 * End-of-session flow (MVP spec §2, Figma "Attend Session Ended"): on session end —
 * or when the attendee leaves early — they get their highlights and can copy them
 * out. Read-back list of saved lines (reaction chip + remove), then a stacked action
 * column: Copy My Highlights (primary) · Share · Close.
 *
 * `reason` tunes the copy: "ended" = the stream finished; "leave" = the attendee
 * chose Leave Session mid-stream (closing here is what actually leaves).
 */
export function SessionEndedSheet({
  open,
  onClose,
  onLeave,
  compact,
  hl,
  reason,
}: {
  open: boolean;
  /** Backdrop / ✕ / Close-after-end — dismiss and stay on the transcript. */
  onClose: () => void;
  /** Confirm leaving (reason "leave") — navigate out of the session. */
  onLeave: () => void;
  compact?: boolean;
  hl: Highlights;
  reason: "ended" | "leave";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    haptic("success");
    try {
      await navigator.clipboard?.writeText(buildShareText(hl));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op in the prototype */
    }
  };

  const share = async () => {
    haptic("light");
    try {
      if (navigator.share)
        await navigator.share({
          title: "My Highlights",
          text: buildShareText(hl),
        });
      else await copy();
    } catch {
      /* user dismissed the native sheet */
    }
  };

  const btn = (primary: boolean): CSSProperties => ({
    width: "100%",
    height: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: primary ? "none" : "1px solid var(--border-2)",
    background: primary ? "var(--primary-blue-400)" : "#fff",
    color: primary ? "#fff" : "var(--fg-1)",
  });

  return (
    <Overlay
      open={open}
      onClose={onClose}
      compact={compact}
      // Spec ("simplified session end"): plain title row, ✕ only — no leading icon.
      title="Session complete"
      footer={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "12px 16px",
          }}
        >
          {hl.count > 0 ? (
            <>
              <button
                onClick={copy}
                className={styles.actionBtn}
                style={btn(true)}
              >
                {copied ? <Icon d={ICON.check} size={17} color="#fff" /> : null}
                {copied ? "Copied" : "Copy My Highlights"}
              </button>
              <button
                onClick={share}
                className={styles.actionBtn}
                style={btn(false)}
              >
                <Icon d={ICON.shareIos} size={17} color="var(--fg-2)" />
                Share
              </button>
            </>
          ) : null}
          <button
            onClick={reason === "leave" ? onLeave : onClose}
            className={styles.actionBtn}
            style={btn(false)}
          >
            {reason === "leave" ? "Leave Session" : "Close"}
          </button>
        </div>
      }
    >
      <div style={{ padding: "12px 16px 16px" }}>
        {/* dir="auto": English chrome copy keeps LTR punctuation inside an RTL doc */}
        <div
          dir="auto"
          style={{
            fontSize: 13,
            color: "var(--fg-3)",
            lineHeight: 1.5,
            marginBottom: 14,
          }}
        >
          {reason === "ended"
            ? "The session has ended. "
            : "You're leaving the session — take your highlights with you. "}
          <a
            href="https://www.wordly.ai/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--primary-blue-500)" }}
          >
            Learn more about Wordly AI Interpretation
          </a>
        </div>

        <HighlightsReadback hl={hl} emptyText="Nothing saved this session." />
      </div>
    </Overlay>
  );
}
