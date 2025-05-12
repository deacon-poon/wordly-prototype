"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Users</CardTitle>
          <CardDescription>
            Manage users and permissions for this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>User management configuration coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
