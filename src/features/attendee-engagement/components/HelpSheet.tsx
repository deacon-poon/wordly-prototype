import { useEffect, useState } from "react";
import { Overlay } from "./Overlay";
import { ICON } from "../lib/reactions-data";

/** FAQ, phrased for the attendee's pointer (fine/hover = desktop verbs). */
const helpQA = (fine: boolean): [string, string][] => [
  [
    "How do I turn on the sound?",
    "To listen to the translation as spoken speech, tap the volume icon near the language name.",
  ],
  [
    "How do I change languages?",
    "Tap the current language name to open the language menu, then choose the language you want to see and hear.",
  ],
  [
    "How do I save a moment?",
    fine
      ? "Click a speech bubble to save it to My Highlights. Hover a bubble to react with an emoji."
      : "Tap a speech bubble to save it to My Highlights. Long press a bubble to react with an emoji.",
  ],
  [
    "Can I capture a transcript?",
    "You can share your saved highlights with the share button in the My Highlights panel.",
  ],
  [
    "How do I leave the session?",
    "Open the menu in the top right and choose Leave Session.",
  ],
];

/** Help page — session info, a short FAQ, and a legal/version footer. */
export function HelpSheet({
  open,
  onClose,
  compact,
}: {
  open: boolean;
  onClose: () => void;
  compact?: boolean;
}) {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false
    );
  }, []);
  const HELP_QA = helpQA(fine);
  return (
    <Overlay
      open={open}
      onClose={onClose}
      compact={compact}
      title="Help"
      icon={ICON.helpCircle}
      footer={
        <div style={{ padding: "12px 16px", textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--fg-3)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            {" | "}
            <span style={{ cursor: "pointer" }}>Terms of Service</span>
            {" | "}
            <span style={{ cursor: "pointer" }}>Attribution</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--fg-3)", marginTop: 6 }}>
            Version 0.1.3
          </div>
        </div>
      }
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-1)",
          background: "var(--gray-50)",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--fg-1)" }}>
          <span style={{ fontWeight: 600 }}>Session ID:</span> BGNA-3762
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-1)", marginTop: 3 }}>
          <span style={{ fontWeight: 600 }}>Translating from:</span> Spanish
        </div>
      </div>
      <div style={{ padding: "2px 16px 14px" }}>
        {HELP_QA.map((qa, i) => (
          <div
            key={i}
            style={{
              padding: "13px 0",
              borderBottom:
                i < HELP_QA.length - 1 ? "1px solid var(--border-1)" : "none",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fg-1)",
                marginBottom: 5,
              }}
            >
              {qa[0]}
            </div>
            <div
              style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--fg-2)" }}
            >
              {qa[1]}
            </div>
          </div>
        ))}
      </div>
    </Overlay>
  );
}
