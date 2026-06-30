import { useEffect, useRef, useState } from "react";
import { TRANSCRIPT, revealLen } from "../data/transcript";

const INIT_BI = 3;
const INIT_WI = 4;

export type StreamState = { bi: number; wi: number };

/**
 * Word-by-word transcript stream — the demo engine ported from the Claude Design
 * source. Each tick (`wordMs`) reveals one more word of the current bubble; when a
 * bubble is fully revealed it advances to the next, looping at the end.
 *
 * Mirrors the existing attendee demo's intent (a timer-driven reveal with no live
 * backend) but at word granularity so the draft→final caption revisions render.
 *
 * ── LIVE API SEAM ──────────────────────────────────────────────────────────────
 * To drive this from the real Wordly attend transcript feed instead of the demo
 * script, replace the interval below with a subscription that pushes finalized +
 * in-progress phrases (see docs/wordly-transcript.md, docs/wordly-endpoints.md —
 * sessions use WebSockets for real-time updates). Keep the same {bi, wi} contract
 * (or feed bubbles directly) and the rest of the UI is unchanged.
 */
export function useTranscriptStream({
  active,
  wordMs = 206,
}: {
  active: boolean;
  wordMs?: number;
}) {
  const [eng, setEng] = useState<StreamState>({ bi: INIT_BI, wi: INIT_WI });

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setEng((s) => {
        let { bi, wi } = s;
        if (bi >= TRANSCRIPT.length) return { bi: 0, wi: 0 };
        const len = revealLen(TRANSCRIPT[bi]);
        if (wi < len) return { bi, wi: wi + 1 };
        return { bi: bi + 1, wi: 0 };
      });
    }, wordMs);
    return () => clearInterval(t);
  }, [active, wordMs]);

  const last = Math.min(eng.bi, TRANSCRIPT.length - 1);
  return { eng, last };
}
