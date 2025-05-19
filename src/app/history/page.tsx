"use client";

import { useState } from "react";
import { AppShell, AppHeader, AppSidebar } from "@/components/layouts";
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
import { Button } from "@/components/ui/button";
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
    <AppShell
      sidebar={<AppSidebar />}
      header={<AppHeader title="History" />}
      showRightPanel={showRightPanel}
      rightPanelTitle="Usage Summary"
      onRightPanelClose={handleCloseRightPanel}
      rightPanel={
        <div className="space-y-4">
          {/* Session summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">{selectedSession.id}</p>
            </div>
            <StatusBadge status={selectedSession.status} />
          </div>

          {/* Title */}
          <div className="py-2">
            <h2 className="text-md font-semibold">{selectedSession.title}</h2>
          </div>

          {/* Session details in two columns */}
          <div className="grid grid-cols-[120px_1fr] gap-y-4">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Start time:</p>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
              <p className="text-sm font-medium">
                {selectedSession.date} {selectedSession.time}
              </p>
            </div>

            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Duration:</p>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
              <p className="text-sm font-medium">
                {selectedSession.duration} mins
              </p>
            </div>

            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Usage:</p>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
              <p className="text-sm font-medium">
                {selectedSession.usedDuration} mins
              </p>
            </div>
          </div>

          {/* Progress bar for usage */}
          <div className="py-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Usage / Duration</span>
              <span className="text-sm font-medium">
                {selectedSession.usedDuration} / {selectedSession.duration} mins
              </span>
            </div>
            <Progress
              value={
                (selectedSession.usedDuration / selectedSession.duration) * 100
              }
              className="h-2"
              indicatorColor="bg-brand-teal"
            />
          </div>

          {/* Presenters section */}
          <Accordion
            type="single"
            collapsible
            defaultValue="presenters"
            className="w-full"
          >
            <AccordionItem value="presenters" className="border-b">
              <AccordionTrigger className="py-3">
                <div className="flex items-center">
                  <p className="text-sm font-medium">Presenters:</p>
                  <span className="ml-2 text-sm">
                    {selectedSession.presenters.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {selectedSession.presenters.map((presenter, index) => (
                  <div key={index} className="py-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{presenter.name}:</span>
                      <span className="text-sm font-medium">
                        {presenter.duration} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={100}
                        className="h-2 flex-1"
                        indicatorColor="bg-brand-teal"
                      />
                      <span className="text-xs text-gray-500">Present</span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Attendees section */}
            <AccordionItem value="attendees" className="border-b">
              <AccordionTrigger className="py-3">
                <div className="flex items-center">
                  <p className="text-sm font-medium">Attendees:</p>
                  <span className="ml-2 text-sm">
                    {selectedSession.attendees}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {selectedSession.languages.map((language, index) => (
                  <div key={index} className="py-2 flex justify-between">
                    <span className="text-sm">{language.name}:</span>
                    <span className="text-sm font-medium">
                      {language.count}
                    </span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      }
    >
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
                onRowClick={setSelectedSession}
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
    </AppShell>
  );
}
