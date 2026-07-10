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
  [
    "Can I use the keyboard?",
    "Yes. Press Tab to reach the transcript, then use ↑ and ↓ to move between lines (Home and End jump to the oldest and newest). Press Enter to save a line, → to open the reactions, ← and → to choose one, Enter to pick it, and Esc to close.",
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
  // Drill-in sub-view (Attribution) INSIDE the same modal — never a second
  // modal stacked on this one (Deacon 7/10). Back (or Escape) returns to Help;
  // the X still closes everything. Resets to Help each time the sheet opens.
  const [view, setView] = useState<"help" | "attribution">("help");
  useEffect(() => {
    if (open) setView("help");
  }, [open]);
  useEffect(() => {
    setFine(
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false
    );
  }, []);
  const HELP_QA = helpQA(fine);

  if (view === "attribution") {
    return (
      <Overlay
        open={open}
        onClose={onClose}
        onBack={() => setView("help")}
        compact={compact}
        title="Attribution"
      >
        <div style={{ padding: "12px 16px 16px" }}>
          <div
            style={{ fontSize: 12.5, color: "var(--fg-3)", marginBottom: 10 }}
          >
            This experience is built with open-source software:
          </div>
          {[
            ["React", "MIT License · Meta Platforms, Inc."],
            ["Next.js", "MIT License · Vercel, Inc."],
            ["Radix UI / shadcn/ui", "MIT License · WorkOS & contributors"],
            ["Lucide Icons", "ISC License · Lucide contributors"],
            ["Roboto", "Apache License 2.0 · Google Fonts"],
          ].map(([name, lic], i, arr) => (
            <div
              key={name}
              style={{
                padding: "10px 0",
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border-1)" : "none",
              }}
            >
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}
              >
                {name}
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>
                {lic}
              </div>
            </div>
          ))}
        </div>
      </Overlay>
    );
  }

  return (
    <>
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
              {/* Real destinations (Graham, tracker 7/9). Attribution is app-
                specific, so it opens an in-app list of this prototype's OSS. */}
              <a
                href="https://www.wordly.ai/privacy-policy"
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit" }}
              >
                Privacy Policy
              </a>
              {" | "}
              <a
                href="https://www.wordly.ai/wordly-inc-terms-of-service"
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit" }}
              >
                Terms of Service
              </a>
              {" | "}
              <button
                onClick={() => setView("attribution")}
                style={{
                  border: "none",
                  background: "transparent",
                  font: "inherit",
                  color: "inherit",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Attribution
              </button>
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
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "var(--fg-2)",
                }}
              >
                {qa[1]}
              </div>
            </div>
          ))}
        </div>
      </Overlay>
    </>
  );
}
