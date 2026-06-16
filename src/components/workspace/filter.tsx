"use client";

/**
 * WorkspaceFilter
 *
 * React migration of the production Angular `wordly-filter`
 * (wordly_portal: libs/components/business/wordly-filter).
 *
 * The Angular original is a config-driven filter bar: it takes a `fields`
 * array (each field declaring a type — date-range, ws-selector, checkbox, or
 * input), builds an Angular ReactiveForm from them, and emits the collected
 * values on submit. Here we keep the same public surface (a declarative
 * `fields` contract, a customizable submit label, an `onSearch` callback, and
 * a `reset`-able controlled form) but drop the Angular DI/service layer:
 * the translation service, UtilsService, and SubmittableFormBuilder are gone;
 * form state is plain React state and data arrives via props.
 *
 * Template anatomy is ported 1:1 from wordly-filter.component.html:
 *   - <form> with flex-wrap items-end gap-4 w-full max-w-[1000px] (+ containerClass).
 *   - Each non-checkbox field sits in `<div class="flex-1 min-w-24/40 flex flex-col">`
 *     and proxies the shared FormControlWrapper with `layoutVariant="card"` +
 *     `contentContextVariant="stacked"` (exactly as the Angular template feeds
 *     those variants into app-wordly-date-range-picker / -workspace-selector /
 *     -input — each of which renders the wrapper internally). The label/required
 *     chrome therefore comes from FormControlWrapper, not a hand-rolled <label>.
 *   - Checkboxes + the submit button share a `flex items-end gap-4 flex-shrink-0`
 *     wrapper so they always wrap as a unit. Each checkbox keeps its own bold
 *     label (the Angular template renders that label outside app-wordly-checkbox,
 *     which itself uses `layoutVariant="compact"` with no label).
 *
 * Built on the shared shadcn primitives (Input, Checkbox, Calendar + Popover,
 * Command + Popover for the workspace selector, Button) wrapped by the shared
 * FormControlWrapper. In production the workspace options would be fetched from
 * the API.
 */

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
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
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular wordly-filter.model.ts)
// ---------------------------------------------------------------------------

export const FILTER_TYPES = {
  dateRange: "date-range",
  wsSelector: "ws-selector",
  checkbox: "checkbox",
  input: "input",
} as const;

export type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

export interface WorkspaceOption {
  label: string;
  value: string;
}

interface FilterFieldBase {
  /** Form key the value is stored under. */
  key: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Hide the field (boolean or predicate, as in the Angular original). */
  hidden?: boolean | (() => boolean);
}

export interface DateRangeFilterField extends FilterFieldBase {
  type: typeof FILTER_TYPES.dateRange;
  /** Latest selectable date. */
  max?: Date;
  initialValue?: DateRange | null;
}

export interface WsSelectorFilterField extends FilterFieldBase {
  type: typeof FILTER_TYPES.wsSelector;
  initialValue?: string | null;
  config?: {
    searchable?: boolean;
    clearable?: boolean;
    includeAllOption?: boolean;
    /** Pre-selected value (e.g. "ALL"); seeds the control's initial value. */
    defaultOption?: string | null;
    /** Options for this selector (mirrors the workspace bridge data). */
    options?: WorkspaceOption[];
  };
}

export interface CheckboxFilterField extends FilterFieldBase {
  type: typeof FILTER_TYPES.checkbox;
  initialValue?: boolean;
}

export interface InputFilterField extends FilterFieldBase {
  type: typeof FILTER_TYPES.input;
  initialValue?: string;
}

export type FilterField =
  | DateRangeFilterField
  | WsSelectorFilterField
  | CheckboxFilterField
  | InputFilterField;

/** Value union per field type. */
export type FilterValue = DateRange | string | boolean | null;

/** Collected form values, keyed by field.key. */
export type FilterValues = Record<string, FilterValue>;

export const ALL_OPTION_VALUE = "ALL";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the workspaces API
// ---------------------------------------------------------------------------

export const MOCK_WORKSPACE_OPTIONS: WorkspaceOption[] = [
  { label: "Acme Global Events", value: "ws-acme" },
  { label: "Northwind Conferences", value: "ws-northwind" },
  { label: "Contoso Town Halls", value: "ws-contoso" },
  { label: "Fabrikam Webinars", value: "ws-fabrikam" },
];

/** A representative set of fields — in production, supplied by the host page. */
export const MOCK_FILTER_FIELDS: FilterField[] = [
  {
    key: "dateRange",
    type: FILTER_TYPES.dateRange,
    label: "Date range",
  },
  {
    key: "workspace",
    type: FILTER_TYPES.wsSelector,
    label: "Workspace",
    placeholder: "Select workspace",
    config: {
      searchable: true,
      clearable: true,
      includeAllOption: true,
      options: MOCK_WORKSPACE_OPTIONS,
    },
  },
  {
    key: "search",
    type: FILTER_TYPES.input,
    label: "Search",
    placeholder: "Search by name",
  },
  {
    key: "activeOnly",
    type: FILTER_TYPES.checkbox,
    label: "Active only",
    initialValue: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isHidden(field: FilterField): boolean {
  return typeof field.hidden === "function"
    ? field.hidden()
    : (field.hidden ?? false);
}

function initialValueFor(field: FilterField): FilterValue {
  switch (field.type) {
    case FILTER_TYPES.checkbox:
      return field.initialValue ?? false;
    case FILTER_TYPES.input:
      return field.initialValue ?? "";
    case FILTER_TYPES.dateRange:
      return field.initialValue ?? null;
    case FILTER_TYPES.wsSelector:
      // Mirror the Angular ws-selector: `defaultOption` seeds the selection;
      // `includeAllOption` with no other default normalizes "" → "ALL".
      return (
        field.initialValue ??
        field.config?.defaultOption ??
        (field.config?.includeAllOption ? ALL_OPTION_VALUE : "")
      );
  }
}

function buildInitialValues(fields: FilterField[]): FilterValues {
  const values: FilterValues = {};
  for (const field of fields) values[field.key] = initialValueFor(field);
  return values;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface WorkspaceFilterProps {
  /** Field configuration (mirrors the Angular required `fields` input). */
  fields?: FilterField[];
  /** Submit button text; defaults to "Filter" (the Angular translation default). */
  submitButtonLabel?: string;
  /** Extra classes on the form container (mirrors `containerClass`). */
  containerClass?: string;
  /** Fired on submit with the collected values (mirrors `searchFilterParams`). */
  onSearch?: (values: FilterValues) => void;
  /** Fired whenever any field value changes. */
  onChange?: (values: FilterValues) => void;
  className?: string;
}

/** Imperative handle — mirrors the Angular component's public `reset()`. */
export interface WorkspaceFilterHandle {
  /** Reset every field back to its initial value. */
  reset: () => void;
}

/** True when a required field has no usable value (mirrors Angular `!valid`). */
function isFieldEmpty(field: FilterField, value: FilterValue): boolean {
  switch (field.type) {
    case FILTER_TYPES.dateRange: {
      const range = value as DateRange | null;
      return !range?.from;
    }
    case FILTER_TYPES.checkbox:
      return value !== true;
    default:
      return value == null || value === "";
  }
}

export const WorkspaceFilter = React.forwardRef<
  WorkspaceFilterHandle,
  WorkspaceFilterProps
>(function WorkspaceFilter(
  {
    fields = MOCK_FILTER_FIELDS,
    submitButtonLabel = "Filter",
    containerClass,
    onSearch,
    onChange,
    className,
  },
  ref
) {
  const [values, setValues] = React.useState<FilterValues>(() =>
    buildInitialValues(fields)
  );
  // Mirrors Angular `markAsSubmitted()` — error styles only show after a submit
  // attempt (the form-control-wrapper showError behavior).
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  // Re-seed when the field contract changes.
  React.useEffect(() => {
    setValues(buildInitialValues(fields));
    setSubmitAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  React.useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setValues(buildInitialValues(fields));
        setSubmitAttempted(false);
      },
    }),
    [fields]
  );

  const visibleFields = React.useMemo(
    () => fields.filter((f) => !isHidden(f)),
    [fields]
  );

  function setValue(key: string, value: FilterValue) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      onChange?.(next);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mirror Angular `markAsSubmitted()` then `if (!filterForm.valid) return;` —
    // surface error styles and block submit while a required field is empty.
    setSubmitAttempted(true);
    const hasMissingRequired = visibleFields.some(
      (f) => f.required && isFieldEmpty(f, values[f.key] ?? null)
    );
    if (hasMissingRequired) return;
    onSearch?.(values);
  }

  function fieldHasError(field: FilterField): boolean {
    return (
      submitAttempted &&
      Boolean(field.required) &&
      isFieldEmpty(field, values[field.key] ?? null)
    );
  }

  // Non-checkbox fields render inline; checkboxes + submit share a wrapper so
  // they always wrap together (matches the Angular template structure).
  const inlineFields = visibleFields.filter(
    (f) => f.type !== FILTER_TYPES.checkbox
  );
  const checkboxFields = visibleFields.filter(
    (f) => f.type === FILTER_TYPES.checkbox
  ) as CheckboxFilterField[];

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full max-w-[1000px] flex-wrap items-end gap-4",
        containerClass,
        className
      )}
    >
      {inlineFields.map((field) => (
        <div
          key={field.key}
          className={cn(
            "flex flex-1 flex-col",
            field.type === FILTER_TYPES.dateRange ? "min-w-24" : "min-w-40"
          )}
        >
          {/* Mirrors the Angular app-wordly-* proxy: each control renders the
              shared FormControlWrapper with layoutVariant="card" +
              contentContextVariant="stacked". */}
          <FormControlWrapper
            controlId={field.key}
            label={field.label}
            required={field.required}
            showError={fieldHasError(field)}
            layoutVariant="card"
            contentContextVariant="stacked"
          >
            {field.type === FILTER_TYPES.dateRange ? (
              <DateRangeField
                field={field}
                values={values}
                setValue={setValue}
                error={fieldHasError(field)}
              />
            ) : field.type === FILTER_TYPES.wsSelector ? (
              <WsSelectorField
                field={field}
                values={values}
                setValue={setValue}
                error={fieldHasError(field)}
              />
            ) : (
              <Input
                id={field.key}
                placeholder={field.placeholder}
                disabled={field.disabled}
                aria-invalid={fieldHasError(field) || undefined}
                value={(values[field.key] as string) ?? ""}
                onChange={(e) => setValue(field.key, e.target.value)}
              />
            )}
          </FormControlWrapper>
        </div>
      ))}

      <div className="flex flex-shrink-0 items-end gap-4">
        {checkboxFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <label
              htmlFor={field.key}
              className="flex items-center gap-2.5 whitespace-nowrap font-sans text-sm font-bold tracking-wider text-foreground"
            >
              {field.label}
              {field.required ? (
                <span className="text-destructive">*</span>
              ) : null}
            </label>
            <div className="flex h-9 items-center">
              <Checkbox
                id={field.key}
                disabled={field.disabled}
                checked={Boolean(values[field.key])}
                aria-invalid={fieldHasError(field) || undefined}
                className={cn(fieldHasError(field) && "border-destructive")}
                onCheckedChange={(checked) =>
                  setValue(field.key, checked === true)
                }
              />
            </div>
          </div>
        ))}

        <div className="flex items-end">
          <Button type="submit" variant="default" size="sm">
            {submitButtonLabel}
          </Button>
        </div>
      </div>
    </form>
  );
});

// ---------------------------------------------------------------------------
// Field sub-components
// ---------------------------------------------------------------------------

function DateRangeField({
  field,
  values,
  setValue,
  error,
}: {
  field: DateRangeFilterField;
  values: FilterValues;
  setValue: (key: string, value: FilterValue) => void;
  error?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const range = (values[field.key] as DateRange | null) ?? undefined;

  const label =
    range?.from && range?.to
      ? `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
      : range?.from
        ? format(range.from, "MMM d, yyyy")
        : (field.placeholder ?? "Pick a date range");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={field.key}
          type="button"
          variant="outline"
          size="sm"
          disabled={field.disabled}
          aria-invalid={error || undefined}
          className={cn(
            "w-full min-w-0 justify-start font-normal",
            !range?.from && "text-muted-foreground",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(next) => setValue(field.key, next ?? null)}
          disabled={field.max ? { after: field.max } : undefined}
          numberOfMonths={2}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function WsSelectorField({
  field,
  values,
  setValue,
  error,
}: {
  field: WsSelectorFilterField;
  values: FilterValues;
  setValue: (key: string, value: FilterValue) => void;
  error?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const cfg = field.config ?? {};
  const baseOptions = cfg.options ?? MOCK_WORKSPACE_OPTIONS;
  const options = React.useMemo<WorkspaceOption[]>(
    () =>
      cfg.includeAllOption
        ? [{ label: "All Workspaces", value: ALL_OPTION_VALUE }, ...baseOptions]
        : baseOptions,
    [baseOptions, cfg.includeAllOption]
  );

  const value = (values[field.key] as string) ?? "";
  const selected = options.find((o) => o.value === value);
  const triggerLabel =
    selected?.label ?? field.placeholder ?? "Select workspace";

  function handleSelect(next: string) {
    setValue(field.key, next === value ? "" : next);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={field.key}
          type="button"
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          disabled={field.disabled}
          aria-invalid={error || undefined}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <span className="flex items-center gap-1">
            {cfg.clearable && selected ? (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                aria-label="Clear selection"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(field.key, "");
                }}
              />
            ) : null}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          {cfg.searchable ? (
            <CommandInput placeholder="Search workspaces..." />
          ) : null}
          <CommandList>
            <CommandEmpty>No workspaces match that search query</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
