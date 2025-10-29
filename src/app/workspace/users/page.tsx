"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  UserPlus,
  ShieldCheck,
  Edit2,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  InviteUsersDialog,
  SelectedUser,
  UserRole,
  UserData,
} from "@/components/workspace/invite-users-dialog";

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Editor" | "Viewer";
  isCurrentUser: boolean;
}

// Mock existing users data for the organization
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
  {
    id: "106",
    name: "Olivia Kim",
    email: "olivia.kim@example.com",
    role: "Viewer",
  },
  {
    id: "107",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    role: "Editor",
  },
  {
    id: "108",
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    role: "Viewer",
  },
  {
    id: "109",
    name: "Ethan Thompson",
    email: "ethan.thompson@example.com",
    role: "Viewer",
  },
  {
    id: "110",
    name: "Ava Garcia",
    email: "ava.garcia@example.com",
    role: "Editor",
  },
];

export default function UsersPage() {
  // Mock workspace data
  const workspaceName = "Main HQ";

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Aisha Patel",
      email: "aisha.patel@example.com",
      role: "Administrator",
      isCurrentUser: true,
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@example.com",
      role: "Editor",
      isCurrentUser: false,
    },
    {
      id: "3",
      name: "Jamal Johnson",
      email: "jamal.johnson@example.com",
      role: "Viewer",
      isCurrentUser: false,
    },
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Get the appropriate icon for a role
  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "Administrator":
        return <ShieldCheck className="h-4 w-4" />;
      case "Editor":
        return <Edit2 className="h-4 w-4" />;
      case "Viewer":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get the appropriate badge class for a role
  const getRoleBadgeClass = (role: User["role"]) => {
    switch (role) {
      case "Administrator":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Editor":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Viewer":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Handler for role change
  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Handler for initiating user removal
  const handleRemoveUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteUserDialogOpen(true);
  };

  // Handler for confirming user removal
  const handleConfirmRemoveUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeletingUser(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the user from the list
      setUsers(users.filter((user) => user.id !== userToDelete));

      // Reset state
      setUserToDelete(null);
    } catch (error) {
      console.error("Error removing user:", error);
    } finally {
      setIsDeletingUser(false);
    }
  };

  // Handler for delete workspace
  const handleDeleteWorkspace = async () => {
    try {
      setIsDeleting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Delete logic would go here
      console.log("Workspace deleted");

      // Note: Dialog will be closed automatically after successful validation
    } catch (error) {
      console.error("Error deleting workspace:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for inviting users
  const handleInviteUsers = async (
    selectedUsers: SelectedUser[],
    role: UserRole
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Process the invited users
      console.log("Inviting users:", selectedUsers, "with role:", role);

      // In a real implementation, you would send this to your API
      // and then update the user list with the response

      // For this demo, let's simulate adding users to the list
      const newUsers = selectedUsers.map((user) => ({
        id: user.id || `new-${Math.random().toString(36).substring(2, 9)}`,
        name: user.name || user.email.split("@")[0],
        email:
          user.email ||
          `new-${Math.random().toString(36).substring(2, 9)}@example.com`,
        role: role,
        isCurrentUser: false,
      }));

      setUsers((prev) => [...prev, ...newUsers]);

      return Promise.resolve();
    } catch (error) {
      console.error("Error inviting users:", error);
      return Promise.reject(error);
    }
  };

  // Define the actions for the CardHeaderLayout
  const actions = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50 w-full sm:w-auto"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete workspace
      </Button>
      <Button
        variant="default"
        className="bg-brand-teal hover:bg-brand-teal/90 text-white w-full sm:w-auto"
        onClick={() => setIsInviteDialogOpen(true)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite users
      </Button>
    </div>
  );

  return (
    <>
      <CardHeaderLayout
        title="User Management"
        description="Manage workspace users and their permissions."
        actions={actions}
      >
        <div className="p-0 -m-6">
          {/* Desktop Table View */}
          <Table className="hidden md:table">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-secondary-navy-600 flex items-center"
                  >
                    Name
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-secondary-navy-600 flex items-center"
                  >
                    Role
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-gray-900 font-medium">
                              {user.name}
                            </span>
                            {user.isCurrentUser && (
                              <span className="text-gray-500 font-normal text-xs ml-1">
                                (you)
                              </span>
                            )}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge
                            variant="outline"
                            className={`${getRoleBadgeClass(
                              user.role
                            )} cursor-pointer hover:bg-opacity-80 border-opacity-50 hover:border-opacity-100 transition-all duration-200`}
                          >
                            <div className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              <span>{user.role}</span>
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </div>
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(user.id, "Administrator")
                            }
                            className={
                              user.role === "Administrator" ? "bg-gray-100" : ""
                            }
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Administrator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "Editor")}
                            className={
                              user.role === "Editor" ? "bg-gray-100" : ""
                            }
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "Viewer")}
                            className={
                              user.role === "Viewer" ? "bg-gray-100" : ""
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Viewer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      {!user.isCurrentUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          className="h-8 w-8 p-0 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove user</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-gray-900 font-medium">
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-gray-500 font-normal text-xs ml-1">
                            (you)
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {user.email}
                      </span>
                    </div>
                    {!user.isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove user</span>
                      </Button>
                    )}
                  </div>

                  {/* Role Section */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">
                      Role
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge
                          variant="outline"
                          className={`${getRoleBadgeClass(
                            user.role
                          )} cursor-pointer hover:bg-opacity-80 border-opacity-50 hover:border-opacity-100 transition-all duration-200`}
                        >
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </div>
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, "Administrator")
                          }
                          className={
                            user.role === "Administrator" ? "bg-gray-100" : ""
                          }
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "Editor")}
                          className={
                            user.role === "Editor" ? "bg-gray-100" : ""
                          }
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "Viewer")}
                          className={
                            user.role === "Viewer" ? "bg-gray-100" : ""
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Viewer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardHeaderLayout>

      {/* Delete Workspace Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Workspace"
        description="This action will permanently delete the workspace and all its data, including sessions, transcripts, and user assignments. This cannot be undone."
        onConfirm={handleDeleteWorkspace}
        confirmText="Delete Workspace"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        icon={<AlertTriangle className="h-12 w-12" />}
        validationText={workspaceName}
        validationLabel={`To confirm, please type the workspace name "${workspaceName}"`}
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
        title="Remove User from Workspace"
        description={`Are you sure you want to remove ${
          userToDelete
            ? users.find((u) => u.id === userToDelete)?.name || "this user"
            : "this user"
        } from the workspace? They will lose access to all workspace resources.`}
        onConfirm={handleConfirmRemoveUser}
        confirmText="Remove User"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeletingUser}
        icon={<Trash2 className="h-12 w-12" />}
      />

      {/* Invite Users Dialog */}
      <InviteUsersDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        contextName={workspaceName}
        existingUsers={existingOrganizationUsers}
        onInvite={handleInviteUsers}
        defaultRole="Editor"
        allowEmailInvites={false}
      />
    </>
  );
}
