"use client";

/**
 * LanguageSelector
 *
 * React migration of the production Angular `wordly-language-selector`
 * (wordly_portal: libs/components/business/language-selector).
 *
 * The Angular original is a proxy control that wraps either a chip selector
 * (multiple selection, with an "add more" dialog) or a select (single
 * selection), populated by a `WordlyLanguageSelectorService` that bridges the
 * app's `LanguageService`. Here we keep the same public surface — single vs
 * multiple selection, searchable picker, max-selectable cap, detectable-only
 * filter, a "sparkles" remark for detectable languages, and loading/error/empty
 * states — but drop the Angular DI/service/caching layer: data arrives via
 * props, defaulting to mock data.
 *
 * Built on the shared shadcn primitives: Command + Popover for single mode
 * (matching WorkspaceSelector), Dialog + Command for the multi-select picker,
 * and pill chips matching the portal's wordly-chip "selected" anatomy. cn from
 * "@/lib/utils"; lucide-react for icons.
 *
 * In production these languages would be fetched from the API.
 */

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, ChevronDown, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). The single-
// selection mode proxies wordly-language-selector -> wordly-select ->
// hlm-select-trigger, so the real control anatomy lives there: border-input,
// rounded-md, px-3 py-2, text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8,
// focus ring [3px] on ring (no offset) with focus-visible:border-ring, no hover
// background, destructive border+text+ring on error. ChevronDown indicator
// (size-4). Identical to the validated account-selector reference.
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8",
      },
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlyLanguageOption model)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  /** Wordly language code, e.g. "en-US". */
  code: string;
  /** Localized display name shown to the user. */
  displayName: string;
  /** Native name of the language (used as helper text). */
  nativeName?: string;
  isTranscribable?: boolean;
  isTranslatable?: boolean;
  isDetectable?: boolean;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the languages API
// ---------------------------------------------------------------------------

export const MOCK_LANGUAGES: LanguageOption[] = [
  {
    code: "en-US",
    displayName: "English (US)",
    nativeName: "English",
    isTranscribable: true,
    isTranslatable: true,
    isDetectable: true,
  },
  {
    code: "es-ES",
    displayName: "Spanish (Spain)",
    nativeName: "Español",
    isTranscribable: true,
    isTranslatable: true,
    isDetectable: true,
  },
  {
    code: "fr-FR",
    displayName: "French (France)",
    nativeName: "Français",
    isTranscribable: true,
    isTranslatable: true,
    isDetectable: false,
  },
  {
    code: "de-DE",
    displayName: "German",
    nativeName: "Deutsch",
    isTranscribable: true,
    isTranslatable: true,
    isDetectable: true,
  },
  {
    code: "ja-JP",
    displayName: "Japanese",
    nativeName: "日本語",
    isTranscribable: true,
    isTranslatable: true,
    isDetectable: false,
  },
  {
    code: "pt-BR",
    displayName: "Portuguese (Brazil)",
    nativeName: "Português",
    isTranscribable: false,
    isTranslatable: true,
    isDetectable: false,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface LanguageSelectorProps {
  /**
   * Controlled selected value. A single code string in single mode, an array
   * of codes in multiple mode (matches the Angular `string | string[]` value).
   */
  value?: string | string[];
  /** Fired when the selection changes (codes), mirroring the Angular value. */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Fired with the resolved rich language objects, mirroring the Angular
   * `languageSelectionChanged` @Output.
   */
  onLanguageSelectionChanged?: (languages: LanguageOption[]) => void;

  /** Available languages. */
  languages?: LanguageOption[];

  /** Single-select (dropdown) vs multi-select (chips + dialog). */
  singleSelection?: boolean;
  /** Cap the number of selectable languages (multi mode only). */
  maxSelectable?: number;
  /** Show a search input in the picker. Default true (as in Angular). */
  searchable?: boolean;
  /** Only offer detectable languages. */
  onlyDetectable?: boolean;
  /** Mark detectable languages with a sparkles icon. */
  remarkSelectable?: boolean;

  placeholder?: string;
  label?: string;
  required?: boolean;

  disabled?: boolean;
  loading?: boolean;
  error?: boolean;

  selectMoreText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogSelectText?: string;
  dialogCancelText?: string;
  emptyStateText?: string;
  selectionLimitText?: string;
  itemTypeName?: string;
  searchPlaceholder?: string;
  loadingText?: string;
  errorLoadingText?: string;
  noResultsText?: string;

  className?: string;
}

export function LanguageSelector({
  value,
  onValueChange,
  onLanguageSelectionChanged,
  languages = MOCK_LANGUAGES,
  singleSelection = false,
  maxSelectable,
  searchable = true,
  onlyDetectable = false,
  remarkSelectable = false,
  placeholder = "Select language",
  label,
  required = false,
  disabled = false,
  loading = false,
  error = false,
  selectMoreText = "Add more languages",
  dialogTitle = "Select Languages",
  dialogDescription = "Choose the languages you want to enable. You can select multiple options.",
  dialogSelectText = "Select",
  dialogCancelText = "Cancel",
  emptyStateText = "No languages selected",
  selectionLimitText = "Select up to",
  itemTypeName = "languages",
  searchPlaceholder = "Search for languages...",
  loadingText = "Loading languages...",
  errorLoadingText = "Failed to load languages",
  noResultsText = "No languages match that search query",
  className,
}: LanguageSelectorProps) {
  const available = React.useMemo(
    () =>
      onlyDetectable ? languages.filter((l) => l.isDetectable) : languages,
    [languages, onlyDetectable]
  );
  const byCode = React.useMemo(() => {
    const m = new Map<string, LanguageOption>();
    for (const l of available) m.set(l.code, l);
    return m;
  }, [available]);

  function emit(codes: string[]) {
    onLanguageSelectionChanged?.(
      codes.map((c) => byCode.get(c)).filter(Boolean) as LanguageOption[]
    );
  }

  if (singleSelection) {
    return (
      <SingleLanguageSelect
        value={typeof value === "string" ? value : ""}
        onValueChange={(code) => {
          onValueChange?.(code);
          emit(code ? [code] : []);
        }}
        available={available}
        searchable={searchable}
        remarkSelectable={remarkSelectable}
        placeholder={placeholder}
        label={label}
        required={required}
        disabled={disabled}
        loading={loading}
        error={error}
        searchPlaceholder={searchPlaceholder}
        loadingText={loadingText}
        errorLoadingText={errorLoadingText}
        noResultsText={noResultsText}
        className={className}
      />
    );
  }

  return (
    <MultiLanguageSelect
      value={Array.isArray(value) ? value : []}
      onValueChange={(codes) => {
        onValueChange?.(codes);
        emit(codes);
      }}
      available={available}
      maxSelectable={maxSelectable}
      searchable={searchable}
      remarkSelectable={remarkSelectable}
      label={label}
      required={required}
      disabled={disabled}
      loading={loading}
      error={error}
      selectMoreText={selectMoreText}
      dialogTitle={dialogTitle}
      dialogDescription={dialogDescription}
      dialogSelectText={dialogSelectText}
      dialogCancelText={dialogCancelText}
      emptyStateText={emptyStateText}
      selectionLimitText={selectionLimitText}
      itemTypeName={itemTypeName}
      searchPlaceholder={searchPlaceholder}
      loadingText={loadingText}
      errorLoadingText={errorLoadingText}
      noResultsText={noResultsText}
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// Field label
// ---------------------------------------------------------------------------

function FieldLabel({
  label,
  required,
}: {
  label?: string;
  required?: boolean;
}) {
  if (!label) return null;
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required ? <span className="ml-0.5 text-destructive">*</span> : null}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Portal-matched spinner (animate-spin rounded-full border-2 border-primary
// border-t-transparent) — replaces lucide Loader2 to match wordly-* anatomy.
// ---------------------------------------------------------------------------

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-primary border-t-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// Single selection — Command + Popover (matches WorkspaceSelector)
// ---------------------------------------------------------------------------

interface SingleProps {
  value: string;
  onValueChange: (code: string) => void;
  available: LanguageOption[];
  searchable: boolean;
  remarkSelectable: boolean;
  placeholder: string;
  label?: string;
  required: boolean;
  disabled: boolean;
  loading: boolean;
  error: boolean;
  searchPlaceholder: string;
  loadingText: string;
  errorLoadingText: string;
  noResultsText: string;
  className?: string;
}

function SingleLanguageSelect({
  value,
  onValueChange,
  available,
  searchable,
  remarkSelectable,
  placeholder,
  label,
  required,
  disabled,
  loading,
  error,
  searchPlaceholder,
  loadingText,
  errorLoadingText,
  noResultsText,
  className,
}: SingleProps) {
  const [open, setOpen] = React.useState(false);
  const selected = available.find((l) => l.code === value);
  const hasOptions = available.length > 0;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selected?.displayName ?? placeholder);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel label={label} required={required} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            disabled={disabled || loading || error}
            className={cn(selectTriggerVariants({ error }))}
          >
            <span
              className={cn(
                "flex min-w-0 items-center gap-2 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {loading ? <Spinner className="h-4 w-4 shrink-0" /> : null}
              <span className="truncate">{triggerLabel}</span>
            </span>
            <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            {searchable ? (
              <CommandInput placeholder={searchPlaceholder} />
            ) : null}
            <CommandList>
              <CommandEmpty>
                {hasOptions ? noResultsText : "No languages available"}
              </CommandEmpty>
              <CommandGroup>
                {available.map((lang) => (
                  <CommandItem
                    key={lang.code}
                    value={lang.displayName}
                    onSelect={() => {
                      onValueChange(lang.code === value ? "" : lang.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === lang.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{lang.displayName}</span>
                    {lang.nativeName ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {lang.nativeName}
                      </span>
                    ) : null}
                    {remarkSelectable && lang.isDetectable ? (
                      <Sparkles className="ml-2 h-3.5 w-3.5 text-accent-green-500" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Language chip — pill matching wordly-chip "selected" anatomy.
// Portal selected chip = Teal background; per the brand mapping, the portal's
// primary Teal maps to OUR Brand Blue primary, so selected = bg-primary.
//   rounded-2xl pill, gap-1 px-1 py-1, text-sm; close button is a 22px
//   rounded-full bg-gray-100 hover:bg-gray-200 hit target.
// ---------------------------------------------------------------------------

function LanguageChip({
  label,
  showSparkle,
  showClose,
  onClose,
}: {
  label: string;
  showSparkle: boolean;
  showClose: boolean;
  onClose: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-2xl border border-primary bg-primary py-1 pl-2 pr-1 text-primary-foreground"
      role="presentation"
    >
      {showSparkle ? <Sparkles className="h-3.5 w-3.5 shrink-0" /> : null}
      <span className="select-none break-words text-sm">{label}</span>
      {showClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 transition-colors duration-200 hover:bg-gray-200"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}

// Add-more trigger — matches the chip-selector's link/ghost "+ text" button.
function AddMoreButton({
  text,
  disabled,
  onClick,
}: {
  text: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      aria-label={text}
      className="h-auto p-0 font-normal text-primary"
    >
      <span className="leading-none">+ {text}</span>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Multiple selection — chips + a Dialog picker (Command)
// ---------------------------------------------------------------------------

interface MultiProps {
  value: string[];
  onValueChange: (codes: string[]) => void;
  available: LanguageOption[];
  maxSelectable?: number;
  searchable: boolean;
  remarkSelectable: boolean;
  label?: string;
  required: boolean;
  disabled: boolean;
  loading: boolean;
  error: boolean;
  selectMoreText: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogSelectText: string;
  dialogCancelText: string;
  emptyStateText: string;
  selectionLimitText: string;
  itemTypeName: string;
  searchPlaceholder: string;
  loadingText: string;
  errorLoadingText: string;
  noResultsText: string;
  className?: string;
}

function MultiLanguageSelect({
  value,
  onValueChange,
  available,
  maxSelectable,
  searchable,
  remarkSelectable,
  label,
  required,
  disabled,
  loading,
  error,
  selectMoreText,
  dialogTitle,
  dialogDescription,
  dialogSelectText,
  dialogCancelText,
  emptyStateText,
  selectionLimitText,
  itemTypeName,
  searchPlaceholder,
  loadingText,
  errorLoadingText,
  noResultsText,
  className,
}: MultiProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string[]>(value);

  // Re-seed the draft each time the dialog opens.
  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const selectedLangs = value
    .map((code) => available.find((l) => l.code === code))
    .filter(Boolean) as LanguageOption[];

  const atLimit =
    typeof maxSelectable === "number" && draft.length >= maxSelectable;

  function removeChip(code: string) {
    onValueChange(value.filter((c) => c !== code));
  }

  function toggleDraft(code: string) {
    setDraft((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : atLimit
          ? prev
          : [...prev, code]
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel label={label} required={required} />

      {/* Container styled like an input field (matches wordly-chip-selector). */}
      <div
        className={cn(
          "min-h-[2.5rem] w-full rounded-md border bg-background px-3 py-2 shadow-xs transition-[color,box-shadow] has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
          error
            ? "border-destructive has-[:focus-visible]:ring-destructive/20"
            : "border-input",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? (
          <div className="flex items-center gap-2 min-h-[1.5rem]">
            <Spinner className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">{loadingText}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between min-h-[1.5rem]">
            <span className="text-sm text-destructive">{errorLoadingText}</span>
          </div>
        ) : selectedLangs.length === 0 ? (
          <div className="flex items-center justify-between min-h-[1.5rem]">
            <span className="text-muted-foreground text-sm">
              {emptyStateText}
            </span>
            <AddMoreButton
              text={selectMoreText}
              disabled={disabled}
              onClick={() => setOpen(true)}
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {selectedLangs.map((lang) => (
              <LanguageChip
                key={lang.code}
                label={lang.displayName}
                showSparkle={remarkSelectable && !!lang.isDetectable}
                showClose={!disabled}
                onClose={() => removeChip(lang.code)}
              />
            ))}
            <AddMoreButton
              text={selectMoreText}
              disabled={disabled || atLimit}
              onClick={() => setOpen(true)}
            />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] p-0 sm:max-w-[500px]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          {/* Selection-info banner (matches chip-selector). The portal uses the
              informational `info` semantic token (bg-info / border-info-border /
              text-info-foreground); those map to the prototype's informational
              blue scale: bg-blue-50 / border-blue-100 / text-blue-700. */}
          <div className="mx-6 rounded-md border border-blue-100 bg-blue-50 p-3">
            <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
              {typeof maxSelectable === "number" && maxSelectable > 0 ? (
                <>
                  <span>
                    {selectionLimitText} {maxSelectable} {itemTypeName}
                  </span>
                  <span>({draft.length} selected)</span>
                </>
              ) : (
                <span>
                  {draft.length} {itemTypeName} selected
                </span>
              )}
            </div>
          </div>

          <Command className="border-t">
            {searchable ? (
              <CommandInput placeholder={searchPlaceholder} />
            ) : null}
            <CommandList>
              <CommandEmpty>{noResultsText}</CommandEmpty>
              <CommandGroup>
                {available.map((lang) => {
                  const checked = draft.includes(lang.code);
                  const blocked = !checked && atLimit;
                  return (
                    <CommandItem
                      key={lang.code}
                      value={lang.displayName}
                      disabled={blocked}
                      onSelect={() => toggleDraft(lang.code)}
                      className={cn(blocked && "opacity-40")}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primary",
                          checked ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1">{lang.displayName}</span>
                      {lang.nativeName ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {lang.nativeName}
                        </span>
                      ) : null}
                      {remarkSelectable && lang.isDetectable ? (
                        <Sparkles className="ml-2 h-3.5 w-3.5 text-accent-green-500" />
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>

          <DialogFooter className="px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {dialogCancelText}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onValueChange(draft);
                setOpen(false);
              }}
            >
              {dialogSelectText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
