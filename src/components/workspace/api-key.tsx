"use client";

/**
 * ApiKey
 *
 * EXACT React mirror of the production Angular `wordly-api-key`
 *   wordly_portal:
 *     libs/components/business/wordly-api-key/
 *       wordly-api-key.component.{ts,html,scss}
 *       models/wordly-api-key.models.ts
 *
 * The Angular component extends `WordlyFormControlBase<string>` and renders
 * `app-wordly-form-control-wrapper` (label / required / helper / error / layout)
 * wrapping a single read-only `app-wordly-input` plus a per-state action cluster:
 *
 *   - loading  → <hlm-spinner />
 *   - empty    → primary button, size `sm`  (`variant="primary" size="sm"`) — text only
 *   - has_key  → three icon buttons: copy (lucideCopy) / refresh (lucideRefreshCcw) /
 *                delete (`variant="icon-destructive"`, lucideTrash colored --destructive)
 *   - error    → lucideCircleAlert (size 16, text-destructive) + outline button "Retry"
 *
 * Anatomy is ported 1:1 from the portal:
 *   - The wrapper is the shared FormControlWrapper (default label-beside layout).
 *   - The input is the shared shadcn Input, read-only, value = apiKey || noKeyText.
 *   - Icon buttons mirror core/button `variant-icon`: fixed 38×38, gray-200 border,
 *     padding 0 (`button.component.scss`). Note `icon-destructive` renders as
 *     `variant-icon` (gray-200 border kept); ONLY the trash icon is destructive-colored
 *     — see WordlyButtonComponent.computedClasses() (`'icon-destructive' ? 'icon'`).
 *   - Delete confirmation mirrors WordlyConfirmDialogService.confirm({variant:'destructive'}).
 *
 * Per the migration brief, OUR Brand Blue stays the primary action color (the
 * portal primary is Teal `--teal-500`); the shared Button's default variant already
 * maps to Brand Blue, so the empty-state button uses the default variant. Everything
 * else tracks the portal SCSS via design-token classes — no raw hex.
 *
 * The Angular DI/service layer (Keycloak flow, ngxClipboard, confirm-dialog,
 * i18next, developer-api) is dropped: state is driven by props + local state, and
 * the @Output events surface as callbacks (onAdd/onCopy/onRefresh/onDelete + onRetry).
 */

import * as React from "react";
// lucide-react exports `AlertCircle` (legacy alias) for the glyph the portal
// references as `lucideCircleAlert`; `Loader2` is the spinning ring equivalent
// of the portal `<hlm-spinner />`.
import {
  AlertCircle as CircleAlert,
  Copy,
  Loader2,
  RefreshCcw,
  Trash as Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

// ---------------------------------------------------------------------------
// Data contract (mirrors models/wordly-api-key.models.ts)
// ---------------------------------------------------------------------------

/** Mirrors the Angular `WordlyApiKeyState` enum. */
export type ApiKeyState = "loading" | "empty" | "has_key" | "error";

/** Mirrors the Angular `WordlyApiKeyEventData` interface. */
export interface ApiKeyEventData {
  apiKey?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Icon-button anatomy — ported verbatim from core/button wordly-button.component.scss
// (`button.variant-icon`): fixed 38×38, gray-200 border, padding 0, brand-blue
// hover/active surface (portal teal-50/teal-100, remapped to Brand Blue per brief).
// `icon-destructive` keeps this same gray-200 border in the portal (computedClasses
// maps it to `variant-icon`); the destructive accent lives only on the icon glyph.
// ---------------------------------------------------------------------------

const ICON_BTN =
  "h-[38px] w-[38px] min-w-[38px] rounded-md border border-gray-200 bg-white p-0 text-gray-800 hover:bg-primary-blue-50 hover:text-primary-blue-700 active:bg-primary-blue-100";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the developer-api
// (getApiKeys → entities[0].apiKey; created/refreshed via the Keycloak flow).
// ---------------------------------------------------------------------------

export const MOCK_API_KEY = "wk_live_8f3a91c2e7b4d65f0a1c9e2d7b4f6a83";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ApiKeyProps {
  /** Controlled API key value. `null`/empty renders the empty state. */
  value?: string | null;
  /** Drive the visible state directly (loading/empty/has_key/error). */
  state?: ApiKeyState;
  /** Loading flag (portal `isLoading$`): disables the input + action buttons. */
  loading?: boolean;

  /** Add a new key (empty state). Angular: initiateKeycloakFlow(). */
  onAdd?: () => void;
  /** Copy the key to the clipboard. Angular: apiKeyCopied. */
  onCopy?: (data: ApiKeyEventData) => void;
  /** Refresh/rotate the key. Angular: initiateKeycloakFlow(apiKey). */
  onRefresh?: (data: ApiKeyEventData) => void;
  /** Delete the key (after confirmation). Angular: apiKeyDeleted. */
  onDelete?: (data: ApiKeyEventData) => void;
  /** Reload after an error. Angular: loadExistingApiKey(). */
  onRetry?: () => void;

  disabled?: boolean;
  readonly?: boolean;

  // ===== FormControlWrapper passthroughs (portal @Inputs from the base) =====
  label?: string;
  required?: boolean;
  helperText?: string;
  helperTextOnTop?: boolean;
  showError?: boolean;
  errorMessage?: string;
  extraInfo?: string;
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Wrapper layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];

  // ===== Configurable text (portal @Inputs, with the same defaults) =====
  /** Portal `id` forwarded to the input. */
  id?: string;
  addButtonText?: string;
  noKeyText?: string;
  placeholder?: string;
  copyButtonTitle?: string;
  refreshButtonTitle?: string;
  deleteButtonTitle?: string;
  deleteConfirmHeader?: string;
  deleteConfirmMessage?: string;
  deleteConfirmAccept?: string;
  deleteConfirmReject?: string;
  clipboardSuccessMessage?: string;

  className?: string;
}

export function ApiKey({
  value,
  state,
  loading = false,
  onAdd,
  onCopy,
  onRefresh,
  onDelete,
  onRetry,
  disabled = false,
  readonly = false,
  label,
  required = false,
  helperText,
  helperTextOnTop = false,
  showError = false,
  errorMessage,
  extraInfo,
  showInfoIcon = false,
  infoTooltipText,
  layoutVariant = "default",
  id,
  // Defaults mirror the Angular *Translated getters (the en fallbacks).
  addButtonText = "Add Api Key",
  noKeyText = "There is no API Key associated with your account.",
  placeholder = "",
  copyButtonTitle = "Copy to Clipboard",
  refreshButtonTitle = "Refresh API Key",
  deleteButtonTitle = "Delete API Key",
  deleteConfirmHeader = "Delete API Key",
  deleteConfirmMessage = "Are you sure you want to delete your API key? This action cannot be undone.",
  deleteConfirmAccept = "Delete",
  deleteConfirmReject = "Cancel",
  clipboardSuccessMessage = "Copied to clipboard",
  className,
}: ApiKeyProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  // Derive the effective state: explicit `state` prop wins, else infer from value
  // (mirrors setApiKey(): apiKey ? HAS_KEY : EMPTY).
  const effectiveState: ApiKeyState = state ?? (value ? "has_key" : "empty");

  const apiKey = value ?? null;

  // Angular: onCopyApiKey() copies via ngxClipboard then emits apiKeyCopied and
  // shows the clipboard success toast. Here we surface the callback + best-effort
  // clipboard write (no toast layer in the lab).
  function handleCopy() {
    if (!apiKey) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(apiKey).catch(() => undefined);
    }
    onCopy?.({ apiKey });
  }

  function handleRefresh() {
    if (!apiKey) return;
    onRefresh?.({ apiKey });
  }

  // Angular: deleteApiKey() opens the destructive confirm dialog, then on accept
  // calls bridge.deleteApiKey + emits apiKeyDeleted.
  function confirmDelete() {
    setConfirmOpen(false);
    if (apiKey) onDelete?.({ apiKey });
  }

  // Portal: input is disabled by `isLoading$`; action buttons by `(isLoading$ | async)`
  // (or the loading state) combined with `disabled`.
  const isLoading = loading || effectiveState === "loading";
  const buttonsDisabled = isLoading || disabled;

  return (
    <FormControlWrapper
      label={label}
      required={required}
      helperText={helperText}
      helperTextOnTop={helperTextOnTop}
      showError={showError}
      currentErrorMessage={errorMessage}
      extraInfo={extraInfo}
      showInfoIcon={showInfoIcon}
      infoTooltipText={infoTooltipText}
      controlId={id}
      layoutVariant={layoutVariant}
      className={className}
    >
      {/* Main Layout: Input + Buttons (portal: <div class="flex items-center gap-2">) */}
      <div className="flex items-center gap-2">
        {/* API Key Input (always present) — portal: <div class="flex-1"> */}
        <div className="flex-1">
          <Input
            id={id}
            value={apiKey ?? noKeyText}
            readOnly
            placeholder={placeholder}
            disabled={isLoading}
          />
        </div>

        {/* Loading State — portal: <hlm-spinner /> */}
        {effectiveState === "loading" ? (
          <div className="flex items-center gap-2">
            <Loader2
              className="size-4 animate-spin text-muted-foreground"
              aria-label="Loading"
            />
          </div>
        ) : null}

        {/* Empty State - Add Button — portal: variant="primary" size="sm" (Brand Blue here) */}
        {effectiveState === "empty" ? (
          <div>
            <Button
              type="button"
              size="sm"
              disabled={buttonsDisabled || readonly}
              onClick={() => onAdd?.()}
            >
              {addButtonText}
            </Button>
          </div>
        ) : null}

        {/* Has API Key State - Action Buttons — portal: <div class="flex items-center gap-1"> */}
        {effectiveState === "has_key" ? (
          <div className="flex items-center gap-1">
            {/* Copy Button — portal variant="icon" */}
            <Button
              type="button"
              variant="ghost"
              title={copyButtonTitle}
              aria-label={copyButtonTitle}
              disabled={buttonsDisabled}
              onClick={handleCopy}
              className={cn(ICON_BTN, readonly && "pointer-events-none")}
            >
              <Copy className="size-4" aria-hidden="true" />
            </Button>

            {/* Refresh Button — portal variant="icon" */}
            <Button
              type="button"
              variant="ghost"
              title={refreshButtonTitle}
              aria-label={refreshButtonTitle}
              disabled={buttonsDisabled}
              onClick={handleRefresh}
              className={cn(ICON_BTN, readonly && "pointer-events-none")}
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
            </Button>

            {/* Delete Button — portal variant="icon-destructive": SAME gray-200
                icon button; only the trash glyph is colored var(--destructive). */}
            <Button
              type="button"
              variant="ghost"
              title={deleteButtonTitle}
              aria-label={deleteButtonTitle}
              disabled={buttonsDisabled}
              onClick={() => setConfirmOpen(true)}
              className={cn(ICON_BTN, readonly && "pointer-events-none")}
            >
              <Trash2 className="size-4 text-destructive" aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {/* Error State - Retry Button — portal: alert icon (16) + outline button */}
        {effectiveState === "error" ? (
          <div className="flex items-center gap-2">
            <CircleAlert
              className="size-4 text-destructive"
              aria-hidden="true"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={readonly}
              onClick={() => onRetry?.()}
            >
              Retry
            </Button>
          </div>
        ) : null}
      </div>

      {/* Destructive delete confirmation (portal WordlyConfirmDialogService,
          variant: 'destructive'). */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmHeader}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{deleteConfirmReject}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteConfirmAccept}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormControlWrapper>
  );
}
