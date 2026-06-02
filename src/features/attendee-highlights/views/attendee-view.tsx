"use client";

import { useEffect, useRef, useState } from "react";
import { Highlighter } from "lucide-react";
import type { ReactEmoji, TranscriptItem } from "../types";
import { TranscriptBubble } from "../components/transcript-bubble";
import { HighlightsPanel } from "../components/highlights-panel";
import { HighlightsSheet } from "../components/highlights-sheet";
import styles from "../styles.module.css";

interface AttendeeViewProps {
  transcript: TranscriptItem[];
  highlighted: Set<number>;
  reactions: Record<number, Set<ReactEmoji>>;
  selectedId: number | null;
  onToggleHighlight: (item: TranscriptItem) => void;
  onSelect: (id: number) => void;
  onReact: (id: number, emoji: ReactEmoji) => void;
}

/** Groups consecutive transcript items by speaker, like the prototype. */
function groupBySpeaker(items: TranscriptItem[]) {
  const groups: { speaker: string; items: TranscriptItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.speaker === item.speaker) last.items.push(item);
    else groups.push({ speaker: item.speaker, items: [item] });
  }
  return groups;
}

export function AttendeeView(props: AttendeeViewProps) {
  const {
    transcript,
    highlighted,
    reactions,
    selectedId,
    onToggleHighlight,
    onSelect,
    onReact,
  } = props;

  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flashId, setFlashId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLen = useRef(transcript.length);

  // Auto-scroll the transcript feed as new bubbles stream in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && transcript.length > prevLen.current) {
      el.scrollTop = el.scrollHeight;
    }
    prevLen.current = transcript.length;
  }, [transcript.length]);

  const highlights = transcript.filter((t) => highlighted.has(t.id));
  const groups = groupBySpeaker(transcript);
  const newestId = transcript[transcript.length - 1]?.id;

  const scrollToBubble = (id: number) => {
    const el = document.getElementById(`ah-bubble-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1200);
    setSheetOpen(false);
  };

  return (
    <div className="relative flex min-h-0 w-full flex-1 overflow-hidden">
      {/* Transcript column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-[#e3e6e8]">
        <div ref={scrollRef} className={`min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-5 ${styles.thinScroll}`}>
          <div>
            {groups.map((g, gi) => (
              <div key={gi} className="mb-1">
                <div className="ml-1 mb-1.5 mt-3 text-[13px] font-medium text-[#646e78]">
                  {g.speaker}
                </div>
                {g.items.map((item) => (
                  <TranscriptBubble
                    key={item.id}
                    item={item}
                    highlighted={highlighted.has(item.id)}
                    isNew={item.id === newestId}
                    flash={flashId === item.id}
                    onToggle={() => onToggleHighlight(item)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop highlights panel */}
      {!panelCollapsed && (
        <HighlightsPanel
          highlights={highlights}
          selectedId={selectedId}
          reactions={reactions}
          onSelect={onSelect}
          onScrollTo={scrollToBubble}
          onReact={onReact}
          onCollapse={() => setPanelCollapsed(true)}
        />
      )}

      {/* FAB — mobile opens sheet; desktop re-expands the collapsed panel */}
      {(panelCollapsed || true) && (
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth > 768) {
              setPanelCollapsed((v) => !v);
            } else {
              setSheetOpen(true);
            }
          }}
          aria-label="My highlights"
          className={`absolute bottom-5 right-5 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0063cc] shadow-[0_4px_16px_rgba(0,99,204,0.4)] transition hover:scale-105 hover:bg-[#0051a8] md:${panelCollapsed ? "flex" : "hidden"}`}
        >
          <Highlighter className="h-[22px] w-[22px] text-white" />
          {highlights.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#e62d21] text-[11px] font-bold text-white">
              {highlights.length}
            </span>
          )}
        </button>
      )}

      {/* Mobile bottom sheet */}
      <HighlightsSheet
        open={sheetOpen}
        highlights={highlights}
        selectedId={selectedId}
        reactions={reactions}
        onClose={() => setSheetOpen(false)}
        onSelect={onSelect}
        onReact={onReact}
      />
    </div>
  );
}
