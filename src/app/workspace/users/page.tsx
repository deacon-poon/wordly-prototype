"use client";

/**
 * Workspace Users — faithful port of the Angular portal
 * (wordly_portal: src/app/modules/v2/workspace-users/workspace-users.component).
 *
 * Anatomy: MainContainer with title "{workspace}'s Users", a description, an
 * "Add Users to Workspace" primary action, and a simple list of users (name +
 * email + destructive delete). No role column and no workspace-delete here —
 * those are net-new / belong to the settings danger zone.
 */

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  InviteUsersDialog,
  SelectedUser,
  UserRole,
  UserData,
} from "@/components/workspace/invite-users-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  // Retained for the Add-Users dialog default; not surfaced in the list (Angular
  // workspace-users shows no role column).
  role: UserRole;
}

// Existing org users offered in the "Add Users to Workspace" picker.
const existingOrganizationUsers: UserData[] = [
  {
    id: "101",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    role: "Editor",
  },
  {
    id: "102",
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    role: "Viewer",
  },
  {
    id: "103",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    role: "Administrator",
  },
  {
    id: "104",
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    role: "Editor",
  },
  {
    id: "105",
    name: "Aiden Patel",
    email: "aiden.patel@example.com",
    role: "Viewer",
  },
];

export default function UsersPage() {
  const workspaceName = "Main HQ";
  const usersLoaded = true;

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Aisha Patel",
      email: "aisha.patel@example.com",
      role: "Administrator",
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@example.com",
      role: "Editor",
    },
    {
      id: "3",
      name: "Jamal Johnson",
      email: "jamal.johnson@example.com",
      role: "Viewer",
    },
  ]);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const handleRemoveUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteUserDialogOpen(true);
  };

  const handleConfirmRemoveUser = async () => {
    if (!userToDelete) return;
    try {
      setIsDeletingUser(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      setUserToDelete(null);
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleInviteUsers = async (
    selectedUsers: SelectedUser[],
    role: UserRole
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newUsers: User[] = selectedUsers.map((user) => ({
      id: user.id || `new-${user.email}`,
      name: user.name || user.email.split("@")[0],
      email: user.email,
      role,
    }));
    setUsers((prev) => [...prev, ...newUsers]);
  };

  return (
    <div className="p-8">
      <MainContainer
        showContentPadding={false}
        title={
          <h1 className="text-2xl font-bold">{workspaceName}&rsquo;s Users</h1>
        }
        description="These users can use the same Sessions and Glossaries as you in this workspace"
        action={
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            Add Users to Workspace
          </Button>
        }
      >
        {users.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {usersLoaded
              ? "No users found in this workspace."
              : "Loading workspace users..."}
          </p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex border-b border-border p-4">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove user"
                  className="text-destructive hover:bg-red-50 hover:text-destructive"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </MainContainer>

      <ConfirmationDialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
        title="Remove User from Workspace"
        description={`Are you sure you want to remove ${
          (userToDelete && users.find((u) => u.id === userToDelete)?.name) ||
          "this user"
        } from the workspace? They will lose access to all workspace resources.`}
        onConfirm={handleConfirmRemoveUser}
        confirmText="Remove User"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeletingUser}
        icon={<Trash2 className="h-12 w-12" />}
      />

      <InviteUsersDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        contextName={workspaceName}
        existingUsers={existingOrganizationUsers}
        onInvite={handleInviteUsers}
        defaultRole="Editor"
        allowEmailInvites={false}
      />
    </div>
  );
}
