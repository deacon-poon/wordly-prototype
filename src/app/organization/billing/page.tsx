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
import { Checkbox } from "@/components/ui/checkbox";
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
    {
      id: "t1",
      date: "2023-04-01",
      description: "City Council Meeting",
      minutes: 120,
      user: "Sarah Johnson",
      projectId: "1",
      session: "Session #1234",
      type: "usage",
    },
    {
      id: "t2",
      date: "2023-04-05",
      description: "Budget Review Session",
      minutes: 90,
      user: "Mark Wilson",
      projectId: "1",
      session: "Session #1235",
      type: "usage",
    },
    {
      id: "t3",
      date: "2023-04-10",
      description: "Added minutes allocation",
      minutes: 500,
      user: "Admin",
      projectId: "1",
      type: "allocation",
    },
    {
      id: "t4",
      date: "2023-04-15",
      description: "Parks Committee Meeting",
      minutes: 60,
      user: "David Miller",
      projectId: "2",
      session: "Session #1236",
      type: "usage",
    },
    {
      id: "t5",
      date: "2023-04-20",
      description: "Manual adjustment",
      minutes: -50,
      user: "Admin",
      projectId: "2",
      type: "adjustment",
    },
  ]);

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
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

  // Handle row selection
  const handleRowSelect = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([projectId]);
      showProjectTransactions(projectId);
    }
  };

  // Handle header checkbox
  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      // Select only the first project to show details when selecting all
      if (filteredProjects.length > 0) {
        setSelectedProjects([filteredProjects[0].id]);
        showProjectTransactions(filteredProjects[0].id);
      }
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

  // Render the transactions panel
  const renderTransactionsPanel = (
    project: BillingProject,
    projectTransactions: Transaction[]
  ) => {
    // Filter transactions based on the active tab
    const filteredTransactions =
      activeTab === "all"
        ? projectTransactions
        : projectTransactions.filter((t) => t.type === activeTab);

    // Calculate some stats
    const totalUsage = projectTransactions
      .filter((t) => t.type === "usage")
      .reduce((sum, t) => sum + t.minutes, 0);
    const totalAllocation = projectTransactions
      .filter((t) => t.type === "allocation")
      .reduce((sum, t) => sum + t.minutes, 0);
    const totalAdjustments = projectTransactions
      .filter((t) => t.type === "adjustment")
      .reduce((sum, t) => sum + t.minutes, 0);

    return (
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {project.description !== "-"
                ? project.description
                : "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.balance}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsage} minutes</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Transaction History</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Tabs
                  defaultValue="all"
                  className="w-[400px]"
                  onValueChange={setActiveTab}
                >
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="allocation">Allocations</TabsTrigger>
                    <TabsTrigger value="adjustment">Adjustments</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Export
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Minutes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {transaction.description}
                              </div>
                              {transaction.session && (
                                <div className="text-xs text-gray-500">
                                  {transaction.session}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "usage"
                                  ? "outline"
                                  : transaction.type === "allocation"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                transaction.type === "usage"
                                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                  : transaction.type === "allocation"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span
                              className={
                                transaction.minutes < 0 ? "text-red-600" : ""
                              }
                            >
                              {transaction.minutes > 0 &&
                              transaction.type !== "usage"
                                ? "+"
                                : ""}
                              {transaction.minutes}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-gray-500"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
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
          className="bg-[#006064] hover:bg-[#00474a] text-white"
          onClick={() => {
            // Handle add new billing project
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Billing Project
        </Button>
      </div>

      <div className="border-t border-gray-200">
        <div className="py-2 px-6 flex items-center justify-between bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                Workspace:
              </span>
              <Select
                value={workspaceFilter}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="h-8 min-h-8 text-xs border-gray-200 bg-white px-2.5 py-1 w-[160px]">
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
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search projects..."
              className="h-8 max-w-[180px] text-xs"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[40px] pl-6">
                <Checkbox
                  checked={
                    filteredProjects.length > 0 &&
                    selectedProjects.length === filteredProjects.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Billing Project</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right pr-6">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedProjects.includes(project.id) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleRowSelect(project.id)}
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleRowSelect(project.id)}
                      aria-label={`Select ${project.name}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.workspace}</TableCell>
                  <TableCell>
                    {project.description === "-" ? (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    ) : (
                      project.description
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-right pr-6">
                    {project.balance}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-2">No billing projects found</p>
                    <p className="text-sm">
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
