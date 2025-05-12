"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, UserPlus, XCircle } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          "Main HQ" Workspace User Management
        </h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-gray-300"
          >
            Archive workspace
          </Button>
          <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite another user
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                <TableHead className="w-[50%] py-4 text-sm font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="w-[50%] py-4 text-sm font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="w-0 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`border-b border-gray-200 ${
                    index === users.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <TableCell className="py-4 font-medium text-gray-900">
                    {user.name}{" "}
                    {user.isCurrentUser && (
                      <span className="text-gray-500 font-normal">(you)</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center justify-between w-36 px-3 py-1 h-9 font-normal border-gray-300 bg-white hover:bg-gray-50"
                        >
                          <span className={`${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-36 border border-gray-200 shadow-md"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleChange(user.id, "Administrator")
                          }
                          className={`px-3 py-2 ${
                            user.role === "Administrator"
                              ? "bg-gray-100 text-brand-teal font-medium"
                              : ""
                          }`}
                        >
                          Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "Editor")}
                          className={`px-3 py-2 ${
                            user.role === "Editor"
                              ? "bg-gray-100 text-brand-teal font-medium"
                              : ""
                          }`}
                        >
                          Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, "Viewer")}
                          className={`px-3 py-2 ${
                            user.role === "Viewer"
                              ? "bg-gray-100 text-brand-teal font-medium"
                              : ""
                          }`}
                        >
                          Viewer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    {!user.isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                      >
                        <XCircle className="h-5 w-5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get color class based on role
function getRoleColor(role: User["role"]): string {
  switch (role) {
    case "Administrator":
      return "text-brand-teal";
    case "Editor":
      return "text-blue-600";
    case "Viewer":
      return "text-gray-600";
    default:
      return "text-gray-700";
  }
}
