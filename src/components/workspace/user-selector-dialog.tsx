"use client";

/**
 * UserSelectorDialog
 *
 * React migration of the production Angular `wordly-user-selector-dialog`
 * (wordly_portal: libs/components/business/wordly-user-selector-dialog).
 *
 * The Angular original opens a dialog with a debounced, service-backed user
 * search; selected users accumulate in a list and are emitted on confirm. Here
 * we keep the same public surface (configurable copy, optional max-users cap,
 * excluded users, multi-select with removable rows, searching/empty states) but
 * drop the Angular DI/service layer (BrnDialogRef + bridge search stream):
 * the user directory arrives via props and search is filtered client-side.
 *
 * Built on the shared shadcn primitives (Dialog + Input + Avatar + Badge) and
 * lucide-react icons. In production the directory would be fetched from the API.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Button anatomy — 1:1 with the portal core button (wordly-button.component.scss)
//
// The Angular dialog renders its trigger/footer with <app-wordly-button>, whose
// SCSS defines the canonical sizing + per-variant/state colors. We reproduce
// that anatomy here as a CVA so the React dialog matches the portal exactly,
// then apply it via the shared <Button>'s className (keeping the shared atom).
//
// Token mapping (portal -> our tokens; primary stays Brand Blue, NOT teal):
//   teal-500 (portal primary)      -> primary / primary-foreground (Brand Blue)
//   teal-50 / teal-100 (hovers)    -> primary-blue-50 / primary-blue-100
//   navy-50/700/100/200 (secondary)-> secondary-navy-50/700/100/200
//   red-600/700/800 (destructive)  -> destructive / error-700 / error-800
//   gray-200/500/800/100           -> gray-200/500/800/100
//   border-radius 6px              -> rounded-md ; bold(600) -> font-semibold
// ---------------------------------------------------------------------------

const dialogButtonVariants = cva(
  // base: portal `button` rule — inline-flex center, weight 500, radius 6px,
  // transition-all 0.2s, focus ring for a11y (portal relies on browser default).
  cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium",
    "transition-all duration-200 ease-in-out",
    // Portal control focus: 3px ring + border-ring, NO offset (matches hlm-* controls).
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    // portal disabled: gray-100 bg, gray-500 text, opacity-50, no pointer events
    "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        // primary: portal teal-500/600/700 -> Brand Blue primary
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-blue-600 active:bg-primary-blue-700",
        // secondary: navy-50 bg / navy-700 text, hover navy-100, active navy-200
        secondary:
          "bg-secondary-navy-50 text-secondary-navy-700 hover:bg-secondary-navy-100 active:bg-secondary-navy-200",
        // destructive: red-600/700/800
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-error-700 active:bg-error-800",
        // outline: white bg, gray-800 text, gray-200 border; hover Brand Blue 50
        outline:
          "bg-white text-gray-800 border border-gray-200 hover:bg-primary-blue-50 active:bg-primary-blue-100",
        // icon: fixed 38x38, gray-200 border, hover Brand Blue 50 (size handled below)
        icon: "border border-gray-200 hover:bg-primary-blue-50 active:bg-primary-blue-100",
      },
      size: {
        // portal size-sm: min-h 36, px-12 py-8, 14/20
        sm: "h-auto min-h-9 px-3 py-2 text-sm leading-5",
        // portal size-default: min-h 38, px-16 py-8, 16/22
        default: "h-auto min-h-[38px] px-4 py-2 text-base leading-[22px]",
        // portal size-lg: min-h 44, px-32 py-10, 16/24
        lg: "h-auto min-h-11 px-8 py-2.5 text-base leading-6",
        // portal size-block: full width default
        block: "h-auto w-full min-h-[38px] px-4 py-2 text-base leading-[22px]",
        // portal icon variants: fixed 38x38, no padding
        icon: "h-[38px] w-[38px] min-h-[38px] min-w-[38px] p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export { dialogButtonVariants };

export type DialogButtonVariant = NonNullable<
  VariantProps<typeof dialogButtonVariants>["variant"]
>;
export type DialogButtonSize = NonNullable<
  VariantProps<typeof dialogButtonVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular UserSelectorOption / realmUser model)
// ---------------------------------------------------------------------------

export interface UserSelectorOption {
  id: string;
  name: string;
  email: string;
  /** Optional personal-workspace id carried through from the realm user. */
  personalWorkspaceId?: string;
  avatar?: string;
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the users/realm directory API
// ---------------------------------------------------------------------------

export const MOCK_USERS: UserSelectorOption[] = [
  { id: "u-avery", name: "Avery Chen", email: "avery.chen@acme.com" },
  { id: "u-jordan", name: "Jordan Patel", email: "jordan.patel@acme.com" },
  { id: "u-sam", name: "Sam Rivera", email: "sam.rivera@acme.com" },
  { id: "u-morgan", name: "Morgan Lee", email: "morgan.lee@northwind.com" },
  { id: "u-taylor", name: "Taylor Brooks", email: "taylor.brooks@contoso.com" },
  { id: "u-jamie", name: "Jamie Fox", email: "jamie.fox@fabrikam.com" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface UserSelectorDialogProps {
  /** The searchable user directory. */
  users?: UserSelectorOption[];

  /** Label on the trigger button that opens the dialog. */
  buttonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  searchPlaceholder?: string;
  selectedUsersText?: string;
  addButtonText?: string;
  cancelButtonText?: string;
  noUserFoundText?: string;
  tryAgainText?: string;

  /** Maximum number of users that can be selected (optional, no cap when unset). */
  maxUsers?: number;
  /** Users to exclude from selection (rendered disabled in results). */
  excludedUsers?: UserSelectorOption[];

  /** Fired with the chosen users when the dialog is confirmed. */
  onUsersSelected?: (users: UserSelectorOption[]) => void;

  /** Controlled open state for the dialog (optional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Simulate the service search latency / spinner. */
  loading?: boolean;

  className?: string;
}

export function UserSelectorDialog({
  users = MOCK_USERS,
  buttonText = "Select Users",
  dialogTitle = "Add Users",
  dialogDescription = "Added users will be given access to the currently-selected workspace",
  searchPlaceholder = "Search users...",
  selectedUsersText = "Selected Users",
  addButtonText = "Add Users",
  cancelButtonText = "Cancel",
  noUserFoundText = "No users found",
  tryAgainText = "Try searching for a different name or check the user list..",
  maxUsers,
  excludedUsers = [],
  onUsersSelected,
  open,
  onOpenChange,
  loading = false,
  className,
}: UserSelectorDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserSelectorOption[]
  >([]);

  function setDialogOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      // Reset all dialog state on close (mirrors resetDialogState()).
      setSearchTerm("");
      setSelectedUsers([]);
    }
  }

  const query = searchTerm.trim().toLowerCase();
  const hasSearched = query.length > 0;

  const searchResults = React.useMemo(() => {
    if (!hasSearched) return [];
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }, [users, query, hasSearched]);

  const hasNoResults = hasSearched && !loading && searchResults.length === 0;
  const hasReachedMaxUsers =
    maxUsers !== undefined && selectedUsers.length >= maxUsers;

  function isUserSelected(userId: string): boolean {
    return [...selectedUsers, ...excludedUsers].some((u) => u.id === userId);
  }

  function selectUser(user: UserSelectorOption) {
    if (isUserSelected(user.id) || hasReachedMaxUsers) return;
    setSelectedUsers((prev) => [...prev, { ...user }]);
  }

  function removeUser(userId: string) {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  const isAddButtonDisabled =
    selectedUsers.length === 0 ||
    (maxUsers !== undefined && selectedUsers.length > maxUsers);

  const addButtonLabel =
    selectedUsers.length === 0
      ? addButtonText
      : `${addButtonText} (${selectedUsers.length})`;

  function addSelectedUsers() {
    if (selectedUsers.length === 0) return;
    onUsersSelected?.([...selectedUsers]);
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={cn(
            dialogButtonVariants({ variant: "primary", size: "default" }),
            className
          )}
        >
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10"
              aria-label={searchPlaceholder}
            />
          </div>

          {/* Loading State */}
          {hasSearched && loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary" />
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          ) : null}

          {/* Search Results */}
          {hasSearched && !loading && searchResults.length > 0 ? (
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs">
              <div className="max-h-[250px] overflow-y-auto">
                {searchResults.map((user) => {
                  // Mirrors Angular: a row is disabled only when the user is
                  // already selected/excluded. The max-users cap is enforced in
                  // selectUser(), not by greying out every remaining row.
                  const disabled = isUserSelected(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectUser(user)}
                      aria-label={`Select user ${user.name}`}
                      className={cn(
                        "mb-4 flex w-full items-center gap-3 rounded border-0 bg-transparent p-2 text-left transition-colors duration-150 ease-in-out last:mb-0",
                        "hover:bg-accent hover:text-accent-foreground",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current"
                      )}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* No Results State */}
          {hasNoResults ? (
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-xs">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mb-1 text-sm font-medium text-foreground">
                  {noUserFoundText}
                </p>
                <p className="text-sm text-muted-foreground">{tryAgainText}</p>
              </div>
            </div>
          ) : null}

          {/* Selected Users List */}
          {selectedUsers.length > 0 ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  {selectedUsersText}
                </h4>
                {maxUsers !== undefined ? (
                  <span className="text-xs text-muted-foreground">
                    {selectedUsers.length} / {maxUsers}
                  </span>
                ) : null}
              </div>
              <div className="max-h-[150px] overflow-y-auto rounded-md border border-input">
                {selectedUsers.map((user, i) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between p-3",
                      i < selectedUsers.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      aria-label={`Remove ${user.name}`}
                      title={`Remove ${user.name}`}
                      className="ml-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {user.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            className={cn(
              dialogButtonVariants({ variant: "outline", size: "default" })
            )}
            onClick={() => setDialogOpen(false)}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            disabled={isAddButtonDisabled}
            className={cn(
              dialogButtonVariants({ variant: "primary", size: "default" })
            )}
            onClick={addSelectedUsers}
          >
            {addButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
