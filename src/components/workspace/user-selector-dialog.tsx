"use client";

/**
 * UserSelectorDialog
 *
 * EXACT React mirror of the production Angular `wordly-user-selector-dialog`
 *   wordly_portal:
 *     libs/components/business/wordly-user-selector-dialog/
 *       wordly-user-selector-dialog.component.{ts,html}
 *
 * The Angular original opens a dialog with a debounced, service-backed user
 * search. Results render in an *absolutely-positioned dropdown* below the
 * search input (shown on focus / while a query exists, hidden on blur);
 * selecting a user appends it to a scrollable "Selected Users" list, and the
 * accumulated list is emitted on confirm. This port keeps the same public
 * surface (configurable copy, optional max-users cap, excluded users,
 * multi-select with removable rows, searching / no-results states) and mirrors
 * the Angular template's DOM/layout/Tailwind classes 1:1.
 *
 * Deviations from the Angular source (see RETURN notes):
 *   - The Angular DI/service search layer (BrnDialogRef + bridge stream) is
 *     dropped: the directory arrives via props and search is filtered
 *     client-side, behind the same isSearching / hasSearched / showResults
 *     state machine + a 300ms debounce (Angular's debounceTime(300)).
 *   - Angular renders avatars as <img src="assets/v2/user-generic-avatar*.svg">.
 *     Those assets do not exist in this repo, so we substitute the shared
 *     <Avatar>/<AvatarFallback> atom inside the same DOM/classes (w-8 h-8
 *     rounded-full). The no-results illustration likewise uses the atom.
 *
 * Built on the shared shadcn primitives (Dialog + Input + Avatar) and
 * lucide-react icons.
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

  /** Label on the trigger button that opens the dialog (Angular @Input buttonText). */
  buttonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  searchPlaceholder?: string;
  selectedUsersText?: string;
  addButtonText?: string;
  cancelButtonText?: string;
  noUserFoundText?: string;
  tryAgainText?: string;

  /** id forwarded to the search input (Angular @Input({required:true}) id). */
  id?: string;

  /** Maximum number of users that can be selected (optional, no cap when unset). */
  maxUsers?: number;
  /** Users to exclude from selection (rendered disabled in results). */
  excludedUsers?: UserSelectorOption[];

  /** Fired with the chosen users when the dialog is confirmed (Angular usersSelected). */
  onUsersSelected?: (users: UserSelectorOption[]) => void;

  /** Controlled open state for the dialog (optional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

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
  id = "user-selector-search",
  maxUsers,
  excludedUsers = [],
  onUsersSelected,
  open,
  onOpenChange,
  className,
}: UserSelectorDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  // ===== STATE MANAGEMENT (mirrors the Angular component fields) =====
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    UserSelectorOption[]
  >([]);
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserSelectorOption[]
  >([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // resetSearchState()
  const resetSearchState = React.useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    setShowResults(false);
    setHasSearched(false);
  }, []);

  function setDialogOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (next) {
      // openDialog(): reset search state when opening.
      resetSearchState();
    } else {
      // resetDialogState(): clear search + selected users on close.
      resetSearchState();
      setSelectedUsers([]);
    }
  }

  // setupSearchStream(): client-side stand-in for the debounced bridge stream.
  // onSearchInput() → debounce 300ms → produce results, flip the same flags.
  function onSearchInput(value: string) {
    setSearchTerm(value);
    setHasSearched(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length === 0) {
      setIsSearching(false);
      setShowResults(false);
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const query = value.trim().toLowerCase();
    debounceRef.current = setTimeout(() => {
      const results = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setIsSearching(false);
      setHasSearched(true);
      setShowResults(value.trim().length > 0);
    }, 300);
  }

  function onInputFocus() {
    if (blurRef.current) clearTimeout(blurRef.current);
    // Show results if there's a search term and we have results.
    if (searchTerm.trim().length > 0 && searchResults.length > 0) {
      setShowResults(true);
    }
  }

  function onInputBlur() {
    // Delay hiding to allow clicking on a result.
    blurRef.current = setTimeout(() => setShowResults(false), 150);
  }

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurRef.current) clearTimeout(blurRef.current);
    };
  }, []);

  // ===== COMPUTED PROPERTIES (mirror the Angular getters) =====
  const hasResults = hasSearched && searchResults.length > 0;
  const hasNoResults =
    hasSearched && searchResults.length === 0 && searchTerm.trim().length > 0;

  function isUserSelected(userId: string): boolean {
    return [...selectedUsers, ...(excludedUsers ?? [])].some(
      (u) => u.id === userId
    );
  }

  // selectUser(): add if not already selected. Keep results visible to allow
  // selecting more users (don't hide). Angular does NOT enforce maxUsers here.
  function selectUser(user: UserSelectorOption) {
    if (isUserSelected(user.id)) return;
    setSelectedUsers((prev) => [...prev, { ...user }]);
  }

  function removeUser(userId: string, event?: React.MouseEvent) {
    if (event) event.stopPropagation();
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  // get isAddButtonDisabled
  const isAddButtonDisabled =
    selectedUsers.length === 0 ||
    (maxUsers !== undefined && selectedUsers.length > maxUsers);

  // get addButtonLabel
  const addButtonLabel =
    selectedUsers.length === 0
      ? addButtonText
      : `${addButtonText} (${selectedUsers.length})`;

  // addSelectedUsers(): emit and close.
  function addSelectedUsers() {
    if (selectedUsers.length === 0) return;
    onUsersSelected?.([...selectedUsers]);
    setDialogOpen(false);
  }

  // cancelSelection() → onModalClosed() → closeDialog()
  function cancelSelection() {
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* Trigger Button */}
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

      {/* Modal Dialog — contentClass mirrors the Angular [contentClass] */}
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] min-h-[300px] overflow-y-visible">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 relative">
          {/* Search Input (app-wordly-input, showLeadingIcon lucideSearch) */}
          <div className="search-container relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none h-4 w-4" />
              <Input
                id={id}
                value={searchTerm}
                onChange={(e) => onSearchInput(e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                placeholder={searchPlaceholder}
                className="pl-10"
                aria-label={searchPlaceholder}
              />
            </div>
          </div>

          {/* Loading State */}
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          ) : null}

          {/* Search Results — absolutely-positioned dropdown */}
          {showResults && !isSearching ? (
            <div className="absolute left-0 right-0 z-10">
              <div className="w-full bg-card border p-6 rounded-xl shadow-sm text-card-foreground">
                {hasResults ? (
                  <div className="max-h-[250px] overflow-y-auto">
                    {searchResults.map((user) => {
                      const disabled = isUserSelected(user.id);
                      return (
                        <button
                          key={user.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => selectUser(user)}
                          aria-label={`Select user ${user.name}`}
                          className={cn(
                            "mb-4 w-full cursor-pointer text-left border-0 bg-transparent p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current",
                            disabled && "userDisabled"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            {/* User Icon */}
                            <div className="flex-shrink-0">
                              <Avatar className="w-8 h-8 rounded-full">
                                <AvatarFallback>
                                  {initials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {/* No Results State */}
                {hasNoResults ? (
                  <div className="w-full">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Avatar className="w-12 h-12 rounded-full opacity-50 mb-2">
                        <AvatarFallback aria-label="No users found">
                          <Search className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {noUserFoundText}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tryAgainText}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Selected Users List */}
          {selectedUsers.length > 0 ? (
            <div className="selected-users">
              <h4 className="text-sm font-medium text-foreground mb-3">
                {selectedUsersText}
              </h4>
              <div className="max-h-[150px] overflow-y-auto border-regular border border-input rounded-md">
                {selectedUsers.map((user, i) => {
                  const last = i === selectedUsers.length - 1;
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "selected-user-item p-3",
                        !last && "border-b border-border"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* User Icon */}
                          <Avatar className="w-8 h-8 rounded-full">
                            <AvatarFallback>
                              {initials(user.name)}
                            </AvatarFallback>
                          </Avatar>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="remove-user-btn ml-2 shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          onClick={(e) => removeUser(user.id, e)}
                          aria-label={`Remove ${user.name}`}
                          title={`Remove ${user.name}`}
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Remove {user.name}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Dialog Actions */}
        <DialogFooter>
          <Button
            type="button"
            className={cn(
              dialogButtonVariants({ variant: "outline", size: "default" })
            )}
            onClick={cancelSelection}
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
