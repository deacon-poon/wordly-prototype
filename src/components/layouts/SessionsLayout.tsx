"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Search,
  FilterX,
  Clock,
  Users,
  ClipboardList,
  Filter,
  BarChart,
  ListFilter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";

// Mock session data
const mockSessions = [
  {
    id: "SES-001",
    title: "Product Team Weekly",
    startDate: "2023-04-12",
    time: "10:00 AM",
    duration: 60,
    status: "completed",
    attendees: { count: 8 },
    languages: [
      { language: "English", count: 5 },
      { language: "Spanish", count: 2 },
      { language: "German", count: 1 },
    ],
  },
  {
    id: "SES-002",
    title: "Marketing Strategy",
    startDate: "2023-04-13",
    time: "2:30 PM",
    duration: 45,
    status: "in-progress",
    attendees: { count: 5 },
    languages: [
      { language: "English", count: 3 },
      { language: "French", count: 2 },
    ],
  },
  {
    id: "SES-003",
    title: "Executive Board Meeting",
    startDate: "2023-04-14",
    time: "9:00 AM",
    duration: 90,
    status: "scheduled",
    attendees: { count: 10 },
    languages: [
      { language: "English", count: 7 },
      { language: "Japanese", count: 3 },
    ],
  },
  {
    id: "SES-004",
    title: "Sales Team Check-in",
    startDate: "2023-04-15",
    time: "11:00 AM",
    duration: 30,
    status: "completed",
    attendees: { count: 6 },
    languages: [
      { language: "English", count: 4 },
      { language: "Portuguese", count: 2 },
    ],
  },
  {
    id: "SES-005",
    title: "Customer Feedback Review",
    startDate: "2023-04-16",
    time: "3:00 PM",
    duration: 60,
    status: "scheduled",
    attendees: { count: 7 },
    languages: [
      { language: "English", count: 5 },
      { language: "Mandarin", count: 2 },
    ],
  },
];

interface Session {
  id: string;
  title: string;
  startDate: string;
  time: string;
  duration: number;
  status: string;
  attendees: { count: number };
  languages: Array<{ language: string; count: number }>;
}

interface SessionsLayoutProps {
  children?: React.ReactNode;
  onToggleRightPanel?: () => void;
  onSelectSession?: (session: Session) => void;
  selectedSession?: Session | null;
}

export function SessionsLayout({
  children,
  onToggleRightPanel,
  onSelectSession,
  selectedSession,
}: SessionsLayoutProps) {
  const [localSelectedSession, setLocalSelectedSession] =
    useState<Session | null>(selectedSession || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Use effect to sync the internal state with the parent component's state
  React.useEffect(() => {
    if (selectedSession !== undefined) {
      setLocalSelectedSession(selectedSession);
    }
  }, [selectedSession]);

  // When selecting a session internally, propagate to parent if prop is provided
  const handleSelectSession = (session: Session) => {
    setLocalSelectedSession(session);
    if (onSelectSession) {
      onSelectSession(session);
    }
  };

  // Filter sessions based on search query and status filter
  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? session.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Filter buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <BarChart className="h-4 w-4 mr-2" />
            <span>Analytics</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={onToggleRightPanel}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            <span>Details Panel</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search sessions..."
              className="h-9 pl-9 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3">
                <span className="hidden md:inline">Status</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>
                Scheduled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Session</span>
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div>
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="p-4 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">
                  From
                </span>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    className="border border-gray-300 rounded p-2 text-sm w-[120px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">
                  To
                </span>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    className="border border-gray-300 rounded p-2 text-sm w-[120px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {searchQuery || statusFilter ? (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500"
                onClick={clearFilters}
              >
                <FilterX className="h-3.5 w-3.5 mr-1.5" />
                Clear Filters
              </Button>
            ) : null}
          </div>

          <div className="p-4 border-y border-gray-200 flex justify-between">
            <span className="text-sm font-medium">
              Sessions: {filteredSessions.length}
            </span>
            <span className="text-sm font-medium">
              Total Duration:{" "}
              {filteredSessions.reduce(
                (acc, session) => acc + session.duration,
                0
              )}{" "}
              mins
            </span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Duration
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Attendees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session, i) => (
                  <TableRow
                    key={i}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      (selectedSession?.id || localSelectedSession?.id) ===
                        session.id
                        ? "bg-brand-teal/10"
                        : ""
                    )}
                    onClick={() => handleSelectSession(session)}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {session.id}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {session.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {session.startDate} {session.time}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {session.duration} mins
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.attendees.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
