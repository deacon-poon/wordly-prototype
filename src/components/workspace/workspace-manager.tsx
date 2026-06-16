"use client";

/**
 * WorkspaceManager
 *
 * EXACT React mirror of the production Angular `wordly-workspace-manager`
 *   wordly_portal:
 *     libs/components/business/wordly-workspace-manager/
 *       wordly-workspace-manager.component.{ts,html}
 *
 * The Angular original is a business component that wraps the core
 * `app-wordly-combobox` (libs/components/core/combobox): it lists the user's
 * workspaces, appends an "Add workspace" action plus a user menu
 * (Edit profile / Log out), and opens a "Create New Workspace" dialog with a
 * name input (max 50 chars, with an info tooltip).
 *
 * This mirrors the combobox template (wordly-combobox.component.html) 1:1:
 *   - Wrapped in the shared FormControlWrapper (label / required / helper /
 *     error / layout) — exactly like the Angular combobox, which renders inside
 *     `app-wordly-form-control-wrapper`.
 *   - The trigger is the `hlmBtn variant="outline"` anatomy:
 *     `w-full justify-between font-normal`, placeholder via the
 *     `.wordly-combobox-placeholder` rule (muted-foreground when no selection),
 *     `border-destructive` on error, with a trailing `lucideChevronsUpDown`
 *     icon (`opacity-50 flex-shrink-0`).
 *   - The popover content is a Command list: a search input, an empty state, the
 *     workspace options group (with "Add workspace" appended) + a separator,
 *     then the user-menu group (Edit profile / Log out). Each item renders an
 *     optional leading icon, a `truncate flex-1 min-w-0 text-left` label, and a
 *     trailing `lucideCheck` (`ml-auto`, `opacity-0` when not the current value).
 *
 * The Angular DI/service layer (bridge + data services, translation, form
 * builder) is dropped: data arrives via props, defaulting to mock data; in
 * production these workspaces would be fetched from the workspaces API.
 *
 * Grouping mirrors `WordlyWorkspaceDataService.generateWorkspaceManagerData`:
 *   group 1 = [...workspaces, addWorkspace?] (showSeparator)
 *   group 2 = [editProfile, logOut]
 */

import * as React from "react";
import { Check, ChevronsUpDown, LogOut, Plus, UserCog } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";

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

/** Reserved action values, mirroring the Angular workspace.constants. */
export const WORKSPACE_ACTIONS = {
  ADD_WORKSPACE: "addWorkspace",
  EDIT_PROFILE: "editProfile",
  LOGOUT: "logOut",
} as const;

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the workspaces API. Mirrors the
// shape used by the portal Overview story (bridge service mock).
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
  /** Combobox label (Angular: workspaceManagerLabel, default "Workspace Manager"). */
  label?: string;
  /**
   * Create-dialog description (Angular: dialogDescription, default
   * "New Workspace Name").
   *
   * Note: the Angular `computedDialogTitle` is hardcoded to the translation
   * "Create New Workspace" and IGNORES the `dialogTitle` @Input, so the dialog
   * title is fixed here too (mirrored 1:1).
   */
  dialogDescription?: string;
  /** Create-dialog submit button text (Angular: createButtonText, default "Create"). */
  createButtonText?: string;
  /** Max length for the new workspace name (Angular: wsNameMaxLength, default 50). */
  wsNameMaxLength?: number;

  /** Combobox placeholder (Angular: searchPlaceholder). */
  searchPlaceholder?: string;
  disabled?: boolean;
  /** Render the trigger as read-only (Angular combobox readonly): no popover. */
  readonly?: boolean;
  /** Error/invalid state (Angular combobox displayError → border-destructive). */
  error?: boolean;

  noWorkspacesText?: string;

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
  dialogDescription = "New Workspace Name",
  createButtonText = "Create",
  wsNameMaxLength = 50,
  searchPlaceholder = "Search all workspaces",
  disabled = false,
  readonly = false,
  error = false,
  noWorkspacesText = "No results found",
  className,
}: WorkspaceManagerProps) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newWorkspace, setNewWorkspace] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const selected = workspaces.find((w) => w.value === value);
  const triggerLabel = selected?.label ?? searchPlaceholder;

  // `.wordly-combobox-placeholder`: no selection → muted-foreground text.
  const showPlaceholder = !selected;

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

  // Mirrors onCreateWorkspace(): trim, validate (required + maxLength), emit.
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

  // Combobox trigger = `hlmBtn variant="outline"` with `w-full justify-between
  // font-normal`, muted-foreground placeholder, border-destructive on error.
  const trigger = (
    <Button
      type="button"
      variant="outline"
      role={readonly ? undefined : "combobox"}
      aria-haspopup="listbox"
      aria-expanded={readonly ? false : open}
      disabled={disabled}
      className={cn(
        "w-full justify-between font-normal",
        showPlaceholder && "text-muted-foreground",
        error && "border-destructive",
        readonly && "pointer-events-none"
      )}
    >
      <span className="truncate mr-2">{triggerLabel}</span>
      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
    </Button>
  );

  return (
    <FormControlWrapper label={label} showError={false} className={className}>
      {readonly ? (
        trigger
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{noWorkspacesText}</CommandEmpty>

                {/* Group 1: workspace options (+ "Add workspace") — showSeparator */}
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
                      <Plus className="h-4 w-4" />
                      <span className="truncate flex-1 min-w-0 text-left">
                        Add workspace
                      </span>
                      <Check className="ml-auto h-4 w-4 opacity-0" />
                    </CommandItem>
                  ) : null}
                </CommandGroup>

                <CommandSeparator />

                {/* Group 2: user menu (Edit profile / Log out) */}
                <CommandGroup>
                  <CommandItem
                    value="Edit profile"
                    onSelect={() =>
                      handleAction(WORKSPACE_ACTIONS.EDIT_PROFILE)
                    }
                  >
                    <UserCog className="h-4 w-4" />
                    <span className="truncate flex-1 min-w-0 text-left">
                      Edit profile
                    </span>
                    <Check className="ml-auto h-4 w-4 opacity-0" />
                  </CommandItem>
                  <CommandItem
                    value="Log out"
                    onSelect={() => handleAction(WORKSPACE_ACTIONS.LOGOUT)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="truncate flex-1 min-w-0 text-left">
                      Log out
                    </span>
                    <Check className="ml-auto h-4 w-4 opacity-0" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Create a new workspace dialog (app-wordly-dialog) */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setNewWorkspace("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 min-w-[170px] md:min-w-[400px]">
            {/* app-wordly-input, stacked layout, with info tooltip */}
            <FormControlWrapper
              controlId="create-ws-input"
              label="New Workspace Name"
              layoutVariant="stacked"
              labelContextVariant="stacked"
              contentContextVariant="stacked"
              helperTextContextVariant="stacked"
              errorContextVariant="stacked"
              showInfoIcon
              infoTooltipText={`Max length is ${wsNameMaxLength} characters`}
            >
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
            </FormControlWrapper>
          </div>

          <DialogFooter>
            {/* app-wordly-button variant="primary" (portal teal → Brand Blue). */}
            <Button
              type="button"
              variant="default"
              onClick={handleCreate}
              disabled={createDisabled}
              aria-busy={isCreating}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCreate();
              }}
            >
              {createButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormControlWrapper>
  );
}
