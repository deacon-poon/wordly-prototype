"use client";

/**
 * WordlyLanguageSelect
 *
 * React/shadcn migration of the production MUI component
 * (wordly-react-components-lib:
 *   src/components/app/meeting/settings/wordly-language-select/*).
 *
 * The original is three files — the shell (`WordlyLanguageSelect`), the dropdown
 * (`WordlyLanguageSelectAutocomplete`), and the selected-pills row
 * (`WordlyLanguageSelectChipsArray`, which renders `LanguageChip`) — all built on
 * MUI 6 + Emotion `styled`. This port folds them into a single component on the
 * shared shadcn primitives (DEC-003):
 *
 *   - MUI Button (the "Add a language" trigger)      → Popover + shadcn Button
 *   - Emotion `DropdownMenu` styled Box (the popover) → PopoverContent
 *   - searchable language list (StyledInput + List)   → Command / CommandInput /
 *                                                        CommandList / CommandItem
 *   - selected-language pills (LanguageChip)          → @/components/ui/chip Chip
 *   - MUI icons (Translate/Add/Check/AutoAwesome/...) → lucide-react
 *   - the verbose ARIA-announcement plumbing          → trimmed to the visible
 *                                                        behavior a prototype proves
 *
 * Theme mapping (lib palette → OUR tokens): the lib's selected-row green
 * (lightnessGreen85/92) maps to accent-green-* for the option hover/selected wash;
 * the active-language pill uses Brand Blue (the Chip "selected" variant) as the
 * primary; the ALS "dynamic language" sparkle uses action-teal-*. No raw hex.
 *
 * Data arrives via props with small inline mock defaults (in production these
 * languages would be fetched from the meeting-settings API).
 */

import * as React from "react";
import { Plus, Check, Minus, Languages, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Data contract (mirrors the lib's `LanguageOption`)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  /** Wordly language code (unique id). */
  wordlyCode: string;
  /** Full label, e.g. "Japanese — 日本語". */
  displayName: string;
  /** Short label used inside pills, e.g. "Japanese". */
  compactDisplayName: string;
  /** Whether the language supports Adaptive Live Speech (ALS) — the sparkle. */
  isDynamicLanguage?: boolean;
}

/** Sentinel value for the synthetic "Select All" / "Remove All" row. */
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
    wordlyCode: "zh-HK",
    displayName: "Cantonese — 廣東話",
    compactDisplayName: "Cantonese",
  },
  {
    wordlyCode: "en",
    displayName: "English (US)",
    compactDisplayName: "English",
    isDynamicLanguage: true,
  },
  {
    wordlyCode: "de",
    displayName: "German — Deutsch",
    compactDisplayName: "German",
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
];

// ---------------------------------------------------------------------------
// Props (mirrors the lib's `WordlyLanguageSelectProps`, minus the ARIA-string
// + announcement plumbing that a prototype doesn't need to prove)
// ---------------------------------------------------------------------------

export interface WordlyLanguageSelectProps {
  /** Trigger label, e.g. "Add a Language". */
  label?: string;
  /** Placeholder for the search input inside the dropdown. */
  searchPlaceholderText?: string;
  /** All languages offered in the dropdown, in display order. */
  languageOptions?: LanguageOption[];
  /** Languages the user has selected, in display order. */
  selectedLanguageList?: LanguageOption[];
  /** The current active language (renders as the Brand-Blue pill). */
  activeLanguage?: LanguageOption;
  /** Fired when the selected-language set changes. */
  onSelectLanguages?: (languages: LanguageOption[]) => void;
  /** Fired when a language is removed (by code). */
  onRemoveLanguage?: (languageCode: string) => void;
  /** Fired when the active language changes. */
  onChangeActiveLanguage?: (language: LanguageOption) => void;

  /** Show a "Select All" / "Remove All" row at the top of the dropdown. */
  showSelectAll?: boolean;
  /** Label for the "Select All" row (requires showSelectAll). */
  selectAllLabel?: string;
  /** Label for the "Remove All" row when everything is selected. */
  removeAllLabel?: string;

  /** Compact layout: hides the leading Translate icon, tightens spacing. */
  compact?: boolean;
  /** Disable the "add a language" trigger. */
  disableAdd?: boolean;
  /** Show a divider between the trigger row and the chips row. */
  showDivider?: boolean;

  /**
   * When true, pills only show their remove (X) button after the user enters
   * "remove mode" via the adjacent minus button.
   */
  enableRemoveView?: boolean;
  /** Hide the remove button on all pills (do not combine with enableRemoveView). */
  disableRemove?: boolean;
  /** When true, selecting a language from the dropdown also makes it active. */
  changeActiveLanguageWithDropdown?: boolean;
  /** When true, the dropdown closes after a selection. */
  closeListboxOnSelect?: boolean;

  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WordlyLanguageSelect({
  label = "Add a Language",
  searchPlaceholderText = "Search languages...",
  languageOptions = MOCK_LANGUAGE_OPTIONS,
  selectedLanguageList = [MOCK_LANGUAGE_OPTIONS[0], MOCK_LANGUAGE_OPTIONS[2]],
  activeLanguage = MOCK_LANGUAGE_OPTIONS[2],
  onSelectLanguages,
  onRemoveLanguage,
  onChangeActiveLanguage,
  showSelectAll = false,
  selectAllLabel = "Select All",
  removeAllLabel = "Remove All Selected",
  compact = false,
  disableAdd = false,
  showDivider = false,
  enableRemoveView = false,
  disableRemove = false,
  changeActiveLanguageWithDropdown = false,
  closeListboxOnSelect = true,
  className,
}: WordlyLanguageSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [isRemoveMode, setIsRemoveMode] = React.useState(false);

  const allSelected =
    selectedLanguageList.length > 0 &&
    selectedLanguageList.length === languageOptions.length;

  const isSelected = React.useCallback(
    (code: string) => selectedLanguageList.some((l) => l.wordlyCode === code),
    [selectedLanguageList]
  );

  // Toggle a single language: add when absent, remove when present (but never
  // remove the last one — mirrors the lib's "at least one language" guard).
  function handleToggle(option: LanguageOption) {
    if (!isSelected(option.wordlyCode)) {
      const next = [...selectedLanguageList, option];
      onSelectLanguages?.(next);
      if (changeActiveLanguageWithDropdown) {
        onChangeActiveLanguage?.(option);
      }
    } else {
      if (selectedLanguageList.length <= 1) return; // keep at least one
      onRemoveLanguage?.(option.wordlyCode);
      if (option.wordlyCode === activeLanguage.wordlyCode) {
        const nextActive = selectedLanguageList.find(
          (l) => l.wordlyCode !== option.wordlyCode
        );
        if (nextActive) onChangeActiveLanguage?.(nextActive);
      }
    }
    if (closeListboxOnSelect) setOpen(false);
  }

  // The synthetic Select All / Remove All row.
  function handleSelectAllToggle() {
    if (allSelected) {
      // Remove all except the active language.
      onSelectLanguages?.([activeLanguage]);
    } else {
      onSelectLanguages?.([...languageOptions]);
    }
    if (closeListboxOnSelect) setOpen(false);
  }

  // Remove a pill (used by the chips row), with the same active-language reflow.
  function handleRemovePill(language: LanguageOption) {
    if (selectedLanguageList.length <= 1) return;
    onRemoveLanguage?.(language.wordlyCode);
    if (language.wordlyCode === activeLanguage.wordlyCode) {
      const nextActive = selectedLanguageList.find(
        (l) => l.wordlyCode !== language.wordlyCode
      );
      if (nextActive) onChangeActiveLanguage?.(nextActive);
    }
  }

  const selectAllRowLabel = allSelected ? removeAllLabel : selectAllLabel;
  const removeModeAvailable =
    enableRemoveView && selectedLanguageList.length > 1;
  // Pills show their X when: remove-view is off (always removable), OR
  // remove-view is on and the user has entered remove mode. disableRemove wins.
  const pillsRemovable = !disableRemove && (!enableRemoveView || isRemoveMode);

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        compact ? "gap-2" : "gap-4",
        className
      )}
    >
      {/* Trigger row: optional Translate glyph + the "add a language" button
          + the optional remove-mode toggle. */}
      <div className="flex items-center gap-2">
        {!compact ? (
          <Languages
            className="size-5 shrink-0 text-gray-500"
            aria-hidden="true"
          />
        ) : null}

        <Popover open={open} onOpenChange={disableAdd ? undefined : setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disableAdd}
              aria-expanded={open}
              aria-haspopup="listbox"
              className="flex w-full items-center justify-start gap-2 font-normal text-gray-900"
            >
              <Plus
                className="size-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] min-w-[16rem] p-0"
          >
            <Command
              // The lib filters by displayName substring; cmdk does this for us
              // off CommandItem `value`, so default filtering is left on.
              className="max-h-[min(62vh,28rem)]"
            >
              <CommandInput placeholder={searchPlaceholderText} />
              <CommandList>
                <CommandEmpty className="py-6 text-center text-sm italic text-muted-foreground">
                  No languages found
                </CommandEmpty>
                <CommandGroup>
                  {showSelectAll ? (
                    <CommandItem
                      key={WORDLY_SELECT_ALL_OPTION}
                      // Always-matchable label so it survives filtering.
                      value={`__select_all__ ${selectAllRowLabel}`}
                      onSelect={handleSelectAllToggle}
                      className="cursor-pointer gap-2 rounded-md py-2.5 pl-9 pr-3 font-medium text-primary aria-selected:bg-accent-green-100 aria-selected:text-primary"
                    >
                      <span className="truncate">{selectAllRowLabel}</span>
                    </CommandItem>
                  ) : null}

                  {languageOptions.map((option) => {
                    const selected = isSelected(option.wordlyCode);
                    const active =
                      option.wordlyCode === activeLanguage.wordlyCode;
                    return (
                      <CommandItem
                        key={option.wordlyCode}
                        value={`${option.displayName} ${option.compactDisplayName}`}
                        onSelect={() => handleToggle(option)}
                        className={cn(
                          "relative cursor-pointer gap-2 rounded-md py-2.5 pl-9 pr-3",
                          // Lib hover/keyboard wash (lightnessGreen92) → accent-green-50.
                          "aria-selected:bg-accent-green-50",
                          // Lib chosen state (lightnessGreen85) → accent-green-100.
                          selected && "bg-accent-green-100"
                        )}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
                          <span className="truncate">{option.displayName}</span>
                          {active ? (
                            <span className="shrink-0 rounded-full bg-primary-blue-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-blue-700">
                              Active
                            </span>
                          ) : null}
                        </span>

                        <span className="ml-auto flex shrink-0 items-center gap-2">
                          {option.isDynamicLanguage ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span aria-hidden="true">
                                  <Sparkles className="size-4 text-action-teal-500" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Adaptive Live Speech supported
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                          {selected ? (
                            <Check
                              className="size-4 text-accent-green-600"
                              aria-hidden="true"
                            />
                          ) : null}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>

              {!closeListboxOnSelect ? (
                <div className="border-t p-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              ) : null}
            </Command>
          </PopoverContent>
        </Popover>

        {enableRemoveView ? (
          <Button
            type="button"
            size="icon"
            variant={isRemoveMode ? "default" : "outline"}
            disabled={!removeModeAvailable && !isRemoveMode}
            aria-pressed={isRemoveMode}
            aria-label={
              isRemoveMode ? "Done removing languages" : "Remove languages"
            }
            onClick={() => setIsRemoveMode((v) => !v)}
            className="shrink-0"
          >
            {isRemoveMode ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Minus className="size-4" aria-hidden="true" />
            )}
          </Button>
        ) : null}
      </div>

      {showDivider ? <Separator /> : null}

      {/* Selected-language pills. Active language → Brand-Blue selected chip;
          clicking a pill makes it the active language. */}
      {selectedLanguageList.length > 0 ? (
        <div
          className="flex flex-wrap gap-1.5"
          role="list"
          aria-label="Selected languages"
        >
          {selectedLanguageList.map((language) => {
            const active = language.wordlyCode === activeLanguage.wordlyCode;
            const removable = pillsRemovable && !active;
            return (
              <div
                key={language.wordlyCode}
                role="listitem"
                className="flex items-center gap-1"
              >
                <Chip
                  text={
                    compact ? language.compactDisplayName : language.displayName
                  }
                  selectable
                  selected={active}
                  onClick={() => onChangeActiveLanguage?.(language)}
                  showCloseButton={removable}
                  onRemove={
                    removable ? () => handleRemovePill(language) : undefined
                  }
                  showHelpIcon={Boolean(language.isDynamicLanguage)}
                  helpText={
                    language.isDynamicLanguage
                      ? "Adaptive Live Speech supported"
                      : undefined
                  }
                  aria-label={
                    active
                      ? `${language.displayName} (active language)`
                      : language.displayName
                  }
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
