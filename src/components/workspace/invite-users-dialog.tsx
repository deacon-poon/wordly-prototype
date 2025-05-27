"use client";

import { useState, useEffect, useRef } from "react";
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
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate avatar color based on email
  const getAvatarColor = (email: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
    ];
    const index =
      Math.abs(
        email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % colors.length;
    return colors[index];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search Input */}
          <div className="space-y-3">
            <div className="relative">
              <Command
                className="border rounded-md overflow-visible"
                ref={commandRef}
              >
                <CommandInput
                  id="user-search"
                  placeholder="Add emails or people"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-b focus:ring-0 h-10 pl-3"
                  icon={<Search className="h-4 w-4 text-gray-500 mr-2" />}
                  onFocus={() => setIsInputFocused(true)}
                  ref={inputRef}
                />
                {isInputFocused && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <CommandList className="max-h-[240px]">
                      {filteredUsers.length === 0 && searchQuery.trim() && (
                        <div>
                          {isValidEmail(searchQuery) ? (
                            <div
                              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                addNewEmail(searchQuery);
                                setIsInputFocused(false);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    <Mail className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {searchQuery}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Keep typing to invite email
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                GUEST
                              </Badge>
                            </div>
                          ) : (
                            <CommandEmpty className="py-3">
                              {searchQuery.includes("@")
                                ? "Please enter a valid email address"
                                : "No users found. Type an email address to invite"}
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
                                  "flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-gray-50 text-gray-900",
                                  isSelected && "bg-blue-50"
                                )}
                                onClick={() => {
                                  addUser(user);
                                  setIsInputFocused(false);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={user.avatarUrl || ""} />
                                      <AvatarFallback
                                        className={getAvatarColor(user.email)}
                                      >
                                        {getInitials(user.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {isSelected && (
                                      <div className="absolute -bottom-1 -right-1 bg-brand-teal text-white rounded-full flex items-center justify-center w-4 h-4 border border-white">
                                        <Check className="h-3 w-3" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {user.email}
                                    </span>
                                  </div>
                                </div>
                                {!isSelected && (
                                  <span className="text-xs text-gray-500">
                                    Select user
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </div>
                )}
              </Command>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>Search for users or type an email address to invite</div>
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

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mt-6">
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

              <div className="border rounded-md divide-y">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between py-2 px-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          {user.isExisting ? (
                            <>
                              <AvatarImage src="" />
                              <AvatarFallback
                                className={getAvatarColor(user.email)}
                              >
                                {getInitials(user.name || "")}
                              </AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Mail className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-brand-teal text-white rounded-full flex items-center justify-center w-4 h-4 border border-white">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {user.name || user.email}
                        </span>
                        {user.name && (
                          <span className="text-xs text-gray-500">
                            {user.email}
                          </span>
                        )}
                        {!user.isExisting && (
                          <span className="text-xs text-blue-600">
                            Will be invited
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded ${getRoleColor(user.role)}`}
                          >
                            <span className="flex items-center text-xs">
                              {getRoleIcon(user.role)}
                              <span className="ml-1 mr-1">{user.role}</span>
                              <ChevronDown className="h-3 w-3" />
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

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => removeUser(user.email)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-start mt-6 border-t pt-4">
          <Button
            variant="default"
            onClick={handleInvite}
            disabled={!isValidInvite || isSubmitting}
            className="bg-brand-teal hover:bg-brand-teal/90 mr-2"
          >
            {isSubmitting
              ? "Inviting..."
              : `Invite ${
                  selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""
                }`}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
