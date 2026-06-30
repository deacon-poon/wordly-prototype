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
  wordMs = 200,
}: {
  active: boolean;
  wordMs?: number;
}) {
  const [eng, setEng] = useState<StreamState>({ bi: INIT_BI, wi: INIT_WI });
  const engRef = useRef(eng);
  engRef.current = eng;

  // Recursive timeout (not a fixed interval) so each word can have its own delay:
  // jitter per word, a beat after sentence/clause punctuation, a longer breath
  // between turns — and longer still when the speaker changes. Makes the live
  // interpretation feel paced by a human rather than a metronome.
  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let id: ReturnType<typeof setTimeout>;

    // deterministic per-step jitter (Math.random is unavailable in some sandboxes)
    let seed = 7;
    const jitter = (spread: number) => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return ((seed / 0x7fffffff) * 2 - 1) * spread;
    };

    const step = () => {
      if (stopped) return;
      const s = engRef.current;
      let next: StreamState;
      let delay = wordMs;

      if (s.bi >= TRANSCRIPT.length) {
        next = { bi: 0, wi: 0 };
        delay = 800;
      } else {
        const bub = TRANSCRIPT[s.bi];
        const len = revealLen(bub);
        if (s.wi < len) {
          next = { bi: s.bi, wi: s.wi + 1 };
          const words = bub.text.split(" ");
          const w = words[Math.min(s.wi, words.length - 1)] || "";
          delay = wordMs + jitter(55);
          if (/[.!?]["')]?$/.test(w))
            delay += 380; // end of sentence
          else if (/[,;:—]$/.test(w)) delay += 170; // clause break
          if (s.wi === 0) delay += 130; // slight ramp-in at the start of a line
        } else {
          const cur = TRANSCRIPT[s.bi];
          const nxt = TRANSCRIPT[s.bi + 1];
          next = { bi: s.bi + 1, wi: 0 };
          delay = nxt && cur && nxt.sp !== cur.sp ? 920 : 540; // breath between turns
        }
      }

      engRef.current = next;
      setEng(next);
      id = setTimeout(step, Math.max(60, delay));
    };

    id = setTimeout(step, wordMs);
    return () => {
      stopped = true;
      clearTimeout(id);
    };
  }, [active, wordMs]);

  const last = Math.min(eng.bi, TRANSCRIPT.length - 1);
  return { eng, last };
}
