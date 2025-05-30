"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  X,
  ArrowLeft,
  ArrowRight,
  Download,
  Filter,
  Calendar,
  User,
  Clock,
  BarChart3,
  Mail,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface Account {
  id: string;
  title: string;
  accountId: string;
  service: "Active" | "Inactive" | "Suspended";
  description: string;
  ownerEmail: string;
  ownerName: string;
  availableMinutes: number;
  consumedMinutes: number;
  allowOverage: boolean;
}

interface Transaction {
  id: string;
  time: string; // Full timestamp
  description: string;
  amount: number; // in minutes
  type: "credit" | "debit" | "adjustment" | "usage";
  balance: number; // Running balance after transaction
  user: string; // Email address
  label?: string;
  note?: string;
  accountId: string;
}

// Navigation state type
type ViewMode = "accounts" | "transactions";

export default function BillingProjectsPage() {
  const [projects, setProjects] = useState<Account[]>([
    {
      id: "1",
      title: "Gardendale City",
      accountId: "Gardendale City",
      service: "Active",
      description: "the main project for Gardendale city council",
      ownerEmail: "gardendale@city.gov",
      ownerName: "Gardendale City Council",
      availableMinutes: 5514,
      consumedMinutes: 0,
      allowOverage: true,
    },
    {
      id: "2",
      title: "Parks and Rec",
      accountId: "Gardendale City",
      service: "Active",
      description: "-",
      ownerEmail: "parks@gardendale.gov",
      ownerName: "Gardendale Parks and Recreation",
      availableMinutes: 14,
      consumedMinutes: 0,
      allowOverage: true,
    },
    {
      id: "3",
      title: "Safety Outreach",
      accountId: "Gardendale City",
      service: "Active",
      description: "funding for disaster preparedness and fire prevention",
      ownerEmail: "safety@gardendale.gov",
      ownerName: "Gardendale Safety Outreach",
      availableMinutes: 5514,
      consumedMinutes: 0,
      allowOverage: true,
    },
  ]);

  // Navigation state
  const [viewMode, setViewMode] = useState<ViewMode>("accounts");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Navigation state
  const [navigationLevel, setNavigationLevel] = useState<
    "accounts" | "transactions"
  >("accounts");

  // Sample transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Most recent transactions
    {
      id: "t38",
      time: "2023-12-22T14:00:00",
      description: "Year-end performance review",
      amount: 240,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t39",
      time: "2023-12-22T15:00:00",
      description: "Final deployment testing",
      amount: 180,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t40",
      time: "2023-12-21T13:00:00",
      description: "Community feedback session",
      amount: 155,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t41",
      time: "2023-12-21T14:00:00",
      description: "Holiday allocation bonus",
      amount: 500,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t42",
      time: "2023-12-21T14:00:00",
      description: "Year-end compliance audit credit",
      amount: -25,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },

    // Usage transactions for Project 1
    {
      id: "t1",
      time: "2023-12-20T10:00:00",
      description: "Website audit session",
      amount: 120,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t2",
      time: "2023-12-19T11:00:00",
      description: "Content review and optimization",
      amount: 90,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t3",
      time: "2023-12-18T12:00:00",
      description: "Technical SEO analysis",
      amount: 150,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t4",
      time: "2023-12-15T13:00:00",
      description: "User experience consultation",
      amount: 200,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t5",
      time: "2023-12-12T14:00:00",
      description: "Performance optimization",
      amount: 180,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },

    // Usage transactions for Project 2
    {
      id: "t6",
      time: "2023-12-19T11:00:00",
      description: "API endpoint testing",
      amount: 75,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t7",
      time: "2023-12-17T12:00:00",
      description: "Database optimization",
      amount: 160,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t8",
      time: "2023-12-14T13:00:00",
      description: "Security audit",
      amount: 130,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t9",
      time: "2023-12-11T14:00:00",
      description: "Load testing session",
      amount: 95,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },

    // Usage transactions for Project 3
    {
      id: "t10",
      time: "2023-12-18T11:00:00",
      description: "Community moderation",
      amount: 85,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t11",
      time: "2023-12-16T12:00:00",
      description: "Community Safety Forum",
      amount: 105,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t25",
      time: "2023-12-13T13:00:00",
      description: "Content moderation training",
      amount: 140,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t26",
      time: "2023-12-10T14:00:00",
      description: "Safety policy review",
      amount: 110,
      type: "usage",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },

    // Allocation transactions
    {
      id: "t12",
      time: "2023-12-01T10:00:00",
      description: "Monthly allocation - December",
      amount: 2000,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t13",
      time: "2023-12-01T10:00:00",
      description: "Monthly allocation - December",
      amount: 500,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t14",
      time: "2023-12-01T10:00:00",
      description: "Monthly allocation - December",
      amount: 1500,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t15",
      time: "2023-11-15T10:00:00",
      description: "Additional allocation for budget review",
      amount: 300,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t16",
      time: "2023-11-20T10:00:00",
      description: "Emergency funding allocation",
      amount: 200,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t27",
      time: "2023-11-01T10:00:00",
      description: "Monthly allocation - November",
      amount: 1800,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t28",
      time: "2023-11-01T10:00:00",
      description: "Monthly allocation - November",
      amount: 450,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t29",
      time: "2023-11-01T10:00:00",
      description: "Monthly allocation - November",
      amount: 1200,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t30",
      time: "2023-10-15T10:00:00",
      description: "Q4 budget increase",
      amount: 500,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t31",
      time: "2023-10-15T10:00:00",
      description: "Development sprint allocation",
      amount: 250,
      type: "credit",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },

    // Adjustment transactions
    {
      id: "t17",
      time: "2023-12-05T10:00:00",
      description: "Correction for double billing",
      amount: -30,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t18",
      time: "2023-12-07T10:00:00",
      description: "Manual adjustment - technical issue",
      amount: -15,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t19",
      time: "2023-12-11T10:00:00",
      description: "Retroactive discount applied",
      amount: -45,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t20",
      time: "2023-12-13T10:00:00",
      description: "Credit for cancelled session",
      amount: -60,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t21",
      time: "2023-12-18T10:00:00",
      description: "Billing error correction",
      amount: 25,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t22",
      time: "2023-12-20T10:00:00",
      description: "Year-end adjustment",
      amount: 100,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t32",
      time: "2023-11-28T10:00:00",
      description: "Service credit for downtime",
      amount: -80,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t33",
      time: "2023-11-22T10:00:00",
      description: "Holiday bonus credit",
      amount: 150,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t34",
      time: "2023-11-18T10:00:00",
      description: "Error correction - overpayment refund",
      amount: -120,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
    {
      id: "t35",
      time: "2023-11-10T10:00:00",
      description: "Performance bonus credit",
      amount: 75,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "2",
    },
    {
      id: "t36",
      time: "2023-10-30T10:00:00",
      description: "Migration credit",
      amount: 200,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "3",
    },
    {
      id: "t37",
      time: "2023-10-25T10:00:00",
      description: "Beta testing compensation",
      amount: 90,
      type: "adjustment",
      balance: 5514,
      user: "gardendale@city.gov",
      accountId: "1",
    },
  ]);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<string>("all_combined");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Listen for field deselection events from the parent layout
  useEffect(() => {
    const handleFieldDeselected = (e: CustomEvent) => {
      if (selectedProjects.includes(e.detail.fieldId)) {
        setSelectedProjects([]);
      }
    };

    window.addEventListener("field-deselected" as any, handleFieldDeselected);

    return () => {
      window.removeEventListener(
        "field-deselected" as any,
        handleFieldDeselected
      );
    };
  }, [selectedProjects]);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setWorkspaceFilter(value);
  };

  // Handle row selection - now for single selection
  const handleRowSelect = (projectId: string, event?: React.MouseEvent) => {
    if (projectId === "all_combined") {
      setSelectedProject("all_combined");
      setSelectedProjects([]);
      // Show combined view - will be called after function is defined
    } else {
      setSelectedProject(projectId);
      setSelectedProjects([projectId]);
      // Show individual project
      showProjectTransactions(projectId);
    }
  };

  // Filter projects based on workspace
  const filteredProjects =
    workspaceFilter === "all"
      ? projects
      : projects.filter((project) => project.accountId === workspaceFilter);

  // Get unique workspaces for filter dropdown
  const workspaces = Array.from(
    new Set(projects.map((project) => project.accountId))
  );

  // Show project transactions in the side panel
  const showProjectTransactions = (projectId: string) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    if (!selectedProject) return;

    const projectTransactions = transactions.filter(
      (t) => t.accountId === projectId
    );

    // Generate the panel content
    const panelContent = renderTransactionsPanel(
      selectedProject,
      projectTransactions
    );

    // Dispatch event to show the panel
    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: projectId,
          content: panelContent,
          mode: "view",
        },
      })
    );
  };

  // Show combined view of all projects
  const showCombinedView = () => {
    if (filteredProjects.length > 0) {
      const allTransactions = transactions.filter((t) =>
        filteredProjects.some((p) => p.id === t.accountId)
      );

      const combinedProject: Account = {
        id: "combined",
        title: "All Projects Combined",
        accountId: "All Workspaces",
        service: "Active",
        description: `Viewing ${filteredProjects.length} projects`,
        ownerEmail: "",
        ownerName: "",
        availableMinutes: filteredProjects.reduce(
          (sum, p) => sum + p.availableMinutes,
          0
        ),
        consumedMinutes: 0,
        allowOverage: true,
      };

      const panelContent = renderTransactionsPanel(
        combinedProject,
        allTransactions
      );

      window.dispatchEvent(
        new CustomEvent("field-selected", {
          detail: {
            fieldId: "combined",
            content: panelContent,
            mode: "view",
          },
        })
      );
    }
  };

  // Update the handleRowSelect to actually call showCombinedView when it's defined
  useEffect(() => {
    if (selectedProject === "all_combined") {
      showCombinedView();
    }
  }, [selectedProject]);

  // Render the transactions panel with better proportions and scalable design
  const renderTransactionsPanel = (
    project: Account,
    projectTransactions: Transaction[]
  ) => {
    // Filter transactions based on the active tab
    const filteredTransactions =
      activeTab === "all"
        ? projectTransactions
        : projectTransactions.filter((t) => t.type === activeTab);

    // Sort transactions by date (most recent first)
    const sortedTransactions = filteredTransactions.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    // Calculate stats
    const totalUsage = projectTransactions
      .filter((t) => t.type === "usage")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = projectTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalAdjustments = projectTransactions
      .filter((t) => t.type === "adjustment")
      .reduce((sum, t) => sum + t.amount, 0);

    // For combined view, calculate total balance
    const totalBalance =
      selectedProject === "all_combined"
        ? filteredProjects.reduce((sum, p) => sum + p.availableMinutes, 0)
        : project?.availableMinutes || 0;

    const displayBalance =
      selectedProject === "all_combined"
        ? `${totalBalance.toLocaleString()} total`
        : project?.availableMinutes.toLocaleString();

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header with Project Info */}
        <div className="flex-shrink-0 border-b bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-lg font-semibold truncate">
                  {project?.title || "Combined View"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {project
                    ? `${project.accountId} • ${project.description}`
                    : `${filteredProjects.length} projects combined`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className="bg-[#e0f7fa] text-[#006064] border-0"
                >
                  {displayBalance}
                </Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Compact Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Current Balance
                    </div>
                    <div className="text-base font-semibold truncate">
                      {totalBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-[#e0f7fa] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#00838f] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Total Used
                    </div>
                    <div className="text-base font-semibold text-blue-600 truncate">
                      {totalUsage.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Net Adjustments
                    </div>
                    <div
                      className={`text-base font-semibold truncate ${
                        totalAdjustments + totalCredit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {totalAdjustments + totalCredit > 0 ? "+" : ""}
                      {(totalAdjustments + totalCredit).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      totalAdjustments + totalCredit >= 0
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        totalAdjustments + totalCredit >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History - Primary Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Transaction Header with Filters */}
          <div className="flex-shrink-0 p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Transaction History</h4>
              <span className="text-sm text-gray-500">
                {sortedTransactions.length} transactions
              </span>
            </div>

            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full bg-white border border-gray-200 p-0">
                <TabsTrigger
                  value="all"
                  className="flex-1 data-[state=active]:bg-gray-100"
                >
                  All ({projectTransactions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="usage"
                  className="flex-1 data-[state=active]:bg-gray-100"
                >
                  Usage (
                  {projectTransactions.filter((t) => t.type === "usage").length}
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="credit"
                  className="flex-1 data-[state=active]:bg-gray-100"
                >
                  Credits (
                  {
                    projectTransactions.filter((t) => t.type === "credit")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="adjustment"
                  className="flex-1 data-[state=active]:bg-gray-100"
                >
                  Adjustments (
                  {
                    projectTransactions.filter((t) => t.type === "adjustment")
                      .length
                  }
                  )
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Scrollable Transaction List */}
          <div className="flex-1 overflow-auto">
            <div className="w-full">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead className="text-xs font-medium w-auto min-w-[70px]">
                      Time
                    </TableHead>
                    <TableHead className="text-xs font-medium w-auto">
                      Description
                    </TableHead>
                    <TableHead className="text-xs font-medium w-auto min-w-[45px]">
                      User
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium w-auto min-w-[45px]">
                      Amount
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium w-auto min-w-[50px]">
                      Balance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-mono text-xs py-3 w-auto min-w-[70px]">
                          <div className="text-[10px] leading-tight">
                            {new Date(transaction.time).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="text-[9px] text-gray-500">
                            {new Date(transaction.time).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 w-auto">
                          <div className="space-y-1">
                            <div className="text-xs font-medium leading-tight">
                              <div className="truncate max-w-[120px]">
                                {transaction.description}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1 py-0.5 font-normal ${
                                transaction.type === "usage"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : transaction.type === "credit"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : transaction.type === "debit"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 py-3 font-mono w-auto min-w-[45px]">
                          <div
                            className="truncate text-[10px] max-w-[40px]"
                            title={transaction.user}
                          >
                            {transaction.user.split("@")[0].slice(0, 4)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono py-3 w-auto min-w-[45px]">
                          <span
                            className={`text-[10px] ${
                              transaction.amount < 0
                                ? "text-red-600"
                                : transaction.type === "credit"
                                ? "text-green-600"
                                : transaction.type === "usage"
                                ? "text-blue-600"
                                : "text-gray-900"
                            }`}
                          >
                            {transaction.amount > 0 &&
                            transaction.type === "credit"
                              ? "+"
                              : transaction.amount < 0
                              ? ""
                              : transaction.type === "usage"
                              ? "-"
                              : ""}
                            {Math.abs(transaction.amount) >= 1000
                              ? `${
                                  Math.round(
                                    Math.abs(transaction.amount) / 100
                                  ) / 10
                                }k`
                              : Math.abs(transaction.amount).toString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono py-3 w-auto min-w-[50px]">
                          <span className="text-[10px] text-gray-900">
                            {transaction.balance >= 1000
                              ? `${Math.round(transaction.balance / 100) / 10}k`
                              : transaction.balance.toString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-gray-500 py-8"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm">No transactions found</p>
                          <p className="text-xs mt-1 text-gray-400">
                            Try a different filter
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle account selection to navigate to transactions view
  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
    setSelectedTransaction(null);
    setNavigationLevel("transactions");
    // Show account summary in right panel
    showAccountSummary(account);
  };

  // Handle transaction selection to show details in right panel
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // Show transaction details in right panel
    showTransactionDetails(transaction);
  };

  // Navigate back to accounts view
  const handleBackToAccounts = () => {
    setSelectedAccount(null);
    setSelectedTransaction(null);
    setNavigationLevel("accounts");
    // Clear right panel
    window.dispatchEvent(
      new CustomEvent("field-deselected", { detail: { fieldId: "all" } })
    );
  };

  // Show account summary in right panel
  const showAccountSummary = (account: Account) => {
    const accountTransactions = transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const panelContent = renderAccountSummaryPanel(
      account,
      accountTransactions
    );

    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: account.id,
          content: panelContent,
          mode: "view",
        },
      })
    );
  };

  // Render account summary panel (more concise than full details)
  const renderAccountSummaryPanel = (
    account: Account,
    accountTransactions: Transaction[]
  ) => {
    // Calculate stats
    const totalUsage = accountTransactions
      .filter((t) => t.type === "usage")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = accountTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalAdjustments = accountTransactions
      .filter((t) => t.type === "adjustment")
      .reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Account Header */}
        <div className="flex-shrink-0 border-b bg-white p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-lg font-semibold text-secondary-navy-800 truncate">
                {account.title}
              </h3>
              <p className="text-sm text-secondary-navy-600 mt-1 truncate">
                {account.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-secondary-navy-600">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {account.ownerName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {account.ownerEmail}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-primary-teal-700">
                {account.availableMinutes.toLocaleString()}
              </div>
              <div className="text-xs text-secondary-navy-600">
                Available Minutes
              </div>
              <Badge
                variant="outline"
                className="mt-1 bg-primary-teal-50 text-primary-teal-700 border-primary-teal-200 text-xs"
              >
                {account.service}
              </Badge>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-teal-25 rounded-lg p-3 border border-primary-teal-100">
              <div className="text-xs text-secondary-navy-600 mb-1">
                Total Used
              </div>
              <div className="text-lg font-semibold text-primary-teal-700">
                {totalUsage.toLocaleString()}
              </div>
              <div className="text-xs text-secondary-navy-500">minutes</div>
            </div>
            <div className="bg-green-25 rounded-lg p-3 border border-green-100">
              <div className="text-xs text-secondary-navy-600 mb-1">
                Net Credits
              </div>
              <div className="text-lg font-semibold text-green-700">
                +{(totalCredit + totalAdjustments).toLocaleString()}
              </div>
              <div className="text-xs text-secondary-navy-500">minutes</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex-1 p-4">
          <h4 className="text-sm font-semibold text-secondary-navy-700 mb-3">
            Transaction Summary
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-25 rounded border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-secondary-navy-700">Usage</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {accountTransactions.filter((t) => t.type === "usage").length}{" "}
                transactions
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-green-25 rounded border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-secondary-navy-700">Credits</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {accountTransactions.filter((t) => t.type === "credit").length}{" "}
                transactions
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-orange-25 rounded border border-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-secondary-navy-700">
                  Adjustments
                </span>
              </div>
              <span className="text-sm font-medium text-orange-600">
                {
                  accountTransactions.filter((t) => t.type === "adjustment")
                    .length
                }{" "}
                transactions
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-secondary-navy-500 mb-2">
              Account Owner
            </div>
            <div className="text-sm text-secondary-navy-700">
              {account.ownerName}
            </div>
            <div className="text-xs text-secondary-navy-500">
              {account.ownerEmail}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get account transactions for the transactions view
  const getAccountTransactions = () => {
    if (!selectedAccount) return [];
    return transactions
      .filter((t) => t.accountId === selectedAccount.id)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  // Render accounts list for the middle area
  const renderAccountsList = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">All Accounts</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click an account to view its transactions.
        </p>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                Account
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                Owner
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                Service
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                Available
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                Consumed
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3 text-right pr-6">
                Allow Overage
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer transition-colors hover:bg-primary-teal-25"
                onClick={() => handleAccountClick(account)}
              >
                <TableCell className="py-3">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="truncate">{account.title}</span>
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0.5 font-mono flex-shrink-0"
                      >
                        {account.accountId}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {account.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {account.ownerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {account.ownerEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant={
                      account.service === "Active" ? "default" : "secondary"
                    }
                    className={
                      account.service === "Active"
                        ? "bg-green-100 text-green-800 border-green-300 text-xs"
                        : account.service === "Inactive"
                        ? "bg-gray-100 text-gray-800 border-gray-300 text-xs"
                        : "bg-red-100 text-red-800 border-red-300 text-xs"
                    }
                  >
                    {account.service}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-medium text-primary-teal-700 text-sm">
                    {account.availableMinutes.toLocaleString()} mins
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-medium text-sm">
                    {account.consumedMinutes.toLocaleString()} mins
                  </span>
                </TableCell>
                <TableCell className="py-3 text-right pr-6">
                  <Badge
                    variant={account.allowOverage ? "default" : "secondary"}
                    className={
                      account.allowOverage
                        ? "bg-blue-100 text-blue-800 border-blue-300 text-xs"
                        : "bg-gray-100 text-gray-800 border-gray-300 text-xs"
                    }
                  >
                    {account.allowOverage ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render transactions list for the middle area
  const renderTransactionsList = () => {
    const accountTransactions = getAccountTransactions();

    const getTypeColor = (type: string) => {
      switch (type) {
        case "credit":
          return "text-green-600 bg-green-50 border-green-200";
        case "usage":
          return "text-blue-600 bg-blue-50 border-blue-200";
        case "adjustment":
          return "text-orange-600 bg-orange-50 border-orange-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    };

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedAccount?.title} Transactions
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Click a transaction to view details.{" "}
                {accountTransactions.length} total transactions.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToAccounts}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Accounts
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                  Date & Time
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                  Description
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                  Type
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3">
                  User
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3 text-right">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide py-3 text-right">
                  Balance After
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={`cursor-pointer transition-colors hover:bg-primary-teal-25 ${
                    selectedTransaction?.id === transaction.id
                      ? "bg-accent-light-blue-50 border-l-4 border-primary-teal-500"
                      : ""
                  }`}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell className="py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(transaction.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-medium text-gray-900 text-sm">
                      {transaction.description}
                    </div>
                    {transaction.note && (
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.note}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      className={`${getTypeColor(
                        transaction.type
                      )} border text-xs px-2 py-1`}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-sm text-gray-900">
                      {transaction.user.split("@")[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{transaction.user.split("@")[1]}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : transaction.type === "usage"
                          ? "text-blue-600"
                          : transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ||
                      (transaction.type === "adjustment" &&
                        transaction.amount > 0)
                        ? "+"
                        : transaction.type === "usage" || transaction.amount < 0
                        ? "-"
                        : ""}
                      {Math.abs(transaction.amount).toLocaleString()} mins
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {transaction.balance.toLocaleString()} mins
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {accountTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <div className="text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        No transactions found for this account
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Show transaction details in right panel
  const showTransactionDetails = (transaction: Transaction) => {
    const account = projects.find((p) => p.id === transaction.accountId);
    const panelContent = renderTransactionDetailsPanel(transaction, account);

    window.dispatchEvent(
      new CustomEvent("field-selected", {
        detail: {
          fieldId: transaction.id,
          content: panelContent,
          mode: "view",
        },
      })
    );
  };

  // Render transaction details panel
  const renderTransactionDetailsPanel = (
    transaction: Transaction,
    account?: Account
  ) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case "credit":
          return "text-green-600 bg-green-50";
        case "usage":
          return "text-blue-600 bg-blue-50";
        case "adjustment":
          return "text-orange-600 bg-orange-50";
        default:
          return "text-gray-600 bg-gray-50";
      }
    };

    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 border-b bg-white p-4">
          <h3 className="text-lg font-semibold mb-4 text-secondary-navy-800">
            Transaction Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Time
              </label>
              <p className="text-sm">{formatDate(transaction.time)}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <p className="text-sm">{transaction.description}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amount
              </label>
              <p className="text-sm font-medium">
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toLocaleString()} mins
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Type
              </label>
              <div className="mt-1">
                <Badge
                  className={`${getTypeColor(
                    transaction.type
                  )} border-0 text-xs`}
                >
                  {transaction.type}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Balance After
              </label>
              <p className="text-sm">
                {transaction.balance.toLocaleString()} mins
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                User
              </label>
              <p className="text-sm">{transaction.user}</p>
            </div>

            {account && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Account
                </label>
                <p className="text-sm">{account.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation - Separate from scorecards */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-25 rounded-lg border border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          {navigationLevel === "accounts" ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-primary-teal-100 rounded-md flex items-center justify-center">
                <CreditCard className="h-3 w-3 text-primary-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                All Accounts
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToAccounts}
                className="text-primary-teal-600 hover:text-primary-teal-800 hover:bg-primary-teal-50 h-6 px-2 gap-1 text-xs"
              >
                <ArrowLeft className="h-3 w-3" />
                Accounts
              </Button>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-primary-teal-100 rounded-md flex items-center justify-center">
                  <User className="h-3 w-3 text-primary-teal-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedAccount?.title}
                </span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-secondary-navy-100 rounded-md flex items-center justify-center">
                  <Clock className="h-3 w-3 text-secondary-navy-600" />
                </div>
                <span className="text-sm text-gray-600">Transactions</span>
                {selectedTransaction && (
                  <>
                    <div className="h-3 w-px bg-gray-300" />
                    <span className="text-xs text-gray-500 max-w-[200px] truncate">
                      {selectedTransaction.description}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scorecards - Clean and separate */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-primary-teal-50 to-primary-teal-25 rounded-lg p-3 border border-primary-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-secondary-navy-600 mb-1">
                  Total Accounts
                </div>
                <div className="text-xl font-bold text-primary-teal-700">
                  {projects.length}
                </div>
              </div>
              <div className="h-8 w-8 bg-primary-teal-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary-navy-50 to-secondary-navy-25 rounded-lg p-3 border border-secondary-navy-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-secondary-navy-600 mb-1">
                  Total Available
                </div>
                <div className="text-xl font-bold text-secondary-navy-700">
                  {filteredProjects
                    .reduce((sum, p) => sum + p.availableMinutes, 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="h-8 w-8 bg-secondary-navy-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-secondary-navy-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-25 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-secondary-navy-600 mb-1">
                  Active Accounts
                </div>
                <div className="text-xl font-bold text-green-700">
                  {projects.filter((p) => p.service === "Active").length}
                </div>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent-light-blue-50 to-accent-light-blue-25 rounded-lg p-3 border border-accent-light-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-secondary-navy-600 mb-1">
                  Total Transactions
                </div>
                <div className="text-xl font-bold text-accent-light-blue-700">
                  {transactions.length}
                </div>
              </div>
              <div className="h-8 w-8 bg-accent-light-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-accent-light-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consolidated Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {navigationLevel === "accounts"
                  ? "Account Filters:"
                  : "Transaction Filters:"}
              </span>
            </div>

            {navigationLevel === "accounts" && (
              <>
                <Select
                  value={workspaceFilter}
                  onValueChange={handleFilterChange}
                >
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workspaces</SelectItem>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={
                    selectedProject === "all_combined" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleRowSelect("all_combined")}
                  className="bg-accent-light-blue-100 hover:bg-accent-light-blue-200 text-secondary-navy-700 h-8"
                >
                  <BarChart3 className="h-3 w-3 mr-2" />
                  View All Combined
                </Button>
              </>
            )}

            {navigationLevel === "transactions" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAccounts}
                className="h-8"
              >
                <ChevronLeft className="h-3 w-3 mr-2" />
                Back to Accounts
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
            {navigationLevel === "accounts" && (
              <Button className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white h-8">
                <Plus className="h-3 w-3 mr-2" />
                Add Account
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Main Content with Transitions */}
      <div className="relative">
        <div
          className={`transition-all duration-300 ease-in-out ${
            navigationLevel === "accounts"
              ? "opacity-100 transform translate-x-0"
              : "opacity-0 transform -translate-x-4 absolute inset-0 pointer-events-none"
          }`}
        >
          {renderAccountsList()}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            navigationLevel === "transactions"
              ? "opacity-100 transform translate-x-0"
              : "opacity-0 transform translate-x-4 absolute inset-0 pointer-events-none"
          }`}
        >
          {navigationLevel === "transactions" && renderTransactionsList()}
        </div>
      </div>
    </div>
  );
}
