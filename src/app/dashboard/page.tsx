"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { selectUserPlan, selectUserActivity } from "@/store/slices/userSlice";
import {
  BarChart3,
  Clock,
  CreditCard,
  Download,
  LineChart,
  MoreHorizontal,
  PlusCircle,
  Settings,
  TrendingUp,
  Users,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Filter,
  CalendarIcon,
} from "lucide-react";

// Mock data for demo purposes
const mockActivityData = [
  {
    title: "English to Spanish Translation",
    status: "completed",
    type: "Translation",
    duration: 45,
  },
  {
    title: "German Conference Call",
    status: "in-progress",
    type: "Interpretation",
    duration: 60,
  },
  {
    title: "French Document Review",
    status: "scheduled",
    type: "Translation",
    duration: 30,
  },
  {
    title: "Chinese Interview",
    status: "completed",
    type: "Interpretation",
    duration: 55,
  },
];

// Mock accounts data
const mockAccountsData = [
  { id: 1, name: "Marketing Team" },
  { id: 2, name: "Sales Department" },
  { id: 3, name: "Executive Office" },
];

export default function DashboardPage() {
  const userPlan = useSelector(selectUserPlan);
  const userActivity = useSelector(selectUserActivity);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-white h-16 shrink-0 items-center gap-2 border-b px-4 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Jan 12 - Feb 10
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white text-sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          <div className="flex flex-col gap-6 p-6">
            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Minutes
                      </h3>
                      <p className="text-3xl font-bold mt-1 text-gray-900">
                        {userPlan.availableTime} min
                      </p>
                      <div className="text-green-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+20.1% from last month</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-brand-teal/10 text-brand-teal">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Sessions
                      </h3>
                      <p className="text-3xl font-bold mt-1 text-gray-900">
                        24
                      </p>
                      <div className="text-green-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+15% from last month</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-brand-teal/10 text-brand-teal">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Active Accounts
                      </h3>
                      <p className="text-3xl font-bold mt-1 text-gray-900">
                        {mockAccountsData.length}
                      </p>
                      <div className="text-green-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+12.5% from last month</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-brand-teal/10 text-brand-teal">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Growth Rate
                      </h3>
                      <p className="text-3xl font-bold mt-1 text-gray-900">
                        +25.8%
                      </p>
                      <div className="text-green-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+7.2% from last month</span>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-brand-teal/10 text-brand-teal">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Chart and Recent Activity */}
            <div className="grid gap-6 md:grid-cols-7">
              <Card className="col-span-4 dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-6 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900">
                        Activity Overview
                      </CardTitle>
                      <CardDescription className="text-gray-500">
                        Your session activity over time
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-brand-teal/10 text-brand-teal border-brand-teal"
                      >
                        Month
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Year
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="h-[300px] flex items-center justify-center bg-muted/10 rounded-md">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Activity chart will appear here
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3 dashboard-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-6 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900">
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-gray-500">
                        Your most recent sessions
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-teal"
                    >
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-6">
                    {mockActivityData.slice(0, 3).map((activity, i) => (
                      <div
                        className="flex items-center justify-between"
                        key={i}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.type} • {activity.duration} min
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`status-badge ${
                              activity.status === "completed"
                                ? "status-badge-completed"
                                : activity.status === "in-progress"
                                ? "status-badge-in-progress"
                                : "status-badge-scheduled"
                            }`}
                          >
                            {activity.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions and Transcripts */}
            <div>
              <Tabs defaultValue="sessions" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="sessions" className="text-sm">
                      Recent Sessions
                    </TabsTrigger>
                    <TabsTrigger value="transcripts" className="text-sm">
                      Transcripts
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="text-sm">
                      Payments
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Filter className="h-3.5 w-3.5 mr-1.5" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs text-brand-teal border-brand-teal"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Export
                    </Button>
                  </div>
                </div>
                <TabsContent value="sessions" className="mt-0">
                  <Card className="dashboard-card overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Session</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockActivityData.map((activity, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-gray-900">
                              {activity.title}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    activity.status === "completed"
                                      ? "bg-green-500"
                                      : activity.status === "in-progress"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  } mr-2`}
                                />
                                {activity.status}
                              </div>
                            </TableCell>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{activity.duration} min</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-brand-teal"
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center p-4 border-t">
                      <div className="text-sm text-gray-500">
                        Showing <strong>1-4</strong> of <strong>12</strong>{" "}
                        results
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 bg-brand-teal/10 text-brand-teal border-brand-teal"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="transcripts" className="mt-0">
                  <Card className="dashboard-card">
                    <CardContent className="p-6">
                      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="text-sm text-gray-500">
                            No transcripts found
                          </div>
                          <Button size="sm" variant="outline" className="mt-4">
                            Browse All Transcripts
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="payments" className="mt-0">
                  <Card className="dashboard-card overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-gray-900">
                            INV-001
                          </TableCell>
                          <TableCell>
                            {new Date().toLocaleDateString()}
                          </TableCell>
                          <TableCell>$29.99</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Paid
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-teal"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
