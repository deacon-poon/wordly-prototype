"use client";

import { useState } from "react";
import { Highlighter, ChevronDown, Copy, Mail, Check } from "lucide-react";
import type { ReactEmoji, TranscriptItem } from "../types";
import { REACT_EMOJIS } from "../data/mock";
import styles from "../styles.module.css";

interface HighlightItemProps {
  item: TranscriptItem;
  selected: boolean;
  reactions: Set<ReactEmoji>;
  onSelect: () => void;
  onScrollTo: () => void;
  onReact: (emoji: ReactEmoji) => void;
}

function HighlightItem({
  item,
  selected,
  reactions,
  onSelect,
  onScrollTo,
  onReact,
}: HighlightItemProps) {
  return (
    <div
      onClick={() => (selected ? onScrollTo() : onSelect())}
      className={`flex-shrink-0 cursor-pointer rounded-lg border border-l-[3px] border-[#b2d8ff] border-l-[#017cff] p-2.5 transition ${
        styles.hlIn
      } ${
        selected
          ? "border-[#3396ff] bg-[#d6eaff] shadow-[0_1px_4px_rgba(0,99,204,0.12)]"
          : "bg-[#f0f7ff] hover:bg-[#d6eaff]"
      }`}
    >
      <div className="mb-0.5 text-[11px] font-medium text-[#0051a8]">{item.time}</div>
      <div className="line-clamp-2 text-xs leading-relaxed text-[#646e78]">{item.text}</div>
      {selected && (
        <div className="mt-2 flex gap-1.5">
          {REACT_EMOJIS.map((e) => {
            const active = reactions.has(e);
            return (
              <button
                key={e}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onReact(e);
                }}
                className={`flex h-7 flex-1 items-center justify-center rounded-md border text-sm transition ${
                  active
                    ? "scale-105 border-[#017cff] bg-[#d6eaff]"
                    : "border-[#b2d8ff] bg-white hover:border-[#75b8ff] hover:bg-[#f0f7ff]"
                }`}
              >
                {e}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface HighlightsPanelProps {
  highlights: TranscriptItem[];
  selectedId: number | null;
  reactions: Record<number, Set<ReactEmoji>>;
  onSelect: (id: number) => void;
  onScrollTo: (id: number) => void;
  onReact: (id: number, emoji: ReactEmoji) => void;
  onCollapse: () => void;
}

/** Desktop "My highlights" side panel (`.highlights-col`). */
export function HighlightsPanel({
  highlights,
  selectedId,
  reactions,
  onSelect,
  onScrollTo,
  onReact,
  onCollapse,
}: HighlightsPanelProps) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const count = highlights.length;

  const copy = () => {
    const txt = highlights
      .map((h) => `[${h.time}] ${h.text}`)
      .join("\n\n");
    if (navigator.clipboard && txt) navigator.clipboard.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hidden w-[280px] flex-shrink-0 flex-col overflow-hidden bg-white md:flex">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e3e6e8] px-4 pb-2.5 pt-3.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#121416]">
          <Highlighter className="h-3.5 w-3.5 text-[#646e78]" />
          My highlights
          <span className="rounded-[10px] bg-[#0063cc] px-[7px] py-px text-[11px] font-semibold text-white">
            {count}
          </span>
        </div>
        <button
          onClick={onCollapse}
          title="Collapse panel"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-md text-[#9ba3ab] hover:bg-[#eef0f2] hover:text-[#646e78]"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 ${styles.thinScroll}`}>
        {count === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Highlighter className="h-10 w-10 text-[#cdd2d7]" />
            <p className="text-[13px] leading-relaxed text-[#9ba3ab]">
              Click on a speech bubble to save it as a highlight. Then add a reaction here.
            </p>
          </div>
        ) : (
          highlights.map((h) => (
            <HighlightItem
              key={h.id}
              item={h}
              selected={selectedId === h.id}
              reactions={reactions[h.id] ?? new Set()}
              onSelect={() => onSelect(h.id)}
              onScrollTo={() => onScrollTo(h.id)}
              onReact={(e) => onReact(h.id, e)}
            />
          ))
        )}
      </div>

      {count > 0 && (
        <div className="flex flex-shrink-0 flex-col gap-2 border-t border-[#e3e6e8] p-3">
          {emailOpen && (
            <div>
              <div className="mb-1.5 text-[11px] font-medium text-[#646e78]">Send highlights to</div>
              <input
                type="email"
                placeholder="your@email.com"
                className="mb-2 w-full rounded-lg border border-[#cdd2d7] px-2.5 py-2 text-[13px] outline-none focus:border-[#017cff]"
              />
            </div>
          )}
          <button
            onClick={copy}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium text-white transition ${
              copied ? "bg-[#0a7b3f]" : "bg-[#0063cc] hover:bg-[#0051a8]"
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy highlights"}
          </button>
          <button
            onClick={() => setEmailOpen((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#cdd2d7] bg-white px-4 py-2 text-[13px] font-medium text-[#121416] transition hover:bg-[#f8f9fa]"
          >
            <Mail className="h-3.5 w-3.5" />
            Email highlights
          </button>
        </div>
      )}
    </div>
  );
}
