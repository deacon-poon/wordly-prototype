"use client";

/**
 * Chrome (app-layout-wrapper) version selector.
 *
 * Resolves which app layout wraps the page container:
 *   - "legacy"  → LegacyShell  (1:1 Angular portal shell)
 *   - "rebrand" → RebrandShell (new design)
 *
 * Resolution order on mount: `?chrome=` URL param (override + persisted) →
 * localStorage → default. The param lets you share a link pinned to a version
 * (e.g. /workspace/settings?chrome=legacy); localStorage keeps the choice sticky
 * across in-app navigations (which drop the query string).
 */

import * as React from "react";

export type ChromeVariant = "legacy" | "rebrand";

export const DEFAULT_CHROME: ChromeVariant = "legacy";
const STORAGE_KEY = "wordly:chrome";
const VALID: ChromeVariant[] = ["legacy", "rebrand"];

interface ChromeContextValue {
  chrome: ChromeVariant;
  setChrome: (c: ChromeVariant) => void;
}

const ChromeContext = React.createContext<ChromeContextValue>({
  chrome: DEFAULT_CHROME,
  setChrome: () => {},
});

export function ChromeProvider({ children }: { children: React.ReactNode }) {
  const [chrome, setChromeState] =
    React.useState<ChromeVariant>(DEFAULT_CHROME);

  const setChrome = React.useCallback((c: ChromeVariant) => {
    setChromeState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore (SSR / disabled storage) */
    }
  }, []);

  // Resolve after mount (avoids SSR/localStorage hydration mismatch).
  React.useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("chrome");
    if (param && VALID.includes(param as ChromeVariant)) {
      setChrome(param as ChromeVariant); // param wins + persists
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID.includes(stored as ChromeVariant)) {
        setChromeState(stored as ChromeVariant);
      }
    } catch {
      /* ignore */
    }
  }, [setChrome]);

  const value = React.useMemo(
    () => ({ chrome, setChrome }),
    [chrome, setChrome]
  );
  return (
    <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
  );
}

export function useChrome() {
  return React.useContext(ChromeContext);
}
