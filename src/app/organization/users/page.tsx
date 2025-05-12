"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrganizationUsersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Users</CardTitle>
          <CardDescription>
            Manage users across all workspaces in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Organization user management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
