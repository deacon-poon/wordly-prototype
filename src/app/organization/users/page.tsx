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
  Settings,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Users,
  UserCheck,
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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  InviteUsersDialog,
  SelectedUser,
  UserRole,
} from "@/components/workspace/invite-users-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  workspace: string;
  role: "Administrator" | "Mixed" | "Viewer" | "Editor";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Mock organization data
  const organizationName = "Wordly";

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Deacon Poon",
      email: "deacon.poon@example.com",
      workspace: "Main HQ",
      role: "Administrator",
      isCurrentUser: true,
      workspaceRoles: [{ workspaceName: "Main HQ", role: "Administrator" }],
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@example.com",
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
      email: "jamal.johnson@example.com",
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
    {
      id: "4",
      name: "Sarah Matthews",
      email: "sarah.matthews@example.com",
      workspace: "3 workspaces",
      role: "Mixed",
      isCurrentUser: false,
      workspaceRoles: [
        { workspaceName: "Marketing", role: "Editor" },
        { workspaceName: "Development", role: "Viewer" },
        { workspaceName: "Sales", role: "Editor" },
      ],
    },
    {
      id: "5",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      workspace: "Main HQ",
      role: "Editor",
      isCurrentUser: false,
      workspaceRoles: [{ workspaceName: "Main HQ", role: "Editor" }],
    },
    {
      id: "6",
      name: "Olivia Rodriguez",
      email: "olivia.rodriguez@example.com",
      workspace: "Support",
      role: "Administrator",
      isCurrentUser: false,
      workspaceRoles: [{ workspaceName: "Support", role: "Administrator" }],
    },
    {
      id: "7",
      name: "Aiden Smith",
      email: "aiden.smith@example.com",
      workspace: "Development",
      role: "Editor",
      isCurrentUser: false,
      workspaceRoles: [{ workspaceName: "Development", role: "Editor" }],
    },
    {
      id: "8",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      workspace: "2 workspaces",
      role: "Mixed",
      isCurrentUser: false,
      workspaceRoles: [
        { workspaceName: "Sales", role: "Administrator" },
        { workspaceName: "Support", role: "Viewer" },
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
            { workspaceName, role: "Editor" as const },
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

  // Handle delete organization
  const handleDeleteOrganization = async () => {
    try {
      setIsDeleting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Delete logic would go here
      console.log("Organization deleted");

      // Note: Dialog will be closed automatically after successful validation
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Add this function for inviting users
  const handleInviteUsers = async (
    selectedUsers: SelectedUser[],
    role: UserRole
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Process the invited users
      console.log("Inviting users:", selectedUsers, "with role:", role);

      // For this demo, let's add the users to the list
      const newUsers = selectedUsers.map((user) => ({
        id: user.id || `new-${Math.random().toString(36).substring(2, 9)}`,
        name: user.name || user.email.split("@")[0],
        email: user.email || `newuser@example.com`,
        workspace: "Main HQ", // Default workspace
        role: role as User["role"],
        isCurrentUser: false,
        workspaceRoles: [{ workspaceName: "Main HQ", role: role }],
      }));

      setUsers((prev) => [...prev, ...newUsers]);

      return Promise.resolve();
    } catch (error) {
      console.error("Error inviting users:", error);
      return Promise.reject(error);
    }
  };

  // Mock existing users data for the organization
  const existingOrganizationUsers = [
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

  // Define the actions for the CardHeaderLayout
  const actions = (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete organization
      </Button>
      <Button
        variant="default"
        className="bg-brand-teal hover:bg-brand-teal/90 text-white"
        onClick={() => setIsInviteDialogOpen(true)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite user
      </Button>
    </div>
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

  // Handle removing a workspace from a user
  const handleRemoveWorkspace = (userId: string, workspaceName: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId && user.workspaceRoles) {
          // Don't allow removing if it's the only workspace
          if (user.workspaceRoles.length <= 1) {
            return user;
          }

          const updatedWorkspaceRoles = user.workspaceRoles.filter(
            (wr) => wr.workspaceName !== workspaceName
          );

          // Determine overall role based on remaining roles
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
            workspace:
              updatedWorkspaceRoles.length > 1
                ? `${updatedWorkspaceRoles.length} workspaces`
                : updatedWorkspaceRoles[0].workspaceName,
            workspaceRoles: updatedWorkspaceRoles,
            role: overallRole,
          };
        }
        return user;
      })
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
          <Table>
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
                <TableHead colSpan={2} className="px-3">
                  <div className="flex items-center justify-between">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-secondary-navy-600 flex items-center"
                        >
                          Workspace
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[180px]">
                        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                          Filter by workspace
                        </DropdownMenuLabel>
                        {workspaces.map((workspace) => (
                          <DropdownMenuItem
                            key={workspace}
                            onClick={() => setSelectedWorkspace(workspace)}
                            className={
                              selectedWorkspace === workspace
                                ? "bg-gray-100"
                                : ""
                            }
                          >
                            {workspace}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 p-0 text-gray-700 font-medium hover:bg-transparent hover:text-secondary-navy-600 flex items-center"
                        >
                          Role
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[180px]">
                        <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                          Filter by role
                        </DropdownMenuLabel>
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
                            selectedRole === "Administrator"
                              ? "bg-gray-100"
                              : ""
                          }
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Editor")}
                          className={
                            selectedRole === "Editor" ? "bg-gray-100" : ""
                          }
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Viewer")}
                          className={
                            selectedRole === "Viewer" ? "bg-gray-100" : ""
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Viewer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedRole("Mixed")}
                          className={
                            selectedRole === "Mixed" ? "bg-gray-100" : ""
                          }
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Mixed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 text-center">
                    <div className="text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No users found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Users matching your filters will appear here
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
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
                      {user.workspaceRoles && user.workspaceRoles.length > 1 ? (
                        <Card className="border border-gray-200">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem
                              value={`user-${user.id}`}
                              className="border-none"
                            >
                              <AccordionTrigger className="flex-auto [&>svg]:hidden px-3 py-2 hover:no-underline group/trigger">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="text-sm font-medium text-gray-800 cursor-pointer">
                                            {user.workspace}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="bottom"
                                          align="start"
                                          className="max-w-[200px]"
                                        >
                                          <div className="space-y-1">
                                            <p className="text-xs font-medium">
                                              Workspaces assigned:
                                            </p>
                                            {user.workspaceRoles.map(
                                              (wr, i) => (
                                                <div
                                                  key={i}
                                                  className="flex items-center justify-between text-xs"
                                                >
                                                  <span>
                                                    {wr.workspaceName}
                                                  </span>
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs ml-2"
                                                  >
                                                    {wr.role}
                                                  </Badge>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <span className="text-xs text-gray-500 ml-2 opacity-0 group-hover/trigger:opacity-100 transition-opacity duration-200">
                                      • Click to manage workspaces
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-primary-teal-600 border-primary-teal-200 bg-primary-teal-25 font-normal text-xs"
                                    >
                                      <div className="flex items-center gap-1">
                                        <UserCheck className="h-3 w-3" />
                                        <span>Mixed</span>
                                      </div>
                                    </Badge>
                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 accordion-open:rotate-180" />
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-3 pb-3">
                                <Separator className="mb-3" />
                                <div className="space-y-2">
                                  {user.workspaceRoles.map((wr, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition-all duration-150"
                                    >
                                      <span className="text-sm font-medium text-gray-700">
                                        {wr.workspaceName}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className={`h-6 text-xs font-medium ${getRoleBadgeClass(
                                                wr.role
                                              )} hover:opacity-80 transition-opacity duration-150`}
                                            >
                                              <div className="flex items-center gap-1">
                                                {getRoleIcon(wr.role)}
                                                <span>{wr.role}</span>
                                                <ChevronDown className="ml-1 h-3 w-3" />
                                              </div>
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                                              Change role for {wr.workspaceName}
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleWorkspaceRoleChange(
                                                  user.id,
                                                  wr.workspaceName,
                                                  "Administrator"
                                                )
                                              }
                                              className={
                                                wr.role === "Administrator"
                                                  ? "bg-gray-100"
                                                  : ""
                                              }
                                            >
                                              <ShieldCheck className="h-4 w-4 mr-2" />
                                              Administrator
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleWorkspaceRoleChange(
                                                  user.id,
                                                  wr.workspaceName,
                                                  "Editor"
                                                )
                                              }
                                              className={
                                                wr.role === "Editor"
                                                  ? "bg-gray-100"
                                                  : ""
                                              }
                                            >
                                              <Edit2 className="h-4 w-4 mr-2" />
                                              Editor
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() =>
                                                handleWorkspaceRoleChange(
                                                  user.id,
                                                  wr.workspaceName,
                                                  "Viewer"
                                                )
                                              }
                                              className={
                                                wr.role === "Viewer"
                                                  ? "bg-gray-100"
                                                  : ""
                                              }
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              Viewer
                                            </DropdownMenuItem>
                                            {user.workspaceRoles &&
                                              user.workspaceRoles.length >
                                                1 && (
                                                <>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      handleRemoveWorkspace(
                                                        user.id,
                                                        wr.workspaceName
                                                      )
                                                    }
                                                    className="text-red-600 focus:text-red-600"
                                                  >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove from workspace
                                                  </DropdownMenuItem>
                                                </>
                                              )}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  ))}
                                  {getAvailableWorkspaces(user).length > 0 && (
                                    <>
                                      <Separator className="my-3" />
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-8 text-xs text-gray-600 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150"
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add to another workspace
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="center"
                                          className="w-[200px]"
                                        >
                                          <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                                            Add {user.name.split(" ")[0]} to
                                            workspace
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          {getAvailableWorkspaces(user).map(
                                            (workspace, i) => (
                                              <DropdownMenuItem
                                                key={i}
                                                onClick={() =>
                                                  handleAddWorkspace(
                                                    user.id,
                                                    workspace
                                                  )
                                                }
                                                className="flex items-center justify-between"
                                              >
                                                <span>{workspace}</span>
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs text-gray-500"
                                                >
                                                  Editor
                                                </Badge>
                                              </DropdownMenuItem>
                                            )
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>
                      ) : (
                        <Card className="border border-gray-200 group/single">
                          {getAvailableWorkspaces(user).length > 0 ? (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem
                                value={`user-${user.id}`}
                                className="border-none"
                              >
                                <AccordionTrigger className="flex-auto [&>svg]:hidden px-3 py-2 hover:no-underline group/trigger">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-800">
                                        {user.workspace}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-2 opacity-0 group-hover/trigger:opacity-100 transition-opacity duration-200">
                                        • Click to add workspaces
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className={`${getRoleBadgeClass(
                                          user.workspaceRoles?.[0]?.role ||
                                            user.role
                                        )} font-normal text-xs`}
                                      >
                                        <div className="flex items-center gap-1">
                                          {getRoleIcon(
                                            user.workspaceRoles?.[0]?.role ||
                                              user.role
                                          )}
                                          <span>
                                            {user.workspaceRoles?.[0]?.role ||
                                              user.role}
                                          </span>
                                        </div>
                                      </Badge>
                                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 accordion-open:rotate-180" />
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                  <Separator className="mb-3" />
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full h-8 text-xs text-gray-600 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to another workspace
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="center"
                                      className="w-[200px]"
                                    >
                                      <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                                        Add {user.name.split(" ")[0]} to
                                        workspace
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {getAvailableWorkspaces(user).map(
                                        (workspace, i) => (
                                          <DropdownMenuItem
                                            key={i}
                                            onClick={() =>
                                              handleAddWorkspace(
                                                user.id,
                                                workspace
                                              )
                                            }
                                            className="flex items-center justify-between"
                                          >
                                            <span>{workspace}</span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs text-gray-500"
                                            >
                                              Editor
                                            </Badge>
                                          </DropdownMenuItem>
                                        )
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <div className="px-3 py-2 flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-800">
                                  {user.workspace}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`${getRoleBadgeClass(
                                  user.workspaceRoles?.[0]?.role || user.role
                                )} font-normal text-xs`}
                              >
                                <div className="flex items-center gap-1">
                                  {getRoleIcon(
                                    user.workspaceRoles?.[0]?.role || user.role
                                  )}
                                  <span>
                                    {user.workspaceRoles?.[0]?.role ||
                                      user.role}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                          )}
                        </Card>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardHeaderLayout>

      {/* Delete Organization Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Organization"
        description="This action will permanently delete the organization and all its data, including workspaces, sessions, transcripts, and user assignments. This cannot be undone."
        onConfirm={handleDeleteOrganization}
        confirmText="Delete Organization"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        icon={<AlertTriangle className="h-12 w-12" />}
        validationText={organizationName}
        validationLabel={`To confirm, please type the organization name "${organizationName}"`}
      />

      {/* Invite Users Dialog */}
      <InviteUsersDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        contextName={organizationName}
        contextType="organization"
        existingUsers={existingOrganizationUsers}
        onInvite={handleInviteUsers}
        defaultRole="Editor"
        title="Invite Users to Organization"
        description={`Invited users will be given access to the ${organizationName} organization and can be assigned to specific workspaces.`}
        allowEmailInvites={true}
      />
    </>
  );
}
