"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  Copy,
  Hash,
  User,
  Languages,
  Edit,
  Search,
  Check,
  Filter,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionsLayout } from "@/components/layouts";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  // Control the right panel visibility
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session>(
    mockSessions[0]
  );

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setShowRightPanel(true);
  };

  const handleToggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
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
    <SessionsLayout onToggleRightPanel={handleToggleRightPanel}>
      {/* Right panel content can be conditionally rendered here if needed */}
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Filters and search row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Date Range</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                <span>Status</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search sessions..."
                  className="h-9 pl-9 pr-3 w-full md:w-[250px]"
                />
              </div>
              <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white h-9">
                <Users className="h-4 w-4 mr-2" />
                <span>New Session</span>
              </Button>
            </div>
          </div>

          {/* Sessions card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Sessions: {mockSessions.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Total Duration:{" "}
                    {mockSessions.reduce(
                      (acc, session) => acc + session.duration,
                      0
                    )}{" "}
                    mins
                  </span>
                </div>
              </div>

              {/* Session list using DataTable */}
              <DataTable
                data={mockSessions}
                columns={columns}
                onRowClick={handleSessionSelect}
                selectedItem={selectedSession}
                idField="id"
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <span>«</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <span>‹</span>
            </Button>
            <Button className="h-9 w-9 p-0 bg-brand-teal text-white">
              <span>1</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <span>›</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <span>»</span>
            </Button>
          </div>
        </div>
      </div>
    </SessionsLayout>
  );
}
