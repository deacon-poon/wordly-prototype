"use client";

/**
 * AccountSelector
 *
 * EXACT React mirror of the production Angular `wordly-account-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-account-selector/
 *       wordly-account-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *thin proxy*: it renders the shared
 * FormControlWrapper (label / required / helper / error / layout) wrapping a
 * Select control, exactly the way the Angular component proxies through
 * `app-wordly-select` → `app-wordly-form-control-wrapper` + `hlm-select-trigger`.
 *
 *   Angular:  account-selector → wordly-select → form-control-wrapper + hlm-select-trigger
 *   React:    AccountSelector  → FormControlWrapper + (radix Select w/ hlm trigger anatomy)
 *
 * The trigger class string is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts (selectTriggerVariants)
 *
 * The default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal — NOT a bespoke vertical flex-col.
 *
 * Account data arrives via props (mock default); the Angular DI/bridge-service
 * layer is dropped, but the `ownAccounts` endpoint switch and `labelFormatter`
 * behavior are preserved.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

// ---------------------------------------------------------------------------
// Trigger anatomy — ported verbatim from the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). Angular targets
// `[&>ng-icon]`; the React radix trigger renders its chevron as an svg, so the
// icon-targeting utilities are mapped to `[&>svg]` while every other token
// (border-input, rounded-md, px-3 py-2, text-sm, shadow-xs, gap-2, the
// data-[size] heights, the focus ring [3px], destructive on error) is identical.
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

export type AccountSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular Account model, trimmed to what the
// selector needs to render a label and an optional detail line)
// ---------------------------------------------------------------------------

export interface Account {
  id: string;
  title: string;
  ownerName: string;
  availableMinutes: number;
  /** True when owned by the current user (mirrors the `ownAccounts` filter). */
  ownedByCurrentUser?: boolean;
}

/** Default label: the account title (matches the Angular default behavior). */
export const defaultLabelFormatter = (account: Account): string =>
  account.title;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the AccountService API. Mirrors the
// dataset used by the portal Overview story (bridge service mock).
// ---------------------------------------------------------------------------

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    title: "Acme Corporation",
    ownerName: "John Smith",
    availableMinutes: 1500,
    ownedByCurrentUser: true,
  },
  {
    id: "2",
    title: "Global Industries Inc.",
    ownerName: "Jane Doe",
    availableMinutes: 2300,
    ownedByCurrentUser: false,
  },
  {
    id: "3",
    title: "Tech Solutions Ltd.",
    ownerName: "John Smith",
    availableMinutes: 800,
    ownedByCurrentUser: true,
  },
  {
    id: "4",
    title: "Enterprise Systems",
    ownerName: "Bob Johnson",
    availableMinutes: 3200,
    ownedByCurrentUser: false,
  },
  {
    id: "5",
    title: "Innovation Group",
    ownerName: "Alice Brown",
    availableMinutes: 1100,
    ownedByCurrentUser: false,
  },
  {
    id: "6",
    title: "Digital Ventures",
    ownerName: "John Smith",
    availableMinutes: 950,
    ownedByCurrentUser: true,
  },
  {
    id: "7",
    title: "Business Partners LLC",
    ownerName: "Carol White",
    availableMinutes: 1800,
    ownedByCurrentUser: false,
  },
  {
    id: "8",
    title: "Strategic Consulting",
    ownerName: "Dave Wilson",
    availableMinutes: 2700,
    ownedByCurrentUser: false,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface AccountSelectorProps {
  /** Controlled selected account id. */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;

  /** Account list. Defaults to mock data. */
  accounts?: Account[];
  /**
   * When true, only accounts owned by the current user are shown (mirrors the
   * Angular `ownAccounts` @Input, which switched the bridge-service endpoint
   * getOwnerAccounts vs getAllAccounts).
   */
  ownAccounts?: boolean;
  /** Customize how each account label renders. Defaults to `account.title`. */
  labelFormatter?: (account: Account) => string;

  placeholder?: string;
  /**
   * Accepted for API compatibility. The Angular account-selector proxies
   * `wordly-select` with `searchable=false` (fixed), so this is a no-op here.
   */
  searchable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: AccountSelectorSize;
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
  noAccountsText?: string;

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

export function AccountSelector({
  value,
  onValueChange,
  accounts = MOCK_ACCOUNTS,
  ownAccounts = false,
  labelFormatter = defaultLabelFormatter,
  placeholder = "Select account",
  size = "default",
  triggerClass = "w-full",
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
  loadingText = "Loading accounts...",
  errorLoadingText = "Failed to load accounts",
  noAccountsText = "No accounts available",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: AccountSelectorProps) {
  // `ownAccounts` mirrors the Angular endpoint switch (getOwnerAccounts vs
  // getAllAccounts): filter to accounts owned by the current user.
  const visibleAccounts = React.useMemo(
    () =>
      ownAccounts ? accounts.filter((a) => a.ownedByCurrentUser) : accounts,
    [accounts, ownAccounts]
  );

  // Build the select option list (mirrors `accountOptions: WordlySelectOption[]`).
  const accountOptions = React.useMemo(
    () =>
      visibleAccounts.map((account) => ({
        value: account.id,
        label: labelFormatter(account),
      })),
    [visibleAccounts, labelFormatter]
  );

  const hasOptions = accountOptions.length > 0;
  const showError = error;

  // Loading / error / readonly block interaction (portal isLoading + readonly).
  const interactionBlocked = disabled || loading || error || readonly;

  const triggerPlaceholder = loading
    ? loadingText
    : error
      ? errorLoadingText
      : placeholder;

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
            accountOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="py-1.5 px-2 text-sm italic text-muted-foreground">
              {noAccountsText}
            </div>
          )}
        </SelectContent>
      </Select>
    </FormControlWrapper>
  );
}
