"use client";

import * as React from "react";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { cn } from "../lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface SearchFilterOption {
  /** Unique value for this option */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon rendered beside the label */
  icon?: React.ElementType;
}

export interface SearchFilterCategory {
  /** Unique key for this category (e.g. "status", "workspace") */
  key: string;
  /** Display label shown as the section heading */
  label: string;
  /** Icon shown next to the heading */
  icon: React.ElementType;
  /** Color for the heading text and chip background */
  color: "blue" | "green" | "amber" | "purple" | "teal" | "rose";
  /** Available options within the category */
  options: SearchFilterOption[];
  /** Allow selecting multiple values (default true) */
  multiple?: boolean;
}

export interface ActiveFilter {
  categoryKey: string;
  value: string;
}

export interface UnifiedSearchProps {
  /** Filter categories to display */
  categories: SearchFilterCategory[];
  /** Currently active filters */
  activeFilters: ActiveFilter[];
  /** Current free-text query */
  query: string;
  /** Callback when filters change */
  onFiltersChange: (filters: ActiveFilter[]) => void;
  /** Callback when free-text query changes */
  onQueryChange: (query: string) => void;
  /** Callback when user presses Enter to search */
  onSearch?: (query: string, filters: ActiveFilter[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional className for the root container */
  className?: string;
}

// ============================================================================
// Color mapping
// ============================================================================

const colorMap = {
  blue: {
    heading: "text-primary-blue-600",
    chipBg: "bg-primary-blue-50",
    chipText: "text-primary-blue-700",
    chipBorder: "border-primary-blue-200",
    chipClose: "text-primary-blue-400 hover:text-primary-blue-600",
  },
  green: {
    heading: "text-emerald-600",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    chipBorder: "border-emerald-200",
    chipClose: "text-emerald-400 hover:text-emerald-600",
  },
  amber: {
    heading: "text-amber-600",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    chipBorder: "border-amber-200",
    chipClose: "text-amber-400 hover:text-amber-600",
  },
  purple: {
    heading: "text-purple-600",
    chipBg: "bg-purple-50",
    chipText: "text-purple-700",
    chipBorder: "border-purple-200",
    chipClose: "text-purple-400 hover:text-purple-600",
  },
  teal: {
    heading: "text-primary-teal-600",
    chipBg: "bg-teal-50",
    chipText: "text-teal-700",
    chipBorder: "border-teal-200",
    chipClose: "text-teal-400 hover:text-teal-600",
  },
  rose: {
    heading: "text-rose-600",
    chipBg: "bg-rose-50",
    chipText: "text-rose-700",
    chipBorder: "border-rose-200",
    chipClose: "text-rose-400 hover:text-rose-600",
  },
};

// ============================================================================
// Highlight matched characters helper
// ============================================================================

function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-gray-900">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ============================================================================
// Filter Chip
// ============================================================================

function FilterChip({
  categoryLabel,
  optionLabel,
  color,
  onRemove,
}: {
  categoryLabel: string;
  optionLabel: string;
  color: keyof typeof colorMap;
  onRemove: () => void;
}) {
  const colors = colorMap[color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        colors.chipBg,
        colors.chipText,
        colors.chipBorder
      )}
    >
      <span className="uppercase text-[10px] font-semibold tracking-wider opacity-70">
        {categoryLabel}
      </span>
      <span>{optionLabel}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          "ml-0.5 rounded-sm p-0 hover:bg-black/5 transition-colors",
          colors.chipClose
        )}
        aria-label={`Remove ${categoryLabel}: ${optionLabel}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function UnifiedSearch({
  categories,
  activeFilters,
  query,
  onFiltersChange,
  onQueryChange,
  onSearch,
  placeholder = "Search...",
  className,
}: UnifiedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build a lookup map for categories & options
  const categoryMap = useMemo(() => {
    const map = new Map<string, SearchFilterCategory>();
    for (const cat of categories) {
      map.set(cat.key, cat);
    }
    return map;
  }, [categories]);

  const optionMap = useMemo(() => {
    const map = new Map<string, { category: SearchFilterCategory; option: SearchFilterOption }>();
    for (const cat of categories) {
      for (const opt of cat.options) {
        map.set(`${cat.key}:${opt.value}`, { category: cat, option: opt });
      }
    }
    return map;
  }, [categories]);

  // Filter options based on current query
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        options: cat.options.filter((opt) =>
          opt.label.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.options.length > 0);
  }, [categories, query]);

  const isSelected = useCallback(
    (categoryKey: string, value: string) =>
      activeFilters.some(
        (f) => f.categoryKey === categoryKey && f.value === value
      ),
    [activeFilters]
  );

  const toggleFilter = useCallback(
    (categoryKey: string, value: string) => {
      const cat = categoryMap.get(categoryKey);
      const alreadySelected = isSelected(categoryKey, value);

      if (alreadySelected) {
        // Remove
        onFiltersChange(
          activeFilters.filter(
            (f) => !(f.categoryKey === categoryKey && f.value === value)
          )
        );
      } else {
        if (cat?.multiple === false) {
          // Single-select: replace within category
          const withoutCategory = activeFilters.filter(
            (f) => f.categoryKey !== categoryKey
          );
          onFiltersChange([...withoutCategory, { categoryKey, value }]);
        } else {
          // Multi-select: add
          onFiltersChange([...activeFilters, { categoryKey, value }]);
        }
      }
    },
    [activeFilters, categoryMap, isSelected, onFiltersChange]
  );

  const removeFilter = useCallback(
    (categoryKey: string, value: string) => {
      onFiltersChange(
        activeFilters.filter(
          (f) => !(f.categoryKey === categoryKey && f.value === value)
        )
      );
    },
    [activeFilters, onFiltersChange]
  );

  const clearAll = useCallback(() => {
    onFiltersChange([]);
    onQueryChange("");
    inputRef.current?.focus();
  }, [onFiltersChange, onQueryChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch?.(query, activeFilters);
        setIsOpen(false);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      // Backspace on empty input removes last chip
      if (e.key === "Backspace" && !query && activeFilters.length > 0) {
        const last = activeFilters[activeFilters.length - 1];
        removeFilter(last.categoryKey, last.value);
      }
    },
    [query, activeFilters, onSearch, removeFilter]
  );

  const hasActiveFilters = activeFilters.length > 0 || query.length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input bar */}
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 min-h-[40px] cursor-text transition-colors",
          isOpen
            ? "border-primary-blue-300 ring-2 ring-primary-blue-100"
            : "border-gray-300 hover:border-gray-400"
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />

        {/* Chips */}
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {activeFilters.map((filter) => {
            const entry = optionMap.get(
              `${filter.categoryKey}:${filter.value}`
            );
            if (!entry) return null;
            return (
              <FilterChip
                key={`${filter.categoryKey}:${filter.value}`}
                categoryLabel={entry.category.label}
                optionLabel={entry.option.label}
                color={entry.category.color}
                onRemove={() =>
                  removeFilter(filter.categoryKey, filter.value)
                }
              />
            );
          })}

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={activeFilters.length > 0 ? "" : placeholder}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-gray-400 py-0.5"
          />
        </div>

        {/* Clear & collapse */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Clear all filters"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 rounded-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? "Close search panel" : "Open search panel"}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-150">
          <div className="max-h-[360px] overflow-y-auto">
            {/* Free text search option */}
            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  onSearch?.(query, activeFilters);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    Search for &ldquo;
                    <span className="font-semibold text-gray-900">
                      {query}
                    </span>
                    &rdquo;
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="text-[10px]">↵</span> enter
                </span>
              </button>
            )}

            {/* Category sections */}
            {filteredCategories.map((category) => {
              const colors = colorMap[category.color];
              const CategoryIcon = category.icon;

              return (
                <div key={category.key} className="py-1">
                  {/* Section heading */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-4 pt-2.5 pb-1.5",
                      colors.heading
                    )}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {category.label}
                    </span>
                  </div>

                  {/* Options */}
                  {category.options.map((option) => {
                    const selected = isSelected(category.key, option.value);
                    const OptionIcon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          toggleFilter(category.key, option.value)
                        }
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          selected
                            ? "bg-gray-50"
                            : "hover:bg-gray-50"
                        )}
                      >
                        {/* Option icon */}
                        <span
                          className={cn(
                            "flex items-center justify-center h-7 w-7 rounded-md flex-shrink-0",
                            selected
                              ? "bg-gray-200/80 text-gray-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {OptionIcon ? (
                            <OptionIcon className="h-3.5 w-3.5" />
                          ) : (
                            <CategoryIcon className="h-3.5 w-3.5" />
                          )}
                        </span>

                        {/* Label with highlight */}
                        <span
                          className={cn(
                            "text-sm",
                            selected
                              ? "text-primary-blue-700 font-medium"
                              : "text-gray-700"
                          )}
                        >
                          <HighlightMatch text={option.label} query={query} />
                        </span>

                        {/* Checkmark */}
                        {selected && (
                          <Check className="ml-auto h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Empty state */}
            {filteredCategories.length === 0 && query.trim() && (
              <div className="py-8 text-center text-sm text-gray-400">
                No filters match &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
