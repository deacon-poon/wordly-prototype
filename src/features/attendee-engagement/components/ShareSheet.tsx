import { useState } from "react";
import { Overlay } from "./Overlay";
import { Icon } from "../lib/icons";
import { ICON, ICON_FOR } from "../lib/reactions-data";
import { TRANSCRIPT } from "../data/transcript";
import { haptic } from "../lib/haptics";
import type { Highlights } from "../lib/useHighlights";
import styles from "../engagement.module.css";

/** Build the shareable plain-text block: each saved line, reactions prefixed [Label]. */
function buildShareText(hl: Highlights): string {
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
    flex: 1,
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
      title="Share highlights"
      icon={ICON.shareIos}
      footer={
        <div style={{ display: "flex", gap: 10, padding: "12px 16px" }}>
          <button
            onClick={copy}
            className={styles.actionBtn}
            style={btn(false)}
          >
            <Icon
              d={copied ? ICON.check : ICON.note}
              size={17}
              color={copied ? "var(--accent-green-700)" : "var(--fg-2)"}
            />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={share}
            className={styles.actionBtn}
            style={btn(true)}
          >
            <Icon d={ICON.shareIos} size={17} color="#fff" sw={1.9} />
            Share
          </button>
        </div>
      }
    >
      <div style={{ padding: "12px 16px 16px" }}>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--fg-3)",
            marginBottom: 10,
          }}
        >
          {hl.count} saved {hl.count === 1 ? "line" : "lines"} · a plain-text
          copy of your highlights
        </div>
        <div
          style={{
            background: "var(--gray-50)",
            border: "1px solid var(--border-1)",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--fg-1)",
            whiteSpace: "pre-wrap",
            maxHeight: compact ? "none" : 320,
            overflowY: "auto",
          }}
        >
          {text || "No highlights yet."}
        </div>
      </div>
    </Overlay>
  );
}
