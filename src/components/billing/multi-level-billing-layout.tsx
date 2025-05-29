import React, { useState, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Building2,
  Users,
  CreditCard,
  ArrowLeft,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced interfaces for the billing hierarchy
interface Organization {
  id: string;
  name: string;
  totalMinutes: number;
  usedMinutes: number;
  workspaces: Workspace[];
}

interface Workspace {
  id: string;
  name: string;
  organizationId: string;
  totalMinutes: number;
  usedMinutes: number;
  accounts: Account[];
}

interface Account {
  id: string;
  name: string;
  workspaceId: string;
  balance: number;
  totalAllocated: number;
  usedMinutes: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  minutes: number;
  user: string;
  accountId: string;
  session?: string;
  type: "usage" | "allocation" | "adjustment";
}

interface BreadcrumbItem {
  id: string;
  name: string;
  level: "organization" | "workspace" | "account";
}

interface MultiLevelBillingLayoutProps {
  userRole: "organization_admin" | "workspace_admin";
  currentWorkspaceId?: string;
  data: Organization[];
}

export function MultiLevelBillingLayout({
  userRole,
  currentWorkspaceId,
  data,
}: MultiLevelBillingLayoutProps) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<
    "organization" | "workspace" | "account"
  >("organization");
  const [selectedItems, setSelectedItems] = useState<{
    organizationId?: string;
    workspaceId?: string;
    accountId?: string;
  }>({});
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [showTransactions, setShowTransactions] = useState(false);

  // Filter data based on user permissions
  const filteredData =
    userRole === "workspace_admin"
      ? data
          .map((org) => ({
            ...org,
            workspaces: org.workspaces.filter(
              (ws) => ws.id === currentWorkspaceId
            ),
          }))
          .filter((org) => org.workspaces.length > 0)
      : data;

  // Navigation handlers
  const navigateToWorkspace = (organizationId: string, workspaceId: string) => {
    setSelectedItems({ organizationId, workspaceId });
    setSelectedLevel("workspace");
    setBreadcrumb([
      {
        id: organizationId,
        name: data.find((o) => o.id === organizationId)?.name || "Organization",
        level: "organization",
      },
      {
        id: workspaceId,
        name:
          data
            .find((o) => o.id === organizationId)
            ?.workspaces.find((w) => w.id === workspaceId)?.name || "Workspace",
        level: "workspace",
      },
    ]);
  };

  const navigateToAccount = (accountId: string) => {
    const account = getCurrentAccounts().find((a) => a.id === accountId);
    if (account) {
      setSelectedItems((prev) => ({ ...prev, accountId }));
      setSelectedLevel("account");
      setShowTransactions(true);
      setBreadcrumb((prev) => [
        ...prev,
        { id: accountId, name: account.name, level: "account" },
      ]);
    }
  };

  const navigateBack = (level: BreadcrumbItem) => {
    const index = breadcrumb.findIndex((item) => item.id === level.id);
    setBreadcrumb(breadcrumb.slice(0, index + 1));

    if (level.level === "organization") {
      setSelectedLevel("organization");
      setSelectedItems({});
      setShowTransactions(false);
    } else if (level.level === "workspace") {
      setSelectedLevel("workspace");
      setSelectedItems((prev) => ({
        organizationId: prev.organizationId,
        workspaceId: level.id,
      }));
      setShowTransactions(false);
    }
  };

  // Data getters based on current selection
  const getCurrentWorkspaces = () => {
    if (selectedItems.organizationId) {
      return (
        filteredData.find((org) => org.id === selectedItems.organizationId)
          ?.workspaces || []
      );
    }
    return filteredData.flatMap((org) => org.workspaces);
  };

  const getCurrentAccounts = () => {
    if (selectedItems.workspaceId) {
      return (
        getCurrentWorkspaces().find((ws) => ws.id === selectedItems.workspaceId)
          ?.accounts || []
      );
    }
    return getCurrentWorkspaces().flatMap((ws) => ws.accounts);
  };

  const getCurrentTransactions = () => {
    if (selectedItems.accountId) {
      return (
        getCurrentAccounts().find((acc) => acc.id === selectedItems.accountId)
          ?.transactions || []
      );
    }
    if (viewMode === "all") {
      return getCurrentAccounts().flatMap((acc) => acc.transactions);
    }
    return [];
  };

  // Calculate aggregated stats
  const getAggregatedStats = () => {
    const accounts = getCurrentAccounts();
    return {
      totalAccounts: accounts.length,
      totalAllocated: accounts.reduce(
        (sum, acc) => sum + acc.totalAllocated,
        0
      ),
      totalUsed: accounts.reduce((sum, acc) => sum + acc.usedMinutes, 0),
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
    };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 p-4 border-b bg-white">
        {breadcrumb.map((item, index) => (
          <React.Fragment key={item.id}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateBack(item)}
              className="text-blue-600 hover:text-blue-800"
            >
              {item.name}
            </Button>
            {index < breadcrumb.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
        {breadcrumb.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setBreadcrumb([]);
              setSelectedLevel("organization");
              setSelectedItems({});
              setShowTransactions(false);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Overview
          </Button>
        )}
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Main List Panel */}
        <ResizablePanel defaultSize={showTransactions ? 30 : 50} minSize={25}>
          <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedLevel === "organization" && "Organizations"}
                  {selectedLevel === "workspace" && "Workspaces"}
                  {selectedLevel === "account" && "Accounts"}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  {selectedLevel === "account" && (
                    <Button
                      variant={viewMode === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setViewMode(viewMode === "all" ? "single" : "all")
                      }
                    >
                      {viewMode === "all"
                        ? "Show Individual"
                        : "View All Combined"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Aggregated Stats for current level */}
              {selectedLevel === "account" && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {(() => {
                    const stats = getAggregatedStats();
                    return (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {stats.totalAccounts}
                          </div>
                          <div className="text-xs text-gray-500">Accounts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {stats.totalAllocated.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Allocated
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {stats.totalUsed.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Used
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {stats.totalBalance.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-2">
              {/* Organization Level */}
              {selectedLevel === "organization" &&
                filteredData.map((org) => (
                  <Card
                    key={org.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      navigateToWorkspace(org.id, org.workspaces[0]?.id)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">{org.name}</div>
                            <div className="text-sm text-gray-500">
                              {org.workspaces.length} workspaces
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {org.totalMinutes.toLocaleString()} min
                          </div>
                          <div className="text-sm text-gray-500">
                            {org.usedMinutes.toLocaleString()} used
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Workspace Level */}
              {selectedLevel === "workspace" &&
                getCurrentWorkspaces().map((workspace) => (
                  <Card
                    key={workspace.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigateToAccount(workspace.accounts[0]?.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">{workspace.name}</div>
                            <div className="text-sm text-gray-500">
                              {workspace.accounts.length} accounts
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {workspace.totalMinutes.toLocaleString()} min
                          </div>
                          <div className="text-sm text-gray-500">
                            {workspace.usedMinutes.toLocaleString()} used
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Account Level */}
              {selectedLevel === "account" &&
                getCurrentAccounts().map((account) => (
                  <Card
                    key={account.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-shadow",
                      selectedItems.accountId === account.id &&
                        "ring-2 ring-blue-500"
                    )}
                    onClick={() => navigateToAccount(account.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium">{account.name}</div>
                            <div className="text-sm text-gray-500">
                              {account.transactions.length} transactions
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {account.balance.toLocaleString()} min
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.usedMinutes.toLocaleString()} used
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </ResizablePanel>

        {/* Details Panel - only show when account is selected or viewing all */}
        {showTransactions && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full bg-white flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">
                    {viewMode === "all"
                      ? "All Transactions"
                      : "Account Details"}
                  </h3>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <Tabs defaultValue="transactions" className="h-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="transactions">
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="transactions"
                      className="mt-4 space-y-2"
                    >
                      {getCurrentTransactions().map((transaction) => (
                        <Card key={transaction.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-sm">
                                {transaction.description}
                              </div>
                              <div className="text-xs text-gray-500">
                                {transaction.date} • {transaction.user}
                              </div>
                              {transaction.session && (
                                <div className="text-xs text-blue-600">
                                  {transaction.session}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div
                                className={cn(
                                  "font-medium",
                                  transaction.type === "usage"
                                    ? "text-red-600"
                                    : transaction.type === "allocation"
                                    ? "text-green-600"
                                    : "text-gray-600"
                                )}
                              >
                                {transaction.type === "usage" ? "-" : "+"}
                                {Math.abs(transaction.minutes)} min
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {transaction.type}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="summary" className="mt-4">
                      <div className="space-y-4">
                        <Card className="p-4">
                          <div className="text-lg font-semibold mb-2">
                            Usage Summary
                          </div>
                          {/* Add summary charts and metrics here */}
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-4">
                      <div className="space-y-4">
                        <Card className="p-4">
                          <div className="text-lg font-semibold mb-2">
                            Usage Analytics
                          </div>
                          {/* Add analytics charts here */}
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
