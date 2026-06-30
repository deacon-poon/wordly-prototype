import { useCallback, useMemo, useState } from "react";
import { haptic } from "./haptics";

/** A saved transcript line. `tag` is the reaction emoji, or '📌' for a plain save. */
export type SavedItem = { id: number; tag: string };

/**
 * "My Highlights" state — save / react / remove for transcript lines.
 *
 * Behaviour ported from the design source: one click saves a line as a plain 📌;
 * applying a reaction also saves it (and re-picking the active reaction reverts to 📌).
 */
export function useHighlights() {
  const [items, setItems] = useState<SavedItem[]>([]);

  const isSaved = useCallback(
    (id: number) => items.some((x) => x.id === id),
    [items]
  );
  const get = useCallback(
    (id: number) => items.find((x) => x.id === id),
    [items]
  );

  // One click = save / un-save (plain 📌).
  const toggleSave = useCallback((id: number) => {
    setItems((p) => {
      if (p.some((x) => x.id === id)) {
        haptic("selection");
        return p.filter((x) => x.id !== id);
      }
      haptic("light");
      return p.concat([{ id, tag: "📌" }]);
    });
  }, []);

  // Apply a reaction: saves if needed; re-picking the active reaction reverts to 📌.
  const react = useCallback((id: number, em: string) => {
    haptic("medium");
    setItems((p) => {
      const it = p.find((x) => x.id === id);
      if (!it) return p.concat([{ id, tag: em }]);
      if (it.tag === em)
        return p.map((x) => (x.id === id ? { ...x, tag: "📌" } : x));
      return p.map((x) => (x.id === id ? { ...x, tag: em } : x));
    });
  }, []);

  const remove = useCallback((id: number) => {
    haptic("selection");
    setItems((p) => p.filter((x) => x.id !== id));
  }, []);

  const sorted = useMemo(
    () => items.slice().sort((a, b) => a.id - b.id),
    [items]
  );

  return {
    items,
    sorted,
    count: items.length,
    isSaved,
    get,
    toggleSave,
    react,
    remove,
  };
}

export type Highlights = ReturnType<typeof useHighlights>;
