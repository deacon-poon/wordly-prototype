"use client";

/**
 * CustomFields
 *
 * React migration of the production Angular `wordly-custom-fields`
 * (wordly_portal: libs/components/business/wordly-custom-fields).
 *
 * The Angular original is a ControlValueAccessor (extends WordlyFormControlBase)
 * wired into reactive/template forms with a translation service and programmatic
 * validators. Here we keep the same public surface — two contexts (PROFILE: the
 * user authors name+value pairs with add/remove and duplicate detection; SESSION:
 * the system defines fixed field names and only the value is editable, with a
 * type-aware control per field: TEXT / NUMERIC / SINGLE_SELECT / MULTI_SELECT) —
 * but drop the Angular DI/service layer. Data arrives via props (controlled),
 * defaulting to mock data; validation surfaces as per-field/duplicate state.
 *
 * Built on the shared shadcn primitives (Input + Command/Popover + Badge + Button).
 * In production these fields would be fetched from / persisted to the API.
 */

import * as React from "react";
import { AlertCircle, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
// Data contract (mirrors the Angular CustomField / CustomFieldTypeId model)
// ---------------------------------------------------------------------------

export type CustomFieldTypeId =
  | "TEXT"
  | "NUMERIC"
  | "SINGLE_SELECT_OPTION"
  | "MULTI_SELECT_OPTION";

export type CustomFieldContext = "profile" | "session";

export interface CustomFieldLabelType {
  typeId: CustomFieldTypeId;
  choices?: string[];
}

export interface CustomField {
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
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

/**
 * Portal icon-button anatomy (wordly-button `variant="icon"` / `"icon-destructive"`):
 * fixed 38×38 px, zero padding, 6px radius (rounded-md), 1px border. The brand-color
 * hover (portal teal-50) maps to Brand Blue per the design-system mapping; the
 * destructive icon uses the error palette for its red text/hover.
 */
const ICON_BUTTON = "h-[38px] w-[38px] shrink-0 rounded-md p-0";

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

function isFieldComplete(field: CustomField): boolean {
  const name = (field.name ?? "").trim();
  const value = (field.value ?? "").toString().trim();
  return !!(name && value);
}

function isValueEmpty(field: CustomField): boolean {
  if (field.labelType?.typeId === "MULTI_SELECT_OPTION") {
    return !field.selectedValues?.length;
  }
  return (field.value ?? "").toString().trim().length === 0;
}

interface ValidationState {
  invalidIndexes: Set<number>;
  hasDuplicateError: boolean;
}

function validateProfile(fields: CustomField[]): ValidationState {
  const invalid = new Set<number>();
  let hasDuplicateError = false;

  fields.forEach((field, i) => {
    const hasName = !!(field.name ?? "").trim();
    const hasValue = !!(field.value ?? "").toString().trim();
    // Partially filled (only name OR only value).
    if ((hasName && !hasValue) || (!hasName && hasValue)) invalid.add(i);
    // Completely empty is valid only when it's the sole field.
    if (!hasName && !hasValue && fields.length > 1) invalid.add(i);
  });

  // Duplicate names.
  const seen = new Map<string, number>();
  fields.forEach((field, i) => {
    const name = (field.name ?? "").trim().toLowerCase();
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

function validateSession(fields: CustomField[]): ValidationState {
  const invalid = new Set<number>();
  fields.forEach((field, i) => {
    if (field.required && isValueEmpty(field)) invalid.add(i);
  });
  return { invalidIndexes: invalid, hasDuplicateError: false };
}

// ---------------------------------------------------------------------------
// MultiSelect — Command + Popover with Badge chips (maps the Spartan multi-select)
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
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between font-normal",
            error && "border-destructive text-destructive"
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
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options match that search query</CommandEmpty>
            <CommandGroup>
              {choices.map((choice) => (
                <CommandItem
                  key={choice}
                  value={choice}
                  onSelect={() => toggle(choice)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(choice) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {choice}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// SingleSelect — Command + Popover (mirrors the proof's selector pattern)
// ---------------------------------------------------------------------------

function SingleSelect({
  value,
  choices,
  placeholder,
  disabled,
  error,
  onChange,
}: {
  value: string;
  choices: string[];
  placeholder: string;
  disabled?: boolean;
  error?: boolean;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive text-destructive"
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options match that search query</CommandEmpty>
            <CommandGroup>
              {choices.map((choice) => (
                <CommandItem
                  key={choice}
                  value={choice}
                  onSelect={() => {
                    onChange(choice === value ? "" : choice);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === choice ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {choice}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
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
  /** SESSION only: stack label above value instead of side-by-side. */
  stacked?: boolean;

  label?: string;
  required?: boolean;
  helperText?: string;

  addFieldLabel?: string;
  fieldNamePlaceholder?: string;
  fieldValuePlaceholder?: string;
  duplicateLabelsErrorMessage?: string;

  disabled?: boolean;
  readonly?: boolean;
  /** Surface per-field validation styling. */
  showError?: boolean;

  className?: string;
}

export function CustomFields({
  value,
  onValueChange,
  context = "profile",
  stacked = false,
  label,
  required = false,
  helperText,
  addFieldLabel = "Add Field",
  fieldNamePlaceholder = "Field name",
  fieldValuePlaceholder = "Field value",
  duplicateLabelsErrorMessage = "Duplicate labels are not allowed",
  disabled = false,
  readonly = false,
  showError = false,
  className,
}: CustomFieldsProps) {
  const isProfile = context === "profile";

  // Source of truth: controlled value (normalized for API-serialized
  // multi-select strings), or a single empty field by default.
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

  function canAddField(): boolean {
    // Mirrors Angular: blocked while a forced error state is shown, and
    // while the last field is incomplete or names are duplicated.
    const last = fields[fields.length - 1];
    return isFieldComplete(last) && !hasDuplicateError && !showError;
  }

  function addField() {
    if (!canAddField()) return;
    emit([...fields, EMPTY_FIELD()]);
  }

  function removeField(index: number) {
    if (fields.length > 1) {
      emit(fields.filter((_, i) => i !== index));
    } else {
      emit([EMPTY_FIELD()]);
    }
  }

  function shouldShowRemoveButton(index: number): boolean {
    return fields.length > 1 || isFieldComplete(fields[index]);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <div className="space-y-3">
        {fields.map((field, i) => {
          const isLast = i === fields.length - 1;
          const invalid = invalidIndexes.has(i);

          // ----- PROFILE: editable name + value, per-row add/remove ----------
          if (isProfile) {
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    value={field.name ?? ""}
                    placeholder={fieldNamePlaceholder}
                    disabled={disabled || readonly}
                    readOnly={readonly}
                    aria-invalid={invalid || undefined}
                    className={cn(
                      invalid && "border-destructive text-destructive"
                    )}
                    onChange={(e) => patchField(i, { name: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={field.value ?? ""}
                    placeholder={fieldValuePlaceholder}
                    disabled={disabled || readonly}
                    readOnly={readonly}
                    aria-invalid={
                      (showError && !(field.value ?? "").toString().trim()) ||
                      undefined
                    }
                    onChange={(e) => patchField(i, { value: e.target.value })}
                  />
                </div>

                {/* Remove button (portal: variant="icon-destructive" size="sm" → 38x38 bordered) */}
                <div className="shrink-0 pl-1">
                  {shouldShowRemoveButton(i) && fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled || readonly}
                      aria-label="Remove field"
                      className={cn(
                        ICON_BUTTON,
                        "border-gray-200 text-error-600 hover:bg-error-50 hover:text-error-700"
                      )}
                      onClick={() => removeField(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="h-[38px] w-[38px]" aria-hidden />
                  )}
                </div>

                {/* Add button on the last row (portal: variant="icon" size="sm" → 38x38 bordered) */}
                <div className="flex shrink-0 justify-start">
                  {!readonly && isLast ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled || !canAddField()}
                      aria-label={addFieldLabel}
                      className={cn(
                        ICON_BUTTON,
                        "border-gray-200 text-gray-600 hover:bg-primary-blue-50 hover:text-gray-700"
                      )}
                      onClick={addField}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="h-[38px] w-[38px]" aria-hidden />
                  )}
                </div>
              </div>
            );
          }

          // ----- SESSION: fixed label + type-aware value control -------------
          const typeId = field.labelType?.typeId ?? "TEXT";
          const choices = field.labelType?.choices ?? [];
          const valueError = showError && invalid;

          return (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3",
                stacked
                  ? "flex-col gap-2"
                  : "flex-col md:flex-row md:gap-4 lg:grid lg:grid-cols-[minmax(200px,_1fr)_2fr] lg:gap-4"
              )}
            >
              <div
                className={cn(
                  stacked
                    ? "w-full"
                    : "w-full md:h-7 md:min-w-[200px] md:max-w-[260px] md:shrink-0"
                )}
              >
                <span className="text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </span>
              </div>

              <div className="w-full md:flex-1">
                {typeId === "NUMERIC" ? (
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    placeholder={fieldValuePlaceholder}
                    disabled={disabled || readonly}
                    readOnly={readonly}
                    aria-invalid={valueError || undefined}
                    className={cn(
                      valueError && "border-destructive text-destructive"
                    )}
                    onChange={(e) => patchField(i, { value: e.target.value })}
                  />
                ) : typeId === "SINGLE_SELECT_OPTION" ? (
                  <SingleSelect
                    value={field.value ?? ""}
                    choices={choices}
                    placeholder={fieldValuePlaceholder}
                    disabled={disabled || readonly}
                    error={valueError}
                    onChange={(next) => patchField(i, { value: next })}
                  />
                ) : typeId === "MULTI_SELECT_OPTION" ? (
                  <MultiSelect
                    values={field.selectedValues ?? []}
                    choices={choices}
                    placeholder={fieldValuePlaceholder}
                    disabled={disabled || readonly}
                    error={valueError}
                    onChange={(next) => patchField(i, { selectedValues: next })}
                  />
                ) : (
                  <Input
                    value={field.value ?? ""}
                    placeholder={fieldValuePlaceholder}
                    disabled={disabled || readonly}
                    readOnly={readonly}
                    aria-invalid={valueError || undefined}
                    className={cn(
                      valueError && "border-destructive text-destructive"
                    )}
                    onChange={(e) => patchField(i, { value: e.target.value })}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Duplicate-label error (PROFILE) */}
        {hasDuplicateError ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{duplicateLabelsErrorMessage}</span>
          </div>
        ) : null}

        {helperText && !hasDuplicateError ? (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    </div>
  );
}
