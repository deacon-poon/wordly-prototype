"use client";

/**
 * ApiKey
 *
 * React migration of the production Angular `wordly-api-key`
 * (wordly_portal: libs/components/business/wordly-api-key).
 *
 * The Angular original is a thin form-control proxy that composes the core
 * `app-wordly-button` and `app-wordly-input` primitives. The real visual anatomy
 * therefore lives in `core/button` (wordly-button.component.scss) and `core/input`.
 * This pass aligns our React markup 1:1 with that core anatomy:
 *
 *   - empty state  → primary button, size `sm`  (portal `variant="primary" size="sm"`)
 *   - has-key      → three 38×38 icon buttons (copy / refresh / icon-destructive delete)
 *   - error        → alert icon + outline button, size `sm`
 *   - delete       → destructive AlertDialog action
 *
 * Portal primary is Teal (`--teal-500`); per the migration brief we keep OUR
 * Brand Blue as the primary action color (token classes `primary` / `primary-blue-*`).
 * Everything else (grays, destructive, hover surfaces) tracks the portal SCSS using
 * design-token classes — no raw hex.
 *
 * We keep the same public surface — the four UI states, the copy/refresh/delete/add
 * actions, the destructive delete confirmation, and the configurable labels — but
 * drop the Angular DI/service layer (Keycloak, clipboard, confirm-dialog, i18next).
 * State is driven by props and local component state; action callbacks fire instead
 * of services.
 *
 * Built on the shared shadcn primitives (Input + Button + AlertDialog) per the
 * workspace-selector proof. In production the key would be fetched and mutated
 * via the developer-api (createApiKey / refreshApiKey / deleteApiKey).
 */

import * as React from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WordlyApiKeyState / event-data types)
// ---------------------------------------------------------------------------

export type ApiKeyState = "loading" | "empty" | "has_key" | "error";

export interface ApiKeyEventData {
  apiKey?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Portal-aligned anatomy tokens
//
// Mirrors core/button/wordly-button.component.scss. Portal `variant="icon"` is a
// fixed 38×38 square with a gray-200 border; hover surface is teal-50 in the
// portal, mapped here to primary-blue-50 to keep Brand Blue as the interaction
// color. `icon-destructive` adds a destructive border (portal `!border-destructive`).
// ---------------------------------------------------------------------------

// 38×38 icon button, gray-200 border, padding 0, brand-blue hover surface
const ICON_BTN =
  "h-[38px] w-[38px] min-w-[38px] rounded-md border border-gray-200 bg-white p-0 text-gray-800 hover:bg-primary-blue-50 hover:text-primary-blue-700 active:bg-primary-blue-100";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the developer-api
// (getApiKeys → entities[0].apiKey; created/refreshed via the Keycloak flow)
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
  readOnly?: boolean;

  label?: string;
  required?: boolean;

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
  errorText?: string;
  retryText?: string;

  className?: string;
}

export function ApiKey({
  value,
  state,
  onAdd,
  onCopy,
  onRefresh,
  onDelete,
  onRetry,
  disabled = false,
  readOnly = false,
  label,
  required = false,
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
  errorText = "Failed to load API key",
  retryText = "Retry",
  className,
}: ApiKeyProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Derive the effective state: explicit `state` prop wins, else infer from value.
  const effectiveState: ApiKeyState = state ?? (value ? "has_key" : "empty");

  const apiKey = value ?? null;

  function handleCopy() {
    if (!apiKey) return;
    // In production this writes to navigator.clipboard and toasts
    // `clipboardSuccessMessage`; here we surface a transient check icon.
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    onCopy?.({ apiKey });
  }

  function handleRefresh() {
    if (!apiKey) return;
    onRefresh?.({ apiKey });
  }

  function confirmDelete() {
    setConfirmOpen(false);
    if (apiKey) onDelete?.({ apiKey });
  }

  const inputDisabled = disabled || effectiveState === "loading";
  const actionsDisabled = disabled || readOnly;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <div className="flex items-center gap-2">
        {/* API key field — always present, read-only (mirrors Angular). */}
        <Input
          readOnly
          disabled={inputDisabled}
          placeholder={placeholder}
          value={apiKey ?? noKeyText}
          aria-invalid={effectiveState === "error"}
          className={cn(
            "flex-1 font-mono text-sm",
            !apiKey && "font-sans text-muted-foreground",
            effectiveState === "error" &&
              "border-destructive focus-visible:ring-destructive/50"
          )}
          aria-label={label ?? "API key"}
        />

        {effectiveState === "loading" ? (
          <div className="flex items-center gap-2 px-2">
            <Loader2
              className="h-4 w-4 animate-spin text-muted-foreground"
              aria-label="Loading API key"
            />
          </div>
        ) : null}

        {/* Empty state → portal variant="primary" size="sm". Kept on Brand Blue. */}
        {effectiveState === "empty" ? (
          <Button
            type="button"
            size="sm"
            disabled={actionsDisabled}
            onClick={() => onAdd?.()}
          >
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        ) : null}

        {/* Has-key state → three 38×38 icon buttons (copy / refresh / delete). */}
        {effectiveState === "has_key" ? (
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={actionsDisabled}
                    onClick={handleCopy}
                    aria-label={copyButtonTitle}
                    className={ICON_BTN}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-accent-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? clipboardSuccessMessage : copyButtonTitle}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={actionsDisabled}
                    onClick={handleRefresh}
                    aria-label={refreshButtonTitle}
                    className={ICON_BTN}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{refreshButtonTitle}</TooltipContent>
              </Tooltip>

              {/* icon-destructive: portal adds `!border-destructive` + destructive icon. */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={actionsDisabled}
                    onClick={() => setConfirmOpen(true)}
                    aria-label={deleteButtonTitle}
                    className={cn(
                      ICON_BTN,
                      "border-destructive text-destructive hover:text-destructive"
                    )}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{deleteButtonTitle}</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ) : null}

        {/* Error state → alert icon + outline button, size sm (portal). */}
        {effectiveState === "error" ? (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={actionsDisabled}
              onClick={() => onRetry?.()}
            >
              {retryText}
            </Button>
          </div>
        ) : null}
      </div>

      {effectiveState === "error" ? (
        <p className="text-sm text-destructive">{errorText}</p>
      ) : null}

      {/* Destructive delete confirmation (Angular: WordlyConfirmDialogService). */}
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
    </div>
  );
}
