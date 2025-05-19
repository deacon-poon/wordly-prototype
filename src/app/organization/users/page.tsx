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
  CheckSquare,
  Square,
  Plus,
  ExternalLink,
  Info,
} from "lucide-react";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock user data
interface User {
  id: string;
  name: string;
  workspace: string;
  role: "Administrator" | "Mixed" | "Viewer";
  isCurrentUser: boolean;
  // For users with multiple workspaces
  workspaceRoles?: {
    workspaceName: string;
    role: "Administrator" | "Editor" | "Viewer";
  }[];
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Deacon Poon",
      workspace: "Main HQ",
      role: "Administrator",
      isCurrentUser: true,
      workspaceRoles: [{ workspaceName: "Main HQ", role: "Administrator" }],
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      workspace: "2 workspaces",
      role: "Mixed",
      isCurrentUser: false,
      workspaceRoles: [
        { workspaceName: "Marketing", role: "Administrator" },
        { workspaceName: "Development", role: "Editor" },
      ],
    },
    {
      id: "3",
      name: "Jamal Johnson",
      workspace: "4 workspaces",
      role: "Viewer",
      isCurrentUser: false,
      workspaceRoles: [
        { workspaceName: "Main HQ", role: "Viewer" },
        { workspaceName: "Marketing", role: "Viewer" },
        { workspaceName: "Development", role: "Viewer" },
        { workspaceName: "Sales", role: "Viewer" },
      ],
    },
  ]);

  // Get the appropriate icon for a role
  const getRoleIcon = (role: User["role"] | "Editor") => {
    switch (role) {
      case "Administrator":
        return <ShieldCheck className="h-4 w-4 mr-2" />;
      case "Mixed":
        return <Edit2 className="h-4 w-4 mr-2" />;
      case "Editor":
        return <Edit2 className="h-4 w-4 mr-2" />;
      case "Viewer":
        return <Eye className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (
    role: "Administrator" | "Editor" | "Viewer" | "Mixed"
  ) => {
    switch (role) {
      case "Administrator":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Editor":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Viewer":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Mixed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  // Handle workspace role change (for multi-workspace users)
  const handleWorkspaceRoleChange = (
    userId: string,
    workspaceName: string,
    newRole: "Administrator" | "Editor" | "Viewer"
  ) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId && user.workspaceRoles) {
          const updatedWorkspaceRoles = user.workspaceRoles.map((wr) =>
            wr.workspaceName === workspaceName ? { ...wr, role: newRole } : wr
          );

          // Determine overall role based on individual workspace roles
          let overallRole: User["role"] = "Viewer";
          if (updatedWorkspaceRoles.some((wr) => wr.role === "Administrator")) {
            if (
              updatedWorkspaceRoles.every((wr) => wr.role === "Administrator")
            ) {
              overallRole = "Administrator";
            } else {
              overallRole = "Mixed";
            }
          } else if (updatedWorkspaceRoles.some((wr) => wr.role === "Editor")) {
            overallRole = "Mixed";
          }

          return {
            ...user,
            role: overallRole,
            workspaceRoles: updatedWorkspaceRoles,
          };
        }
        return user;
      })
    );
  };

  // Handle adding a new workspace to a user
  const handleAddWorkspace = (userId: string, workspaceName: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const currentWorkspaces = user.workspaceRoles || [];
          // Don't add if it already exists
          if (
            currentWorkspaces.some((w) => w.workspaceName === workspaceName)
          ) {
            return user;
          }

          const newWorkspaceRoles = [
            ...currentWorkspaces,
            { workspaceName, role: "Viewer" as const },
          ];

          return {
            ...user,
            workspace: `${newWorkspaceRoles.length} workspaces`,
            workspaceRoles: newWorkspaceRoles,
            // If it was a single workspace user before, update to Mixed role
            role: user.workspaceRoles ? user.role : "Mixed",
          };
        }
        return user;
      })
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

  // Open workspace management dialog for multi-workspace users
  const handleManageWorkspaces = (userId: string) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  // Filter users based on selected workspace and role
  const filteredUsers = users.filter((user) => {
    const workspaceMatch =
      selectedWorkspace === "All Workspaces" ||
      user.workspace === selectedWorkspace ||
      (user.workspaceRoles?.some(
        (wr) => wr.workspaceName === selectedWorkspace
      ) &&
        selectedWorkspace !== "All Workspaces");

    const roleMatch =
      selectedRole === "All Roles" || user.role === selectedRole;

    return workspaceMatch && roleMatch;
  });

  // Get selected user for modal
  const selectedUser = selectedUserId
    ? users.find((user) => user.id === selectedUserId)
    : null;

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

  // Available workspaces for assignment (excluding ones already assigned to the user)
  const getAvailableWorkspaces = (user: User) => {
    if (!user.workspaceRoles)
      return workspaces.filter((w) => w !== "All Workspaces");

    const assignedWorkspaces = user.workspaceRoles.map(
      (wr) => wr.workspaceName
    );
    return workspaces.filter(
      (w) => w !== "All Workspaces" && !assignedWorkspaces.includes(w)
    );
  };

  return (
    <>
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
                    className={
                      selectedRole === "All Roles" ? "bg-gray-100" : ""
                    }
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
                        className="text-gray-700 border-gray-300 h-9 flex items-center justify-between"
                      >
                        <span className="flex items-center">
                          {user.workspace}
                          <ChevronDown className="ml-1.5 h-4 w-4" />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      {user.workspaceRoles && (
                        <>
                          <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                            Assigned workspaces
                          </DropdownMenuLabel>
                          {user.workspaceRoles.map((wr, i) => (
                            <DropdownMenuItem
                              key={i}
                              className="py-2 cursor-pointer"
                              onClick={() => handleManageWorkspaces(user.id)}
                            >
                              <div className="w-full flex items-center justify-between">
                                <span>{wr.workspaceName}</span>
                                <div
                                  className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                                    wr.role === "Administrator"
                                      ? "bg-blue-50 text-blue-700"
                                      : wr.role === "Editor"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  {wr.role}
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}

                      {getAvailableWorkspaces(user).length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                            Add to workspace
                          </DropdownMenuLabel>
                          {getAvailableWorkspaces(user).map((workspace, i) => (
                            <DropdownMenuItem
                              key={`add-${i}`}
                              onClick={() =>
                                handleAddWorkspace(user.id, workspace)
                              }
                              className="py-2 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5 mr-2 text-[#006064]" />
                              {workspace}
                            </DropdownMenuItem>
                          ))}
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleManageWorkspaces(user.id)}
                        className="text-[#006064] py-2 cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        Manage all workspace roles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center">
                    <div
                      className={`border rounded-full px-3 py-1 text-xs font-medium inline-flex items-center ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>

                    {user.workspaceRoles && user.workspaceRoles.length > 1 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 ml-1 rounded-full"
                            >
                              <Info className="h-3.5 w-3.5 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white p-0 border border-gray-200 shadow-md rounded-md">
                            <div className="p-3 max-w-[280px]">
                              <div className="text-xs font-semibold text-gray-700 mb-2">
                                Workspace Assignments
                              </div>
                              <div className="space-y-1.5">
                                {user.workspaceRoles.map((wr, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-gray-600 mr-3">
                                      {wr.workspaceName}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full ${
                                        wr.role === "Administrator"
                                          ? "bg-blue-50 text-blue-700"
                                          : wr.role === "Editor"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : "bg-gray-50 text-gray-600"
                                      }`}
                                    >
                                      {wr.role}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageWorkspaces(user.id)}
                      className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-teal-50 text-[#006064]"
                    >
                      {user.workspaceRoles ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      <span className="sr-only">Manage roles</span>
                    </Button>

                    {!user.isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to remove this user?"
                            )
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
              </div>
            ))
          )}
        </div>
      </CardHeaderLayout>

      {/* User Role Management Modal */}
      <Dialog
        open={modalOpen && selectedUser !== null}
        onOpenChange={setModalOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Manage User Access</DialogTitle>
            <DialogDescription>
              Edit {selectedUser?.name}'s role for each workspace
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedUser?.workspaceRoles ? (
              <div className="space-y-4">
                {selectedUser.workspaceRoles.map((workspace, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-gray-50 border-b font-medium">
                      {workspace.workspaceName}
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div
                        onClick={() =>
                          handleWorkspaceRoleChange(
                            selectedUser.id,
                            workspace.workspaceName,
                            "Administrator"
                          )
                        }
                        className="flex items-center cursor-pointer py-1.5 px-1 hover:bg-gray-50 rounded-md"
                      >
                        {workspace.role === "Administrator" ? (
                          <CheckSquare className="h-5 w-5 mr-2 text-[#006064]" />
                        ) : (
                          <Square className="h-5 w-5 mr-2 text-gray-300" />
                        )}
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">Administrator</span>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          handleWorkspaceRoleChange(
                            selectedUser.id,
                            workspace.workspaceName,
                            "Editor"
                          )
                        }
                        className="flex items-center cursor-pointer py-1.5 px-1 hover:bg-gray-50 rounded-md"
                      >
                        {workspace.role === "Editor" ? (
                          <CheckSquare className="h-5 w-5 mr-2 text-[#006064]" />
                        ) : (
                          <Square className="h-5 w-5 mr-2 text-gray-300" />
                        )}
                        <div className="flex items-center">
                          <Edit2 className="h-4 w-4 mr-2 text-emerald-600" />
                          <span className="font-medium">Editor</span>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          handleWorkspaceRoleChange(
                            selectedUser.id,
                            workspace.workspaceName,
                            "Viewer"
                          )
                        }
                        className="flex items-center cursor-pointer py-1.5 px-1 hover:bg-gray-50 rounded-md"
                      >
                        {workspace.role === "Viewer" ? (
                          <CheckSquare className="h-5 w-5 mr-2 text-[#006064]" />
                        ) : (
                          <Square className="h-5 w-5 mr-2 text-gray-300" />
                        )}
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="font-medium">Viewer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Section to add a user to a new workspace */}
                {getAvailableWorkspaces(selectedUser).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Add to workspace
                    </h4>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-gray-700 bg-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to another workspace
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                          {getAvailableWorkspaces(selectedUser).map(
                            (workspace, i) => (
                              <DropdownMenuItem
                                key={`add-modal-${i}`}
                                onClick={() =>
                                  handleAddWorkspace(selectedUser.id, workspace)
                                }
                              >
                                {workspace}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                This user doesn't have multiple workspace assignments.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setModalOpen(false)}
              className="bg-[#006064] hover:bg-[#00474a]"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
