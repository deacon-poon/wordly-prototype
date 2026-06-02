"use client";

import { useState } from "react";
import { Highlighter, X } from "lucide-react";
import type { ReactEmoji, TranscriptItem } from "../types";
import { REACT_EMOJIS } from "../data/mock";
import styles from "../styles.module.css";

interface HighlightsSheetProps {
  open: boolean;
  highlights: TranscriptItem[];
  selectedId: number | null;
  reactions: Record<number, Set<ReactEmoji>>;
  onClose: () => void;
  onSelect: (id: number) => void;
  onReact: (id: number, emoji: ReactEmoji) => void;
}

/** Mobile bottom sheet of highlights (`.bottom-sheet`). */
export function HighlightsSheet({
  open,
  highlights,
  selectedId,
  reactions,
  onClose,
  onSelect,
  onReact,
}: HighlightsSheetProps) {
  const [copied, setCopied] = useState(false);
  const count = highlights.length;

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className={`absolute inset-0 z-20 bg-black/35 transition-opacity md:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 flex max-h-[72%] flex-col overflow-hidden rounded-t-2xl bg-white ${styles.sheet} ${
          open ? styles.sheetOpen : ""
        }`}
      >
        <div className="mx-auto mt-2.5 h-1 w-9 flex-shrink-0 rounded-sm bg-[#cdd2d7]" />
        <div className="flex flex-shrink-0 items-center gap-2 px-4 pb-2.5 pt-3">
          <Highlighter className="h-[18px] w-[18px] text-[#0063cc]" />
          <span className="flex-1 text-[15px] font-semibold text-[#121416]">My Highlights</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef0f2] text-[#646e78]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pt-1.5 ${styles.thinScroll}`}>
          {count === 0 ? (
            <div className="flex flex-col items-center gap-2.5 p-6 text-center text-[#9ba3ab]">
              <Highlighter className="h-9 w-9 text-[#cdd2d7]" />
              <p className="text-[13px] leading-relaxed">
                Tap on a speech bubble to save it as a highlight. Then add a reaction here.
              </p>
            </div>
          ) : (
            highlights.map((h) => {
              const selected = selectedId === h.id;
              const r = reactions[h.id] ?? new Set<ReactEmoji>();
              return (
                <div
                  key={h.id}
                  onClick={() => onSelect(h.id)}
                  className={`flex-shrink-0 cursor-pointer rounded-lg border border-l-[3px] border-[#b2d8ff] border-l-[#017cff] p-3 ${
                    selected ? "bg-[#d6eaff]" : "bg-[#f0f7ff]"
                  }`}
                >
                  <div className="mb-1 text-[11px] font-medium text-[#0051a8]">{h.time}</div>
                  <div className="text-[13px] leading-relaxed text-[#646e78]">{h.text}</div>
                  {selected && (
                    <div className="mt-2.5 flex gap-1.5">
                      {REACT_EMOJIS.map((e) => {
                        const active = r.has(e);
                        return (
                          <button
                            key={e}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              onReact(h.id, e);
                            }}
                            className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-lg ${
                              active ? "border-[#017cff] bg-[#d6eaff]" : "border-[#b2d8ff] bg-white"
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
            })
          )}
        </div>
        <div className="flex-shrink-0 p-4">
          <button
            onClick={copy}
            className={`w-full rounded-[10px] py-3.5 text-[15px] font-semibold text-white ${
              copied ? "bg-[#0a7b3f]" : "bg-[#0063cc]"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy My Highlights"}
          </button>
        </div>
      </div>
    </div>
  );
}
