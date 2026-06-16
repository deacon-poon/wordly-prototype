"use client";

/**
 * AvatarLanguageSelect
 *
 * Port of the production `wordly-react-components-lib` component
 * (src/components/app/meeting/settings/avatar-select/AvatarLanguageSelect.tsx),
 * which was built on MUI 6 (Avatar + useSelect) and an Emotion styled layer.
 * Rebuilt here on the prototype's shadcn/Tailwind foundation.
 *
 * Anatomy (unchanged from the original):
 *   - A circular avatar showing the participant's initials (or an image).
 *   - When `languages` are supplied, the avatar becomes a toggle button with a
 *     small down-arrow badge overlapping its bottom-right corner; clicking it
 *     opens a listbox of selectable languages.
 *   - A small caption message renders beneath the avatar.
 *
 * Component mapping (lib primitive → prototype primitive):
 *   - Avatar / WordlyAvatar          → `@/components/ui/avatar`
 *   - useSelect + Listbox            → `@/components/ui/popover` + `command`
 *   - KeyboardArrowDownIcon          → `ChevronDown` (lucide-react)
 *   - Emotion style helpers          → Tailwind utility classes
 *
 * Theme mapping (lib palette → our tokens):
 *   - wordlyBlue (the teal brand accent used for the avatar + arrow)
 *     → `action-teal` tokens. Brand Blue stays the app primary.
 *   - lib grays (avatar bg, listbox borders, message text) → `gray-*` tokens.
 *
 * Data arrives via props with small inline mock defaults; in production the
 * language list is fetched from the API.
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// ---------------------------------------------------------------------------
// Data contract (mirrors the lib's LanguageOption type)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  /** Wordly language code, e.g. "en". */
  wordlyCode: string;
  /** Full language label, e.g. "English (US)". */
  displayName: string;
  /** Compact label shown in the listbox, e.g. "English". */
  compactDisplayName: string;
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
// Initials helper (ported 1:1 from WordlyAvatar.extractInitials)
// ---------------------------------------------------------------------------

const MINIMUM_NAME_CHARACTERS = 3;

function extractInitials(name: string): string {
  const names = name.trim().toUpperCase().split(" ");
  if (names.length === 1) {
    return names[0].slice(0, MINIMUM_NAME_CHARACTERS);
  }
  if (names.length <= 3) {
    return names
      .map((n) => n[0])
      .join("")
      .slice(0, 3);
  }
  return names[0].slice(0, 1) + names[names.length - 1].slice(0, 1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface AvatarLanguageSelectProps {
  /**
   * Languages shown in the select listbox, in render order. When omitted, the
   * component renders an avatar only (no select affordance).
   */
  languages?: LanguageOption[];

  /** Selected language code (uncontrolled default if `value` is not provided). */
  defaultValue?: string;

  /** Controlled selected language code. */
  value?: string;

  /** Display name used to derive the avatar initials. Defaults to "YOU". */
  name?: string;

  /** Caption rendered beneath the avatar. */
  message?: string;

  /** Accessible label for the trigger. */
  "aria-label"?: string;

  /** Fired when a language is selected. */
  onLanguageChange?: (value: string) => void;

  /** Optional image source for the avatar; falls back to initials when absent. */
  avatarImage?: string;

  /** Compact rendering (smaller avatar + arrow). */
  small?: boolean;

  /** Disable the control. */
  disabled?: boolean;

  /** Show a search box inside the listbox. */
  searchable?: boolean;

  /** Class applied to the root wrapper. */
  className?: string;
}

export function AvatarLanguageSelect({
  languages = MOCK_LANGUAGES,
  defaultValue = "en",
  value: controlledValue,
  name = "YOU",
  message = "",
  "aria-label": ariaLabel,
  onLanguageChange,
  avatarImage,
  small = false,
  disabled = false,
  searchable = false,
  className,
}: AvatarLanguageSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const showSelect = languages != null && languages.length > 0;
  const initials = React.useMemo(() => extractInitials(name), [name]);

  function handleSelect(next: string) {
    if (!isControlled) setInternalValue(next);
    onLanguageChange?.(next);
    setOpen(false);
  }

  // The avatar + arrow badge. Reused for both the static and the toggle case.
  const avatarSize = small ? "h-10 w-10" : "h-[50px] w-[50px]";
  const avatarFontSize = small ? "text-xs" : "text-sm";

  const avatarVisual = (
    <Avatar
      className={cn(
        avatarSize,
        "bg-action-teal-100 text-gray-900",
        disabled && "opacity-60 grayscale"
      )}
    >
      {avatarImage ? <AvatarImage src={avatarImage} alt={name} /> : null}
      <AvatarFallback
        className={cn(
          "bg-action-teal-100 text-gray-900 font-medium",
          avatarFontSize
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className={cn("flex w-fit flex-col items-center", className)}>
      {showSelect ? (
        <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-label={ariaLabel}
              disabled={disabled}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full bg-transparent p-0 outline-none",
                "transition focus-visible:ring-2 focus-visible:ring-action-teal-500 focus-visible:ring-offset-2",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {avatarVisual}
              {/* Down-arrow badge overlapping the avatar's bottom-right. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full text-white shadow-sm",
                  small ? "h-[18px] w-[18px]" : "h-6 w-6",
                  disabled
                    ? "bg-gray-400"
                    : "bg-action-teal-600 transition hover:bg-action-teal-700"
                )}
              >
                <ChevronDown className={small ? "h-3 w-3" : "h-4 w-4"} />
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="w-auto min-w-[250px] rounded-sm border border-gray-200 p-1.5 shadow-lg"
          >
            <Command>
              {searchable ? (
                <CommandInput placeholder="Search languages..." />
              ) : null}
              <CommandList className="max-h-[60vh]">
                <CommandEmpty className="py-1.5 text-sm italic text-gray-500">
                  No languages match that search
                </CommandEmpty>
                <CommandGroup>
                  {languages.map((language) => {
                    const isSelected = selectedValue === language.wordlyCode;
                    return (
                      <CommandItem
                        key={language.wordlyCode}
                        value={language.compactDisplayName}
                        aria-label={language.compactDisplayName}
                        onSelect={() => handleSelect(language.wordlyCode)}
                        className={cn(
                          "cursor-pointer rounded-sm px-2 py-2 text-sm text-gray-900",
                          "aria-selected:bg-gray-100",
                          isSelected && "font-medium text-action-teal-700"
                        )}
                      >
                        {language.compactDisplayName}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        // Avatar-only mode: no select affordance.
        avatarVisual
      )}

      {message ? (
        <p className={cn("text-xs text-gray-700", small ? "-mt-2.5" : "mt-1")}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default AvatarLanguageSelect;
