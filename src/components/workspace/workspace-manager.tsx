"use client";

/**
 * WorkspaceManager
 *
 * React migration of the production Angular `wordly-workspace-manager`
 * (wordly_portal: libs/components/business/wordly-workspace-manager).
 *
 * The Angular original is a business component wrapping the core
 * `wordly-combobox`: it lists the user's workspaces, appends an "Add workspace"
 * action plus a user menu (Edit profile / Log out), and opens a "Create New
 * Workspace" dialog with a name input (max 50 chars). Here we keep the same
 * public surface (workspace list, selection, the three actions, create dialog,
 * loading/error/empty states) but drop the Angular DI/service layer
 * (bridge + data services, translation, form builder): data arrives via props,
 * defaulting to mock data. In production these workspaces would be fetched from
 * the workspaces API.
 *
 * Built on the shared shadcn primitives (Command + Popover for the combobox,
 * Dialog + Input for the create flow) per the WorkspaceSelector proof.
 *
 * VISUAL PARITY (vs. portal core anatomy):
 *  - The combobox trigger uses the portal SELECT-trigger anatomy
 *    (`hlm-select-trigger`), identical to our validated AccountSelector reference:
 *    h-9 (default) / h-8 (sm), px-3 py-2, gap-2, rounded-md, border border-input,
 *    bg-transparent, text-sm, shadow-xs, single ChevronDown indicator (size-4,
 *    opacity-50 via muted-foreground), NO hover background on the trigger, focus
 *    ring [3px] with focus-visible:border-ring and no offset, error ->
 *    border-destructive text-destructive focus-visible:ring-destructive/20.
 *    Placeholder = muted-foreground; readonly keeps appearance + blocks interaction.
 *  - The create button is the portal `wordly-button` `variant="primary"` at the
 *    default size (38px / 8px 16px / 16px text). Portal primary Teal maps to our
 *    Brand Blue, so: bg-primary, hover brand-blue-600, active brand-blue-700.
 *  - Disabled mirrors the portal button: gray-100 bg, gray-500 text, opacity-50.
 *  - All buttons: Roboto (inherited), font-weight 500 (font-medium), rounded-md
 *    (= 6px at our --radius), transition-colors, focus-visible ring = Brand Blue.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { selectTriggerVariants } from "@/components/ui/select-trigger";
import {
  Check,
  ChevronDown,
  Info,
  Loader2,
  LogOut,
  Plus,
  UserCog,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Portal-aligned button anatomy
//
// Mirrors wordly-button.component.scss 1:1 (variant + size set, px sizing, and
// per-state colors), with the portal's primary Teal remapped to our Brand Blue
// and only token classes used (no raw hex). The combobox trigger uses the
// `outline` variant; the create button uses the `primary` variant. The full
// variant/size set is declared so the anatomy stays portable and self-documents
// the parity contract even though this business component renders two of them.
// ---------------------------------------------------------------------------

export const workspaceButtonVariants = cva(
  // base: portal `button` rule — inline-flex, centered, 500 weight, 6px radius,
  // smooth transition, focus ring (Brand Blue via --ring): portal uses a 3px ring
  // with focus-visible:border-ring and NO ring offset.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // portal teal primary -> Brand Blue
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-blue-600 active:bg-primary-blue-700",
        // portal navy secondary -> our navy tokens (alias to Brand Blue family)
        secondary:
          "bg-secondary-navy-50 text-secondary-navy-700 hover:bg-secondary-navy-100 active:bg-secondary-navy-200",
        destructive:
          "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",
        outline:
          "border border-gray-200 bg-white text-gray-800 hover:bg-primary-blue-50 active:bg-primary-blue-100",
        "outline-primary":
          "border border-primary-blue-200 bg-white text-primary-blue-700 hover:bg-primary-blue-50 active:bg-primary-blue-100",
        ghost:
          "bg-transparent text-gray-800 hover:bg-primary-blue-50 active:bg-primary-blue-100",
        link: "bg-transparent text-primary p-0 font-normal underline-offset-4 hover:underline",
        icon: "w-[38px] min-w-[38px] h-[38px] border border-gray-200 p-0 hover:bg-primary-blue-50 active:bg-primary-blue-100",
      },
      size: {
        // portal size-sm: 36px / 8px 12px / 14px
        sm: "min-h-9 px-3 py-2 text-sm",
        // portal size-default: 38px / 8px 16px / 16px
        default: "min-h-[38px] px-4 py-2 text-base",
        // portal size-lg: 44px / 10px 32px / 16px
        lg: "min-h-11 px-8 py-2.5 text-base",
        // portal size-block: full-width, default height
        block: "w-full min-h-[38px] px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export type WorkspaceButtonVariant = NonNullable<
  VariantProps<typeof workspaceButtonVariants>["variant"]
>;
export type WorkspaceButtonSize = NonNullable<
  VariantProps<typeof workspaceButtonVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts), identical to our
// validated AccountSelector reference. The combobox trigger renders the SELECT
// trigger, not the generic button: border-input, rounded-md, px-3 py-2, text-sm,
// shadow-xs, gap-2, sizes default=h-9 / sm=h-8, NO hover background, focus ring
// [3px] on ring with focus-visible:border-ring (no offset), and on error
// border-destructive + text-destructive + ring-destructive/20.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular WorkspaceManagerComboboxOption / WorkspaceGroup)
// ---------------------------------------------------------------------------

export interface WorkspaceItem {
  /** Workspace id (combobox value). */
  value: string;
  /** Display name. */
  label: string;
  /** e.g. "shared" | "personal" — informational only here. */
  type?: string;
}

/** Reserved action values, mirroring the Angular WorkspaceAction enum. */
export const WORKSPACE_ACTIONS = {
  ADD_WORKSPACE: "addWorkspace",
  EDIT_PROFILE: "editProfile",
  LOGOUT: "logOut",
} as const;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the workspaces API
// ---------------------------------------------------------------------------

export const MOCK_WORKSPACE_ITEMS: WorkspaceItem[] = [
  { label: "Acme Global Events", value: "ws-acme", type: "shared" },
  { label: "Northwind Conferences", value: "ws-northwind", type: "shared" },
  { label: "Contoso Town Halls", value: "ws-contoso", type: "shared" },
  { label: "Avery Chen", value: "ws-avery", type: "personal" },
  { label: "Jordan Patel", value: "ws-jordan", type: "personal" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface WorkspaceManagerProps {
  /** Controlled selected workspace id. */
  value?: string;
  /** Fired when the selected workspace changes. */
  onValueChange?: (value: string) => void;

  /** Workspaces to list. Defaults to mock data. */
  workspaces?: WorkspaceItem[];

  /** Fired with the new workspace name when the create dialog is submitted. */
  onCreateWorkspace?: (name: string) => void;
  /** Fired when the "Edit profile" action is chosen. */
  onEditProfile?: () => void;
  /** Fired when the "Log out" action is chosen. */
  onLogOut?: () => void;
  /** Hide the "Add workspace" action (Angular: non-admin SSO users). */
  hideAddWorkspace?: boolean;

  // ----- @Input mirrors -----
  label?: string;
  /** Create-dialog title (Angular: dialogTitle). */
  dialogTitle?: string;
  /** Create-dialog description (Angular: dialogDescription). */
  dialogDescription?: string;
  /** Create-dialog submit button text (Angular: createButtonText). */
  createButtonText?: string;
  /** Max length for the new workspace name (Angular: wsNameMaxLength). */
  wsNameMaxLength?: number;

  searchPlaceholder?: string;
  disabled?: boolean;
  /** Render the trigger as read-only (Angular combobox readonly): no popover. */
  readonly?: boolean;
  loading?: boolean;
  error?: boolean;

  loadingText?: string;
  errorLoadingText?: string;
  noWorkspacesText?: string;
  noSearchResultsText?: string;

  className?: string;
}

export function WorkspaceManager({
  value,
  onValueChange,
  workspaces = MOCK_WORKSPACE_ITEMS,
  onCreateWorkspace,
  onEditProfile,
  onLogOut,
  hideAddWorkspace = false,
  label = "Workspace Manager",
  dialogTitle = "Create New Workspace",
  dialogDescription = "New Workspace Name",
  createButtonText = "Create",
  wsNameMaxLength = 50,
  searchPlaceholder = "Search all workspaces",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  loadingText = "Loading workspaces...",
  errorLoadingText = "Failed to load workspaces",
  noWorkspacesText = "No workspaces available",
  noSearchResultsText = "No workspaces match that search query",
  className,
}: WorkspaceManagerProps) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newWorkspace, setNewWorkspace] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const selected = workspaces.find((w) => w.value === value);
  const hasWorkspaces = workspaces.length > 0;
  const triggerDisabled = disabled || loading || error;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selected?.label ?? searchPlaceholder);

  // Placeholder state (no selection) -> muted-foreground, per the portal
  // `.wordly-combobox-placeholder` rule.
  const showPlaceholder = !selected && !loading && !error;

  function selectWorkspace(next: string) {
    onValueChange?.(next);
    setOpen(false);
  }

  // Mirrors the Angular onOptionSelected switch: actions vs. real workspaces.
  function handleAction(action: string) {
    setOpen(false);
    switch (action) {
      case WORKSPACE_ACTIONS.ADD_WORKSPACE:
        setDialogOpen(true);
        break;
      case WORKSPACE_ACTIONS.EDIT_PROFILE:
        onEditProfile?.();
        break;
      case WORKSPACE_ACTIONS.LOGOUT:
        onLogOut?.();
        break;
    }
  }

  function handleCreate() {
    const name = newWorkspace.trim();
    if (!name || name.length > wsNameMaxLength || isCreating) return;
    setIsCreating(true);
    onCreateWorkspace?.(name);
    // Prototype: no async backend — reset and close immediately.
    setIsCreating(false);
    setNewWorkspace("");
    setDialogOpen(false);
  }

  const createDisabled =
    !newWorkspace.trim() ||
    newWorkspace.trim().length > wsNameMaxLength ||
    isCreating;

  // Portal combobox trigger = the SELECT trigger (hlm-select-trigger) anatomy.
  // Placeholder text -> muted-foreground; error -> destructive border/text/ring
  // (handled by the variant).
  const triggerClasses = cn(
    selectTriggerVariants({ size: "default", error }),
    showPlaceholder && "text-muted-foreground"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      ) : null}

      {readonly ? (
        // Readonly trigger: portal renders the same outline button with no
        // popover trigger.
        <button
          type="button"
          disabled={triggerDisabled}
          aria-haspopup="listbox"
          aria-expanded={false}
          className={cn(triggerClasses, "pointer-events-none")}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <span className="truncate">{triggerLabel}</span>
          </span>
          <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              disabled={triggerDisabled}
              className={triggerClasses}
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                {loading ? (
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                ) : null}
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
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>
                  {hasWorkspaces ? noSearchResultsText : noWorkspacesText}
                </CommandEmpty>

                <CommandGroup>
                  {workspaces.map((ws) => (
                    <CommandItem
                      key={ws.value}
                      value={ws.label}
                      onSelect={() => selectWorkspace(ws.value)}
                    >
                      <span className="truncate flex-1 min-w-0 text-left">
                        {ws.label}
                      </span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === ws.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  {!hideAddWorkspace ? (
                    <CommandItem
                      value="Add workspace"
                      onSelect={() =>
                        handleAction(WORKSPACE_ACTIONS.ADD_WORKSPACE)
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add workspace
                    </CommandItem>
                  ) : null}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup>
                  <CommandItem
                    value="Edit profile"
                    onSelect={() =>
                      handleAction(WORKSPACE_ACTIONS.EDIT_PROFILE)
                    }
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit profile
                  </CommandItem>
                  <CommandItem
                    value="Log out"
                    onSelect={() => handleAction(WORKSPACE_ACTIONS.LOGOUT)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Create a new workspace dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setNewWorkspace("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="create-ws-input" className="text-gray-700">
                  New Workspace Name
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Name length info"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Max length is {wsNameMaxLength} characters
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="create-ws-input"
                value={newWorkspace}
                maxLength={wsNameMaxLength}
                placeholder="Add a name for your new workspace"
                onChange={(e) => setNewWorkspace(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </div>
          </div>

          <DialogFooter>
            {/* Portal create button: wordly-button variant="primary" size default. */}
            <button
              type="button"
              onClick={handleCreate}
              disabled={createDisabled}
              aria-busy={isCreating}
              className={workspaceButtonVariants({
                variant: "primary",
                size: "default",
              })}
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {createButtonText}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
