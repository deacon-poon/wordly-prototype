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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X, Check, Search, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedTab, setSelectedTab] = useState<"existing" | "new">(
    "existing"
  );
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [newUserEmails, setNewUserEmails] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Default description if none provided
  const defaultDescription = `Invited users will be given access to the currently-selected ${contextType} (${contextName}).`;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setNewUserEmails("");
      setSelectedRole(defaultRole);
      setSearchQuery("");
      setSelectedTab("existing");
    }
  }, [open, defaultRole]);

  const handleInvite = async () => {
    try {
      setIsSubmitting(true);
      await onInvite(selectedUsers, selectedRole);
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
        },
      ]);
      setSearchQuery("");
    }
  };

  const removeUser = (email: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.email !== email));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded-md mb-3">
              {selectedUsers.map((user) => (
                <div
                  key={user.email}
                  className={`flex items-center px-2 py-1 rounded-md text-sm ${
                    user.isExisting ? "bg-gray-100" : "bg-blue-50"
                  }`}
                >
                  {user.isExisting ? (
                    user.name || user.email
                  ) : (
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeUser(user.email)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Unified Search */}
          <Command className="border rounded-md overflow-visible">
            <CommandInput
              placeholder="Search existing users or enter email to invite..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0"
              icon={<Search className="h-4 w-4" />}
            />
            <CommandList>
              {filteredUsers.length === 0 && searchQuery.trim() && (
                <div className="p-2">
                  {isValidEmail(searchQuery) ? (
                    <div className="py-3 px-2">
                      <p className="text-sm mb-2">
                        No matching users. Invite by email?
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addNewEmail(searchQuery)}
                        className="w-full justify-start"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Invite {searchQuery}
                      </Button>
                    </div>
                  ) : (
                    <CommandEmpty>
                      {searchQuery.includes("@")
                        ? "Please enter a valid email address."
                        : "No users found. Try typing an email address to invite."}
                    </CommandEmpty>
                  )}
                </div>
              )}

              {filteredUsers.length > 0 && (
                <CommandGroup heading="Existing Users">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.email}
                      onSelect={() => addUser(user)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer p-2",
                        selectedUsers.some(
                          (selected) => selected.email === user.email
                        ) && "bg-gray-100"
                      )}
                    >
                      {selectedUsers.some(
                        (selected) => selected.email === user.email
                      ) ? (
                        <Check className="h-4 w-4 text-brand-teal" />
                      ) : (
                        <div className="w-4" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          <p className="text-xs text-gray-500 mt-1">
            Search for existing users or enter email addresses to invite new
            users.
          </p>
        </div>

        <div className="space-y-2 mt-6">
          <Label>Role:</Label>
          <RadioGroup
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as UserRole)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Viewer" id="viewer" />
              <Label htmlFor="viewer">Viewer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Editor" id="editor" />
              <Label htmlFor="editor">Editor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Administrator" id="admin" />
              <Label htmlFor="admin">Administrator</Label>
            </div>
          </RadioGroup>
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
            {isSubmitting ? "Inviting..." : "Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
