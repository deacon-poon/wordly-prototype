"use client";

/**
 * WorkspaceSelector
 *
 * EXACT React mirror of the production Angular `wordly-workspace-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-workspace-selector/
 *       wordly-workspace-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *pure proxy*: the template is a single
 * `<app-wordly-select>` populated with `workspaceOptions`, and `wordly-select`
 * itself renders the shared `wordly-form-control-wrapper` (label / required /
 * helper / error / info icon / extra info + the responsive label-beside grid
 * layout) wrapping the `hlm-select-trigger`.
 *
 *   Angular:  workspace-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:    WorkspaceSelector  → FormControlWrapper + (radix Select w/ hlm trigger anatomy)
 *
 * This mirrors the validated AccountSelector reference 1:1, including:
 *   - the trigger class string ported verbatim from
 *     wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts
 *   - the default LAYOUT being the responsive label-beside-control grid
 *     (design variant "default"), matching the portal — NOT a vertical flex-col.
 *
 * The Angular bridge-service / DI layer is dropped; workspace data arrives via
 * props (mock default). The component preserves the Angular public surface:
 * `includeAllOption` / `allOptionLabel` (prepends an "ALL" entry),
 * `defaultOption` (pre-selects on mount, with "" normalized to ALL when
 * includeAllOption is on), `showGroupedWorkspaces` (shared/personal groups),
 * plus `searchable` / `clearable` (proxied wordly-select inputs).
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

// ---------------------------------------------------------------------------
// Trigger anatomy — ported verbatim from the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). Angular targets
// `[&>ng-icon]`; the React radix trigger renders its chevron as an svg, so the
// icon-targeting utilities are mapped to `[&>svg]` while every other token
// (border-input, rounded-md, px-3 py-2, text-sm, shadow-xs, gap-2, the
// data-[size] heights, the focus ring [3px], destructive on error) is identical.
// Mirrors the validated AccountSelector reference.
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

export type WorkspaceSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlySelectOption / WordlySelectOptionType)
// ---------------------------------------------------------------------------

export interface WorkspaceOption {
  label: string;
  value: string;
}

/** A grouped option block (mirrors the Angular `{ groupName, options }` shape). */
export interface WorkspaceOptionGroup {
  groupName: string;
  options: WorkspaceOption[];
}

/** Value used by the prepended "All Workspaces" entry (Angular ALL_OPTION_VALUE). */
export const ALL_OPTION_VALUE = "ALL";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the workspaces bridge service. Mirrors
// the dataset used by the portal Overview story (mockGroupedBridgeService).
// ---------------------------------------------------------------------------

export const MOCK_WORKSPACES: WorkspaceOption[] = [
  { label: "Personal Workspace", value: "65b7a1cfa5f3b021c5a909e7" },
  { label: "Engineering", value: "65b7a253a5f3b021c5a90b20" },
  { label: "Marketing Team", value: "65b7a253a5f3b021c5a90b21" },
  { label: "Product Development", value: "65b7a253a5f3b021c5a90b22" },
  { label: "Design Team", value: "65b7a253a5f3b021c5a90b23" },
  { label: "Customer Success", value: "65b7a253a5f3b021c5a90b24" },
  { label: "Data Analytics", value: "65b7a253a5f3b021c5a90b25" },
  { label: "Infrastructure", value: "65b7a253a5f3b021c5a90b26" },
];

/** Personal workspaces (portal mockPersonalOptions) — used when grouped. */
export const MOCK_PERSONAL_WORKSPACES: WorkspaceOption[] = [
  { label: "Personal Workspace1", value: "65b7a1cfa5f3b021c5a909e1" },
  { label: "Personal Workspace2", value: "65b7a1cfa5f3b021c5a909e2" },
  { label: "Personal Workspace3", value: "65b7a1cfa5f3b021c5a909e3" },
  { label: "Personal Workspace4", value: "65b7a1cfa5f3b021c5a909e4" },
  { label: "Personal Workspace5", value: "65b7a1cfa5f3b021c5a909e5" },
  { label: "Personal Workspace6", value: "65b7a1cfa5f3b021c5a909e6" },
];

/** Pre-grouped Shared/Personal blocks (mirrors loadData's grouped branch). */
export const MOCK_GROUPED_WORKSPACES: WorkspaceOptionGroup[] = [
  { groupName: "Shared Workspaces", options: MOCK_WORKSPACES },
  { groupName: "Personal Workspaces", options: MOCK_PERSONAL_WORKSPACES },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface WorkspaceSelectorProps {
  /** Controlled selected workspace value. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;

  /** Flat workspace list. Ignored when `showGroupedWorkspaces` is set. */
  workspaces?: WorkspaceOption[];
  /** Shared/personal groups, used when `showGroupedWorkspaces` is true. */
  groupedWorkspaces?: WorkspaceOptionGroup[];
  /**
   * When true, shared and personal workspaces render as separate groups
   * (mirrors the Angular `showGroupedWorkspaces` @Input).
   */
  showGroupedWorkspaces?: boolean;

  /** Prepend an "All Workspaces" entry (value === ALL_OPTION_VALUE). */
  includeAllOption?: boolean;
  allOptionLabel?: string;
  /**
   * Pre-select an option on mount (mirrors the Angular `defaultOption` @Input).
   * When `includeAllOption` is on, "" is normalized to ALL.
   */
  defaultOption?: string | null;

  placeholder?: string;
  /**
   * Accepted for API parity with the proxied `wordly-select` (`searchable`).
   * The Angular control renders an in-popover search; the Radix Select used
   * here has no built-in search, so this is a no-op (see component notes).
   */
  searchable?: boolean;
  /** Allow clearing the current selection (portal `clearable`). */
  clearable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: WorkspaceSelectorSize;
  /** CSS class(es) applied to the select trigger (portal `triggerClass`). */
  triggerClass?: string;

  disabled?: boolean;
  /** Read-only: shows the value but blocks interaction (portal `readonly`). */
  readonly?: boolean;
  loading?: boolean;
  /** Error/invalid state (portal `displayError`). */
  error?: boolean;
  /** Error text shown below the control when `error` is set (portal errorMessage). */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;
  /** Place helper text above the control (stacked layout only). */
  helperTextOnTop?: boolean;

  label?: string;
  required?: boolean;
  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

  loadingText?: string;
  errorLoadingText?: string;
  noWorkspacesText?: string;

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  /** Container layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

  className?: string;
}

export function WorkspaceSelector({
  value,
  onValueChange,
  workspaces = MOCK_WORKSPACES,
  groupedWorkspaces = MOCK_GROUPED_WORKSPACES,
  showGroupedWorkspaces = false,
  includeAllOption = false,
  allOptionLabel = "All Workspaces",
  defaultOption = null,
  placeholder = "Select workspace",
  searchable = false,
  clearable = false,
  size = "default",
  triggerClass = "",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  label,
  required = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  loadingText = "Loading workspaces...",
  errorLoadingText = "Failed to load workspaces",
  noWorkspacesText = "No workspaces available",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: WorkspaceSelectorProps) {
  // Build the option model (mirrors `workspaceOptions: WordlySelectOptionType[]`).
  // includeAllOption prepends the ALL entry; showGroupedWorkspaces switches the
  // flat list for the shared/personal groups.
  const groups: WorkspaceOptionGroup[] = React.useMemo(() => {
    const base = showGroupedWorkspaces
      ? groupedWorkspaces
      : [{ groupName: "", options: workspaces }];
    if (!includeAllOption) return base;
    return [
      {
        groupName: "",
        options: [{ label: allOptionLabel, value: ALL_OPTION_VALUE }],
      },
      ...base,
    ];
  }, [
    showGroupedWorkspaces,
    groupedWorkspaces,
    workspaces,
    includeAllOption,
    allOptionLabel,
  ]);

  const hasGroupHeadings = groups.some((g) => g.groupName);
  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  const hasOptions = allOptions.length > 0;
  const selected = allOptions.find((o) => o.value === value);
  const showError = error;

  // applyDefaultOptionIfNeeded(): pre-select defaultOption on mount when no
  // value has been written. "" normalizes to ALL when includeAllOption is on.
  const appliedDefault = React.useRef(false);
  React.useEffect(() => {
    if (appliedDefault.current) return;
    if (defaultOption !== null && (value === undefined || value === "")) {
      appliedDefault.current = true;
      const normalized =
        includeAllOption && defaultOption === ""
          ? ALL_OPTION_VALUE
          : defaultOption;
      onValueChange?.(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading / error / readonly block interaction (portal isLoading + readonly).
  const interactionBlocked = disabled || loading || error || readonly;

  const triggerPlaceholder = loading
    ? loadingText
    : error
      ? errorLoadingText
      : placeholder;

  const showClear =
    clearable && !!selected && !loading && !error && !readonly && !disabled;

  // The portal "clearable" sets the value back to empty (or ALL when includeAll).
  const handleClear = () => {
    onValueChange?.(includeAllOption ? ALL_OPTION_VALUE : "");
  };

  return (
    <FormControlWrapper
      label={label}
      required={required}
      helperText={!error ? helperText : undefined}
      helperTextOnTop={helperTextOnTop}
      showError={showError}
      currentErrorMessage={errorMessage}
      extraInfo={extraInfo}
      showInfoIcon={showInfoIcon}
      infoTooltipText={infoTooltipText}
      layoutVariant={layoutVariant}
      labelStyleVariant={labelStyleVariant}
      labelSizeVariant={labelSizeVariant}
      labelContextVariant={labelContextVariant}
      spacingVariant={spacingVariant}
      contentContextVariant={contentContextVariant}
      className={className}
    >
      <div className="relative">
        <Select
          value={value || undefined}
          onValueChange={(next) => onValueChange?.(next)}
          disabled={interactionBlocked}
        >
          <SelectTrigger
            data-size={size}
            aria-invalid={error || undefined}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            className={cn(
              selectTriggerVariants({ error: showError }),
              // Make room for the clear button + chevron when clearable.
              showClear && "pr-12",
              readonly && "pointer-events-none",
              triggerClass
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
              groups.map((group, i) =>
                hasGroupHeadings && group.groupName ? (
                  <SelectGroup key={group.groupName || `group-${i}`}>
                    <SelectLabel className="text-sm font-semibold text-muted-foreground">
                      {group.groupName}
                    </SelectLabel>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )
              )
            ) : (
              <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
                {noWorkspacesText}
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Clear button: portal places it absolutely before the chevron. */}
        {showClear ? (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={handleClear}
            className="absolute right-8 top-1/2 z-10 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </FormControlWrapper>
  );
}
