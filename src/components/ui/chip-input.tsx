"use client";

/**
 * ChipInput
 *
 * React migration of the production Angular `app-wordly-chip-input`
 * (wordly_portal: libs/components/core/chip-input).
 *
 * A text input that turns typed entries into removable chips (Badges). The
 * value is a controlled `string[]`. Entries are committed on a separator key
 * (Enter and comma by default; the Angular original used Tab) or on blur.
 * Backspace on an empty input removes the last chip. Optional de-duplication.
 *
 * Faithful to the Angular API: `chipVariant`, `uniqueValues`, `separatorKeys`
 * (was `separatorKeyCodes`), disabled + error states, label/required. The
 * Angular DI / RxJS / reactive-forms layer is dropped — data and handlers
 * arrive via props. Built on the shared shadcn `Badge` primitive.
 */

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Chip variant anatomy — 1:1 with the portal `WordlyBadgeComponent`
// (wordly_portal: libs/components/core/badge VARIANT_STYLES), translated to our
// design tokens. The shared shadcn `Badge` is used as the pill primitive; these
// classes override its per-variant colors so chips match the portal exactly.
//
// Brand mapping (per parity rules): the portal's blue `primary` and Teal `info`
// both map to OUR Brand Blue primary. Grays use the gray-* token scale; the
// success/destructive cases use the semantic destructive token. No raw hex.
// ---------------------------------------------------------------------------

export type ChipVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "info"
  | "destructive";

const CHIP_VARIANT_STYLES: Record<ChipVariant, string> = {
  // portal: bg-gray-100 text-gray-800 (neutral)
  default: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
  // portal: bg-blue-600 text-white  → OUR Brand Blue primary
  primary:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
  // portal: bg-gray-200 text-gray-800
  secondary: "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
  // portal: border-gray-400 text-gray-700 bg-transparent
  outline:
    "border border-gray-400 bg-transparent text-gray-700 hover:bg-gray-100",
  // portal: bg-teal-100 text-teal-800 → OUR Action Teal scale (not the primary action color)
  info: "border-transparent bg-action-teal-100 text-action-teal-800 hover:bg-action-teal-200",
  // portal: bg-destructive text-white
  destructive:
    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

// ---------------------------------------------------------------------------
// Props (mirror the Angular @Inputs / @Output)
// ---------------------------------------------------------------------------

export interface ChipInputProps {
  /** Controlled chip values. */
  value?: string[];
  /** Fired with the next chip array whenever chips are added/removed. */
  onValueChange?: (value: string[]) => void;

  /** Chip color variant. Mirrors Angular `chipVariant` (WordlyBadgeVariant). */
  chipVariant?: ChipVariant;
  /** Prevent committing a chip that already exists. Mirrors `uniqueValues`. */
  uniqueValues?: boolean;
  /**
   * Keys that commit the current text into a chip. Mirrors `separatorKeyCodes`.
   * Defaults to Enter and comma (the React-friendly equivalent of Tab).
   */
  separatorKeys?: string[];

  placeholder?: string;
  disabled?: boolean;
  /** Render the error styling (red border). Mirrors `showError`. */
  error?: boolean;

  label?: string;
  required?: boolean;

  /** Extra classes applied to the chip container. Mirrors `inputClass`. */
  inputClassName?: string;
  className?: string;
  id?: string;
}

let idCounter = 0;

// Mirrors the Angular `stripInvisibleCharacters` util: drop zero-width and
// other invisible formatting characters that sneak in via paste before
// committing a chip. Covers zero-width space/non-joiner/joiner, word joiner,
// soft hyphen, and the byte-order mark.
function stripInvisibleCharacters(raw: string): string {
  return raw.replace(/[​‌‍⁠­﻿]/g, "");
}

export function ChipInput({
  value = [],
  onValueChange,
  chipVariant = "outline",
  uniqueValues = false,
  separatorKeys = ["Enter", ","],
  placeholder = "Add an item",
  disabled = false,
  error = false,
  label,
  required = false,
  inputClassName,
  className,
  id: idProp,
}: ChipInputProps) {
  const [text, setText] = React.useState("");
  const generatedId = React.useMemo(() => `chip-input-${++idCounter}`, []);
  const controlId = idProp ?? generatedId;

  const updateChips = React.useCallback(
    (next: string[]) => {
      onValueChange?.(next);
    },
    [onValueChange]
  );

  const commitChip = React.useCallback(
    (raw: string) => {
      const chip = stripInvisibleCharacters(raw).trim();
      const isDuplicate = uniqueValues && value.includes(chip);
      if (chip && !isDuplicate) {
        updateChips([...value, chip]);
      }
      setText("");
    },
    [uniqueValues, value, updateChips]
  );

  const removeChip = React.useCallback(
    (index: number) => {
      if (disabled) return;
      updateChips(value.filter((_, i) => i !== index));
    },
    [disabled, value, updateChips]
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (separatorKeys.includes(event.key)) {
      event.preventDefault();
      commitChip(text);
    } else if (event.key === "Backspace" && !text && value.length) {
      removeChip(value.length - 1);
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={controlId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",
          disabled
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : undefined,
          error
            ? "border-destructive focus-within:border-destructive"
            : "border-input focus-within:border-ring",
          inputClassName
        )}
      >
        {value.map((chip, i) => (
          <Badge
            key={`${chip}-${i}`}
            className={cn(
              "flex min-w-0 max-w-full items-center gap-1",
              CHIP_VARIANT_STYLES[chipVariant]
            )}
          >
            <span className="truncate">{chip}</span>
            <button
              type="button"
              className="flex flex-shrink-0 items-center rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={() => removeChip(i)}
              disabled={disabled}
              aria-label={`Remove ${chip}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          type="text"
          id={controlId}
          className="min-w-[2px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitChip(text)}
        />
      </div>
    </div>
  );
}
