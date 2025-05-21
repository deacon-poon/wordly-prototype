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

      // Process emails from the text input if on the new tab
      if (selectedTab === "new" && newUserEmails.trim()) {
        const emails = newUserEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email && /^\S+@\S+\.\S+$/.test(email));

        // Add new email addresses
        const newUsers = emails.map((email) => ({
          email,
          isExisting: false,
        }));

        // Add to the selection
        const updatedUsers = [...selectedUsers];
        newUsers.forEach((newUser) => {
          if (!updatedUsers.some((u) => u.email === newUser.email)) {
            updatedUsers.push(newUser);
          }
        });

        await onInvite(updatedUsers, selectedRole);
      } else {
        // Just send the already selected users
        await onInvite(selectedUsers, selectedRole);
      }

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

  const handleNewEmailsChange = (value: string) => {
    setNewUserEmails(value);
  };

  const isValidInvite =
    selectedTab === "existing"
      ? selectedUsers.length > 0
      : newUserEmails.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="existing"
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as "existing" | "new")}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="existing">Select Existing Users</TabsTrigger>
            <TabsTrigger value="new">Invite New Users</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border rounded-md mb-3">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-sm"
                  >
                    {user.name || user.email}
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

            {/* User Search */}
            <Command className="border rounded-md overflow-visible">
              <CommandInput
                placeholder="Search users..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-none focus:ring-0"
                icon={<Search className="h-4 w-4" />}
              />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup heading="Available Users">
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
              </CommandList>
            </Command>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Email(s):</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="emails"
                  value={newUserEmails}
                  onChange={(e) => handleNewEmailsChange(e.target.value)}
                  placeholder="user@example.com, another@example.com"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                You can specify multiple emails separated by commas.
              </p>
            </div>
          </TabsContent>
        </Tabs>

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
