"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import styles from "../styles.module.css";

type AiState = "ready" | "loading" | "error";

/**
 * AI summary block with loading shimmer / ready / error states. The state
 * toggles mirror the prototype's `.ai-state-toggles` demo controls.
 */
export function AiSummary({ text }: { text: string }) {
  const [state, setState] = useState<AiState>("ready");

  return (
    <div className="rounded-[7px] border border-[#b2d8ff] bg-[#f0f7ff] px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded border border-[#75b8ff] bg-white px-[7px] py-0.5 text-[10px] font-semibold text-[#0051a8]">
          <Sparkles className="h-2.5 w-2.5" /> AI summary
        </span>
        <div className="flex gap-1">
          {(["ready", "loading", "error"] as AiState[]).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`rounded px-[7px] py-0.5 text-[10px] capitalize ${
                state === s
                  ? "border border-[#017cff] bg-white text-[#0063cc]"
                  : "border border-[#cdd2d7] bg-white text-[#646e78]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {state === "loading" && (
        <>
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-[#0051a8]">
            <span className={`h-2.5 w-2.5 rounded-full border-[1.5px] border-[#b2d8ff] border-t-[#0063cc] ${styles.spinner}`} />
            Generating summary…
          </div>
          <div className={`mb-1.5 h-[11px] rounded-[3px] bg-[#b2d8ff] ${styles.shimmer}`} />
          <div className={`mb-1.5 h-[11px] w-[85%] rounded-[3px] bg-[#b2d8ff] ${styles.shimmer}`} />
          <div className={`h-[11px] w-[68%] rounded-[3px] bg-[#b2d8ff] ${styles.shimmer}`} />
        </>
      )}

      {state === "ready" && <p className="text-xs leading-relaxed text-[#343a40]">{text}</p>}

      {state === "error" && (
        <p className="text-xs leading-relaxed text-[#b8221a]">
          Could not generate a summary right now. Please try again.
        </p>
      )}
    </div>
  );
}
