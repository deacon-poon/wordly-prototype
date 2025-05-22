"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  X,
  Check,
  Search,
  Mail,
  ShieldCheck,
  Edit2,
  Eye,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
export type UserRole = "Administrator" | "Editor" | "Viewer";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface SelectedUser {
  id?: string;
  email: string;
  name?: string;
  isExisting: boolean;
  role: UserRole;
}

export interface InviteUsersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contextName: string;
  contextType?: string;
  existingUsers?: UserData[];
  onInvite: (users: SelectedUser[], role: UserRole) => Promise<void>;
  defaultRole?: UserRole;
  title?: string;
  description?: string;
}

export function InviteUsersDialog({
  open,
  onOpenChange,
  contextName,
  contextType = "workspace",
  existingUsers = [],
  onInvite,
  defaultRole = "Editor",
  title = "Add New User(s)",
  description,
}: InviteUsersProps) {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [defaultUserRole, setDefaultUserRole] = useState<UserRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Default description if none provided
  const defaultDescription = `Invited users will be given access to the currently-selected ${contextType} (${contextName}).`;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setDefaultUserRole(defaultRole);
      setSearchQuery("");
    }
  }, [open, defaultRole]);

  const handleInvite = async () => {
    try {
      setIsSubmitting(true);
      // We no longer need to pass a global role as each user has their own role
      await onInvite(selectedUsers, defaultUserRole);
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error inviting users:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUser = (user: UserData) => {
    // Check if user is already selected
    if (!selectedUsers.some((selected) => selected.email === user.email)) {
      setSelectedUsers([
        ...selectedUsers,
        {
          id: user.id,
          email: user.email,
          name: user.name,
          isExisting: true,
          role: defaultUserRole,
        },
      ]);
    }
    setSearchQuery("");
  };

  const addNewEmail = (email: string) => {
    if (
      !selectedUsers.some((user) => user.email === email) &&
      /^\S+@\S+\.\S+$/.test(email)
    ) {
      setSelectedUsers([
        ...selectedUsers,
        {
          email,
          isExisting: false,
          role: defaultUserRole,
        },
      ]);
      setSearchQuery("");
    }
  };

  const removeUser = (email: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.email !== email));
  };

  const updateUserRole = (email: string, role: UserRole) => {
    setSelectedUsers(
      selectedUsers.map((user) =>
        user.email === email ? { ...user, role } : user
      )
    );
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Administrator":
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case "Editor":
        return <Edit2 className="h-3.5 w-3.5" />;
      case "Viewer":
        return <Eye className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Editor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Viewer":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredUsers = existingUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const isValidEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const isValidInvite = selectedUsers.length > 0;

  const applyRoleToAll = (role: UserRole) => {
    setSelectedUsers(selectedUsers.map((user) => ({ ...user, role })));
    // Also update the default role for new additions
    setDefaultUserRole(role);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {selectedUsers.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Selected Users</div>
                {selectedUsers.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <span>Set All Roles</span>
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => applyRoleToAll("Administrator")}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => applyRoleToAll("Editor")}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => applyRoleToAll("Viewer")}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Viewer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className={`flex items-center px-2 py-1 rounded-md text-sm ${
                      user.isExisting
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    {user.isExisting ? (
                      <span className="mr-1">{user.name || user.email}</span>
                    ) : (
                      <span className="flex items-center mr-1">
                        <Mail className="h-3 w-3 mr-1 text-blue-500" />
                        {user.email}
                      </span>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-5 px-1.5 ml-1 rounded ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <span className="flex items-center text-xs">
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role}</span>
                            <ChevronDown className="ml-0.5 h-2.5 w-2.5" />
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() =>
                            updateUserRole(user.email, "Administrator")
                          }
                          className={
                            user.role === "Administrator" ? "bg-gray-100" : ""
                          }
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateUserRole(user.email, "Editor")}
                          className={
                            user.role === "Editor" ? "bg-gray-100" : ""
                          }
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateUserRole(user.email, "Viewer")}
                          className={
                            user.role === "Viewer" ? "bg-gray-100" : ""
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Viewer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                      type="button"
                      onClick={() => removeUser(user.email)}
                      className="ml-1 text-gray-400 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="user-search" className="text-sm font-medium">
              Add Users
            </Label>
            <div className="relative">
              <Command className="border rounded-md overflow-visible">
                <CommandInput
                  id="user-search"
                  placeholder="Search users or type an email to invite"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-b focus:ring-0 h-10 pl-3"
                  icon={<Search className="h-4 w-4 text-gray-500 mr-2" />}
                />
                <CommandList className="max-h-[240px]">
                  {filteredUsers.length === 0 && searchQuery.trim() && (
                    <div className="p-2">
                      {isValidEmail(searchQuery) ? (
                        <div className="py-2 px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addNewEmail(searchQuery)}
                            className="w-full justify-start h-9"
                          >
                            <Mail className="h-4 w-4 mr-2 text-blue-500" />
                            <span>
                              Invite{" "}
                              <span className="font-medium">{searchQuery}</span>
                            </span>
                          </Button>
                        </div>
                      ) : (
                        <CommandEmpty className="py-3">
                          {searchQuery.includes("@")
                            ? "Please enter a valid email address"
                            : "No users found. Try typing an email address to invite"}
                        </CommandEmpty>
                      )}
                    </div>
                  )}

                  {filteredUsers.length > 0 && (
                    <CommandGroup
                      heading="Users"
                      className="font-semibold text-gray-900"
                    >
                      {filteredUsers.map((user) => {
                        const isSelected = selectedUsers.some(
                          (selected) => selected.email === user.email
                        );
                        return (
                          <div
                            key={user.id}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer py-2 px-2 hover:bg-gray-50 text-gray-900",
                              isSelected && "bg-blue-50"
                            )}
                            onClick={() => addUser(user)}
                          >
                            <div className="w-4 flex-shrink-0">
                              {isSelected && (
                                <Check className="h-4 w-4 text-brand-teal" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-xs text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>
                Search for existing users or enter an email address to invite
              </div>
              <div className="flex items-center">
                <span className="mr-1">Default role:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <span className="flex items-center gap-1">
                        {getRoleIcon(defaultUserRole)}
                        {defaultUserRole}
                        <ChevronDown className="h-3 w-3" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setDefaultUserRole("Administrator")}
                      className={
                        defaultUserRole === "Administrator" ? "bg-gray-100" : ""
                      }
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDefaultUserRole("Editor")}
                      className={
                        defaultUserRole === "Editor" ? "bg-gray-100" : ""
                      }
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editor
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDefaultUserRole("Viewer")}
                      className={
                        defaultUserRole === "Viewer" ? "bg-gray-100" : ""
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Viewer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleInvite}
            disabled={!isValidInvite || isSubmitting}
            className="bg-brand-teal hover:bg-brand-teal/90"
          >
            {isSubmitting
              ? "Inviting..."
              : `Invite ${
                  selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
