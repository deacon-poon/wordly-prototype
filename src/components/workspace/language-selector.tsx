"use client";

/**
 * LanguageSelector
 *
 * EXACT React mirror of the production Angular `wordly-language-selector`
 *   wordly_portal:
 *     libs/components/business/language-selector/
 *       wordly-language-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *proxy control*: the template renders
 * EITHER `<app-wordly-chip-selector>` (multiple selection — the DEFAULT) OR
 * `<app-wordly-select>` (single selection, when `singleSelection` is true).
 * BOTH proxied controls wrap the shared `wordly-form-control-wrapper`, so the
 * label / required / helper / error / info-icon / extra-info + the responsive
 * label-beside-control grid layout come from that wrapper — exactly like the
 * validated AccountSelector / WorkspaceSelector references.
 *
 *   Angular (multi):  language-selector → chip-selector → form-control-wrapper
 *   Angular (single): language-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:            LanguageSelector  → FormControlWrapper + (chip container | radix Select)
 *
 * The chip-selector anatomy is ported from
 *   wordly_portal: libs/components/core/chip-selector/wordly-chip-selector.component.html
 *   wordly_portal: libs/components/core/chip/wordly-chip.component.{html,scss}
 * (selected chip = Action Teal — portal `--teal-500` ≈ action-teal-400; 22px
 * rounded-full close button on a gray-100/gray-200 hit target; "+ add more"
 * link button; a dialog with a search input, an info banner, and a checkbox
 * list of options).
 *
 * The trigger class string (single mode) is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts.
 *
 * The Angular DI / WordlyLanguageSelectorService / caching layer is dropped:
 * language data arrives via props (mock default). The Angular value contract
 * (`string` in single mode, `string[]` in multiple mode) and the
 * `languageSelectionChanged` @Output (rich language objects) are preserved.
 */

import * as React from "react";
import { cva } from "class-variance-authority";
import { Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

// ---------------------------------------------------------------------------
// Trigger anatomy (single mode) — ported verbatim from the portal
// `selectTriggerVariants` (wordly_portal libs/ui/select/src/lib/
// hlm-select-trigger.ts). Identical to the validated AccountSelector reference;
// the radix chevron svg is targeted via [&>svg] where Angular targets [&>ng-icon].
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "border-input [&>svg]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      error: {
        true: "text-destructive border-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
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
  /** Native name of the language. */
  nativeName?: string;
  isTranscribable?: boolean;
  isTranslatable?: boolean;
  isDetectable?: boolean;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the LanguageService.
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
   * Controlled value. A single code string in single mode, an array of codes
   * in multiple mode (matches the Angular `string | string[]` value).
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

  /** Single-select (wordly-select) vs multi-select (chip-selector). Default false. */
  singleSelection?: boolean;
  /** Cap the number of selectable languages (multi mode only). */
  maxSelectable?: number;
  /** Show a search input in the dialog. Default true (as in Angular). */
  searchable?: boolean;
  /** Hide already-selected options from the dialog list. Default true. */
  hideSelectedOptions?: boolean;
  /** Only offer detectable languages. */
  onlyDetectable?: boolean;
  /** Mark detectable languages with a sparkles icon. */
  remarkSelectable?: boolean;

  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Error text shown below the control when `error` is set. */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;
  helperTextOnTop?: boolean;
  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

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

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

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
  hideSelectedOptions = true,
  onlyDetectable = false,
  remarkSelectable = false,
  placeholder = "Select language",
  label,
  required = false,
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
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
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
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

  // Mirrors getLanguagesByIds() -> languageSelectionChanged.emit().
  const emit = React.useCallback(
    (codes: string[]) => {
      onLanguageSelectionChanged?.(
        codes.map((c) => byCode.get(c)).filter(Boolean) as LanguageOption[]
      );
    },
    [byCode, onLanguageSelectionChanged]
  );

  // Shared wrapper props (both proxied controls wrap form-control-wrapper).
  const wrapperProps = {
    label,
    required,
    helperText: !error ? helperText : undefined,
    helperTextOnTop,
    showError: error,
    currentErrorMessage: errorMessage,
    extraInfo,
    showInfoIcon,
    infoTooltipText,
    layoutVariant,
    labelStyleVariant,
    labelSizeVariant,
    labelContextVariant,
    spacingVariant,
    contentContextVariant,
    className,
  };

  if (singleSelection) {
    return (
      <SingleLanguageSelect
        value={typeof value === "string" ? value : ""}
        onValueChange={(code) => {
          onValueChange?.(code);
          emit(code ? [code] : []);
        }}
        available={available}
        remarkSelectable={remarkSelectable}
        placeholder={placeholder}
        disabled={disabled}
        readonly={readonly}
        loading={loading}
        error={error}
        loadingText={loadingText}
        errorLoadingText={errorLoadingText}
        noResultsText={noResultsText}
        wrapperProps={wrapperProps}
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
      hideSelectedOptions={hideSelectedOptions}
      remarkSelectable={remarkSelectable}
      disabled={disabled}
      readonly={readonly}
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
      wrapperProps={wrapperProps}
    />
  );
}

// Wrapper props shared by both modes (props passed straight to FormControlWrapper).
type WrapperProps = React.ComponentProps<typeof FormControlWrapper>;

// ---------------------------------------------------------------------------
// Portal-matched spinner (animate-spin rounded-full border-2 border-primary
// border-t-transparent) — matches the chip-selector loading state.
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
// Single selection — wordly-select proxy (FormControlWrapper + radix Select)
// ---------------------------------------------------------------------------

interface SingleProps {
  value: string;
  onValueChange: (code: string) => void;
  available: LanguageOption[];
  remarkSelectable: boolean;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  loading: boolean;
  error: boolean;
  loadingText: string;
  errorLoadingText: string;
  noResultsText: string;
  wrapperProps: WrapperProps;
}

function SingleLanguageSelect({
  value,
  onValueChange,
  available,
  remarkSelectable,
  placeholder,
  disabled,
  readonly,
  loading,
  error,
  loadingText,
  errorLoadingText,
  noResultsText,
  wrapperProps,
}: SingleProps) {
  const hasOptions = available.length > 0;
  const interactionBlocked = disabled || loading || error || readonly;
  const triggerPlaceholder = loading
    ? loadingText
    : error
      ? errorLoadingText
      : placeholder;

  return (
    <FormControlWrapper {...wrapperProps}>
      <Select
        value={value || undefined}
        onValueChange={(next) => onValueChange(next)}
        disabled={interactionBlocked}
      >
        <SelectTrigger
          data-size="default"
          aria-invalid={error || undefined}
          aria-readonly={readonly || undefined}
          aria-required={wrapperProps.required || undefined}
          className={cn(
            selectTriggerVariants({ error }),
            readonly && "pointer-events-none"
          )}
        >
          <SelectValue
            placeholder={
              <span className="text-muted-foreground line-clamp-1 truncate">
                {triggerPlaceholder}
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-96 min-w-[325px] pt-0 pb-0">
          {hasOptions ? (
            available.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.displayName}</span>
                  {lang.nativeName ? (
                    <span className="text-xs text-muted-foreground">
                      {lang.nativeName}
                    </span>
                  ) : null}
                  {remarkSelectable && lang.isDetectable ? (
                    <Sparkles className="size-3.5 text-accent-green-500" />
                  ) : null}
                </span>
              </SelectItem>
            ))
          ) : (
            <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
              {noResultsText}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormControlWrapper>
  );
}

// ---------------------------------------------------------------------------
// Language chip — pill matching wordly-chip "selected" anatomy.
// Portal selected chip = Action Teal (scss `--teal-500` ≈ action-teal-400),
// white text, rounded-2xl pill, gap-1 px-1 py-1, text-sm; the close button is a
// 22px rounded-full bg-gray-100 hover:bg-gray-200 hit target.
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
      className="inline-flex items-center gap-1 rounded-2xl border border-action-teal-400 bg-action-teal-400 py-1 pl-2 pr-1 text-white"
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

// Add-more trigger — matches the chip-selector's link "+ text" button.
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
// Multiple selection — chip-selector proxy (FormControlWrapper + chip container
// + a Dialog picker with search, info banner and a checkbox list)
// ---------------------------------------------------------------------------

interface MultiProps {
  value: string[];
  onValueChange: (codes: string[]) => void;
  available: LanguageOption[];
  maxSelectable?: number;
  searchable: boolean;
  hideSelectedOptions: boolean;
  remarkSelectable: boolean;
  disabled: boolean;
  readonly: boolean;
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
  wrapperProps: WrapperProps;
}

function MultiLanguageSelect({
  value,
  onValueChange,
  available,
  maxSelectable,
  searchable,
  hideSelectedOptions,
  remarkSelectable,
  disabled,
  readonly,
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
  wrapperProps,
}: MultiProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string[]>(value);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Re-seed the draft (tempSelectedValues) each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setDraft(value);
      setSearchTerm("");
    }
  }, [open, value]);

  const selectedLangs = value
    .map((code) => available.find((l) => l.code === code))
    .filter(Boolean) as LanguageOption[];

  const atLimit =
    typeof maxSelectable === "number" && draft.length >= maxSelectable;
  // hasReachedMaxChips() — disables the "+ add more" button.
  const reachedMaxChips =
    typeof maxSelectable === "number" && value.length >= maxSelectable;

  // hideSelectedOptions: hide currently-committed selections from the dialog.
  const dialogOptions = hideSelectedOptions
    ? available.filter((l) => !value.includes(l.code))
    : available;

  const filteredOptions = searchTerm
    ? dialogOptions.filter((l) =>
        l.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dialogOptions;

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
    <FormControlWrapper {...wrapperProps}>
      {/* Chips container styled like an input field (wordly-chip-selector). */}
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
            {!readonly ? (
              <AddMoreButton
                text={selectMoreText}
                disabled={disabled}
                onClick={() => setOpen(true)}
              />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {selectedLangs.map((lang) => (
              <LanguageChip
                key={lang.code}
                label={lang.displayName}
                showSparkle={remarkSelectable && !!lang.isDetectable}
                showClose={!disabled && !readonly}
                onClose={() => removeChip(lang.code)}
              />
            ))}
            {!readonly ? (
              <AddMoreButton
                text={selectMoreText}
                disabled={disabled || reachedMaxChips}
                onClick={() => setOpen(true)}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Selection dialog (wordly-dialog) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {/* Search input */}
            {searchable ? (
              <div className="mb-4">
                <Input
                  value={searchTerm}
                  placeholder={searchPlaceholder}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            ) : null}

            {/* Selection info banner. Portal: bg-info / border-info-border /
                text-info-foreground; mapped to the prototype informational blue
                scale. Limited case shows two-color text; unlimited a single line. */}
            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center gap-1 text-sm font-medium">
                {typeof maxSelectable === "number" && maxSelectable > 0 ? (
                  <>
                    <span className="text-blue-700">
                      {selectionLimitText} {maxSelectable} {itemTypeName}
                    </span>
                    <span className="text-blue-500">
                      ({draft.length} selected)
                    </span>
                  </>
                ) : (
                  <span className="text-blue-700">
                    {draft.length} {itemTypeName} selected
                  </span>
                )}
              </div>
            </div>

            {/* Checkbox list of options, or a no-results message */}
            {filteredOptions.length > 0 ? (
              <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
                {filteredOptions.map((lang) => {
                  const checked = draft.includes(lang.code);
                  const blocked = !checked && atLimit;
                  return (
                    <label
                      key={lang.code}
                      className={cn(
                        "flex items-center gap-3 rounded-md border border-input px-3 py-2 text-sm",
                        blocked
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer hover:bg-accent"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={blocked}
                        onCheckedChange={() => toggleDraft(lang.code)}
                      />
                      <span className="flex-1">{lang.displayName}</span>
                      {lang.nativeName ? (
                        <span className="text-xs text-muted-foreground">
                          {lang.nativeName}
                        </span>
                      ) : null}
                      {remarkSelectable && lang.isDetectable ? (
                        <Sparkles className="h-3.5 w-3.5 text-accent-green-500" />
                      ) : null}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-sm text-muted-foreground">
                  {searchTerm
                    ? `No ${itemTypeName} found matching ${searchTerm}`
                    : noResultsText}
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
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
    </FormControlWrapper>
  );
}
