"use client";

/**
 * Dev-only floating toggle to flip between the legacy and rebrand app layouts
 * live (also settable via ?chrome=legacy|rebrand). Bottom-right, unobtrusive.
 */

import { useChrome, ChromeVariant } from "./chrome-context";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ChromeVariant; label: string }[] = [
  { value: "legacy", label: "Legacy" },
  { value: "rebrand", label: "Rebrand" },
];

export function ChromeSwitcher() {
  const { chrome, setChrome } = useChrome();

  return (
    <div className="fixed bottom-3 right-3 z-[1000] flex items-center gap-1 rounded-full border border-gray-200 bg-white/95 p-1 shadow-md backdrop-blur">
      <span className="px-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">
        Chrome
      </span>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setChrome(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            chrome === o.value
              ? "bg-primary-blue-400 text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
