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
  Edit,
  Copy,
  Printer,
  Mail,
  ExternalLink,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import {
  ActivityChart,
  MinutesUsageChart,
  SessionsBarChart,
  ProgressChart,
} from "@/components/dashboard/dashboard-charts";
import { useState } from "react";

// Mock data for demo purposes
const mockActivityData = [
  {
    id: "STOD-4856",
    title: "Test Session",
    presenter: "Deacon Poon",
    status: "ended",
    type: "Translation",
    duration: 1,
    startDate: "May 7, 2025 9:46 AM",
    language: "English (US)",
    selections: [
      "Chinese (Simplified)",
      "Arabic",
      "Spanish (ES)",
      "Chinese (Traditional)",
    ],
    access: "Open",
    passcode: "999780",
    attendees: {
      count: 1,
      languages: [
        { language: "English (US)", count: 0 },
        { language: "Cantonese", count: 0 },
        { language: "Chinese (Simplified)", count: 1 },
        { language: "Spanish (ES)", count: 0 },
        { language: "Chinese (Traditional)", count: 0 },
      ],
    },
    presenters: {
      count: 1,
      languages: [{ language: "English (US)", count: 1, status: "Present" }],
    },
    usage: 1,
  },
  {
    id: "SSOD-5071",
    title: "Marketing Overview",
    presenter: "Deacon Poon",
    status: "scheduled",
    type: "Translation",
    duration: 0,
    startDate: "May 7, 2025 8:57 PM",
    language: "English (US)",
    selections: [
      "Chinese (Simplified)",
      "Arabic",
      "Spanish (ES)",
      "Chinese (Traditional)",
    ],
    access: "Open",
    passcode: "123456",
    attendees: {
      count: 1,
      languages: [
        { language: "English (US)", count: 0 },
        { language: "Cantonese", count: 1 },
        { language: "Chinese (Simplified)", count: 0 },
        { language: "Spanish (ES)", count: 0 },
        { language: "Chinese (Traditional)", count: 0 },
      ],
    },
    presenters: {
      count: 1,
      languages: [{ language: "English (US)", count: 1, status: "Present" }],
    },
    usage: 0,
  },
  {
    id: "EMSA-4421",
    title: "French Document Review",
    presenter: "Deacon Poon",
    status: "completed",
    type: "Translation",
    duration: 30,
    startDate: "Apr 15, 2025 11:00 AM",
    language: "French (FR)",
    selections: ["English", "Spanish", "German", "Italian"],
    access: "Open",
    passcode: "654321",
    attendees: {
      count: 6,
      languages: [
        { language: "English (US)", count: 2 },
        { language: "French (FR)", count: 2 },
        { language: "Spanish (ES)", count: 1 },
        { language: "German (DE)", count: 1 },
      ],
    },
    presenters: {
      count: 2,
      languages: [
        { language: "French (FR)", count: 1, status: "Present" },
        { language: "English (US)", count: 1, status: "Present" },
      ],
    },
    usage: 30,
  },
  {
    id: "EMSA-3310",
    title: "Chinese Interview",
    presenter: "Deacon Poon",
    status: "completed",
    type: "Interpretation",
    duration: 55,
    startDate: "Mar 22, 2025 3:45 PM",
    language: "Chinese (Simplified)",
    selections: ["English", "Japanese", "Korean", "Thai"],
    access: "Private",
    passcode: "987654",
    attendees: {
      count: 8,
      languages: [
        { language: "Chinese (Simplified)", count: 3 },
        { language: "English (US)", count: 3 },
        { language: "Japanese", count: 1 },
        { language: "Korean", count: 1 },
      ],
    },
    presenters: {
      count: 2,
      languages: [
        { language: "Chinese (Simplified)", count: 1, status: "Present" },
        { language: "English (US)", count: 1, status: "Present" },
      ],
    },
    usage: 55,
  },
];

// Mock translation data
const mockTranslationData = [
  {
    id: "TR-8842",
    title: "Marketing Presentation",
    originalLanguage: "English (US)",
    targetLanguages: ["Spanish", "French", "German"],
    status: "completed",
    date: "May 5, 2025",
    wordCount: 2450,
    accuracy: "98%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-7731",
    title: "Product Documentation",
    originalLanguage: "English (US)",
    targetLanguages: ["Chinese (Simplified)", "Japanese", "Korean"],
    status: "in-progress",
    date: "May 2, 2025",
    wordCount: 5320,
    accuracy: "96%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-6620",
    title: "Legal Contract",
    originalLanguage: "French (FR)",
    targetLanguages: ["English", "German", "Italian"],
    status: "completed",
    date: "Apr 28, 2025",
    wordCount: 3150,
    accuracy: "99%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-5519",
    title: "User Interface Strings",
    originalLanguage: "English (US)",
    targetLanguages: ["Spanish", "Portuguese", "Arabic", "+5"],
    status: "scheduled",
    date: "May 10, 2025",
    wordCount: 850,
    accuracy: "Pending",
    owner: "Deacon Poon",
  },
  {
    id: "TR-4408",
    title: "Technical Manual",
    originalLanguage: "German (DE)",
    targetLanguages: ["English", "French", "Russian"],
    status: "completed",
    date: "Apr 15, 2025",
    wordCount: 7250,
    accuracy: "97%",
    owner: "Deacon Poon",
  },
];

// Mock payment history data
const mockPaymentData = [
  {
    id: "INV-2025-041",
    date: "Apr 15, 2025",
    amount: "$299.00",
    plan: "Professional Plan",
    status: "paid",
    method: "Visa •••• 4242",
  },
  {
    id: "INV-2025-032",
    date: "Mar 15, 2025",
    amount: "$299.00",
    plan: "Professional Plan",
    status: "paid",
    method: "Visa •••• 4242",
  },
  {
    id: "INV-2025-021",
    date: "Feb 15, 2025",
    amount: "$299.00",
    plan: "Professional Plan",
    status: "paid",
    method: "Visa •••• 4242",
  },
  {
    id: "INV-2025-010",
    date: "Jan 15, 2025",
    amount: "$199.00",
    plan: "Standard Plan",
    status: "paid",
    method: "Visa •••• 4242",
  },
  {
    id: "INV-2024-122",
    date: "Dec 15, 2024",
    amount: "$199.00",
    plan: "Standard Plan",
    status: "paid",
    method: "Visa •••• 4242",
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
  const [selectedSession, setSelectedSession] = useState<
    (typeof mockActivityData)[0] | null
  >(null);
  const [selectedTranslation, setSelectedTranslation] = useState<
    (typeof mockTranslationData)[0] | null
  >(null);
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof mockPaymentData)[0] | null
  >(null);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />

        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto dashboard-container">
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
              <ActivityChart />

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
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {mockActivityData.slice(0, 3).map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedSession(activity)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 flex items-center justify-center rounded-full ${
                              activity.type === "Translation"
                                ? "bg-brand-teal/10"
                                : "bg-brand-pink/10"
                            }`}
                          >
                            {activity.type === "Translation" ? (
                              <LineChart className="h-5 w-5 text-brand-teal" />
                            ) : (
                              <CreditCard className="h-5 w-5 text-brand-pink" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {activity.id}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {activity.type} • {activity.startDate}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            activity.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "in-progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {activity.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Visualization Charts */}
            <div className="grid gap-6 md:grid-cols-3">
              <SessionsBarChart />
              <MinutesUsageChart />
              <ProgressChart />
            </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Card className="dashboard-card overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium whitespace-nowrap">
                                From
                              </span>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="MM/DD/YYYY"
                                  className="border border-gray-300 rounded p-2 text-sm w-[120px]"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                                >
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium whitespace-nowrap">
                                To
                              </span>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="MM/DD/YYYY"
                                  className="border border-gray-300 rounded p-2 text-sm w-[120px]"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                                >
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium whitespace-nowrap">
                                Search
                              </span>
                              <input
                                type="text"
                                placeholder="Search"
                                className="border border-gray-300 rounded p-2 text-sm w-[120px]"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90 hover:text-white"
                            >
                              Active
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-brand-teal text-white border-brand-teal hover:bg-brand-teal/90 hover:text-white whitespace-nowrap"
                            >
                              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                              Add Session
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border-y border-gray-200 flex justify-between">
                          <span className="text-sm font-medium">
                            Sessions: {mockActivityData.length}
                          </span>
                          <span className="text-sm font-medium">
                            Duration:{" "}
                            {mockActivityData.reduce(
                              (acc, session) => acc + session.duration,
                              0
                            )}{" "}
                            mins
                          </span>
                        </div>

                        <Table>
                          <TableBody>
                            {mockActivityData.map((activity, i) => (
                              <TableRow
                                key={i}
                                className={`cursor-pointer hover:bg-muted/20 ${
                                  selectedSession?.id === activity.id
                                    ? "bg-[#41C4DD33]"
                                    : ""
                                }`}
                                onClick={() => setSelectedSession(activity)}
                              >
                                <TableCell className="font-medium text-gray-900 w-[120px]">
                                  {activity.id}
                                </TableCell>
                                <TableCell className="text-gray-900">
                                  {activity.title}
                                </TableCell>
                                <TableCell>{activity.startDate}</TableCell>
                                <TableCell className="text-right">
                                  {activity.duration} mins
                                </TableCell>
                                <TableCell className="text-right">
                                  {activity.attendees.count} Attendees
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>

                    {selectedSession ? (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card overflow-hidden">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gray-50">
                            <div>
                              <CardTitle className="text-xl">
                                Usage Summary
                              </CardTitle>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-6">
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Session:
                                  </p>
                                  <div className="flex items-center text-right">
                                    <p className="text-sm font-medium">
                                      {selectedSession.id}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 ml-1"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Label:
                                  </p>
                                  <p className="text-sm font-medium">-</p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Status:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSession.status.toUpperCase()}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Start time:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSession.startDate}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Duration:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSession.duration} mins
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-700">
                                    Usage:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedSession.usage} mins
                                  </p>
                                </div>

                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <p className="text-sm text-gray-700 mr-1">
                                      Presenters:
                                    </p>
                                    <p className="text-sm font-medium">
                                      {selectedSession.presenters.count}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>

                                {selectedSession.presenters.languages.map(
                                  (lang, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between pl-4"
                                    >
                                      <p className="text-sm text-gray-700">
                                        {lang.language}:
                                      </p>
                                      <div className="flex items-center">
                                        <p className="text-sm font-medium mr-3">
                                          {lang.count}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          {lang.status}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}

                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <p className="text-sm text-gray-700 mr-1">
                                      Attendees:
                                    </p>
                                    <p className="text-sm font-medium">
                                      {selectedSession.attendees.count}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>

                                {selectedSession.attendees.languages.map(
                                  (lang, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between pl-4"
                                    >
                                      <p className="text-sm text-gray-700">
                                        {lang.language}:
                                      </p>
                                      <p className="text-sm font-medium">
                                        {lang.count}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card h-full flex items-center justify-center p-6">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">
                              Select a session to view details
                            </p>
                            <p className="text-xs text-gray-400">
                              Click on any session in the table to see more
                              information
                            </p>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="transcripts" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Card className="dashboard-card overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Original</TableHead>
                              <TableHead>Target Languages</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Word Count</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockTranslationData.map((translation, i) => (
                              <TableRow
                                key={i}
                                className={`cursor-pointer hover:bg-muted/20 ${
                                  selectedTranslation?.id === translation.id
                                    ? "bg-muted/30"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedTranslation(translation)
                                }
                              >
                                <TableCell className="font-medium text-gray-900">
                                  {translation.id}
                                </TableCell>
                                <TableCell className="text-gray-900">
                                  {translation.title}
                                </TableCell>
                                <TableCell>
                                  {translation.originalLanguage}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {translation.targetLanguages
                                      .slice(0, 2)
                                      .map((lang, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded-full"
                                        >
                                          {lang}
                                        </span>
                                      ))}
                                    {translation.targetLanguages.length > 2 && (
                                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded-full">
                                        +
                                        {translation.targetLanguages.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        translation.status === "completed"
                                          ? "bg-green-500"
                                          : translation.status === "in-progress"
                                          ? "bg-amber-500"
                                          : "bg-blue-500"
                                      } mr-2`}
                                    />
                                    {translation.status}
                                  </div>
                                </TableCell>
                                <TableCell>{translation.wordCount}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTranslation(translation);
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>

                    {selectedTranslation ? (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card overflow-hidden">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                Translation
                              </CardTitle>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Title:
                                  </p>
                                  <p className="text-sm font-medium text-right">
                                    {selectedTranslation.title}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">ID:</p>
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium mr-2">
                                      {selectedTranslation.id}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Owner:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedTranslation.owner}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">Date:</p>
                                  <p className="text-sm font-medium">
                                    {selectedTranslation.date}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Original Language:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedTranslation.originalLanguage}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Target Languages:
                                  </p>
                                  <div className="flex gap-1 flex-wrap justify-end">
                                    {selectedTranslation.targetLanguages.map(
                                      (lang, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded-full"
                                        >
                                          {lang}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Status:
                                  </p>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        selectedTranslation.status ===
                                        "completed"
                                          ? "bg-green-500"
                                          : selectedTranslation.status ===
                                            "in-progress"
                                          ? "bg-amber-500"
                                          : "bg-blue-500"
                                      } mr-2`}
                                    />
                                    <p className="text-sm font-medium">
                                      {selectedTranslation.status}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Word Count:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedTranslation.wordCount}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Accuracy:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedTranslation.accuracy}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-sm font-semibold">
                                    Translation Actions
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex justify-between items-center text-xs h-8"
                                  >
                                    <span>Download Translation</span>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex justify-between items-center text-xs h-8"
                                  >
                                    <span>View Original Document</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex justify-between items-center text-xs h-8"
                                  >
                                    <span>Share Translation</span>
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card h-full flex items-center justify-center p-6">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">
                              Select a translation to view details
                            </p>
                            <p className="text-xs text-gray-400">
                              Click on any translation in the table to see more
                              information
                            </p>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="payments" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Card className="dashboard-card overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead>Invoice ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Plan</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockPaymentData.map((payment, i) => (
                              <TableRow
                                key={i}
                                className={`cursor-pointer hover:bg-muted/20 ${
                                  selectedPayment?.id === payment.id
                                    ? "bg-muted/30"
                                    : ""
                                }`}
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <TableCell className="font-medium text-gray-900">
                                  {payment.id}
                                </TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.plan}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        payment.status === "paid"
                                          ? "bg-green-500"
                                          : payment.status === "pending"
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                      } mr-2`}
                                    />
                                    {payment.status}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPayment(payment);
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </div>

                    {selectedPayment ? (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card overflow-hidden">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                Invoice Details
                              </CardTitle>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Invoice ID:
                                  </p>
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium mr-2">
                                      {selectedPayment.id}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">Date:</p>
                                  <p className="text-sm font-medium">
                                    {selectedPayment.date}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Billing Period:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedPayment.date.replace("15", "01")} -{" "}
                                    {selectedPayment.date.replace("15", "30")}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">Plan:</p>
                                  <p className="text-sm font-medium">
                                    {selectedPayment.plan}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Amount:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedPayment.amount}
                                  </p>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Status:
                                  </p>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        selectedPayment.status === "paid"
                                          ? "bg-green-500"
                                          : selectedPayment.status === "pending"
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                      } mr-2`}
                                    />
                                    <p className="text-sm font-medium">
                                      {selectedPayment.status}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex justify-between">
                                  <p className="text-sm text-gray-500">
                                    Payment Method:
                                  </p>
                                  <p className="text-sm font-medium">
                                    {selectedPayment.method}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-sm font-semibold">
                                    Usage Summary
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Translation Minutes
                                    </span>
                                    <span className="font-medium">
                                      375 min / 500 min
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Sessions Created
                                    </span>
                                    <span className="font-medium">
                                      17 sessions
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Transcripts Generated
                                    </span>
                                    <span className="font-medium">
                                      12 transcripts
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-gray-100">
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex justify-between items-center text-xs h-8"
                                  >
                                    <span>Download Invoice PDF</span>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex justify-between items-center text-xs h-8"
                                  >
                                    <span>Request Receipt</span>
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="md:col-span-1">
                        <Card className="dashboard-card h-full flex items-center justify-center p-6">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">
                              Select an invoice to view details
                            </p>
                            <p className="text-xs text-gray-400">
                              Click on any invoice in the table to see more
                              information
                            </p>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
