import { useWorkspace } from "@/contexts/workspace-context";
import React, { useState, useEffect } from "react";
import { MultiLevelBillingLayout } from "./multi-level-billing-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Building,
  Users,
  CreditCard,
} from "lucide-react";

// Mock user role - in real app this would come from auth context
interface User {
  id: string;
  role: "organization_admin" | "workspace_admin" | "editor" | "viewer";
  workspaceId?: string;
  organizationId: string;
}

interface PermissionAwareBillingProps {
  user: User;
}

export function PermissionAwareBilling({ user }: PermissionAwareBillingProps) {
  const { activeWorkspace } = useWorkspace();
  const [billingData, setBillingData] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLevel, setAccessLevel] = useState<
    "full" | "workspace_only" | "none"
  >("none");

  // Check permissions based on user role
  useEffect(() => {
    if (user.role === "organization_admin") {
      setHasAccess(true);
      setAccessLevel("full");
    } else if (user.role === "workspace_admin") {
      setHasAccess(true);
      setAccessLevel("workspace_only");
    } else {
      setHasAccess(false);
      setAccessLevel("none");
    }
  }, [user.role]);

  // Mock billing data - in real app this would come from API
  useEffect(() => {
    const mockData = [
      {
        id: "org1",
        name: "Wordly Organization",
        totalMinutes: 150000,
        usedMinutes: 87500,
        workspaces: [
          {
            id: "ws1",
            name: "Main HQ",
            organizationId: "org1",
            totalMinutes: 100000,
            usedMinutes: 65000,
            accounts: [
              {
                id: "acc1",
                name: "Gardendale City",
                workspaceId: "ws1",
                balance: 5514,
                totalAllocated: 60000,
                usedMinutes: 54486,
                transactions: [
                  {
                    id: "t1",
                    date: "2024-01-15",
                    description: "City Council Meeting",
                    minutes: 120,
                    user: "Sarah Johnson",
                    accountId: "acc1",
                    session: "Session #1234",
                    type: "usage" as const,
                  },
                  {
                    id: "t2",
                    date: "2024-01-10",
                    description: "Minutes allocation",
                    minutes: 5000,
                    user: "Admin",
                    accountId: "acc1",
                    type: "allocation" as const,
                  },
                ],
              },
              {
                id: "acc2",
                name: "Parks and Recreation",
                workspaceId: "ws1",
                balance: 14,
                totalAllocated: 5000,
                usedMinutes: 4986,
                transactions: [
                  {
                    id: "t3",
                    date: "2024-01-12",
                    description: "Parks Committee Meeting",
                    minutes: 60,
                    user: "David Miller",
                    accountId: "acc2",
                    session: "Session #1236",
                    type: "usage" as const,
                  },
                ],
              },
            ],
          },
          {
            id: "ws2",
            name: "Marketing Department",
            organizationId: "org1",
            totalMinutes: 50000,
            usedMinutes: 22500,
            accounts: [
              {
                id: "acc3",
                name: "Marketing Events",
                workspaceId: "ws2",
                balance: 27500,
                totalAllocated: 50000,
                usedMinutes: 22500,
                transactions: [],
              },
            ],
          },
        ],
      },
    ];

    setBillingData(mockData);
  }, []);

  // No access - show permission denied
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to view billing information. Contact
                your organization administrator for access.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Required roles:</p>
              <div className="flex gap-2 justify-center mt-2">
                <Badge variant="outline">Organization Admin</Badge>
                <Badge variant="outline">Workspace Admin</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (billingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Permission indicator header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {accessLevel === "full" ? (
                <Shield className="h-5 w-5 text-blue-500" />
              ) : (
                <Users className="h-5 w-5 text-green-500" />
              )}
              <div>
                <h1 className="text-xl font-semibold">Billing Management</h1>
                <p className="text-sm text-gray-600">
                  {accessLevel === "full"
                    ? "Organization Administrator - Full Access"
                    : `Workspace Administrator - ${
                        activeWorkspace || "Current Workspace"
                      } Only`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={accessLevel === "full" ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <CreditCard className="h-3 w-3" />
              {accessLevel === "full"
                ? "Full Billing Access"
                : "Workspace Billing"}
            </Badge>
          </div>
        </div>

        {/* Workspace admin scope warning */}
        {accessLevel === "workspace_only" && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You can only view billing information for your workspace:{" "}
              <strong>{activeWorkspace}</strong>. For organization-wide billing
              access, contact your organization administrator.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main billing interface */}
      <div className="flex-1">
        <MultiLevelBillingLayout
          userRole={
            user.role === "organization_admin"
              ? "organization_admin"
              : "workspace_admin"
          }
          currentWorkspaceId={
            user.role === "workspace_admin" ? user.workspaceId : undefined
          }
          data={billingData}
        />
      </div>
    </div>
  );
}
