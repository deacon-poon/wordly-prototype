"use client";

import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Copy,
  Hash,
  User,
  Languages as LanguagesIcon,
  Edit,
  Search,
  Check,
  Filter,
  Users,
  BarChart,
  ListFilter,
  ChevronDown,
  X as CloseIcon,
  QrCode as QrCodeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  StatusBadge,
  type TableColumn,
} from "@/components/ui/data-table";

// Define the session type
interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: number;
  status: string;
  presenter?: string;
  account?: string;
  passcode?: string;
  language?: string;
  access?: string;
  pinned?: boolean;
  selections?: string[];
  voicePack?: string;
}

const mockSessions: Session[] = [
  {
    id: "SES-001",
    title: "Product Team Weekly",
    date: "2023-04-12",
    time: "10:00 AM",
    duration: 60,
    attendees: 8,
    status: "COMPLETED",
    presenter: "Deacon Poon",
    account: "Deacon Poon (2a49e)",
    passcode: "327269",
    language: "English (US)",
    access: "Open",
    pinned: true,
    selections: ["Arabic", "Chinese (Simplified)"],
    voicePack: "Voice Pack 1",
  },
  {
    id: "SES-002",
    title: "Marketing Strategy",
    date: "2023-04-13",
    time: "2:30 PM",
    duration: 45,
    attendees: 5,
    status: "IN-PROGRESS",
    presenter: "Marketing Team",
    account: "Deacon Poon (2a49e)",
    language: "English (US)",
  },
  {
    id: "SES-003",
    title: "Executive Board Meeting",
    date: "2023-04-14",
    time: "9:00 AM",
    duration: 90,
    attendees: 10,
    status: "SCHEDULED",
    presenter: "Executive Team",
    account: "Deacon Poon (2a49e)",
    language: "English (US)",
  },
  {
    id: "SES-004",
    title: "Sales Team Check-in",
    date: "2023-04-15",
    time: "11:00 AM",
    duration: 30,
    attendees: 6,
    status: "COMPLETED",
    presenter: "Sales Lead",
    account: "Deacon Poon (2a49e)",
    language: "English (US)",
  },
  {
    id: "SES-005",
    title: "Customer Feedback Review",
    date: "2023-04-16",
    time: "3:00 PM",
    duration: 60,
    attendees: 7,
    status: "SCHEDULED",
    presenter: "Customer Success",
    account: "Deacon Poon (2a49e)",
    language: "English (US)",
  },
];

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined
  );

  const handleSessionSelect = (session: Session) => {
    console.log("Selected session:", session.id, session.title);
    setSelectedSession(session);
  };

  const columns: TableColumn<Session>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center">
          <Hash className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span className="font-medium text-gray-900">{row.id}</span>
        </div>
      ),
      className: "w-[100px]",
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (row) => (
        <div className="flex items-center">
          <span>{row.title}</span>
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row) => (
        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.date}</span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Time",
      accessorKey: "time",
      cell: (row) => (
        <div className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.time}</span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.duration} mins</span>
        </div>
      ),
      className: "text-center",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <StatusBadge status={row.status} />
        </div>
      ),
      className: "text-center",
    },
    {
      header: "Attendees",
      accessorKey: "attendees",
      cell: (row) => (
        <div className="flex items-center justify-end">
          <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.attendees}</span>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      {/* Filter toolbar at top */}
      <div className="flex flex-wrap items-center gap-2 p-4 border-b bg-white">
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <BarChart className="h-4 w-4 mr-2" />
          <span>Analytics</span>
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <ListFilter className="h-4 w-4 mr-2" />
          <span>Details Panel</span>
        </Button>

        <div className="flex grow items-center justify-end gap-2">
          <div className="flex items-center w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 ml-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sessions..."
                className="h-9 pl-9 pr-3 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 px-3 ml-2">
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("IN-PROGRESS")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("SCHEDULED")}>
                  Scheduled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Date filter row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">From</span>
              <div className="border rounded-md p-1.5">
                <span className="text-sm">MM/DD/YYYY</span>
              </div>

              <span className="text-sm font-medium">To</span>
              <div className="border rounded-md p-1.5">
                <span className="text-sm">MM/DD/YYYY</span>
              </div>
            </div>

            <div className="flex items-center">
              <Badge variant="outline" className="mr-2">
                <span className="text-sm">Sessions: 5</span>
              </Badge>
              <Badge variant="outline">
                <span className="text-sm">Total Duration: 285 mins</span>
              </Badge>
            </div>
          </div>

          {/* Sessions card */}
          <Card>
            <CardContent className="p-4">
              {/* Session list using DataTable */}
              <DataTable
                data={mockSessions.filter((session) => {
                  return !statusFilter || session.status === statusFilter;
                })}
                columns={columns}
                onRowClick={handleSessionSelect}
                selectedItem={selectedSession}
                idField="id"
              />
            </CardContent>
          </Card>

          {/* Selected session indicator */}
          {selectedSession && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Selected Session
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSession.title} ({selectedSession.id})
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSession(undefined)}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
