"use client";

import { useState, useEffect } from "react";
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

// Sample billing project data
interface BillingProject {
  id: string;
  name: string;
  workspace: string;
  description: string;
  balance: string;
  minutesValue: number;
}

// Sample transaction data
interface Transaction {
  id: string;
  date: string;
  description: string;
  minutes: number;
  user: string;
  projectId: string;
  session?: string;
  type: "usage" | "allocation" | "adjustment";
}

export default function BillingProjectsPage() {
  const [projects, setProjects] = useState<BillingProject[]>([
    {
      id: "1",
      name: "Gardendale City",
      workspace: "Gardendale City",
      description: "the main project for Gardendale city council",
      balance: "5,514 minutes",
      minutesValue: 5514,
    },
    {
      id: "2",
      name: "Parks and Rec",
      workspace: "Gardendale City",
      description: "-",
      balance: "14 minutes",
      minutesValue: 14,
    },
    {
      id: "3",
      name: "Safety Outreach",
      workspace: "Gardendale City",
      description: "funding for disaster preparedness and fire prevention",
      balance: "5,514 minutes",
      minutesValue: 5514,
    },
  ]);

  // Sample transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Usage transactions - Project 1 (Gardendale City)
    {
      id: "t1",
      date: "2023-12-01",
      description: "City Council Meeting",
      minutes: 120,
      user: "Sarah Johnson",
      projectId: "1",
      session: "Session #1234",
      type: "usage",
    },
    {
      id: "t2",
      date: "2023-12-05",
      description: "Budget Review Session",
      minutes: 90,
      user: "Mark Wilson",
      projectId: "1",
      session: "Session #1235",
      type: "usage",
    },
    {
      id: "t3",
      date: "2023-12-08",
      description: "Planning Commission Meeting",
      minutes: 75,
      user: "Lisa Chen",
      projectId: "1",
      session: "Session #1237",
      type: "usage",
    },
    {
      id: "t4",
      date: "2023-12-12",
      description: "Emergency Council Session",
      minutes: 45,
      user: "David Miller",
      projectId: "1",
      session: "Session #1238",
      type: "usage",
    },
    {
      id: "t5",
      date: "2023-12-15",
      description: "Public Hearing - Zoning",
      minutes: 180,
      user: "Sarah Johnson",
      projectId: "1",
      session: "Session #1239",
      type: "usage",
    },

    // Usage transactions - Project 2 (Parks and Rec)
    {
      id: "t6",
      date: "2023-12-03",
      description: "Parks Committee Meeting",
      minutes: 60,
      user: "David Miller",
      projectId: "2",
      session: "Session #1236",
      type: "usage",
    },
    {
      id: "t7",
      date: "2023-12-10",
      description: "Recreation Planning Session",
      minutes: 90,
      user: "Amy Rodriguez",
      projectId: "2",
      session: "Session #1240",
      type: "usage",
    },
    {
      id: "t8",
      date: "2023-12-14",
      description: "Youth Programs Review",
      minutes: 45,
      user: "Mike Thompson",
      projectId: "2",
      session: "Session #1241",
      type: "usage",
    },

    // Usage transactions - Project 3 (Safety Outreach)
    {
      id: "t9",
      date: "2023-12-02",
      description: "Fire Prevention Workshop",
      minutes: 120,
      user: "Jennifer Lee",
      projectId: "3",
      session: "Session #1242",
      type: "usage",
    },
    {
      id: "t10",
      date: "2023-12-09",
      description: "Emergency Preparedness Training",
      minutes: 150,
      user: "Robert Garcia",
      projectId: "3",
      session: "Session #1243",
      type: "usage",
    },
    {
      id: "t11",
      date: "2023-12-16",
      description: "Community Safety Forum",
      minutes: 105,
      user: "Jennifer Lee",
      projectId: "3",
      session: "Session #1244",
      type: "usage",
    },

    // Allocation transactions
    {
      id: "t12",
      date: "2023-12-01",
      description: "Monthly allocation - December",
      minutes: 2000,
      user: "Admin",
      projectId: "1",
      type: "allocation",
    },
    {
      id: "t13",
      date: "2023-12-01",
      description: "Monthly allocation - December",
      minutes: 500,
      user: "Admin",
      projectId: "2",
      type: "allocation",
    },
    {
      id: "t14",
      date: "2023-12-01",
      description: "Monthly allocation - December",
      minutes: 1500,
      user: "Admin",
      projectId: "3",
      type: "allocation",
    },
    {
      id: "t15",
      date: "2023-11-15",
      description: "Additional allocation for budget review",
      minutes: 300,
      user: "Finance Admin",
      projectId: "1",
      type: "allocation",
    },
    {
      id: "t16",
      date: "2023-11-20",
      description: "Emergency funding allocation",
      minutes: 200,
      user: "Emergency Admin",
      projectId: "3",
      type: "allocation",
    },

    // Adjustment transactions
    {
      id: "t17",
      date: "2023-12-05",
      description: "Correction for double billing",
      minutes: -30,
      user: "Admin",
      projectId: "1",
      type: "adjustment",
    },
    {
      id: "t18",
      date: "2023-12-07",
      description: "Manual adjustment - technical issue",
      minutes: -15,
      user: "Tech Support",
      projectId: "2",
      type: "adjustment",
    },
    {
      id: "t19",
      date: "2023-12-11",
      description: "Retroactive discount applied",
      minutes: -45,
      user: "Billing Admin",
      projectId: "1",
      type: "adjustment",
    },
    {
      id: "t20",
      date: "2023-12-13",
      description: "Credit for cancelled session",
      minutes: -60,
      user: "Admin",
      projectId: "3",
      type: "adjustment",
    },
    {
      id: "t21",
      date: "2023-12-18",
      description: "Billing error correction",
      minutes: 25,
      user: "Finance Admin",
      projectId: "2",
      type: "adjustment",
    },
    {
      id: "t22",
      date: "2023-12-20",
      description: "Year-end adjustment",
      minutes: 100,
      user: "Admin",
      projectId: "1",
      type: "adjustment",
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
      : projects.filter((project) => project.workspace === workspaceFilter);

  // Get unique workspaces for filter dropdown
  const workspaces = Array.from(
    new Set(projects.map((project) => project.workspace))
  );

  // Show project transactions in the side panel
  const showProjectTransactions = (projectId: string) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    if (!selectedProject) return;

    const projectTransactions = transactions.filter(
      (t) => t.projectId === projectId
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
        filteredProjects.some((p) => p.id === t.projectId)
      );

      const combinedProject: BillingProject = {
        id: "combined",
        name: "All Projects Combined",
        workspace: "All Workspaces",
        description: `Viewing ${filteredProjects.length} projects`,
        balance: `${filteredProjects.reduce(
          (sum, p) => sum + p.minutesValue,
          0
        )} minutes`,
        minutesValue: filteredProjects.reduce(
          (sum, p) => sum + p.minutesValue,
          0
        ),
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
    project: BillingProject,
    projectTransactions: Transaction[]
  ) => {
    // Filter transactions based on the active tab
    const filteredTransactions =
      activeTab === "all"
        ? projectTransactions
        : projectTransactions.filter((t) => t.type === activeTab);

    // Calculate stats
    const totalUsage = projectTransactions
      .filter((t) => t.type === "usage")
      .reduce((sum, t) => sum + t.minutes, 0);
    const totalAllocation = projectTransactions
      .filter((t) => t.type === "allocation")
      .reduce((sum, t) => sum + t.minutes, 0);
    const totalAdjustments = projectTransactions
      .filter((t) => t.type === "adjustment")
      .reduce((sum, t) => sum + t.minutes, 0);

    // For combined view, calculate total balance
    const totalBalance =
      selectedProject === "all_combined"
        ? filteredProjects.reduce((sum, p) => sum + p.minutesValue, 0)
        : project?.minutesValue || 0;

    const displayBalance =
      selectedProject === "all_combined"
        ? `${totalBalance.toLocaleString()} total`
        : project?.balance || "0";

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Compact Header with Project Info */}
        <div className="flex-shrink-0 border-b bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {project?.name || "Combined View"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {project
                    ? `${project.workspace} • ${project.description}`
                    : `${filteredProjects.length} projects combined`}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Current Balance
                    </div>
                    <div className="text-base font-semibold">
                      {totalBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-[#e0f7fa] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00838f] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Total Used
                    </div>
                    <div className="text-base font-semibold text-blue-600">
                      {totalUsage.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Net Adjustments
                    </div>
                    <div
                      className={`text-base font-semibold ${
                        totalAdjustments + totalAllocation >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {totalAdjustments + totalAllocation > 0 ? "+" : ""}
                      {(totalAdjustments + totalAllocation).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      totalAdjustments + totalAllocation >= 0
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        totalAdjustments + totalAllocation >= 0
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
                {filteredTransactions.length} transactions
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
                  value="allocation"
                  className="flex-1 data-[state=active]:bg-gray-100"
                >
                  Allocations (
                  {
                    projectTransactions.filter((t) => t.type === "allocation")
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
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[100px] text-xs font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-medium">
                    Description
                  </TableHead>
                  <TableHead className="w-[80px] text-xs font-medium">
                    User
                  </TableHead>
                  <TableHead className="w-[100px] text-right text-xs font-medium">
                    Minutes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm py-3">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {transaction.description}
                            <Badge
                              variant="outline"
                              className={`px-1.5 py-0.5 text-xs font-normal ${
                                transaction.type === "usage"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : transaction.type === "allocation"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                          {transaction.session && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {transaction.session}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 py-3">
                        {transaction.user}
                      </TableCell>
                      <TableCell className="text-right font-medium font-mono py-3">
                        <span
                          className={`text-sm ${
                            transaction.minutes < 0
                              ? "text-red-600"
                              : transaction.type === "allocation"
                              ? "text-green-600"
                              : transaction.type === "usage"
                              ? "text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {transaction.minutes > 0 &&
                          transaction.type !== "usage"
                            ? "+"
                            : ""}
                          {transaction.minutes.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
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
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Billing Projects</h2>
          <p className="text-gray-500 mt-1">
            Track and allocate minutes across workspaces with billing projects.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-brand-teal hover:bg-brand-teal/90 text-white"
          onClick={() => {
            // Handle add new billing project
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Billing Project
        </Button>
      </div>

      {/* Selection and Filters Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="p-4">
          {/* Cleaner header row with view toggle and filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle - More subtle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex rounded-md border border-gray-200 bg-white">
                  <button
                    onClick={() => {
                      if (filteredProjects.length > 0) {
                        handleRowSelect(filteredProjects[0].id);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-l-md transition-colors ${
                      selectedProject !== "all_combined"
                        ? "bg-blue-50 text-blue-700 border-r border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => handleRowSelect("all_combined")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-r-md transition-colors ${
                      selectedProject === "all_combined"
                        ? "bg-blue-50 text-blue-700 border-l border-blue-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Combined ({filteredProjects.length})
                  </button>
                </div>
              </div>

              {/* Workspace Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Workspace:</span>
                <Select
                  value={workspaceFilter}
                  onValueChange={handleFilterChange}
                >
                  <SelectTrigger className="h-8 text-sm border-gray-200 bg-white px-3 py-1 w-[160px]">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All workspaces</SelectItem>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                className="h-8 max-w-[200px] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="border-t border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px] pl-6">
                {selectedProject !== "all_combined" && (
                  <span className="sr-only">Select</span>
                )}
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Billing Project
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Workspace
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Description
              </TableHead>
              <TableHead className="text-right pr-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Balance
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                    selectedProject === project.id
                      ? "bg-blue-50 border-l-2 border-l-blue-500"
                      : ""
                  }`}
                  onClick={(event) => handleRowSelect(project.id, event)}
                >
                  <TableCell className="pl-6 py-4">
                    {selectedProject !== "all_combined" && (
                      <input
                        type="radio"
                        name="project_selection"
                        value={project.id}
                        checked={selectedProject === project.id}
                        onChange={() => handleRowSelect(project.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium text-gray-900">
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-gray-600">
                      {project.workspace}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {project.description === "-" ? (
                      <span className="text-sm text-gray-400 italic">
                        No description
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">
                        {project.description}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <span className="font-medium text-gray-900">
                      {project.balance}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center py-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-sm mb-2">No billing projects found</p>
                    <p className="text-xs text-gray-400">
                      Try changing your filter or add a new billing project
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
}
