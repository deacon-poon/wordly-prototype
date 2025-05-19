"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  UserPlus,
  XCircle,
  ShieldCheck,
  Edit2,
  Eye,
  Archive,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";

// Mock user data
interface User {
  id: string;
  name: string;
  role: "Administrator" | "Editor" | "Viewer";
  isCurrentUser: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Aisha Patel",
      role: "Administrator",
      isCurrentUser: true,
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      role: "Editor",
      isCurrentUser: false,
    },
    {
      id: "3",
      name: "Jamal Johnson",
      role: "Viewer",
      isCurrentUser: false,
    },
  ]);

  // Get the appropriate icon for a role
  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "Administrator":
        return <ShieldCheck className="h-4 w-4 mr-2" />;
      case "Editor":
        return <Edit2 className="h-4 w-4 mr-2" />;
      case "Viewer":
        return <Eye className="h-4 w-4 mr-2" />;
      default:
        return null;
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

  // Handler for user removal
  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Handler for archive workspace
  const handleArchiveWorkspace = () => {
    if (confirm("Are you sure you want to archive this workspace?")) {
      // Archive logic would go here
      console.log("Workspace archived");
    }
  };

  // Handler for inviting users
  const handleInviteUser = () => {
    // Invitation logic would go here
    console.log("Invite user modal would open");
  };

  const actions = (
    <>
      <Button
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={handleArchiveWorkspace}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archive workspace
      </Button>
      <Button
        variant="default"
        className="bg-brand-teal hover:bg-brand-teal/90 text-white"
        onClick={handleInviteUser}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite another user
      </Button>
    </>
  );

  return (
    <CardHeaderLayout
      title="User Management"
      description="Manage workspace users and their permissions."
      actions={actions}
    >
      <div className="p-0 -m-6">
        <div className="w-full border-b px-6 py-3 bg-gray-50 grid grid-cols-2">
          <div className="font-medium text-gray-700">Name</div>
          <div className="font-medium text-gray-700">Role</div>
        </div>

        {users.map((user, index) => (
          <div
            key={user.id}
            className={`w-full px-6 py-4 grid grid-cols-2 items-center ${
              index < users.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="font-medium text-gray-900">
              {user.name}{" "}
              {user.isCurrentUser && (
                <span className="text-gray-500 font-normal">(you)</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-gray-800 border-gray-300 h-9 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(user.id, "Administrator")}
                    className={
                      user.role === "Administrator" ? "bg-gray-100" : ""
                    }
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(user.id, "Editor")}
                    className={user.role === "Editor" ? "bg-gray-100" : ""}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editor
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(user.id, "Viewer")}
                    className={user.role === "Viewer" ? "bg-gray-100" : ""}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Viewer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!user.isCurrentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <XCircle className="h-5 w-5" />
                  <span className="sr-only">Remove user</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardHeaderLayout>
  );
}
