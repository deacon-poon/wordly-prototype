"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ShieldCheck, Edit2, Eye } from "lucide-react";

// Mock user data
interface User {
  id: string;
  name: string;
  workspace: string;
  role: "Administrator" | "Mixed" | "Viewer";
  isCurrentUser: boolean;
}

export default function OrganizationUsersPage() {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            User Management (across workspaces)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage organization users across all workspaces.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 self-center"
            onClick={(e) => {
              e.preventDefault();
              console.log("Archive workspace");
            }}
          >
            archive workspace
          </a>
          <Button
            variant="default"
            className="bg-[#006064] hover:bg-[#00474a] text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite another user
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="w-full px-6 py-3 bg-gray-50 grid grid-cols-3 border-b">
          <div className="font-medium text-gray-700">Name</div>
          <div className="font-medium text-gray-700">Workspace</div>
          <div className="font-medium text-gray-700">Role</div>
        </div>

        {users.map((user, index) => (
          <div
            key={user.id}
            className={`w-full px-6 py-4 grid grid-cols-3 items-center ${
              index < users.length - 1 ? "border-b" : ""
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
            <div className="text-gray-700">{user.workspace}</div>
            <div className="flex items-center text-gray-700">
              <span className="inline-flex items-center">
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
