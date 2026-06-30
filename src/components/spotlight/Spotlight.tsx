"use client";

/**
 * Spotlight — a ⌘K command palette for finding prototypes (and their variants) and
 * switching appearance. Replaces the old always-on floating switchers (Legacy/Rebrand
 * chrome + per-prototype variant buttons) with one searchable, unobtrusive surface.
 *
 * Open with ⌘K / Ctrl+K (or the small launcher button); ↑↓ to move, ↵ to run, Esc to
 * close. Data comes from the feature registry, so new prototypes appear automatically;
 * a feature's `spotlight` entries (e.g. variants) show up as extra results.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Palette,
  CornerDownLeft,
  SlidersHorizontal,
} from "lucide-react";
import { featureConfigs } from "@/shell/feature-registry.generated";
import { useChrome } from "@/components/chrome/chrome-context";
import { cn } from "@/lib/utils";

type Group = "Prototypes" | "Variants" | "Appearance";

interface Item {
  id: string;
  label: string;
  sub?: string;
  hint?: string;
  group: Group;
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
}

const GROUP_ORDER: Group[] = ["Prototypes", "Variants", "Appearance"];

export function Spotlight() {
  const router = useRouter();
  const { chrome, setChrome } = useChrome();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Build the full item set once per render of the palette.
  const items = React.useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    const prototypes = [...featureConfigs]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map<Item>((c) => ({
        id: `proto:${c.id}`,
        label: c.title,
        sub: `/lab/${c.id}`,
        group: "Prototypes",
        keywords: `${c.title} ${c.id} ${c.nav.label}`,
        icon: <Sparkles className="h-4 w-4" />,
        run: go(`/lab/${c.id}`),
      }));

    const variants = featureConfigs.flatMap<Item>((c) =>
      (c.spotlight ?? []).map((e) => ({
        id: `var:${e.href}`,
        label: e.label,
        sub: e.href,
        hint: e.hint,
        group: "Variants",
        keywords: `${e.label} ${e.keywords ?? ""} ${c.title} ${c.id}`,
        icon: <SlidersHorizontal className="h-4 w-4" />,
        run: go(e.href),
      }))
    );

    const appearance: Item[] = (["legacy", "rebrand"] as const).map((v) => ({
      id: `chrome:${v}`,
      label: `Appearance: ${v === "legacy" ? "Legacy" : "Rebrand"} chrome`,
      sub: chrome === v ? "Current" : undefined,
      group: "Appearance",
      keywords: `chrome appearance theme layout ${v}`,
      icon: <Palette className="h-4 w-4" />,
      run: () => {
        setChrome(v);
        setOpen(false);
      },
    }));

    return [...prototypes, ...variants, ...appearance];
  }, [router, chrome, setChrome]);

  // Filter: every whitespace token must appear somewhere in the item's haystack.
  const results = React.useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return items;
    return items.filter((it) => {
      const hay =
        `${it.label} ${it.sub ?? ""} ${it.hint ?? ""} ${it.group} ${it.keywords}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [items, query]);

  // Open/close + global shortcut.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset + focus on open.
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Clamp active index when results shrink.
  React.useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) =>
        results.length ? (a - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  // Keep the active row in view.
  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      {/* Launcher — the single, unobtrusive control (replaces the old switcher clusters). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search prototypes"
        className="fixed bottom-3 right-3 z-[1000] inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 py-1.5 pl-3 pr-2 text-xs font-medium text-gray-500 shadow-md backdrop-blur transition-colors hover:text-gray-900"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] text-gray-400">
          ⌘K
        </kbd>
      </button>

      {!open ? null : (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search prototypes"
          className="fixed inset-0 z-[1001] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Search field */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-4">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search prototypes, variants, appearance…"
                className="h-14 w-full bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400 sm:block">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  No matches
                </div>
              ) : (
                GROUP_ORDER.map((group) => {
                  const rows = results.filter((r) => r.group === group);
                  if (!rows.length) return null;
                  return (
                    <div key={group} className="mb-1">
                      <div className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {group}
                      </div>
                      {rows.map((it) => {
                        const idx = results.indexOf(it);
                        const isActive = idx === active;
                        return (
                          <button
                            key={it.id}
                            data-idx={idx}
                            type="button"
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => it.run()}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                              isActive ? "bg-primary-blue-25" : "bg-transparent"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                isActive
                                  ? "bg-primary-blue-400 text-white"
                                  : "bg-gray-100 text-gray-500"
                              )}
                            >
                              {it.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-gray-900">
                                {it.label}
                              </span>
                              {it.sub ? (
                                <span className="block truncate text-xs text-gray-400">
                                  {it.sub}
                                </span>
                              ) : null}
                            </span>
                            {it.hint ? (
                              <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-500">
                                {it.hint}
                              </span>
                            ) : null}
                            {isActive ? (
                              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
