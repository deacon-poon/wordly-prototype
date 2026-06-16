"use client";

/**
 * LanguageMultiSelect
 *
 * React/shadcn migration of the production lib component
 * (wordly-react-components-lib: src/components/app/meeting/settings/LanguageMultiSelect.tsx),
 * originally built on MUI 6 `Autocomplete` (multiple) + Emotion.
 *
 * Behavior preserved 1:1 from the MUI original:
 * - Multi-select of languages with a searchable list.
 * - A leading "Select All" entry (rendered italic) that selects every option.
 * - Each option shows a checkbox; a "dynamic language" option is annotated with
 *   a sparkle (AutoAwesome → lucide `Sparkles`) icon, highlighted when selected.
 * - The dropdown does NOT close on select (disableCloseOnSelect).
 * - Selected languages render as dismissible chips inside the field, capped at
 *   `limitTags` (or `limitTagsMobile` on mobile) with a "+N" overflow indicator.
 * - A clear (X) button removes all selections; an add (+) button opens the list.
 * - The label floats/shrinks once the field is focused or has a value.
 *
 * MUI/Emotion → shadcn mapping:
 *   Autocomplete + TextField → Command + Popover (per the WorkspaceSelector proof)
 *   MUI Checkbox             → inline Tailwind check box (matches Command anatomy)
 *   MUI Chip (tags)          → @/components/ui/chip
 *   MUI IconButton + icons   → buttons + lucide-react (Plus, X, Sparkles, Check)
 *
 * Theme mapping (lib palette → OUR tokens): the lib's brand blue / `primary`
 * maps to OUR Brand Blue primary (primary / primary-blue-*); grays → gray-*.
 *
 * Data arrives via props (mock defaults below). In production the language list
 * is fetched from the meeting-settings API.
 */

import * as React from "react";
import { Plus, X, Sparkles, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Data contract (mirrors the lib's LanguageOption type)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  /** Wordly language code. */
  readonly wordlyCode: string;
  /** Language text to be displayed. */
  readonly displayName: string;
  /** Language text to be displayed within a compact screen size. */
  readonly compactDisplayName: string;
  /** Whether the language is a dynamic language. */
  readonly isDynamicLanguage?: boolean;
}

export const WORDLY_SELECT_ALL_OPTION = "select-all";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the meeting-settings API
// ---------------------------------------------------------------------------

export const MOCK_LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    wordlyCode: "ar",
    displayName: "Arabic — العربية",
    compactDisplayName: "Arabic",
  },
  {
    wordlyCode: "en",
    displayName: "English (US)",
    compactDisplayName: "English",
    isDynamicLanguage: true,
  },
  {
    wordlyCode: "ja",
    displayName: "Japanese — 日本語",
    compactDisplayName: "Japanese",
    isDynamicLanguage: true,
  },
  {
    wordlyCode: "ko",
    displayName: "Korean — 한국어",
    compactDisplayName: "Korean",
  },
  {
    wordlyCode: "es",
    displayName: "Spanish — Español",
    compactDisplayName: "Spanish",
  },
  {
    wordlyCode: "fr",
    displayName: "French — Français",
    compactDisplayName: "French",
  },
];

// ---------------------------------------------------------------------------
// Props (mirrors the lib's LanguageMultiSelectProps)
// ---------------------------------------------------------------------------

export interface LanguageMultiSelectProps {
  /** Displays the content of the label. */
  label: string;
  /** Renders the mobile tag limit when true. */
  isMobile?: boolean;
  /** Language options displayed in the order of the array. */
  languageOptions?: LanguageOption[];
  /** Controlled list of selected language objects. */
  selectedLanguages?: LanguageOption[];
  /** Called when the selected languages change. */
  onSelectedLanguagesChange?: (languages: LanguageOption[]) => void;
  /** Label for the "select all" entry. Default: "Select All". */
  selectAllLabel?: string;
  /** Limit the number of tags displayed. Default: 6. */
  limitTags?: number;
  /** Limit the number of tags displayed on mobile. Default: 2. */
  limitTagsMobile?: number;
  /** Maximum height (px) of the list. */
  listMaxHeight?: number;
  /** Maximum height (px) of the list on mobile. */
  listMaxHeightMobile?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LanguageMultiSelect({
  label,
  isMobile = false,
  languageOptions = MOCK_LANGUAGE_OPTIONS,
  selectedLanguages,
  onSelectedLanguagesChange,
  selectAllLabel = "Select All",
  limitTags = 6,
  limitTagsMobile = 2,
  listMaxHeight = 280,
  listMaxHeightMobile = 200,
  className,
}: LanguageMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // Support both controlled (selectedLanguages prop) and uncontrolled usage.
  const [internalSelected, setInternalSelected] = React.useState<
    LanguageOption[]
  >(selectedLanguages ?? []);
  const isControlled = selectedLanguages !== undefined;
  const selected = isControlled ? selectedLanguages : internalSelected;

  const setSelected = React.useCallback(
    (next: LanguageOption[]) => {
      if (!isControlled) setInternalSelected(next);
      onSelectedLanguagesChange?.(next);
    },
    [isControlled, onSelectedLanguagesChange]
  );

  const isSelected = React.useCallback(
    (code: string) => selected.some((s) => s.wordlyCode === code),
    [selected]
  );

  const allSelected =
    languageOptions.length > 0 && selected.length === languageOptions.length;

  function toggleOption(option: LanguageOption) {
    // The "select all" entry mirrors the MUI original: it selects every option,
    // or clears when already fully selected.
    if (option.wordlyCode === WORDLY_SELECT_ALL_OPTION) {
      setSelected(allSelected ? [] : [...languageOptions]);
      return;
    }
    if (isSelected(option.wordlyCode)) {
      setSelected(selected.filter((s) => s.wordlyCode !== option.wordlyCode));
    } else {
      setSelected([...selected, option]);
    }
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    setSelected([]);
  }

  const tagLimit = isMobile ? limitTagsMobile : limitTags;
  const visibleTags = selected.slice(0, tagLimit);
  const overflowCount = selected.length - visibleTags.length;
  const hasSelection = selected.length > 0;

  // Label floats once focused, open, or holding a value (MUI `shrink`).
  const labelFloating = focused || open || hasSelection;

  const selectAllEntry: LanguageOption = {
    wordlyCode: WORDLY_SELECT_ALL_OPTION,
    displayName: selectAllLabel,
    compactDisplayName: selectAllLabel,
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          {/* Floating label — mirrors the MUI TextField shrinking label. */}
          <label
            className={cn(
              "pointer-events-none absolute left-3 z-10 bg-white px-1 text-gray-500 transition-all duration-150",
              labelFloating
                ? "top-0 -translate-y-1/2 text-xs text-primary"
                : "top-1/2 -translate-y-1/2 text-sm"
            )}
          >
            {label}
          </label>

          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-label={label}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={cn(
                "flex min-h-[3.25rem] w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 pr-20 text-left text-sm shadow-sm outline-none transition-[color,box-shadow]",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                (focused || open) && "border-ring ring-[3px] ring-ring/50"
              )}
            >
              {hasSelection ? (
                <span className="flex max-h-[78px] flex-wrap items-center gap-1.5 overflow-auto">
                  {visibleTags.map((lang) => (
                    <Chip
                      key={lang.wordlyCode}
                      text={lang.compactDisplayName}
                      onRemove={() =>
                        setSelected(
                          selected.filter(
                            (s) => s.wordlyCode !== lang.wordlyCode
                          )
                        )
                      }
                    />
                  ))}
                  {overflowCount > 0 ? (
                    <span className="text-xs font-medium text-gray-500">
                      +{overflowCount}
                    </span>
                  ) : null}
                </span>
              ) : (
                // Keeps the trigger height stable while the label sits inline.
                <span className="text-transparent select-none">{label}</span>
              )}
            </button>
          </PopoverTrigger>

          {/* End adornments: clear-all (X) + open (+) — mirror the MUI IconButtons. */}
          <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
            {hasSelection ? (
              <button
                type="button"
                aria-label="Clear all languages"
                onClick={clearAll}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-4" />
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Add a language"
              onClick={() => setOpen((o) => !o)}
              className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[12rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandList
              style={{
                maxHeight: isMobile ? listMaxHeightMobile : listMaxHeight,
              }}
            >
              <CommandEmpty className="py-2 text-center text-sm italic text-muted-foreground">
                No languages match that search query
              </CommandEmpty>
              <CommandGroup>
                {[selectAllEntry, ...languageOptions].map((option) => {
                  const isAll = option.wordlyCode === WORDLY_SELECT_ALL_OPTION;
                  const checked = isAll
                    ? allSelected
                    : isSelected(option.wordlyCode);
                  return (
                    <CommandItem
                      key={option.wordlyCode}
                      // disableCloseOnSelect: handle selection without closing.
                      onSelect={() => toggleOption(option)}
                      value={`${option.displayName} ${option.compactDisplayName}`}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-gray-400 bg-transparent"
                          )}
                          aria-hidden="true"
                        >
                          {checked ? <Check className="size-3" /> : null}
                        </span>
                        <span
                          className={cn(
                            "truncate",
                            isAll && "italic text-gray-700"
                          )}
                        >
                          {isAll
                            ? option.displayName
                            : option.compactDisplayName}
                        </span>
                      </span>
                      {option.isDynamicLanguage ? (
                        <Sparkles
                          className={cn(
                            "size-4 shrink-0",
                            checked ? "text-primary" : "text-gray-400"
                          )}
                          aria-label="Dynamic language"
                        />
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
