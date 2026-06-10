"use client";

/**
 * LanguageSelect
 *
 * Port of the production MUI component
 * (wordly-react-components-lib: src/components/app/meeting/settings/LanguageSelect.tsx).
 *
 * The original was a styled MUI `Select` rendering the list of Wordly-supported
 * languages, with a controlled `value`, optional `label`, a `compact` mode that
 * swaps the long display name for a short one, and a check icon on the selected
 * row. It also had a `native` flag (native <select> vs. MUI listbox) and a
 * `textColor` hex override driven by the theme palette.
 *
 * Rebuilt here on the shared shadcn primitives (Command + Popover) per the
 * repo idiom established by `workspace-selector.tsx`. MUI/Emotion are gone:
 * the MUI styling helpers fold into Tailwind classes, MUI palette maps to our brand
 * tokens (wordlyBlue/brand → Brand Blue `primary`; grays → `gray-*`/`muted`),
 * the MUI Check icon becomes lucide `Check`, and the `native` listbox is
 * replaced by a searchable Command list (languages are long; search helps).
 * The free-form hex `textColor` override is intentionally dropped in favor of
 * tokens (no raw hex in the lab); use `className` for trigger styling.
 *
 * In production these languages would be fetched from the API.
 */

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
// Data contract (mirrors the lib's `LanguageOption` type)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  /** Wordly language code (the option value). */
  wordlyCode: string;
  /** Full display name, e.g. "Japanese — 日本語". */
  displayName: string;
  /** Short display name used in compact mode, e.g. "Japanese". */
  compactDisplayName: string;
  /** Whether the language is a dynamic language (carried for parity). */
  isDynamicLanguage?: boolean;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the languages API
// ---------------------------------------------------------------------------

export const MOCK_LANGUAGES: LanguageOption[] = [
  {
    wordlyCode: "en",
    displayName: "English (US)",
    compactDisplayName: "English",
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
  {
    wordlyCode: "de",
    displayName: "German — Deutsch",
    compactDisplayName: "German",
  },
  {
    wordlyCode: "ja",
    displayName: "Japanese — 日本語",
    compactDisplayName: "Japanese",
  },
  {
    wordlyCode: "ko",
    displayName: "Korean — 한국어",
    compactDisplayName: "Korean",
  },
  {
    wordlyCode: "ar",
    displayName: "Arabic — العربية",
    compactDisplayName: "Arabic",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface LanguageSelectProps {
  /** Languages, rendered in array order. Defaults to a small inline mock. */
  languages?: readonly LanguageOption[];
  /** Controlled selected value (the `wordlyCode`). */
  value?: string;
  /** Fired with the selected `wordlyCode` when a language is chosen. */
  handleChange?: (value: string) => void;
  /** Optional field label rendered above the trigger. */
  label?: string;
  /** aria-label for the trigger when there is no visible `label`. */
  "aria-label"?: string;
  /** Compact mode: show `compactDisplayName` instead of `displayName`. */
  compact?: boolean;
  /** Show a search input to filter the list (default true). */
  searchable?: boolean;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Text shown when no languages match the search query. */
  noResultsText?: string;
  className?: string;
}

export function LanguageSelect({
  languages = MOCK_LANGUAGES,
  value,
  handleChange,
  label,
  "aria-label": ariaLabel,
  compact = false,
  searchable = true,
  placeholder = "Select a language",
  disabled = false,
  noResultsText = "No languages match that search",
  className,
}: LanguageSelectProps) {
  const [open, setOpen] = React.useState(false);

  const nameOf = React.useCallback(
    (lang: LanguageOption) =>
      compact ? lang.compactDisplayName : lang.displayName,
    [compact]
  );

  const selected = languages.find((l) => l.wordlyCode === value);

  function handleSelect(code: string) {
    handleChange?.(code);
    setOpen(false);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      ) : null}

      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={!label ? ariaLabel : undefined}
            disabled={disabled}
            data-testid="language-select"
            className={cn(
              "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-[color,box-shadow]",
              "focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span
              className={cn(
                "min-w-0 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {selected ? nameOf(selected) : placeholder}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[12rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          align="start"
        >
          <Command>
            {searchable ? (
              <CommandInput placeholder="Search languages..." />
            ) : null}
            <CommandList>
              <CommandEmpty className="py-1.5 text-sm italic text-muted-foreground">
                {noResultsText}
              </CommandEmpty>
              <CommandGroup>
                {languages.map((lang) => {
                  const isSelected = value === lang.wordlyCode;
                  return (
                    <CommandItem
                      key={lang.wordlyCode}
                      value={`${nameOf(lang)} ${lang.wordlyCode}`}
                      onSelect={() => handleSelect(lang.wordlyCode)}
                      className={cn(
                        "relative cursor-pointer gap-4 rounded-md py-2 pl-2 pr-8 text-sm text-gray-900",
                        "aria-selected:bg-primary/10 aria-selected:text-gray-900",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      <span className="truncate">{nameOf(lang)}</span>
                      <span className="absolute right-2 flex size-4 items-center justify-center">
                        {isSelected ? (
                          <Check
                            className="size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>
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

export default LanguageSelect;
