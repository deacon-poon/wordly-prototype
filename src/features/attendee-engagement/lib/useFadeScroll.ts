import { useCallback, useRef } from "react";

/**
 * Apple-style auto-hiding scrollbar behaviour: marks the element `data-scrolling`
 * while the user scrolls and clears it ~700ms after they stop, so the (CSS-styled)
 * overlay thumb fades out when idle. Pair with the `appleScroll` class.
 *
 * Also maintains `data-more` — set while there is content below the fold — which
 * drives the `.scrollFade` "more below" overlay (a sibling gradient veil). Call
 * `check()` after anything that changes content height outside a scroll event
 * (cards added/removed, detent change, resize).
 *
 * Uses direct DOM/attribute writes (no state) so scrolling never triggers re-renders.
 */
export function useFadeScroll<T extends HTMLElement = HTMLDivElement>(
  extra?: () => void
) {
  const ref = useRef<T>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // 4px slack so sub-pixel scroll positions still count as "at the end".
    const more = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    if (more) el.setAttribute("data-more", "1");
    else el.removeAttribute("data-more");
  }, []);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.setAttribute("data-scrolling", "1");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => el.removeAttribute("data-scrolling"),
        700
      );
    }
    check();
    extra?.();
  }, [extra, check]);

  return { ref, onScroll, check };
}
