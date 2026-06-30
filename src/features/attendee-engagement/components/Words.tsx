import { Fragment } from "react";
import type { Bubble } from "../data/transcript";

/**
 * Renders the revealed words of a bubble. When `done`, the full text shows.
 *
 * A `revise` bubble first streams a rough "draft" leading phrase, then — once the
 * draft is fully on screen — swaps it for the corrected (often re-ordered, different
 * length) final wording before continuing with the tail. Ported from the source.
 */
export function Words({
  bubble,
  count,
  done,
}: {
  bubble: Bubble;
  count: number;
  done: boolean;
}) {
  const words = bubble.text.split(" ");
  const r = bubble.revise;

  let seq: { t: string; key: string }[];
  if (!r) {
    const shown = done ? words.length : Math.min(count, words.length);
    seq = words.slice(0, shown).map((t, i) => ({ t, key: "w" + i }));
  } else {
    const draftHead = r.draftHead;
    const dLen = draftHead.length;
    const tail = words.slice(r.finalHeadLen);
    const swapped = done || count >= dLen + 1;
    const head = swapped
      ? words.slice(0, r.finalHeadLen).map((t, i) => ({ t, key: "h" + i }))
      : draftHead.slice(0, count).map((t, i) => ({ t, key: "d" + i }));
    const tailShown = done ? tail.length : Math.max(0, count - dLen);
    const tailArr = tail
      .slice(0, tailShown)
      .map((t, i) => ({ t, key: "t" + i }));
    seq = head.concat(tailArr);
  }

  // Gently fade the most-recently revealed word in (only while still streaming) so
  // text arrives word-by-word rather than popping.
  return (
    <span>
      {seq.map((d, i) => {
        const isNewest = !done && i === seq.length - 1;
        return (
          <Fragment key={d.key}>
            {i ? " " : ""}
            <span
              style={isNewest ? { animation: "wEngFade .22s ease" } : undefined}
            >
              {d.t}
            </span>
          </Fragment>
        );
      })}
    </span>
  );
}
