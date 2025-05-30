"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserPlan, selectUserActivity } from "@/store/slices/userSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Clock,
  CreditCard,
  LineChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Mock activity sessions data
const mockActivitySessions = [
  {
    id: "S-5532",
    title: "Product Demo with Marketing Team",
    date: "Today, 2:00 PM",
    duration: "45 minutes",
    participants: 5,
    languages: ["English", "Spanish"],
    status: "scheduled",
  },
  {
    id: "S-5531",
    title: "Client Onboarding - Acme Corp",
    date: "Today, 10:00 AM",
    duration: "30 minutes",
    participants: 3,
    languages: ["English", "Japanese"],
    status: "completed",
  },
  {
    id: "S-5530",
    title: "Technical Support - GlobalTech",
    date: "Yesterday, 4:30 PM",
    duration: "60 minutes",
    participants: 4,
    languages: ["English", "German"],
    status: "completed",
  },
  {
    id: "S-5529",
    title: "Sales Presentation - NewCorp",
    date: "Yesterday, 11:00 AM",
    duration: "45 minutes",
    participants: 6,
    languages: ["English", "French", "Italian"],
    status: "completed",
  },
  {
    id: "S-5528",
    title: "Team Standup",
    date: "Apr 15, 2025",
    duration: "15 minutes",
    participants: 8,
    languages: ["English"],
    status: "completed",
  },
];

// Mock translation projects data
const mockTranslationProjects = [
  {
    id: "TR-4412",
    title: "Marketing Campaign Materials",
    originalLanguage: "English (US)",
    targetLanguages: ["Spanish", "French", "German", "Italian"],
    status: "in-progress",
    date: "Due Apr 22, 2025",
    wordCount: 15230,
    accuracy: "92%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-4411",
    title: "Product Documentation",
    originalLanguage: "English (US)",
    targetLanguages: ["Japanese", "Korean", "Chinese (Simplified)"],
    status: "in-progress",
    date: "Due Apr 28, 2025",
    wordCount: 25750,
    accuracy: "95%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-4410",
    title: "Website Localization",
    originalLanguage: "English (US)",
    targetLanguages: ["Spanish", "Portuguese", "French"],
    status: "in-progress",
    date: "Due May 5, 2025",
    wordCount: 12450,
    accuracy: "91%",
    owner: "Deacon Poon",
  },
  {
    id: "TR-4409",
    title: "Legal Contracts",
    originalLanguage: "English (US)",
    targetLanguages: ["Spanish", "French", "German"],
    status: "completed",
    date: "Apr 18, 2025",
    wordCount: 5450,
    accuracy: "98%",
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
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
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
                <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
                <p className="text-3xl font-bold mt-1 text-gray-900">24</p>
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
                <p className="text-3xl font-bold mt-1 text-gray-900">3</p>
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
                <p className="text-3xl font-bold mt-1 text-gray-900">+25.8%</p>
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

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ActivityChart />
        </div>
        <div className="md:col-span-1">
          <ProgressChart />
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="dashboard-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 pt-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-gray-500">
                Your most recent sessions
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-brand-teal">
              View all
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            {mockActivitySessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {session.date} • {session.duration} • {session.participants}{" "}
                    participants
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {session.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
