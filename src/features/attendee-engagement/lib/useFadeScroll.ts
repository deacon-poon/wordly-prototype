import { useCallback, useRef } from "react";

/**
 * Apple-style auto-hiding scrollbar behaviour: marks the element `data-scrolling`
 * while the user scrolls and clears it ~700ms after they stop, so the (CSS-styled)
 * overlay thumb fades out when idle. Pair with the `appleScroll` class.
 *
 * Uses direct DOM/attribute writes (no state) so scrolling never triggers re-renders.
 */
export function useFadeScroll<T extends HTMLElement = HTMLDivElement>(
  extra?: () => void
) {
  const ref = useRef<T>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    extra?.();
  }, [extra]);

  return { ref, onScroll };
}
