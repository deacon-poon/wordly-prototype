"use client";

/**
 * CustomFields
 *
 * EXACT React mirror of the production Angular `wordly-custom-fields`
 *   wordly_portal:
 *     libs/components/business/wordly-custom-fields/
 *       wordly-custom-fields.component.{ts,html}
 *     src/app/models/custom-field/custom-field.model.ts
 *
 * Like the Angular original (which extends `WordlyFormControlBase<CustomField[]>`),
 * this renders the shared FormControlWrapper (label / required / helper / error /
 * layout) wrapping a `.wordly-custom-fields-container` that lists the fields:
 *
 *   Angular:  custom-fields → app-wordly-form-control-wrapper
 *               └ *ngFor row → app-wordly-input / app-wordly-select + icon buttons
 *   React:    CustomFields  → FormControlWrapper
 *               └ row        → Input / Select + icon buttons
 *
 * Two contexts (mirrors `CustomFieldContext`):
 *   - PROFILE: the user authors name+value pairs (add/remove per row, duplicate
 *     detection). Both name and value are editable `app-wordly-input`s.
 *   - SESSION: the system defines fixed field names; only the value is editable,
 *     with a type-aware control per `labelType.typeId` — TEXT / NUMERIC
 *     (`app-wordly-input`), SINGLE_SELECT_OPTION / MULTI_SELECT_OPTION
 *     (`app-wordly-select`, `searchable=false`).
 *
 * The Angular DI/service layer (NgControl/ControlContainer, translation service,
 * programmatic validators) is dropped: data arrives via props (controlled,
 * mock by default) and validation surfaces as per-field / duplicate UI state.
 * Per the migration brief, OUR Brand Blue stays the primary action color (the
 * portal icon hover is teal-50, remapped to primary-blue-50 here) — no raw hex.
 */

import * as React from "react";
// lucide-react exports `AlertCircle` (legacy alias) for the glyph the portal
// references as `lucideCircleAlert` (same icon used by the wrapper's error-icon).
import {
  AlertCircle as CircleAlert,
  Check,
  ChevronDown,
  Plus,
  Trash as Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";

// ---------------------------------------------------------------------------
// Data contract — mirrors src/app/models/custom-field/custom-field.model.ts
// ---------------------------------------------------------------------------

/** Mirrors the Angular `CustomFieldTypeId` enum (string values). */
export type CustomFieldTypeId =
  | "TEXT"
  | "NUMERIC"
  | "SINGLE_SELECT_OPTION"
  | "MULTI_SELECT_OPTION";

/** Mirrors the Angular `CustomFieldContext` enum (string values). */
export type CustomFieldContext = "profile" | "session";

export interface CustomFieldLabelType {
  typeId: CustomFieldTypeId;
  choices?: string[];
}

export interface CustomFieldState {
  frozen: boolean;
}

export interface CustomField {
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  state?: CustomFieldState;
  labelType?: CustomFieldLabelType;
  /** Selected values for MULTI_SELECT_OPTION fields. */
  selectedValues?: string[];
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the custom-fields API
// ---------------------------------------------------------------------------

/** PROFILE context: user-authored name/value pairs. */
export const MOCK_PROFILE_FIELDS: CustomField[] = [
  { name: "Department", value: "Engineering", labelType: { typeId: "TEXT" } },
  { name: "Employee ID", value: "WD-4821", labelType: { typeId: "TEXT" } },
  { name: "Region", value: "EMEA", labelType: { typeId: "TEXT" } },
];

/** SESSION context: system-defined fields with type-aware value controls. */
export const MOCK_SESSION_FIELDS: CustomField[] = [
  {
    name: "Session Title",
    value: "Q3 All-Hands",
    required: true,
    labelType: { typeId: "TEXT" },
  },
  {
    name: "Expected Attendees",
    value: "250",
    labelType: { typeId: "NUMERIC" },
  },
  {
    name: "Room",
    value: "Auditorium A",
    required: true,
    labelType: {
      typeId: "SINGLE_SELECT_OPTION",
      choices: ["Auditorium A", "Auditorium B", "Breakout 1", "Breakout 2"],
    },
  },
  {
    name: "Languages",
    selectedValues: ["English", "Spanish"],
    labelType: {
      typeId: "MULTI_SELECT_OPTION",
      choices: ["English", "Spanish", "French", "German", "Japanese"],
    },
  },
];

// ---------------------------------------------------------------------------
// Select trigger anatomy — ported verbatim from the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts), exactly as the
// validated AccountSelector does, so the SESSION select controls match the
// portal `app-wordly-select` 1:1. The radix chevron is an svg, so the portal
// `[&>ng-icon]` icon tokens map to `[&>svg]`.
// ---------------------------------------------------------------------------

const SELECT_TRIGGER_BASE =
  "border-input [&>svg]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0";

const SELECT_TRIGGER_ERROR =
  "text-destructive border-destructive focus-visible:ring-destructive/20";

/**
 * Icon-button anatomy — ported verbatim from core/button wordly-button.component.scss
 * (`button.variant-icon`): fixed 38×38, gray-200 border, padding 0, brand-blue hover
 * surface (portal teal-50, remapped to Brand Blue per the migration brief). The portal
 * `variant="icon-destructive"` keeps this SAME gray-200 border (computedClasses maps it
 * to `variant-icon`); only the trash glyph carries the destructive color.
 */
const ICON_BTN =
  "h-[38px] w-[38px] min-w-[38px] rounded-md border border-gray-200 bg-white p-0 text-gray-600 hover:bg-primary-blue-50 hover:text-gray-700 active:bg-primary-blue-100";

const EMPTY_FIELD = (): CustomField => ({
  name: "",
  value: "",
  labelType: { typeId: "TEXT" },
});

/**
 * Normalizes a CustomField coming from the API (port of Angular `normalizeField`).
 *
 * The API serializes MULTI_SELECT_OPTION values as a pipe-separated string in the
 * `value` field (e.g. "English|Spanish"). Split that into the `selectedValues`
 * array the UI works with, so the rest of the component always sees a clean
 * string[].
 */
function normalizeField(field: CustomField): CustomField {
  if (
    field.labelType?.typeId === "MULTI_SELECT_OPTION" &&
    typeof field.value === "string" &&
    field.value &&
    !field.selectedValues?.length
  ) {
    return {
      ...field,
      selectedValues: field.value
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean),
    };
  }
  return field;
}

// ---------------------------------------------------------------------------
// Validation helpers (port of the Angular validateProfileFields/Session logic)
// ---------------------------------------------------------------------------

/** Port of Angular `isFieldComplete`. */
function isFieldComplete(field: CustomField): boolean {
  const name = typeof field?.name === "string" ? field.name.trim() : "";
  const value = typeof field?.value === "string" ? field.value.trim() : "";
  return !!(name && value);
}

/** Port of Angular `isFieldValueEmpty`. */
function isFieldValueEmpty(field: CustomField): boolean {
  if (field.value === null || field.value === undefined) return true;
  if (typeof field.value === "string") return field.value.trim().length === 0;
  return false;
}

interface ValidationState {
  invalidIndexes: Set<number>;
  hasDuplicateError: boolean;
}

/** Port of Angular `validateProfileFields`. */
function validateProfile(fields: CustomField[]): ValidationState {
  const invalid = new Set<number>();
  let hasDuplicateError = false;

  fields.forEach((field, i) => {
    const hasName =
      typeof field?.name === "string" ? !!field.name.trim() : false;
    const hasValue =
      typeof field?.value === "string" ? !!field.value.trim() : !!field?.value;
    // Case 1: partially filled (only name OR only value).
    if ((hasName && !hasValue) || (!hasName && hasValue)) invalid.add(i);
    // Case 2: completely empty is valid only when it's the only field.
    if (!hasName && !hasValue && fields.length > 1) invalid.add(i);
  });

  // Case 3: duplicate names.
  const seen = new Map<string, number>();
  fields.forEach((field, i) => {
    const name =
      typeof field?.name === "string" ? field.name.trim().toLowerCase() : "";
    if (!name) return;
    if (seen.has(name)) {
      invalid.add(i);
      invalid.add(seen.get(name)!);
      hasDuplicateError = true;
    } else {
      seen.set(name, i);
    }
  });

  return { invalidIndexes: invalid, hasDuplicateError };
}

/** Port of Angular `validateSessionFields`. */
function validateSession(fields: CustomField[]): ValidationState {
  const invalid = new Set<number>();
  fields.forEach((field, i) => {
    const hasValue =
      typeof field?.value === "string"
        ? field.value.trim().length > 0
        : field?.value !== null && field?.value !== undefined;
    const hasSelectedValues = !!field?.selectedValues?.length;
    const isMissingValue =
      field.labelType?.typeId === "MULTI_SELECT_OPTION"
        ? !hasSelectedValues
        : !hasValue;
    if (field.required && isMissingValue) invalid.add(i);
  });
  return { invalidIndexes: invalid, hasDuplicateError: false };
}

// ---------------------------------------------------------------------------
// MultiSelect — Select-trigger anatomy + Badge chips, no search box (mirrors the
// portal `app-wordly-select [multiple]="true" [searchable]="false"`).
// ---------------------------------------------------------------------------

function MultiSelect({
  values,
  choices,
  placeholder,
  disabled,
  error,
  onChange,
}: {
  values: string[];
  choices: string[];
  placeholder: string;
  disabled?: boolean;
  error?: boolean;
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  function toggle(choice: string) {
    onChange(
      values.includes(choice)
        ? values.filter((v) => v !== choice)
        : [...values, choice]
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-size="default"
          className={cn(
            SELECT_TRIGGER_BASE,
            "h-auto min-h-9 font-normal",
            error && SELECT_TRIGGER_ERROR
          )}
        >
          <span className="flex flex-1 flex-wrap items-center gap-1">
            {values.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              values.map((v) => (
                <Badge key={v} variant="secondary" className="font-normal">
                  {v}
                </Badge>
              ))
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
      >
        {choices.map((choice) => {
          const selected = values.includes(choice);
          return (
            <button
              key={choice}
              type="button"
              onClick={() => toggle(choice)}
              className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {selected ? <Check className="h-4 w-4" /> : null}
              </span>
              {choice}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface CustomFieldsProps {
  /** Controlled list of custom fields. */
  value?: CustomField[];
  /** Fired whenever the list changes. */
  onValueChange?: (value: CustomField[]) => void;

  /**
   * PROFILE: user authors name+value pairs (add/remove, duplicate detection).
   * SESSION: system-defined names, type-aware value inputs, no add/remove.
   */
  context?: CustomFieldContext;

  // ===== FormControlWrapper passthroughs (portal @Inputs from the base) =====
  label?: string;
  required?: boolean;
  helperText?: string;
  helperTextOnTop?: boolean;
  showError?: boolean;
  extraInfo?: string;
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /**
   * Wrapper layout. Default "default" = portal responsive label-beside grid.
   * "stacked" forces the SESSION rows to stack label-above-value.
   */
  layoutVariant?: "default" | "stacked" | "dialog" | "modal" | "card";

  // ===== Configurable text (portal @Inputs, with the same en fallbacks) =====
  addFieldLabel?: string;
  fieldNamePlaceholder?: string;
  fieldValuePlaceholder?: string;
  duplicateLabelsErrorMessage?: string;

  disabled?: boolean;
  readonly?: boolean;

  className?: string;
}

export function CustomFields({
  value,
  onValueChange,
  context = "profile",
  label,
  required = false,
  helperText,
  helperTextOnTop = false,
  showError = false,
  extraInfo,
  showInfoIcon = false,
  infoTooltipText,
  layoutVariant = "default",
  // Defaults mirror the Angular *Translated getters (the en fallbacks).
  addFieldLabel = "Add Field",
  fieldNamePlaceholder = "Field name",
  fieldValuePlaceholder = "Field value",
  duplicateLabelsErrorMessage = "Duplicate labels are not allowed",
  disabled = false,
  readonly = false,
  className,
}: CustomFieldsProps) {
  const isProfile = context === "profile";
  const isStacked = layoutVariant === "stacked";

  // Source of truth: controlled value (normalized for API-serialized
  // multi-select strings), or a single empty field by default (Angular
  // `initializeFields`).
  const fields = React.useMemo<CustomField[]>(
    () =>
      value && value.length > 0 ? value.map(normalizeField) : [EMPTY_FIELD()],
    [value]
  );

  const { invalidIndexes, hasDuplicateError } = React.useMemo(
    () => (isProfile ? validateProfile(fields) : validateSession(fields)),
    [fields, isProfile]
  );

  function emit(next: CustomField[]) {
    onValueChange?.(next);
  }

  function patchField(index: number, patch: Partial<CustomField>) {
    emit(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  // Port of Angular `canAddField()`.
  function canAddField(): boolean {
    if (fields.length === 0 && !showError) return true;
    const last = fields[fields.length - 1];
    return isFieldComplete(last) && !showError && !hasDuplicateError;
  }

  // Port of Angular `addField()`.
  function addField() {
    if (!canAddField()) return;
    emit([...fields, EMPTY_FIELD()]);
  }

  // Port of Angular `removeField()`.
  function removeField(index: number) {
    if (fields.length > 1) {
      emit(fields.filter((_, i) => i !== index));
    } else {
      emit([EMPTY_FIELD()]);
    }
  }

  // Port of Angular `shouldShowRemoveButton()`.
  function shouldShowRemoveButton(index: number): boolean {
    return fields.length > 1 || isFieldComplete(fields[index]);
  }

  // SESSION field-name label class string, derived from the shared label
  // design-variant (the Angular template binds `[class]="labelClasses"`).
  const labelClasses =
    "flex items-center gap-2.5 font-roboto font-bold text-sm tracking-wider text-black";

  return (
    <FormControlWrapper
      label={label}
      required={required}
      helperText={helperText}
      helperTextOnTop={helperTextOnTop}
      showError={showError}
      extraInfo={extraInfo}
      showInfoIcon={showInfoIcon}
      infoTooltipText={infoTooltipText}
      layoutVariant={layoutVariant}
      className={className}
    >
      <div className="wordly-custom-fields-container space-y-3">
        {/* Custom Fields List */}
        {fields.map((field, i) => {
          const isLast = i === fields.length - 1;
          const invalid = invalidIndexes.has(i);

          return (
            <div key={i}>
              <div
                className={cn(
                  "wordly-custom-field-row flex items-start gap-3",
                  isProfile
                    ? undefined
                    : isStacked
                      ? "flex-col gap-2"
                      : "flex-col md:flex-row md:gap-4 lg:grid lg:grid-cols-[minmax(200px,_1fr)_2fr] lg:gap-4"
                )}
              >
                {isProfile ? (
                  <>
                    {/* Field Name Input */}
                    <div className="flex-1">
                      <Input
                        value={field.name ?? ""}
                        placeholder={fieldNamePlaceholder}
                        disabled={disabled || readonly}
                        readOnly={readonly}
                        aria-invalid={(showError && !field.name) || undefined}
                        className={cn(
                          invalid && "!border-destructive !text-destructive"
                        )}
                        onChange={(e) =>
                          patchField(i, { name: e.target.value.trim() })
                        }
                      />
                    </div>

                    {/* Field Value Input */}
                    <div className="flex-1">
                      <Input
                        value={field.value ?? ""}
                        placeholder={fieldValuePlaceholder}
                        disabled={disabled || readonly}
                        readOnly={readonly}
                        aria-invalid={(showError && !field.value) || undefined}
                        onChange={(e) =>
                          patchField(i, { value: e.target.value.trim() })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Field Name Label */}
                    <div
                      className={cn(
                        isStacked
                          ? "w-full"
                          : "w-full md:min-w-[200px] md:max-w-[260px] md:h-7 md:shrink-0"
                      )}
                    >
                      <span className={labelClasses}>
                        {field.name}
                        {field.required ? (
                          <span className="text-destructive">*</span>
                        ) : null}
                      </span>
                    </div>

                    {/* Field Value Input (type-aware) */}
                    <div className="w-full md:flex-1">
                      <SessionValueControl
                        field={field}
                        placeholder={fieldValuePlaceholder}
                        disabled={disabled || readonly}
                        readonly={readonly}
                        error={showError && invalid}
                        onValueChange={(next) => patchField(i, { value: next })}
                        onMultiSelectChange={(next) =>
                          patchField(i, { selectedValues: next })
                        }
                      />
                    </div>
                  </>
                )}

                {/* Remove + Add Field Buttons (PROFILE only) */}
                {isProfile ? (
                  <>
                    <div className="flex-shrink-0 pl-1">
                      {shouldShowRemoveButton(i) && fields.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={disabled || readonly}
                          aria-label="Remove field"
                          onClick={() => removeField(i)}
                          className={cn(ICON_BTN)}
                        >
                          <Trash2
                            className="h-4 w-4 text-destructive"
                            aria-hidden="true"
                          />
                        </Button>
                      ) : null}
                    </div>

                    <div className="flex justify-start">
                      {!readonly && isLast ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={disabled || !canAddField()}
                          aria-label={addFieldLabel}
                          onClick={addField}
                          className={cn(ICON_BTN)}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      ) : (
                        <div className="h-[38px] w-[38px]" aria-hidden />
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Duplicate Error Message (PROFILE) */}
        {hasDuplicateError ? (
          <div className="text-sm text-destructive mt-2 flex items-center gap-2">
            <div className="error-icon">
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            </div>
            <span>{duplicateLabelsErrorMessage}</span>
          </div>
        ) : null}
      </div>
    </FormControlWrapper>
  );
}

// ---------------------------------------------------------------------------
// SessionValueControl — type-aware value control (Angular @switch on typeId)
// ---------------------------------------------------------------------------

function SessionValueControl({
  field,
  placeholder,
  disabled,
  readonly,
  error,
  onValueChange,
  onMultiSelectChange,
}: {
  field: CustomField;
  placeholder: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  onValueChange: (next: string) => void;
  onMultiSelectChange: (next: string[]) => void;
}) {
  const typeId = field.labelType?.typeId ?? "TEXT";
  const choices = field.labelType?.choices ?? [];

  // @case (NUMERIC)
  if (typeId === "NUMERIC") {
    return (
      <Input
        type="number"
        value={field.value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        aria-invalid={error || undefined}
        className={cn(error && "!border-destructive !text-destructive")}
        onChange={(e) => onValueChange(e.target.value.trim())}
      />
    );
  }

  // @case (SINGLE_SELECT_OPTION)
  if (typeId === "SINGLE_SELECT_OPTION") {
    return (
      <Select
        value={field.value || undefined}
        onValueChange={(next) => onValueChange(next)}
        disabled={disabled}
      >
        <SelectTrigger
          data-size="default"
          aria-invalid={error || undefined}
          className={cn(
            SELECT_TRIGGER_BASE,
            readonly && "pointer-events-none",
            error && SELECT_TRIGGER_ERROR
          )}
        >
          <SelectValue
            placeholder={
              <span className="text-muted-foreground line-clamp-1 truncate">
                {placeholder}
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
          {choices.map((choice) => (
            <SelectItem key={choice} value={choice}>
              {choice}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // @case (MULTI_SELECT_OPTION)
  if (typeId === "MULTI_SELECT_OPTION") {
    return (
      <MultiSelect
        values={field.selectedValues ?? []}
        choices={choices}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        onChange={onMultiSelectChange}
      />
    );
  }

  // @default (TEXT)
  return (
    <Input
      value={field.value ?? ""}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      aria-invalid={error || undefined}
      className={cn(error && "!border-destructive !text-destructive")}
      onChange={(e) => onValueChange(e.target.value.trim())}
    />
  );
}
