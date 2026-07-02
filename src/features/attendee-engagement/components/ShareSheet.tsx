import { useState } from "react";
import { Overlay } from "./Overlay";
import { HighlightsReadback } from "./HighlightsReadback";
import { Icon } from "../lib/icons";
import { ICON, ICON_FOR } from "../lib/reactions-data";
import { TRANSCRIPT } from "../data/transcript";
import { haptic } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/** Build the shareable plain-text block: each saved line, reactions prefixed [Label]. */
export function buildShareText(hl: Highlights): string {
  return hl.sorted
    .map((s) => {
      const b = TRANSCRIPT.find((t) => t.id === s.id);
      const r = ICON_FOR[s.tag];
      const prefix = r && s.tag !== "📌" ? `[${r.l}] ` : "";
      return prefix + (b ? b.text : "");
    })
    .join("\n\n");
}

/**
 * Share flow for "My Highlights": previews the formatted lines, then Copy (to clipboard)
 * or Share (native share sheet where available). Built as its own flow rather than a
 * bare `navigator.share` so the attendee sees exactly what they're sending.
 */
export function ShareSheet({
  open,
  onClose,
  compact,
  hl,
}: {
  open: boolean;
  onClose: () => void;
  compact?: boolean;
  hl: Highlights;
}) {
  const [copied, setCopied] = useState(false);
  const text = open ? buildShareText(hl) : "";

  const copy = async () => {
    haptic("success");
    try {
      await navigator.clipboard?.writeText(text);
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
        await navigator.share({ title: "My Highlights", text });
      else await copy();
    } catch {
      /* user dismissed the native sheet */
    }
  };

  const btn = (primary: boolean): React.CSSProperties => ({
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
      // Share-panel spec (same as Session complete): plain title row (no icon) and a
      // stacked action column — Copy My Highlights (primary) · Share · Close.
      title="Share highlights"
      footer={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "12px 16px",
          }}
        >
          <button onClick={copy} className={styles.actionBtn} style={btn(true)}>
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
          <button
            onClick={onClose}
            className={styles.actionBtn}
            style={btn(false)}
          >
            Close
          </button>
        </div>
      }
    >
      <div style={{ padding: "12px 16px 16px" }}>
        {/* Figma share panel: the highlights read back as CARDS (text + reaction
            chip + remove), not a plain-text blob — same body as Session complete. */}
        <HighlightsReadback hl={hl} emptyText="No highlights yet." />
      </div>
    </Overlay>
  );
}
