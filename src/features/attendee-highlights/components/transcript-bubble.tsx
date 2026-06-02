"use client";

import type { TranscriptItem } from "../types";
import styles from "../styles.module.css";

interface TranscriptBubbleProps {
  item: TranscriptItem;
  highlighted: boolean;
  isNew: boolean;
  onToggle: () => void;
  flash: boolean;
}

/** A single tap-to-highlight transcript bubble (`.bubble`). */
export function TranscriptBubble({
  item,
  highlighted,
  isNew,
  onToggle,
  flash,
}: TranscriptBubbleProps) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <div
        id={`ah-bubble-${item.id}`}
        onClick={onToggle}
        className={`inline-flex max-w-full cursor-pointer select-none items-center rounded-[0_18px_18px_18px] border-[1.5px] px-4 py-2.5 text-[15px] leading-snug transition-colors ${
          isNew ? styles.bubbleIn : ""
        } ${
          highlighted
            ? "border-[#3396ff] bg-[#f0f7ff] text-[#002c5c]"
            : "border-transparent bg-[#eef0f2] text-[#121416] hover:bg-[#e3e6e8]"
        } ${flash ? "shadow-[0_0_0_3px_rgba(0,99,204,0.2)]" : ""}`}
      >
        <span>{item.text}</span>
        {highlighted && (
          <span className="ml-2 flex flex-shrink-0 items-center">
            <span className="h-[7px] w-[7px] rounded-full bg-[#017cff]" />
          </span>
        )}
      </div>
    </div>
  );
}
