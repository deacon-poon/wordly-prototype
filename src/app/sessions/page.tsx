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
  Key,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  Globe,
  ToggleLeft,
  Lock,
  Pin,
  Volume2,
  Mic,
  FileText,
  Download,
  BarChart3,
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
import { StatusBadge } from "@/components/ui/data-table";
import { useAppShell } from "@/components/layouts/AppShellProvider";
import { SessionJoinModal } from "@/components/ui/session-join-modal";
import { SessionJoinModalCompact } from "@/components/ui/session-join-modal-compact";
import { SessionJoinModalProgressive } from "@/components/ui/session-join-modal-progressive";

// Define the session type
interface Session {
  id: string;
  title: string;
  passcode: string;
  dateTime: string; // Combined date and time
  status: "RUNNING" | "SCHEDULED" | "COMPLETED";
  sessionType?: "bot" | "present-app" | "rtmps" | "mixed";
  // Remote control data for running sessions
  inputs?: SessionInput[];
  languages?: string[];
  activeLanguages?: string[];
  hasAutoSelect?: boolean;
}

interface SessionInput {
  id: string;
  name: string;
  type: "rtmps" | "teams-bot" | "microphone";
  status: "active" | "inactive";
}

const mockSessions: Session[] = [
  // Currently running sessions
  {
    id: "ZGSG-0712",
    title: "March Council Meeting",
    passcode: "590745",
    dateTime: "Mar 10, 2025 7:00 PM",
    status: "RUNNING",
    sessionType: "mixed",
    inputs: [
      { id: "rtmps-1", name: "RTMPS stream", type: "rtmps", status: "active" },
      { id: "teams-1", name: "Teams bot", type: "teams-bot", status: "active" },
      { id: "mic-1", name: "Avery mic", type: "microphone", status: "active" },
      { id: "mic-2", name: "Taylor mic", type: "microphone", status: "active" },
    ],
    languages: [
      "English (US)",
      "Welsh - Cymraeg",
      "Spanish (LatAm) - Español (LatAm)",
    ],
    activeLanguages: [
      "English (US)",
      "Welsh - Cymraeg",
      "Spanish (LatAm) - Español (LatAm)",
    ],
    hasAutoSelect: false,
  },
  {
    id: "ZGSG-0713",
    title: "A meeting without RT...",
    passcode: "590745",
    dateTime: "Mar 10, 2025 7:00 PM",
    status: "RUNNING",
    sessionType: "present-app",
    inputs: [
      { id: "mic-3", name: "Podium mic", type: "microphone", status: "active" },
    ],
    languages: ["English (US)"],
    activeLanguages: ["English (US)"],
    hasAutoSelect: false,
  },
  {
    id: "ZGSG-0714",
    title: "A meeting with bot co...",
    passcode: "590745",
    dateTime: "Mar 10, 2025 7:00 PM",
    status: "RUNNING",
    sessionType: "bot",
    inputs: [
      { id: "teams-2", name: "Teams bot", type: "teams-bot", status: "active" },
    ],
    languages: ["English (US)", "Spanish (LatAm) - Español (LatAm)"],
    activeLanguages: ["English (US)", "Spanish (LatAm) - Español (LatAm)"],
    hasAutoSelect: true,
  },
  // Scheduled/completed sessions
  {
    id: "JFNT-1823",
    title: "Monthly Update on th...",
    passcode: "458329",
    dateTime: "multiple future sessions",
    status: "SCHEDULED",
    sessionType: "present-app",
  },
  {
    id: "KTUA-9533",
    title: "April Council Meeting",
    passcode: "561819",
    dateTime: "Apr 12, 2025 7:00 PM",
    status: "SCHEDULED",
    sessionType: "mixed",
  },
  {
    id: "RUQH-5717",
    title: "May Council Meeting",
    passcode: "271910",
    dateTime: "May 8, 2025 7:00 PM",
    status: "SCHEDULED",
    sessionType: "present-app",
  },
];

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined
  );
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState<string>("");
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );
  const [modalVariant, setModalVariant] = useState<
    "detailed" | "compact" | "progressive"
  >("progressive");

  // Separate running and other sessions
  const runningSessions = mockSessions.filter(
    (session) => session.status === "RUNNING"
  );
  const otherSessions = mockSessions.filter(
    (session) => session.status !== "RUNNING"
  );
  const { openRightPanel, closeRightPanel } = useAppShell();

  const handleSessionSelect = (session: Session) => {
    console.log("Selected session:", session.id, session.title);
    setSelectedSession(session);
    openRightPanel("Session Details", renderSessionDetails(session));
  };

  const handleJoinSession = (sessionId?: string) => {
    setJoinSessionId(sessionId || "");
    setIsJoinModalOpen(true);
  };

  const handleJoinAsPresenter = (method: string) => {
    console.log(
      `Joining session ${joinSessionId} as presenter with method: ${method}`
    );

    alert(
      `Joined session ${joinSessionId} as presenter with method: ${method}`
    );
    setIsJoinModalOpen(false);
  };

  const handleJoinAsAttendee = (method: string) => {
    console.log(
      `Joining session ${joinSessionId} as attendee with method: ${method}`
    );
    // Here you would implement the actual join logic
    // For example: router.push(`/attend/${joinSessionId}?method=${method}`);
    alert(
      `Joining session ${joinSessionId} as attendee with method: ${method}`
    );
    setIsJoinModalOpen(false);
  };

  const toggleSessionExpansion = (sessionId: string) => {
    console.log(`Toggling expansion for session: ${sessionId}`);
    console.log(`Current expanded sessions:`, Array.from(expandedSessions));

    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      console.log(`Collapsing session ${sessionId}`);
      newExpanded.delete(sessionId);
    } else {
      console.log(`Expanding session ${sessionId}`);
      newExpanded.add(sessionId);
    }

    console.log(`New expanded sessions:`, Array.from(newExpanded));
    setExpandedSessions(newExpanded);
  };

  const handleLanguageToggle = (sessionId: string, language: string) => {
    console.log(`Toggling language ${language} for session ${sessionId}`);
    // Here you would update the session's active languages
  };

  const handleInputToggle = (sessionId: string, inputId: string) => {
    console.log(`Toggling input ${inputId} for session ${sessionId}`);
    // Here you would update the input status
  };

  const renderSessionDetails = (session: Session) => {
    return (
      <div className="space-y-4">
        {/* Session summary */}
        <div>
          <h2 className="text-xl font-semibold mb-1">{session.title}</h2>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-500">{session.id}</p>
            <StatusBadge status={session.status} />
          </div>

          {/* Join Session Button */}
          <Button
            onClick={() => handleJoinSession(session.id)}
            className="w-full bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Join Session
          </Button>
        </div>

        {/* Session details in two columns */}
        <div className="grid grid-cols-[120px_1fr] gap-y-4">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Presenter:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>

          <div className="flex items-center">
            <Key className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Passcode:</p>
          </div>
          <p className="text-sm font-medium">{session.passcode}</p>

          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Start Date:</p>
          </div>
          <p className="text-sm font-medium">{session.dateTime}</p>

          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Account:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>

          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Duration:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>

          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Language:</p>
          </div>
          <p className="text-sm font-medium">
            {session.languages?.join(", ") || "N/A"}
          </p>

          <div className="flex items-center">
            <ToggleLeft className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Auto Select:</p>
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-600" />
            <p className="text-sm font-medium">
              {session.hasAutoSelect ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Selections:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>

          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Access:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>

          <div className="flex items-center">
            <Pin className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Pinned:</p>
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-green-600" />
            <p className="text-sm font-medium">N/A</p>
          </div>

          <div className="flex items-center">
            <Volume2 className="w-4 h-4 mr-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">Voice Pack:</p>
          </div>
          <p className="text-sm font-medium">N/A</p>
        </div>
      </div>
    );
  };

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

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleJoinSession()}
            className="h-9 bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Join Session</span>
          </Button>

          {/* Modal Version Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                const variants: Array<"detailed" | "compact" | "progressive"> =
                  ["progressive", "compact", "detailed"];
                const currentIndex = variants.indexOf(modalVariant);
                const nextIndex = (currentIndex + 1) % variants.length;
                setModalVariant(variants[nextIndex]);
              }}
              variant="outline"
              size="sm"
              className="h-9"
              title={`Current: ${modalVariant} - Click to cycle through variants`}
            >
              <ToggleLeft className="h-4 w-4 mr-1 transition-transform" />
              <span className="text-xs capitalize">{modalVariant}</span>
            </Button>
          </div>
        </div>

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

          {/* Currently Running Sessions */}
          {runningSessions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Currently running
              </h2>
              <Card>
                <CardContent className="p-0">
                  {/* Custom expandable sessions table */}
                  <div className="w-full">
                    {/* Table header */}
                    <div className="border-b bg-gray-50 px-4 py-3">
                      <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-900">
                        <div className="col-span-4">Title</div>
                        <div className="col-span-2">ID</div>
                        <div className="col-span-2">Passcode</div>
                        <div className="col-span-2">Date & Time</div>
                        <div className="col-span-2"></div>
                      </div>
                    </div>

                    {/* Session rows */}
                    {runningSessions.map((session) => (
                      <div key={session.id} className="border-b">
                        {/* Main row */}
                        <div
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleSessionExpansion(session.id)}
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                              <span className="font-medium">
                                {session.title}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-mono text-sm">
                                {session.id}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-mono text-sm">
                                {session.passcode}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm">
                                {session.dateTime}
                              </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSessionExpansion(session.id);
                                }}
                                className="text-xs"
                              >
                                {expandedSessions.has(session.id)
                                  ? "hide"
                                  : "show"}{" "}
                                language controls
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-teal-500 text-white hover:bg-teal-600"
                              >
                                Pause
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                End
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Expandable content */}
                        {(() => {
                          const isExpanded = expandedSessions.has(session.id);
                          const hasInputs = !!session.inputs;
                          console.log(
                            `Session ${
                              session.id
                            }: isExpanded=${isExpanded}, hasInputs=${hasInputs}, shouldRender=${
                              isExpanded && hasInputs
                            }`
                          );
                          return isExpanded && hasInputs;
                        })() && (
                          <div className="bg-gray-50 p-4 border-t">
                            <div className="space-y-4">
                              {/* Remote language controls */}
                              <div className="grid grid-cols-3 gap-4">
                                {/* Input Sources */}
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Remote language controls
                                  </h4>
                                  <div className="space-y-2">
                                    {session.inputs?.map((input) => (
                                      <div key={input.id} className="text-sm">
                                        <span className="font-medium">
                                          {input.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Teams bot section */}
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Teams bot
                                  </h4>
                                  <div className="space-y-2">
                                    {session.languages?.map((language) => (
                                      <div
                                        key={language}
                                        className="flex items-center"
                                      >
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-300">
                                          {language}
                                          <button className="ml-1 text-green-600 hover:text-green-800">
                                            ×
                                          </button>
                                        </span>
                                      </div>
                                    ))}
                                    <button className="text-sm text-blue-600 hover:text-blue-800">
                                      +Add another language
                                    </button>
                                    {session.hasAutoSelect && (
                                      <div className="flex items-center mt-2">
                                        <input
                                          type="checkbox"
                                          checked
                                          className="mr-2"
                                        />
                                        <span className="text-sm">
                                          Auto-select input language
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Microphone inputs */}
                                <div>
                                  <div className="space-y-2">
                                    {session.inputs
                                      ?.filter(
                                        (input) => input.type === "microphone"
                                      )
                                      .map((input) => (
                                        <div
                                          key={input.id}
                                          className="text-sm font-medium"
                                        >
                                          {input.name}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Other Sessions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              All Other Sessions
            </h2>

            {/* Filter controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>since yesterday</option>
                  <option>last week</option>
                  <option>last month</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Creator:</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>All creators</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search (ID, title, or tags)"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Open Selected Transcripts
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Selected
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Show usage for Selected
              </Button>
              <Button variant="outline" size="sm">
                <Pin className="h-4 w-4 mr-2" />
                Un-pin selected
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                {/* Custom table matching running sessions format */}
                <div className="w-full">
                  {/* Table header */}
                  <div className="border-b bg-gray-50 px-4 py-3">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-900">
                      <div className="col-span-4">Title</div>
                      <div className="col-span-2">ID</div>
                      <div className="col-span-2">Passcode</div>
                      <div className="col-span-2">Date & Time</div>
                      <div className="col-span-2"></div>
                    </div>
                  </div>

                  {/* Session rows */}
                  {otherSessions
                    .filter((session) => {
                      const matchesSearch =
                        !searchQuery ||
                        session.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        session.id
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase());
                      const matchesStatus =
                        !statusFilter || session.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((session) => (
                      <div key={session.id} className="border-b">
                        {/* Main row */}
                        <div
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSessionSelect(session)}
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                              <span className="font-medium">
                                {session.title}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-mono text-sm">
                                {session.id}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-mono text-sm">
                                {session.passcode}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm">
                                {session.dateTime}
                              </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinSession(session.id);
                                }}
                                className="bg-blue-500 text-white hover:bg-blue-600"
                              >
                                Start
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Session Join Modal */}
      {modalVariant === "progressive" && (
        <SessionJoinModalProgressive
          open={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          sessionId={joinSessionId}
          onJoinAsPresenter={handleJoinAsPresenter}
          onJoinAsAttendee={handleJoinAsAttendee}
        />
      )}
      {modalVariant === "compact" && (
        <SessionJoinModalCompact
          open={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          sessionId={joinSessionId}
          onJoinAsPresenter={handleJoinAsPresenter}
          onJoinAsAttendee={handleJoinAsAttendee}
        />
      )}
      {modalVariant === "detailed" && (
        <SessionJoinModal
          open={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
          sessionId={joinSessionId}
          onJoinAsPresenter={handleJoinAsPresenter}
          onJoinAsAttendee={handleJoinAsAttendee}
        />
      )}
    </div>
  );
}
