"use client";

/**
 * WorkspaceSelector
 *
 * React migration of the production Angular `wordly-workspace-selector`
 * (wordly_portal: libs/components/business/wordly-workspace-selector).
 *
 * The Angular original is a pure proxy over the core `wordly-select`, populated
 * with workspace data from a bridge service. The real control anatomy therefore
 * lives in `wordly-select` -> `hlm-select-trigger`, so this component matches the
 * portal's select-trigger anatomy 1:1 (mirrors the AccountSelector proof):
 * border-input, rounded-md, px-3 py-2, text-sm, shadow-xs, gap-2, sizes
 * default=h-9 / sm=h-8, focus ring [3px] on ring, destructive border+text+ring
 * on error, readonly keeps appearance but blocks interaction.
 *
 * We keep the same public surface (searchable, clearable, an optional
 * "All Workspaces" entry, grouped shared/personal workspaces, loading/error/
 * empty states) and drop the Angular DI/service layer: data arrives via props,
 * defaulting to mock data. Built on the shared shadcn primitives
 * (Command + Popover) per DEC-003. In production these workspaces would be
 * fetched from the API (see DEC-007).
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { selectTriggerVariants } from "@/components/ui/select-trigger";
import { Check, ChevronDown, AlertCircle, X } from "lucide-react";

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
// Trigger anatomy - mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). The portal
// proxies wordly-workspace-selector -> wordly-select -> hlm-select-trigger, so
// the real control anatomy lives there: border-input, rounded-md, px-3 py-2,
// text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring [3px] on
// ring, destructive border+text+ring on error.
// ---------------------------------------------------------------------------

export type WorkspaceSelectorSize = NonNullable<
  VariantProps<typeof selectTriggerVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlySelectOption / grouped option types)
// ---------------------------------------------------------------------------

export interface WorkspaceOption {
  label: string;
  value: string;
}

export interface WorkspaceOptionGroup {
  groupName: string;
  options: WorkspaceOption[];
}

export const ALL_OPTION_VALUE = "ALL";

// ---------------------------------------------------------------------------
// Mock data - in production, fetched from the workspaces API (DEC-007)
// ---------------------------------------------------------------------------

export const MOCK_WORKSPACES: WorkspaceOption[] = [
  { label: "Acme Global Events", value: "ws-acme" },
  { label: "Northwind Conferences", value: "ws-northwind" },
  { label: "Contoso Town Halls", value: "ws-contoso" },
  { label: "Fabrikam Webinars", value: "ws-fabrikam" },
  { label: "Tailspin Summits", value: "ws-tailspin" },
];

export const MOCK_GROUPED_WORKSPACES: WorkspaceOptionGroup[] = [
  {
    groupName: "Shared Workspaces",
    options: [
      { label: "Acme Global Events", value: "ws-acme" },
      { label: "Northwind Conferences", value: "ws-northwind" },
      { label: "Contoso Town Halls", value: "ws-contoso" },
    ],
  },
  {
    groupName: "Personal Workspaces",
    options: [
      { label: "Avery Chen", value: "ws-avery" },
      { label: "Jordan Patel", value: "ws-jordan" },
      { label: "Sam Rivera", value: "ws-sam" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface WorkspaceSelectorProps {
  /** Controlled selected workspace value. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Flat workspace list. Ignored when `groupedWorkspaces` is provided. */
  workspaces?: WorkspaceOption[];
  /** Shared/personal groups; when set, renders grouped instead of flat. */
  groupedWorkspaces?: WorkspaceOptionGroup[];

  placeholder?: string;
  /** Show a search input to filter workspaces. */
  searchable?: boolean;
  /** Allow clearing the current selection. */
  clearable?: boolean;
  /** Prepend an "All Workspaces" entry (value === ALL_OPTION_VALUE). */
  includeAllOption?: boolean;
  allOptionLabel?: string;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: WorkspaceSelectorSize;

  disabled?: boolean;
  /** Read-only: shows the value but blocks interaction (portal `readonly`). */
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Error text shown below the control when `error` is set (portal errorMessage). */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;

  label?: string;
  required?: boolean;

  loadingText?: string;
  errorLoadingText?: string;
  noWorkspacesText?: string;
  noSearchResultsText?: string;

  className?: string;
}

export function WorkspaceSelector({
  value,
  onValueChange,
  workspaces = MOCK_WORKSPACES,
  groupedWorkspaces,
  placeholder = "Select workspace",
  searchable = false,
  clearable = false,
  includeAllOption = false,
  allOptionLabel = "All Workspaces",
  size = "default",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  helperText,
  label,
  required = false,
  loadingText = "Loading workspaces...",
  errorLoadingText = "Failed to load workspaces",
  noWorkspacesText = "No workspaces available",
  noSearchResultsText = "No workspaces match that search query",
  className,
}: WorkspaceSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Normalize flat vs grouped into a single render model.
  const groups: WorkspaceOptionGroup[] = React.useMemo(() => {
    const base = groupedWorkspaces ?? [{ groupName: "", options: workspaces }];
    if (!includeAllOption) return base;
    return [
      {
        groupName: "",
        options: [{ label: allOptionLabel, value: ALL_OPTION_VALUE }],
      },
      ...base,
    ];
  }, [groupedWorkspaces, workspaces, includeAllOption, allOptionLabel]);

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  const hasGroupedOptions = groups.some((g) => g.groupName);
  const selected = allOptions.find((o) => o.value === value);
  const hasOptions = allOptions.length > 0;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selected?.label ?? placeholder);

  // Loading / error block the trigger; readonly keeps appearance but blocks open.
  const interactionBlocked = disabled || loading || error || readonly;

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.("");
  }

  const showClear = clearable && !!selected && !loading && !error && !readonly;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <Popover
        open={open}
        onOpenChange={interactionBlocked ? undefined : setOpen}
      >
        <div className="relative">
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-invalid={error || undefined}
              aria-readonly={readonly || undefined}
              aria-required={required || undefined}
              disabled={disabled || loading || error}
              className={cn(
                selectTriggerVariants({ size, error }),
                // Make room for the clear button + chevron when clearable.
                showClear && "pr-12",
                readonly && "pointer-events-none"
              )}
            >
              <span
                className={cn(
                  "flex min-w-0 items-center gap-2 truncate",
                  !selected && "text-muted-foreground"
                )}
              >
                {loading ? (
                  <span
                    className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="truncate">{triggerLabel}</span>
              </span>
              <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>

          {/* Clear button: portal places it absolutely at right-8, before the chevron. */}
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

        <PopoverContent
          className="min-w-[8rem] w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          align="start"
        >
          <Command>
            {searchable ? (
              <CommandInput placeholder="Search workspaces..." />
            ) : null}
            <CommandList>
              <CommandEmpty className="py-1.5 text-sm italic text-muted-foreground">
                {hasOptions ? noSearchResultsText : noWorkspacesText}
              </CommandEmpty>
              {groups.map((group, i) => (
                <CommandGroup
                  key={group.groupName || `group-${i}`}
                  heading={group.groupName || undefined}
                  // Portal hlm-select-label: text-sm font-semibold text-muted-foreground
                  // (overrides the shared CommandGroup default of text-xs/medium/gray-500).
                  className="[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {group.options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          "relative cursor-default gap-2 rounded-sm py-1.5 pr-8 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground",
                          // Portal indents options inside groups (pl-4 / pl-8).
                          hasGroupedOptions ? "pl-8" : "pl-2"
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        <span className="absolute right-2 flex size-3.5 items-center justify-center">
                          {isSelected ? (
                            <Check className="size-4 shrink-0 text-primary" />
                          ) : null}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error message (portal: icon + text-destructive, pl-3). Falls back to helper text. */}
      {error && errorMessage ? (
        <div className="flex items-center gap-1 pl-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : helperText && !error ? (
        <p className="pl-3 text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
