"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Highlighter, X } from "lucide-react";
import type { TranscriptItem } from "../types";

interface EndedModalProps {
  transcript: TranscriptItem[];
  highlights: TranscriptItem[];
  onClose: () => void;
  onViewPublic: () => void;
}

function fmtList(arr: string[]) {
  if (!arr.length) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}

function detectTheme(texts: string[]) {
  const j = texts.join(" ").toLowerCase();
  if (/\b(95%|didn.t type|wiped out|25 years|inflection|november 2025)\b/.test(j)) return "experience";
  if (/\b(prompt injection|challenger|lethal trifecta|agentic|dark factory)\b/.test(j)) return "risk";
  if (/\b(tdd|test|pelican|benchmark|red.green|failing test)\b/.test(j)) return "craft";
  if (/\b(ai|model|coding|agent|code is cheap|iteration)\b/.test(j)) return "ai";
  return "general";
}

function buildSessionSummary(speakers: string[], items: TranscriptItem[]) {
  if (!items.length) return "No transcript available for this session.";
  const sp = fmtList(speakers) || "the presenter";
  const allText = items.map((b) => b.text).join(" ");
  const outroText = items.slice(-4).map((b) => b.text).join(" ");
  const sentences: string[] = [];

  let s1 = `This session featured ${sp}`;
  if (/lenny|newsletter|podcast/i.test(allText)) s1 += " in a conversation for Lenny's Newsletter";
  const topics: string[] = [];
  if (/inflection|november 2025|coding agent/i.test(allText)) topics.push("the AI coding inflection point");
  if (/prompt injection|challenger|lethal trifecta/i.test(allText)) topics.push("AI security risks");
  if (/dark factory|agentic/i.test(allText)) topics.push("autonomous agentic development");
  if (topics.length) s1 += `, exploring ${fmtList(topics.slice(0, 2))}`;
  sentences.push(s1 + ".");

  if (/95%|didn.t type|25 years/i.test(allText)) {
    sentences.push(
      "The central claim: even a 25-year veteran now produces roughly 95% of their code via AI agents — yet using those agents well requires every bit of that experience to catch what the model misses.",
    );
  }
  if (/challenger|prompt injection|lethal trifecta/i.test(outroText)) {
    sentences.push(
      "The conversation closed on risk: with prompt injection affecting most agentic systems, a major public failure may be what finally forces the industry to reckon with oversight and trust.",
    );
  } else if (/cheap|better.*software|humane|accessible/i.test(allText)) {
    sentences.push(
      "A closing theme: code is now cheap, and that abundance should be directed toward building software that is more thoughtful and humane — not merely more.",
    );
  } else {
    sentences.push(
      "The discussion challenged assumptions about where AI development is headed and who is best positioned to navigate the transition.",
    );
  }
  return sentences.join(" ");
}

function buildHighlightsSummary(highlights: TranscriptItem[]) {
  const n = highlights.length;
  if (n === 0)
    return "You didn't save any highlights this session. Next time, tap any speech bubble to bookmark key moments — they'll be ready for you here when the session ends.";

  const counts: Record<string, number> = {};
  highlights.forEach((h) => {
    counts[h.speaker] = (counts[h.speaker] || 0) + 1;
  });
  const speakerNames = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const topSpeaker = speakerNames[0] || "";
  const theme = detectTheme(highlights.map((h) => h.text));

  const insights: Record<string, string> = {
    experience: `Your highlights focused on the "what it's actually like" moments — the 95% stat, the exhaustion by 11 a.m. You're drawn to concrete experience over abstract claims.`,
    risk: `You gravitated toward the security and risk thread — prompt injection, the Challenger prediction, the lethal trifecta. You're thinking about second-order consequences.`,
    craft: `Your highlights centered on technique — TDD with agents, benchmarking, quality controls. You're thinking practically about how to actually use these tools well.`,
    ai: `You saved the AI-specific structural claims — what agents change about how software gets made. You're tracking the bigger shift.`,
    general: `The moments you saved stood out as most relevant or memorable to you personally.`,
  };

  let s = `You saved ${n} highlight${n > 1 ? "s" : ""} from ${fmtList(speakerNames) || "the session"}. ${insights[theme]}`;
  if (speakerNames.length > 1 && counts[topSpeaker] > n * 0.6) {
    s += ` ${topSpeaker.split(" ")[0]}'s contributions resonated with you most.`;
  }
  return s;
}

/** "Session complete" summary modal (`.ended-overlay`). */
export function EndedModal({ transcript, highlights, onClose, onViewPublic }: EndedModalProps) {
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const speakers = useMemo(() => {
    const seen: string[] = [];
    transcript.forEach((t) => {
      if (!seen.includes(t.speaker)) seen.push(t.speaker);
    });
    return seen;
  }, [transcript]);

  const sessionSummary = useMemo(() => buildSessionSummary(speakers, transcript), [speakers, transcript]);
  const hlSummary = useMemo(() => buildHighlightsSummary(highlights), [highlights]);

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 px-4 py-6">
      <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between border-b border-[#e3e6e8] px-6 pb-4 pt-6">
          <div>
            <div className="mb-1 text-xl font-bold text-[#121416]">Session complete</div>
            <div className="text-sm text-[#646e78]">
              An AI State of the Union — Lenny&apos;s Newsletter with Simon Willison
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[#9ba3ab] hover:bg-[#eef0f2] hover:text-[#646e78]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex max-h-[calc(100vh-260px)] flex-col gap-5 overflow-y-auto p-6">
          <div>
            <div className="mb-2.5 text-[15px] font-bold text-[#121416]">Session Summary</div>
            <div className="rounded-[10px] bg-[#f8f9fa] px-4 py-3.5 text-sm leading-relaxed text-[#121416]">
              {sessionSummary}
            </div>
          </div>
          <div>
            <div className="mb-2.5 text-[15px] font-bold text-[#121416]">Your Highlights Summary</div>
            <div className="rounded-[10px] bg-[#f0f7ff] px-4 py-3.5 text-sm leading-relaxed text-[#121416]">
              {hlSummary}
            </div>
          </div>
          <div className="h-px bg-[#e3e6e8]" />
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <Highlighter className="h-[18px] w-[18px] text-[#0063cc]" />
              <div className="text-[15px] font-bold text-[#121416]">My Highlights</div>
            </div>
            <div className="flex flex-col gap-2">
              {highlights.length === 0 ? (
                <div className="py-1 text-sm italic text-[#646e78]">No highlights saved yet.</div>
              ) : (
                highlights.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-[10px] border border-[#b2d8ff] bg-[#f0f7ff] px-3.5 py-3 text-sm leading-snug text-[#121416]"
                  >
                    {h.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-[#e3e6e8] px-6 py-4">
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`w-full rounded-[10px] py-3.5 text-[15px] font-semibold text-white ${copied ? "bg-[#0a7b3f]" : "bg-[#0063cc]"}`}
          >
            {copied ? "✓ Copied!" : "Copy My Highlights"}
          </button>
          {emailOpen && (
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mb-2 w-full rounded-lg border border-[#cdd2d7] px-3 py-2.5 text-sm outline-none focus:border-[#017cff]"
              />
              <button
                onClick={() => {
                  if (!email) return;
                  setSent(true);
                  setTimeout(() => {
                    setSent(false);
                    setEmail("");
                    setEmailOpen(false);
                  }, 2000);
                }}
                className="w-full rounded-[10px] bg-[#0063cc] py-3.5 text-[15px] font-semibold text-white"
              >
                {sent ? "✓ Sent!" : "Send"}
              </button>
            </div>
          )}
          <button
            onClick={() => setEmailOpen((v) => !v)}
            className="w-full rounded-[10px] border border-[#cdd2d7] bg-white py-3 text-[15px] font-medium text-[#121416] hover:bg-[#f8f9fa]"
          >
            {emailOpen ? "Cancel" : "Send Highlights"}
          </button>
          <button
            onClick={onViewPublic}
            className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#75b8ff] bg-[#f0f7ff] py-3 text-[15px] font-medium text-[#0051a8]"
          >
            <ExternalLink className="h-[15px] w-[15px]" />
            View public summary
          </button>
        </div>
      </div>
    </div>
  );
}
