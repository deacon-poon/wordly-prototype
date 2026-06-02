"use client";

import { useState } from "react";
import { ChevronUp, Globe, HelpCircle, Highlighter, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { ReactEmoji, TranscriptItem } from "../types";
import { PRESENTER_LANGS, PRESENTER_PARTICIPANTS } from "../data/mock";
import styles from "../styles.module.css";

interface PresenterViewProps {
  transcript: TranscriptItem[];
  highlighted: Set<number>;
  reactions: Record<number, Set<ReactEmoji>>;
}

function CollapsibleSection({
  name,
  sub,
  children,
}: {
  name: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#e3e6e8]">
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer select-none items-start justify-between gap-2 px-4 py-3.5 hover:bg-[#f8f9fa]"
      >
        <div>
          <div className="text-[11px] font-bold tracking-[0.09em] text-[#121416]">{name}</div>
          {sub && <div className="mt-px text-[11px] text-[#9ba3ab]">{sub}</div>}
        </div>
        <ChevronUp
          className={`h-4 w-4 flex-shrink-0 text-[#646e78] transition-transform ${open ? "" : "rotate-180"}`}
        />
      </div>
      {open && children}
    </div>
  );
}

export function PresenterView({ transcript, highlighted, reactions }: PresenterViewProps) {
  const [auto, setAuto] = useState(true);

  const questions = transcript.filter((t) => reactions[t.id]?.has("❓"));
  const highlights = transcript.filter((t) => highlighted.has(t.id));

  // Group transcript by speaker for the center feed.
  const groups: { speaker: string; items: TranscriptItem[] }[] = [];
  for (const item of transcript) {
    const last = groups[groups.length - 1];
    if (last && last.speaker === item.speaker) last.items.push(item);
    else groups.push({ speaker: item.speaker, items: [item] });
  }

  const clip = (t: string) => (t.length > 100 ? t.slice(0, 100) + "…" : t);

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      {/* Left: language controls + participants */}
      <div className="flex w-[264px] flex-shrink-0 flex-col overflow-y-auto border-r border-[#e3e6e8] bg-white">
        <CollapsibleSection name="LANGUAGE CONTROLS">
          <div className="px-4 pb-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-[#cdd2d7] bg-white px-3 py-2.5 text-xs font-semibold tracking-[0.03em] text-[#646e78] transition hover:border-[#017cff] hover:text-[#0063cc]">
              <Globe className="h-[15px] w-[15px]" />+ ADD A LANGUAGE
            </button>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PRESENTER_LANGS.map((l) => (
                <div
                  key={l.name}
                  className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] py-1.5 pl-[9px] pr-[7px] text-xs font-medium ${
                    l.active
                      ? "border-[#0063cc] bg-[#0063cc] text-white"
                      : "border-[#cdd2d7] bg-white text-[#646e78]"
                  }`}
                >
                  {l.name}
                  <button
                    className={`flex h-[15px] w-[15px] items-center justify-center rounded-full text-[9px] leading-none ${
                      l.active ? "bg-white/25" : "bg-black/10"
                    }`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3.5 flex items-center gap-2.5">
              <Switch checked={auto} onCheckedChange={setAuto} />
              <span className="flex-1 text-xs text-[#646e78]">Automatic language selection</span>
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#cdd2d7]">
                <HelpCircle className="h-2.5 w-2.5 text-[#646e78]" />
              </span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection name="PARTICIPANTS" sub="247 attendees">
          {PRESENTER_PARTICIPANTS.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between border-b border-[#e3e6e8] px-4 py-2 last:border-b-0"
            >
              <div>
                <div className="text-[11px] text-[#9ba3ab]">{p.role}</div>
                <div className="text-[13px] font-semibold text-[#121416]">{p.name}</div>
              </div>
              <div className={`h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#017cff] ${styles.presLivePulse}`} />
            </div>
          ))}
        </CollapsibleSection>
      </div>

      {/* Center: transcript feed */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-[#e3e6e8] bg-[#f8f9fa]">
        <div className={`flex-1 overflow-y-auto px-5 pb-6 pt-5 ${styles.thinScroll}`}>
          {transcript.length === 0 && (
            <div className="text-[13px] italic text-[#9ba3ab]">Waiting for the session to begin…</div>
          )}
          {groups.map((g, gi) => (
            <div key={gi}>
              <div className="mb-1.5 mt-4 pl-0.5 text-[13px] font-semibold text-[#121416] first:mt-0">
                {g.speaker}
              </div>
              {g.items.map((item) => {
                const r = reactions[item.id];
                const hasQ = r?.has("❓");
                const isHL = highlighted.has(item.id);
                const otherReacts = r ? [...r].filter((e) => e !== "❓") : [];
                return (
                  <div key={item.id} className="mb-1.5 flex items-center gap-2">
                    <div
                      className={`min-w-0 flex-1 rounded-lg border-l-[3px] px-3.5 py-3 text-[15px] leading-normal text-[#121416] transition-colors ${
                        hasQ
                          ? "border-l-[#f59e0b] bg-[#fffdf5]"
                          : isHL
                            ? "border-l-[#3396ff] bg-white"
                            : "border-l-transparent bg-white"
                      }`}
                    >
                      {item.text}
                    </div>
                    {(hasQ || isHL || otherReacts.length > 0) && (
                      <div className="flex flex-shrink-0 flex-col items-start gap-1">
                        {hasQ && (
                          <span className="inline-flex items-center gap-1 rounded-[10px] border border-[#fde68a] bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#92400e]">
                            ❓ Question
                          </span>
                        )}
                        {isHL && (
                          <span className="inline-flex items-center gap-1 rounded-[10px] border border-[#b2d8ff] bg-[#f0f7ff] px-2 py-0.5 text-[11px] font-semibold text-[#0051a8]">
                            <Highlighter className="h-2.5 w-2.5" /> Highlighted
                          </span>
                        )}
                        {otherReacts.map((e) => (
                          <span
                            key={e}
                            className="inline-flex items-center rounded-[10px] border border-[#b2d8ff] bg-[#f0f7ff] px-2 py-0.5 text-[13px]"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Right: live engagement panel */}
      <div className="flex w-[280px] flex-shrink-0 flex-col overflow-hidden bg-white">
        <div className="flex-shrink-0 border-b border-[#e3e6e8] px-3.5 pb-2.5 pt-3">
          <div className="mb-[3px] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#121416]">Live Engagement</span>
            <span className="inline-flex items-center gap-1 rounded border border-[#c5e8d2] bg-[#e6f6ec] px-1.5 py-0.5 text-[10px] font-semibold text-[#0a7b3f]">
              <span className={`h-[5px] w-[5px] rounded-full bg-[#0a7b3f] ${styles.presLivePulse}`} />
              Live
            </span>
          </div>
          <div className="text-[11px] text-[#9ba3ab]">
            {highlights.length} highlight{highlights.length !== 1 ? "s" : ""} · {questions.length}{" "}
            question{questions.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className={`flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3 ${styles.thinScroll}`}>
          {questions.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#646e78]">
                <span>❓</span> Questions from attendees
              </div>
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`mb-1.5 rounded-lg border border-l-[3px] border-[#fde68a] border-l-[#f59e0b] bg-[#fffbf0] p-2.5 ${styles.hlIn}`}
                >
                  <div className="mb-1 inline-flex items-center rounded-lg border border-[#fde68a] bg-[#fef3c7] px-[7px] py-px text-[10px] font-bold text-[#92400e]">
                    ❓ attendee question
                  </div>
                  <div className="text-xs leading-snug text-[#121416]">{clip(q.text)}</div>
                </div>
              ))}
              <div className="my-1 h-px bg-[#e3e6e8]" />
            </div>
          )}
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#646e78]">
              <Highlighter className="h-2.5 w-2.5" /> Most highlighted
            </div>
            {highlights.length === 0 ? (
              <div className="text-xs italic text-[#9ba3ab]">Highlights from attendees appear here</div>
            ) : (
              highlights.map((h, i) => {
                const pct = Math.round(((highlights.length - i) / highlights.length) * 100);
                return (
                  <div
                    key={h.id}
                    className={`mb-1.5 rounded-lg border border-l-[3px] border-[#b2d8ff] border-l-[#017cff] bg-[#f0f7ff] p-2.5 ${styles.hlIn}`}
                  >
                    <div className="mb-1 inline-flex items-center rounded-lg border border-[#b2d8ff] bg-[#d6eaff] px-[7px] py-px text-[10px] font-bold text-[#0051a8]">
                      ▲ highlighted
                    </div>
                    <div className="text-xs leading-snug text-[#121416]">{clip(h.text)}</div>
                    <div className="mt-1.5 h-[3px] overflow-hidden rounded-sm bg-[#b2d8ff]">
                      <div className="h-full rounded-sm bg-[#017cff]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
