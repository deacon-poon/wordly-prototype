"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  ShieldCheck,
  Edit2,
  Eye,
  Archive,
  ChevronDown,
  XCircle,
} from "lucide-react";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user data
interface User {
  id: string;
  name: string;
  workspace: string;
  role: "Administrator" | "Mixed" | "Viewer";
  isCurrentUser: boolean;
}

// Mock workspace data
const workspaces = [
  "All Workspaces",
  "Main HQ",
  "Marketing",
  "Development",
  "Sales",
  "Support",
];

export default function OrganizationUsersPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState("All Workspaces");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Aisha Patel",
      workspace: "Main HQ",
      role: "Administrator",
      isCurrentUser: true,
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      workspace: "2 workspaces",
      role: "Mixed",
      isCurrentUser: false,
    },
    {
      id: "3",
      name: "Jamal Johnson",
      workspace: "4 workspaces",
      role: "Viewer",
      isCurrentUser: false,
    },
  ]);

  // Get the appropriate icon for a role
  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "Administrator":
        return <ShieldCheck className="h-4 w-4 mr-2" />;
      case "Mixed":
        return <Edit2 className="h-4 w-4 mr-2" />;
      case "Viewer":
        return <Eye className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Handle role change for a user
  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Handle workspace change for a user
  const handleWorkspaceChange = (userId: string, newWorkspace: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, workspace: newWorkspace } : user
      )
    );
  };

  // Filter users based on selected workspace and role
  const filteredUsers = users.filter((user) => {
    const workspaceMatch =
      selectedWorkspace === "All Workspaces" ||
      user.workspace === selectedWorkspace ||
      (user.workspace.includes("workspaces") &&
        selectedWorkspace !== "All Workspaces");

    const roleMatch =
      selectedRole === "All Roles" || user.role === selectedRole;

    return workspaceMatch && roleMatch;
  });

  const actions = (
    <>
      <Button
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={() => {
          if (confirm("Are you sure you want to archive this organization?")) {
            // Archive logic would go here
            console.log("Organization archived");
          }
        }}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archive organization
      </Button>
      <Button
        variant="default"
        className="bg-[#006064] hover:bg-[#00474a] text-white"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite another user
      </Button>
    </>
  );

  return (
    <CardHeaderLayout
      title="All Users"
      description="Manage users across all workspaces in your organization."
      actions={actions}
    >
      <div className="p-0 -m-6">
        <div className="w-full px-6 py-3 bg-gray-50 grid grid-cols-3 border-b">
          <div className="font-medium text-gray-700">Name</div>
          <div className="font-medium text-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-brand-teal flex items-center"
                >
                  Workspace
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px]">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace}
                    onClick={() => setSelectedWorkspace(workspace)}
                    className={
                      selectedWorkspace === workspace ? "bg-gray-100" : ""
                    }
                  >
                    {workspace}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="font-medium text-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-brand-teal flex items-center"
                >
                  Role
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[180px]">
                <DropdownMenuItem
                  onClick={() => setSelectedRole("All Roles")}
                  className={selectedRole === "All Roles" ? "bg-gray-100" : ""}
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRole("Administrator")}
                  className={
                    selectedRole === "Administrator" ? "bg-gray-100" : ""
                  }
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Administrator
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRole("Mixed")}
                  className={selectedRole === "Mixed" ? "bg-gray-100" : ""}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Mixed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedRole("Viewer")}
                  className={selectedRole === "Viewer" ? "bg-gray-100" : ""}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Viewer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="w-full px-6 py-8 text-center text-gray-500">
            No users found matching the selected filters.
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className={`w-full px-6 py-4 grid grid-cols-3 items-center ${
                index < filteredUsers.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="font-medium text-gray-900">
                <a href="#" className="text-[#006064] hover:underline">
                  {user.name}
                </a>{" "}
                {user.isCurrentUser && (
                  <span className="text-gray-500 font-normal">(you)</span>
                )}
              </div>
              <div className="text-gray-700">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-gray-800 border-gray-300 h-9 flex items-center justify-between"
                      disabled={user.workspace.includes("workspaces")}
                    >
                      {user.workspace}
                      {!user.workspace.includes("workspaces") && (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  {!user.workspace.includes("workspaces") && (
                    <DropdownMenuContent align="start">
                      {workspaces
                        .filter((w) => w !== "All Workspaces")
                        .map((workspace) => (
                          <DropdownMenuItem
                            key={workspace}
                            onClick={() =>
                              handleWorkspaceChange(user.id, workspace)
                            }
                            className={
                              user.workspace === workspace ? "bg-gray-100" : ""
                            }
                          >
                            {workspace}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between text-gray-700">
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
                      onClick={() => handleRoleChange(user.id, "Mixed")}
                      className={user.role === "Mixed" ? "bg-gray-100" : ""}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Mixed
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
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to remove this user?")
                      ) {
                        setUsers(users.filter((u) => u.id !== user.id));
                      }
                    }}
                    className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <XCircle className="h-5 w-5" />
                    <span className="sr-only">Remove user</span>
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </CardHeaderLayout>
  );
}
