"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Search,
  Calendar,
  Copy,
  BarChart,
  Users,
  Filter,
  Hash,
  Calendar as CalendarIcon,
  User,
  Clock as ClockIcon,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DataTable,
  StatusBadge,
  type TableColumn,
} from "@/components/ui/data-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data for sessions
interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  usedDuration: number;
  attendees: number;
  status: string;
  languages: { name: string; count: number }[];
  presenters: { name: string; duration: number; isPresent: boolean }[];
}

const mockSessions: Session[] = [
  {
    id: "DMNX-4414",
    title: "Product Team Demo",
    date: "May 7, 2025",
    time: "9:42 AM",
    duration: 2,
    usedDuration: 1,
    attendees: 1,
    status: "ENDED",
    languages: [
      { name: "English (US)", count: 0 },
      { name: "Korean", count: 0 },
      { name: "Cantonese", count: 0 },
      { name: "Chinese (Traditional)", count: 1 },
    ],
    presenters: [{ name: "English (US)", duration: 2, isPresent: true }],
  },
  {
    id: "EMSA-6640",
    title: "Marketing Strategy",
    date: "May 7, 2025",
    time: "9:08 AM",
    duration: 2,
    usedDuration: 0,
    attendees: 2,
    status: "SCHEDULED",
    languages: [],
    presenters: [],
  },
  {
    id: "TRNX-9932",
    title: "Quarterly Review",
    date: "May 6, 2025",
    time: "2:15 PM",
    duration: 3,
    usedDuration: 3,
    attendees: 5,
    status: "COMPLETED",
    languages: [
      { name: "English (US)", count: 3 },
      { name: "Japanese", count: 2 },
    ],
    presenters: [{ name: "English (US)", duration: 3, isPresent: true }],
  },
];

export default function HistoryPage() {
  const [selectedSession, setSelectedSession] = useState(mockSessions[0]);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
  };

  const handleSessionSelect = (session: Session) => {
    console.log("Selected session in history:", session.id, session.title);
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
      className: "w-[120px]",
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
          <CalendarIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.date}</span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Duration",
      accessorKey: "usedDuration",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <ClockIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span>{row.usedDuration} mins</span>
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
      className: "text-center hidden md:table-cell",
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
              <span>Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <BarChart className="h-4 w-4 mr-2" />
              <span>Analytics</span>
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
              <span>My Sessions</span>
            </Button>
          </div>
        </div>

        {/* Summary card */}
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
                  Duration:{" "}
                  {mockSessions.reduce(
                    (acc, session) => acc + session.usedDuration,
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
                  onClick={() => handleSessionSelect(mockSessions[0])}
                >
                  Reset Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
  );
}
