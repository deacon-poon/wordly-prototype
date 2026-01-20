"use client";

import React, { useState, useMemo, useEffect, use, useRef, useCallback } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  Edit2,
  ExternalLink,
  FileSpreadsheet,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getStoredEvent,
  saveEvent,
  deserializeEvent,
  serializeEvent,
} from "@/lib/eventStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { WaysToJoinModal } from "@/components/WaysToJoinModal";
import { RoomAccordion } from "@/components/events/RoomAccordion";
import {
  AddRoomModal,
  EditRoomModal,
} from "@/components/events/AddRoomModal";
import { SessionPanel } from "@/components/events/SessionPanel";
import {
  UploadScheduleModal,
  type SessionDefaults,
} from "@/components/events/UploadScheduleModal";
import {
  BulkUploadReviewModal,
  type UploadedSession,
} from "@/components/events/BulkUploadReviewModal";
import type {
  RoomFormData,
  SessionFormData,
} from "@/components/events/forms";
import { parseScheduleFile } from "@/lib/utils/parseSchedule";

// Data interfaces (will be imported from shared types in production)
interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface Room {
  id: string;
  name: string;
  sessionCount: number;
  roomSessionId: string;
  passcode: string;
  sessions: Session[];
}

type EventStatus = "active" | "upcoming" | "past";

interface Event {
  id: string;
  name: string;
  dateRange: string;
  startDate: Date;
  endDate: Date;
  timezone: string; // Event timezone (e.g., "America/Los_Angeles")
  roomCount: number;
  sessionCount: number;
  description: string;
  publicSummaryUrl?: string;
  rooms: Room[];
}

// Helper functions
function getEventStatus(startDate: Date, endDate: Date): EventStatus {
  const now = new Date();
  // Compare dates only (ignore time) to avoid timezone issues
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  if (today >= start && today <= end) {
    return "active";
  } else if (today < start) {
    return "upcoming";
  } else {
    return "past";
  }
}

function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function groupSessionsByDate(sessions: Session[]): [string, Session[]][] {
  const grouped = sessions.reduce((acc, session) => {
    const date = session.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  return Object.entries(grouped).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );
}

function isSessionToday(sessionDate: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return sessionDate === today;
}

function hasSessionsToday(room: Room): boolean {
  return room.sessions.some((session) =>
    isSessionToday(session.scheduledDate)
  );
}

// Helper to get relative dates
const getRelativeDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const end = endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${start}-${endDate.getDate()}, ${endDate.getFullYear()}`;
};

// Generate mock event data based on event ID
function getMockEventData(eventId: string): Event {
  // First, check if the event exists in localStorage (user-created events)
  const storedEvent = getStoredEvent(eventId);
  if (storedEvent) {
    return deserializeEvent(storedEvent);
  }

  // Map of event IDs to event data (demo events)
  const eventDataMap: Record<string, Partial<Event>> = {
    "evt-001": {
      name: "AI & Machine Learning Summit 2026",
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      timezone: "America/Los_Angeles",
      description:
        "Live conference on the latest advances in AI, machine learning, and deep learning technologies",
      publicSummaryUrl: "/public/ai-ml-summit-2026",
    },
    "evt-002": {
      name: "Cloud Infrastructure & DevOps Summit",
      startDate: getRelativeDate(7),
      endDate: getRelativeDate(8),
      timezone: "America/New_York",
      description:
        "Two-day summit focused on cloud architecture, Kubernetes, and modern DevOps practices",
      publicSummaryUrl: "/public/cloud-devops-summit-2026",
    },
    "evt-003": {
      name: "Frontend Development Conference 2026",
      startDate: getRelativeDate(14),
      endDate: getRelativeDate(15),
      timezone: "America/Los_Angeles",
      description:
        "Explore the latest in frontend technologies, React, Vue, and modern web development",
    },
  };

  const eventData = eventDataMap[eventId];
  // Use the event's start date for session scheduling (not current date)
  // This ensures future events show sessions on their actual scheduled dates
  const eventStartDate = eventData?.startDate || getRelativeDate(0);
  const eventDay1 = eventStartDate.toISOString().split("T")[0];
  const eventDay2 = new Date(eventStartDate.getTime() + 86400000).toISOString().split("T")[0];

  // For new events (not in our mock data), return an empty event
  if (!eventData) {
    return {
      id: eventId,
      name: "New Event",
      dateRange: formatDateRange(getRelativeDate(0), getRelativeDate(1)),
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(1),
      timezone: "America/Los_Angeles",
      roomCount: 0,
      sessionCount: 0,
      description: "Add rooms and sessions to get started",
      rooms: [],
    };
  }

  return {
    id: eventId,
    name: eventData.name || "Sample Event",
    dateRange: formatDateRange(
      eventData.startDate || getRelativeDate(0),
      eventData.endDate || getRelativeDate(1)
    ),
    startDate: eventData.startDate || getRelativeDate(0),
    endDate: eventData.endDate || getRelativeDate(1),
    timezone: eventData.timezone || "America/Los_Angeles",
    roomCount: 3,
    sessionCount: 12,
    description:
      eventData.description ||
      "A comprehensive conference featuring industry experts",
    publicSummaryUrl: eventData.publicSummaryUrl,
    rooms: [
      {
        id: "loc-001",
        name: "Main Auditorium",
        sessionCount: 5,
        roomSessionId: "AUDM-1234",
        passcode: "123456",
        sessions: [
          {
            id: "ses-001",
            title: "Opening Keynote: The Future of Technology",
            presenters: ["Dr. Sarah Chen", "John Smith"],
            scheduledDate: eventDay1,
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-002",
            title: "Scalable Architecture Patterns",
            presenters: ["Mike Rodriguez"],
            scheduledDate: eventDay1,
            scheduledStart: "11:00",
            endTime: "12:00",
            status: "pending",
          },
          {
            id: "ses-003",
            title: "Security Best Practices",
            presenters: ["Alex Thompson"],
            scheduledDate: eventDay1,
            scheduledStart: "13:30",
            endTime: "14:30",
            status: "pending",
          },
          {
            id: "ses-004",
            title: "Building Modern Applications",
            presenters: ["Jennifer Wu"],
            scheduledDate: eventDay2,
            scheduledStart: "09:00",
            endTime: "10:30",
            status: "pending",
          },
          {
            id: "ses-005",
            title: "Performance Optimization Techniques",
            presenters: ["Robert Kim", "Dr. Lisa Wang"],
            scheduledDate: eventDay2,
            scheduledStart: "11:00",
            endTime: "12:30",
            status: "pending",
          },
        ],
      },
      {
        id: "loc-002",
        name: "Workshop Room A",
        sessionCount: 4,
        roomSessionId: "WRKA-5678",
        passcode: "234567",
        sessions: [
          {
            id: "ses-006",
            title: "Hands-on Workshop: Advanced Techniques",
            presenters: ["Lisa Park", "David Martinez"],
            scheduledDate: eventDay1,
            scheduledStart: "09:00",
            endTime: "11:00",
            status: "pending",
          },
          {
            id: "ses-007",
            title: "Interactive Coding Session",
            presenters: ["Emily Zhang"],
            scheduledDate: eventDay1,
            scheduledStart: "11:30",
            endTime: "13:00",
            status: "pending",
          },
          {
            id: "ses-008",
            title: "Deep Dive: Technical Patterns",
            presenters: ["Tom Anderson"],
            scheduledDate: eventDay1,
            scheduledStart: "14:00",
            endTime: "15:30",
            status: "pending",
          },
          {
            id: "ses-009",
            title: "Real-world Case Studies",
            presenters: ["Rachel Green", "Bob Johnson"],
            scheduledDate: eventDay2,
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
        ],
      },
      {
        id: "loc-003",
        name: "Breakout Room B",
        sessionCount: 3,
        roomSessionId: "BRKB-1234",
        passcode: "345678",
        sessions: [
          {
            id: "ses-010",
            title: "Panel Discussion: Industry Trends",
            presenters: ["Multiple Speakers"],
            scheduledDate: eventDay1,
            scheduledStart: "10:00",
            endTime: "11:30",
            status: "pending",
          },
          {
            id: "ses-011",
            title: "Networking Session",
            presenters: ["Event Staff"],
            scheduledDate: eventDay1,
            scheduledStart: "12:00",
            endTime: "13:30",
            status: "pending",
          },
          {
            id: "ses-012",
            title: "Closing Remarks",
            presenters: ["Conference Host"],
            scheduledDate: eventDay2,
            scheduledStart: "16:00",
            endTime: "17:00",
            status: "pending",
          },
        ],
      },
    ],
  };
}

// Copy Button Component
export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const resolvedParams = use(params);
  // Default to "all" so newly added sessions are always visible
  const [selectedTab, setSelectedTab] = useState<
    "now" | "upcoming" | "past" | "all"
  >("all");
  const [waysToJoinModal, setWaysToJoinModal] = useState<{
    room: Room | null;
    eventName: string | null;
  }>({ room: null, eventName: null });
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Session panel state (unified for add/edit)
  const [sessionPanelState, setSessionPanelState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    session?: Session;
    roomId: string;
    roomName: string;
  } | null>(null);

  // Add Room modal
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [editRoomContext, setEditRoomContext] = useState<{
    room: Room;
  } | null>(null);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);

  // Event name editing
  const [isEditingEventName, setIsEditingEventName] = useState(false);
  const [editedEventName, setEditedEventName] = useState("");

  // Bulk upload flow modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBulkReviewModalOpen, setIsBulkReviewModalOpen] = useState(false);
  const [parsedSessions, setParsedSessions] = useState<UploadedSession[]>([]);

  // Smart sticky header state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Generate mock event data based on the event ID
  // In production, this would be fetched from an API
  // Using state so we can update it when adding locations/sessions
  const [event, setEvent] = useState<Event>(() =>
    getMockEventData(resolvedParams.eventId)
  );

  // Save event changes to localStorage for persistence
  useEffect(() => {
    // Only save user-created events (not demo events)
    if (
      event.id.startsWith("evt-") &&
      !["evt-001", "evt-002", "evt-003"].includes(event.id)
    ) {
      saveEvent(serializeEvent(event));
    }
  }, [event]);

  // Smart sticky header: hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentScrollY = container.scrollTop;
    const headerHeight = headerRef.current?.offsetHeight || 0;

    // Only start hiding after scrolling past the header
    if (currentScrollY < headerHeight) {
      setIsHeaderVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }

    // Determine scroll direction
    const isScrollingDown = currentScrollY > lastScrollY.current;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

    // Only react to meaningful scroll (not tiny movements)
    if (scrollDelta > 5) {
      setIsHeaderVisible(!isScrollingDown);
      lastScrollY.current = currentScrollY;
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Measure header height on mount and window resize
  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    measureHeader();
    window.addEventListener("resize", measureHeader);
    return () => window.removeEventListener("resize", measureHeader);
  }, []);

  // Reset header visibility and scroll position when panel opens/closes
  useEffect(() => {
    setIsHeaderVisible(true);
    lastScrollY.current = 0;
    // Reset scroll position to top when panel state changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [sessionPanelState?.isOpen]);

  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isPastEvent = eventStatus === "past";

  // Group all sessions by date across all rooms
  const sessionsByDate = useMemo(() => {
    const grouped: Record<
      string,
      Array<{ room: Room; session: Session }>
    > = {};

    event.rooms.forEach((room) => {
      room.sessions.forEach((session) => {
        if (!grouped[session.scheduledDate]) {
          grouped[session.scheduledDate] = [];
        }
        grouped[session.scheduledDate].push({ room, session });
      });
    });

    // Sort sessions within each date by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) =>
        a.session.scheduledStart.localeCompare(b.session.scheduledStart)
      );
    });

    return grouped;
  }, [event.rooms]);

  // Filter dates based on selected tab
  // "Now" = today's date (sessions happening now/today)
  // "Upcoming" = future dates
  // "Past" = past dates
  const filteredDates = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const allDates = Object.keys(sessionsByDate).sort();

    if (selectedTab === "all") {
      return allDates;
    }

    if (selectedTab === "now") {
      // Show only today's date (sessions happening now/today)
      return allDates.filter((date) => date === today);
    }

    if (selectedTab === "upcoming") {
      // Show future dates (sessions scheduled for future)
      return allDates.filter((date) => date > today);
    }

    if (selectedTab === "past") {
      // Show past dates (sessions that already happened)
      return allDates.filter((date) => date < today);
    }

    return allDates;
  }, [sessionsByDate, selectedTab]);

  // Compute the most recent session date for defaulting new sessions
  // Falls back to today's date if no sessions exist
  const mostRecentSessionDate = useMemo(() => {
    const allDates = Object.keys(sessionsByDate);
    if (allDates.length === 0) {
      return new Date().toISOString().split("T")[0];
    }
    // Return the most recent (max) date
    return allDates.sort().pop()!;
  }, [sessionsByDate]);

  // Auto-expand today's date on mount
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setExpandedDates(new Set([today]));
  }, [selectedTab]);

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleStartRoom = (
    room: Room,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // Open Join web app directly (presenter entry point)
    const joinUrl = `https://join.wordly.ai/${room.roomSessionId}`;
    window.open(joinUrl, "_blank", "noopener,noreferrer");
  };

  const handleWaysToJoin = (
    room: Room,
    eventName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWaysToJoinModal({
      room,
      eventName,
    });
  };

  const handleEditSession = (
    session: Session,
    room: Room,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSessionPanelState({
      isOpen: true,
      mode: "edit",
      session,
      roomId: room.id,
      roomName: room.name,
    });
  };

  const handleAddSession = (room: Room) => {
    setSessionPanelState({
      isOpen: true,
      mode: "add",
      roomId: room.id,
      roomName: room.name,
    });
  };

  const handleCloseSessionPanel = () => {
    setSessionPanelState(null);
  };

  const handleSaveSession = (
    sessionData: Session | SessionFormData,
    isNew: boolean,
    newRoomId?: string
  ) => {
    if (isNew) {
      // Adding new session
      const formData = sessionData as SessionFormData;
      const newSession: Session = {
        id: `ses-${Date.now()}`,
        title: formData.title,
        presenters: formData.presenters
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        scheduledDate: formData.scheduledDate,
        scheduledStart: formData.scheduledStart,
        endTime: formData.endTime,
        status: "pending",
      };

      // Add to selected room (which may be different from the one panel was opened from)
      const targetRoomId = newRoomId || sessionPanelState?.roomId;
      
      setEvent((prev) => ({
        ...prev,
        sessionCount: prev.sessionCount + 1,
        rooms: prev.rooms.map((rm) =>
          rm.id === targetRoomId
            ? {
                ...rm,
                sessions: [...rm.sessions, newSession],
                sessionCount: rm.sessionCount + 1,
              }
            : rm
        ),
      }));
      toast.success(`Session "${formData.title}" added successfully`);
    } else {
      // Editing existing session
      const updatedSession = sessionData as Session;
      const originalRoomId = sessionPanelState?.roomId;
      
      // Check if session is being moved to a different room
      if (newRoomId && newRoomId !== originalRoomId) {
        // Move session to new room
        setEvent((prev) => ({
          ...prev,
          rooms: prev.rooms.map((rm) => {
            if (rm.id === originalRoomId) {
              // Remove from original room
              return {
                ...rm,
                sessions: rm.sessions.filter((s) => s.id !== updatedSession.id),
                sessionCount: rm.sessionCount - 1,
              };
            }
            if (rm.id === newRoomId) {
              // Add to new room
              return {
                ...rm,
                sessions: [...rm.sessions, updatedSession],
                sessionCount: rm.sessionCount + 1,
              };
            }
            return rm;
          }),
        }));
        const newRoomName = event.rooms.find((r) => r.id === newRoomId)?.name;
        toast.success(`Session moved to "${newRoomName}"`);
      } else {
        // Update in same room
        setEvent((prev) => ({
          ...prev,
          rooms: prev.rooms.map((rm) =>
            rm.id === originalRoomId
              ? {
                  ...rm,
                  sessions: rm.sessions.map((s) =>
                    s.id === updatedSession.id ? updatedSession : s
                  ),
                }
              : rm
          ),
        }));
        toast.success("Session updated successfully");
      }
    }

    setSessionPanelState(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    const roomId = sessionPanelState?.roomId;
    if (!roomId) return;

    setEvent((prev) => ({
      ...prev,
      sessionCount: prev.sessionCount - 1,
      rooms: prev.rooms.map((rm) =>
        rm.id === roomId
          ? {
              ...rm,
              sessions: rm.sessions.filter((s) => s.id !== sessionId),
              sessionCount: rm.sessionCount - 1,
            }
          : rm
      ),
    }));

    toast.success("Session deleted");
    setSessionPanelState(null);
  };

  const handleDownloadForAV = () => {
    // Generate CSV content with event details for AV crew
    const csvRows = [];

    // Header
    csvRows.push(
      "Event,Room,Session ID,Passcode,Presentation Title,Presenters,Date,Start Time,End Time,Present URL"
    );

    // Data rows for each room and presentation
    event.rooms.forEach((room) => {
      const presentUrl = `https://present.wordly.ai/${room.roomSessionId}`;

      room.sessions.forEach((session) => {
        const row = [
          `"${event.name}"`,
          `"${room.name}"`,
          room.roomSessionId,
          room.passcode,
          `"${session.title}"`,
          `"${session.presenters.join(", ")}"`,
          session.scheduledDate,
          session.scheduledStart,
          session.endTime,
          presentUrl,
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.name.replace(/\s+/g, "-")}-AV-Details.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Bulk upload handlers
  const handleBulkUpload = async (file: File, defaults: SessionDefaults) => {
    try {
      // Parse the uploaded file
      const sessions = await parseScheduleFile(file, defaults.timezone);
      
      if (sessions.length === 0) {
        toast.error("No sessions found in the file. Please check the format.");
        // Still open review modal with mock data for demo
        setParsedSessions([]);
        setIsUploadModalOpen(false);
        setIsBulkReviewModalOpen(true);
        return;
      }
      
      // Apply defaults to sessions that don't have values
      const sessionsWithDefaults = sessions.map((session) => ({
        ...session,
        timezone: session.timezone || defaults.timezone,
        glossary: session.glossary || defaults.glossaryId,
        account: session.account || defaults.accountId,
        voicePack: session.voicePack || defaults.voicePack,
        language: session.language || defaults.startingLanguage,
      }));

      setParsedSessions(sessionsWithDefaults);
      setIsUploadModalOpen(false);
      setIsBulkReviewModalOpen(true);
      
      toast.success(`Parsed ${sessions.length} sessions from file`);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error(error instanceof Error ? error.message : "Failed to parse file");
      // Still open review modal with mock data for demo
      setParsedSessions([]);
      setIsUploadModalOpen(false);
      setIsBulkReviewModalOpen(true);
    }
  };

  const handleBulkReviewSubmit = (sessions: UploadedSession[]) => {
    console.log("handleBulkReviewSubmit called with", sessions.length, "sessions");
    console.log("Sessions data:", sessions);
    
    // Process the reviewed sessions and add them to the event
    const roomMap = new Map<
      string,
      { sessions: Session[]; roomId: string; existingRoomId?: string }
    >();

    // Check if rooms already exist
    const existingRooms = new Map(
      event.rooms.map((rm) => [rm.name.toLowerCase(), rm.id])
    );

    sessions.forEach((session, index) => {
      const roomName = session.room;
      const roomKey = roomName.toLowerCase();

      if (!roomMap.has(roomName)) {
        roomMap.set(roomName, {
          sessions: [],
          roomId: `loc-${Date.now()}-${index}`,
          existingRoomId: existingRooms.get(roomKey),
        });
      }

      const rm = roomMap.get(roomName)!;
      rm.sessions.push({
        id: `ses-${Date.now()}-${index}`,
        title: session.title,
        presenters: session.presenter.split(",").map((p) => p.trim()),
        scheduledDate: session.date,
        scheduledStart: session.startTime,
        endTime: session.endTime,
        status: "pending",
      });
    });

    // Update event with new rooms and sessions
    setEvent((prev) => {
      const updatedRooms = [...prev.rooms];

      roomMap.forEach((data, name) => {
        if (data.existingRoomId) {
          // Add sessions to existing room
          const roomIndex = updatedRooms.findIndex(
            (rm) => rm.id === data.existingRoomId
          );
          if (roomIndex !== -1) {
            updatedRooms[roomIndex] = {
              ...updatedRooms[roomIndex],
              sessions: [
                ...updatedRooms[roomIndex].sessions,
                ...data.sessions,
              ],
              sessionCount:
                updatedRooms[roomIndex].sessions.length +
                data.sessions.length,
            };
          }
        } else {
          // Create new room
          updatedRooms.push({
            id: data.roomId,
            name,
            sessionCount: data.sessions.length,
            roomSessionId: `${Array.from({ length: 4 }, () =>
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
            ).join("")}-${Math.floor(1000 + Math.random() * 9000)}`,
            passcode: Math.random().toString().substring(2, 8),
            sessions: data.sessions,
          });
        }
      });

      // Expand date range to include new sessions (but never shrink it)
      const allDates = updatedRooms.flatMap((rm) =>
        rm.sessions.map((s) => new Date(s.scheduledDate))
      );
      
      // Get today's date (at midnight) for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate the min/max dates from sessions
      const sessionMinDate = allDates.length > 0
        ? new Date(Math.min(...allDates.map((d) => d.getTime())))
        : null;
      const sessionMaxDate = allDates.length > 0
        ? new Date(Math.max(...allDates.map((d) => d.getTime())))
        : null;
      
      // Only EXPAND the date range, never shrink it
      // Also ensure we don't mark the event as "past" by keeping endDate >= today
      const startDate = sessionMinDate
        ? new Date(Math.min(prev.startDate.getTime(), sessionMinDate.getTime()))
        : prev.startDate;
      const endDate = sessionMaxDate
        ? new Date(Math.max(prev.endDate.getTime(), sessionMaxDate.getTime(), today.getTime()))
        : new Date(Math.max(prev.endDate.getTime(), today.getTime()));

      const updated = {
        ...prev,
        rooms: updatedRooms,
        roomCount: updatedRooms.length,
        sessionCount: updatedRooms.reduce(
          (sum, rm) => sum + rm.sessions.length,
          0
        ),
        startDate,
        endDate,
        dateRange: formatDateRange(startDate, endDate),
      };
      console.log("Updated event state:", updated);
      console.log("Updated rooms:", updated.rooms);
      return updated;
    });

    const newRoomsCount = Array.from(roomMap.values()).filter(
      (data) => !data.existingRoomId
    ).length;
    const totalSessions = sessions.length;

    console.log("Room map:", Array.from(roomMap.entries()));
    console.log("New rooms count:", newRoomsCount);
    console.log("Total sessions:", totalSessions);

    toast.success(
      `Imported ${totalSessions} session${totalSessions > 1 ? "s" : ""}${
        newRoomsCount > 0
          ? ` across ${newRoomsCount} new room${
              newRoomsCount > 1 ? "s" : ""
            }`
          : ""
      }`
    );
    setIsBulkReviewModalOpen(false);
  };

  const mainContent = (
    <>
      {/* Smart sticky header - hides on scroll down, shows on scroll up */}
      <div
        ref={headerRef}
        className={cn(
          "sticky top-0 z-20 bg-white border-b border-gray-200 transition-transform duration-300 ease-out",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="px-6 py-5">
          {/* Row 1: Title (editable) + Add Room */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isEditingEventName ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Input
                    value={editedEventName}
                    onChange={(e) => setEditedEventName(e.target.value)}
                    className="text-xl font-semibold h-9 max-w-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editedEventName.trim()) {
                        setEvent((prev) => ({
                          ...prev,
                          name: editedEventName.trim(),
                        }));
                        setIsEditingEventName(false);
                        toast.success("Event name updated");
                      } else if (e.key === "Escape") {
                        setIsEditingEventName(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (editedEventName.trim()) {
                        setEvent((prev) => ({
                          ...prev,
                          name: editedEventName.trim(),
                        }));
                        setIsEditingEventName(false);
                        toast.success("Event name updated");
                      }
                    }}
                    className="p-1.5 hover:bg-green-100 rounded-md transition-colors text-green-600 flex-shrink-0"
                    title="Save"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsEditingEventName(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 flex-shrink-0"
                    title="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">
                    {event.name}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedEventName(event.name);
                      setIsEditingEventName(true);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                    title="Edit event name"
                    aria-label="Edit event name"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
            {/* Add Room button - primary action */}
            <Button
              onClick={() => setIsAddRoomModalOpen(true)}
              disabled={isPastEvent}
              className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white flex-shrink-0"
              title={isPastEvent ? "Cannot add to past events" : "Add Room"}
            >
              <Plus className="h-4 w-4 @sm:mr-2" />
              <span className="hidden @sm:inline">Add Room</span>
            </Button>
          </div>

          {/* Row 2: Metadata + Public Summary Link */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              {event.dateRange}
            </span>
            <span className="text-gray-300 hidden @sm:inline">·</span>
            <span>{event.roomCount} rooms</span>
            <span className="text-gray-300">·</span>
            <span>{event.sessionCount} presentations</span>
            {event.publicSummaryUrl && (
              <>
                <span className="text-gray-300">·</span>
                <a
                  href={event.publicSummaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-teal-600 hover:text-primary-teal-700 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Public Summaries Page
                </a>
              </>
            )}
          </div>

          {/* Row 3: Tabs (left) + Actions (right) - container-query responsive */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={selectedTab}
              onValueChange={(value: any) => setSelectedTab(value)}
              className="flex-shrink-0"
            >
              <TabsList>
                <TabsTrigger value="now">Now</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Actions - responsive based on container width */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Only show bulk download when there are rooms with sessions */}
              {event.rooms.some((rm) => rm.sessions.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadForAV}
                  className="text-gray-600 hover:text-gray-900"
                  title="Bulk Download Links"
                >
                  <Download className="h-4 w-4 @md:mr-1.5" />
                  <span className="hidden @md:inline">Bulk Download Links</span>
                </Button>
              )}
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                size="sm"
                variant="outline"
                disabled={isPastEvent}
                title={
                  isPastEvent
                    ? "Cannot add to past events"
                    : event.sessionCount > 0
                    ? "Replace all sessions with a new schedule from spreadsheet"
                    : "Upload locations and sessions from spreadsheet"
                }
              >
                <FileSpreadsheet className="h-4 w-4 @md:mr-1" />
                <span className="hidden @md:inline">
                  {event.sessionCount > 0 ? "Replace Schedule" : "Upload Schedule"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule grouped by date */}
      <div className="px-6 pb-6 pt-4 space-y-4">
        {/* Show rooms without sessions */}
        {event.rooms.filter((rm) => rm.sessions.length === 0).length >
          0 && (
          <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <h3 className="text-sm font-semibold text-amber-800">
                Rooms awaiting sessions
              </h3>
              <span className="text-xs text-amber-600">
                (
                {
                  event.rooms.filter((rm) => rm.sessions.length === 0)
                    .length
                }{" "}
                {event.rooms.filter((rm) => rm.sessions.length === 0)
                  .length === 1
                  ? "room"
                  : "rooms"}
                )
              </span>
            </div>
            <p className="text-xs text-amber-700 ml-4">
              These rooms don&apos;t have any sessions scheduled yet. Add
              sessions to schedule them on specific dates.
            </p>
            {event.rooms
              .filter((rm) => rm.sessions.length === 0)
              .map((room) => (
                <RoomAccordion
                  key={room.id}
                  room={room}
                  defaultExpanded={false}
                  eventTimezone={event.timezone}
                  onStartRoom={(room, e) =>
                    handleStartRoom(room, event.name, e)
                  }
                  onLinksToJoin={(room, e) =>
                    handleWaysToJoin(room, event.name, e)
                  }
                  onRenameRoom={(room) => {
                    setEditRoomContext({ room });
                    setIsEditRoomModalOpen(true);
                  }}
                  onDeleteRoom={(room) => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${room.name}"?`
                      )
                    ) {
                      setEvent((prev) => ({
                        ...prev,
                        rooms: prev.rooms.filter(
                          (r) => r.id !== room.id
                        ),
                        roomCount: prev.roomCount - 1,
                      }));
                      toast.success(`Room "${room.name}" deleted`);
                    }
                  }}
                  onAddSession={handleAddSession}
                  isPastEvent={isPastEvent}
                  showCredentials={true}
                />
              ))}
          </div>
        )}

        {filteredDates.length === 0 &&
        event.rooms.filter((rm) => rm.sessions.length === 0).length ===
          0 ? (
          <Card className="p-8 text-center">
            {/* New event - no rooms at all */}
            {event.rooms.length === 0 ? (
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  This is a new event
                </p>
                <p className="text-gray-600">
                  Click <span className="font-medium">Add Room</span> to add
                  rooms one at a time, or{" "}
                  <span className="font-medium">Upload Schedule</span> to bulk
                  import from a spreadsheet.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                {selectedTab === "now" && "No sessions happening now"}
                {selectedTab === "upcoming" && "No upcoming sessions"}
                {selectedTab === "past" && "No past sessions"}
                {selectedTab === "all" && "No sessions found"}
              </p>
            )}
          </Card>
        ) : filteredDates.length > 0 ? (
          // Display dates first, then locations within each date
          filteredDates.map((date) => {
            const sessionsForDate = sessionsByDate[date];

            // Group sessions by room for this date
            const roomSessionsMap = sessionsForDate.reduce(
              (acc, { room, session }) => {
                if (!acc[room.id]) {
                  acc[room.id] = {
                    room,
                    sessions: [],
                  };
                }
                acc[room.id].sessions.push(session);
                return acc;
              },
              {} as Record<string, { room: Room; sessions: Session[] }>
            );

            const roomsList = Object.values(roomSessionsMap);

            const isDateExpanded = expandedDates.has(date);

            return (
              <div
                key={date}
                className={`relative transition-all duration-200 rounded-lg ${
                  isDateExpanded
                    ? "border border-gray-300 bg-white shadow-sm"
                    : "border border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Date Header - Collapsible Accordion */}
                <button
                  onClick={() => toggleDateExpansion(date)}
                  className="w-full px-4 py-4 flex items-center text-left"
                >
                  {/* Left: Icon column (fixed width for alignment) */}
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-teal-600" />
                  </div>

                  {/* Center: Date info (grows) */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {formatSessionDate(date)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({sessionsForDate.length}{" "}
                      {sessionsForDate.length === 1
                        ? "presentation"
                        : "presentations"}
                      , {roomsList.length}{" "}
                      {roomsList.length === 1 ? "room" : "rooms"})
                    </span>
                  </div>

                  {/* Right: Chevron column (fixed width for alignment) */}
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <ChevronDown
                      className={`h-5 w-5 text-primary-teal-600 transition-transform duration-200 ${
                        isDateExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Rooms for this date */}
                {isDateExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-3">
                    {roomsList.map(({ room, sessions }) => {
                      // Create a modified room object with only sessions for this date
                      const roomWithDateSessions = {
                        ...room,
                        sessions: sessions,
                      };

                      return (
                        <RoomAccordion
                          key={room.id}
                          room={roomWithDateSessions}
                          defaultExpanded={false}
                          eventTimezone={event.timezone}
                          onStartRoom={(room, e) =>
                            handleStartRoom(room, event.name, e)
                          }
                          onLinksToJoin={(room, e) =>
                            handleWaysToJoin(room, event.name, e)
                          }
                          onEditSession={(session, room, e) =>
                            handleEditSession(session, room, e)
                          }
                          onRenameRoom={(room) => {
                            setEditRoomContext({ room });
                            setIsEditRoomModalOpen(true);
                          }}
                          onDeleteRoom={(room) => {
                            // In production, show confirmation dialog then call API
                            if (
                              confirm(
                                `Delete room "${room.name}"? This will also delete all sessions in this room.`
                              )
                            ) {
                              console.log("Delete room:", room.id);
                            }
                          }}
                          onAddSession={handleAddSession}
                          isPastEvent={isPastEvent}
                          showCredentials={true}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : null}
      </div>

      {/* Ways to Join Modal */}
      {waysToJoinModal.room && waysToJoinModal.eventName && (
        <WaysToJoinModal
          open={!!waysToJoinModal.room}
          onOpenChange={(open) => {
            if (!open) {
              setWaysToJoinModal({ room: null, eventName: null });
            }
          }}
          roomSessionId={waysToJoinModal.room.roomSessionId}
          roomName={waysToJoinModal.room.name}
          eventName={waysToJoinModal.eventName}
          passcode={waysToJoinModal.room.passcode}
        />
      )}

      {/* Add Room Modal */}
      <AddRoomModal
        open={isAddRoomModalOpen}
        onOpenChange={setIsAddRoomModalOpen}
        eventName={event.name}
        onSave={async (roomData: RoomFormData) => {
          // Create a new empty room with generated IDs
          const newRoom: Room = {
            id: `loc-${Date.now()}`,
            name: roomData.name,
            sessionCount: 0,
            roomSessionId:
              roomData.roomSessionId ||
              `${Array.from({ length: 4 }, () =>
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]
              ).join("")}-${Math.floor(1000 + Math.random() * 9000)}`,
            passcode:
              roomData.passcode || Math.random().toString().substring(2, 8),
            sessions: [],
          };

          // Update event state with new room
          setEvent((prev) => ({
            ...prev,
            rooms: [...prev.rooms, newRoom],
            roomCount: prev.roomCount + 1,
          }));

          toast.success(`Room "${roomData.name}" added. Add sessions to schedule it.`);
          setIsAddRoomModalOpen(false);

          // Open the session panel to encourage adding a session immediately
          setSessionPanelState({
            isOpen: true,
            mode: "add",
            roomId: newRoom.id,
            roomName: newRoom.name,
          });
        }}
      />

      {/* Edit Room Modal */}
      {editRoomContext && (
        <EditRoomModal
          open={isEditRoomModalOpen}
          onOpenChange={setIsEditRoomModalOpen}
          eventName={event.name}
          initialData={{
            id: editRoomContext.room.id,
            name: editRoomContext.room.name,
          }}
          onSave={async (roomData: RoomFormData) => {
            // Update the room in state
            setEvent((prev) => ({
              ...prev,
              rooms: prev.rooms.map((rm) =>
                rm.id === editRoomContext.room.id
                  ? { ...rm, name: roomData.name }
                  : rm
              ),
            }));

            toast.success("Room renamed successfully");
            setIsEditRoomModalOpen(false);
            setEditRoomContext(null);
          }}
        />
      )}

      {/* Upload Schedule Modal */}
      <UploadScheduleModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleBulkUpload}
        hasExistingSessions={event.sessionCount > 0}
      />

      {/* Bulk Upload Review Modal */}
      <BulkUploadReviewModal
        open={isBulkReviewModalOpen}
        onOpenChange={setIsBulkReviewModalOpen}
        onSubmit={handleBulkReviewSubmit}
        initialSessions={parsedSessions}
        eventName={event.name}
      />
    </>
  );

  return (
    <div className="h-full">
      {sessionPanelState?.isOpen ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={65} minSize={50}>
            <div ref={scrollContainerRef} className="h-full overflow-y-auto bg-white @container">
              {mainContent}
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px bg-transparent hover:bg-gray-300 transition-colors" />
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <SessionPanel
              mode={sessionPanelState.mode}
              session={sessionPanelState.session}
              roomName={sessionPanelState.roomName}
              roomId={sessionPanelState.roomId}
              eventName={event.name}
              defaultDate={mostRecentSessionDate}
              rooms={event.rooms.map((rm) => ({ id: rm.id, name: rm.name }))}
              onClose={handleCloseSessionPanel}
              onSave={handleSaveSession}
              onDelete={handleDeleteSession}
              onAddRoom={() => setIsAddRoomModalOpen(true)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div ref={scrollContainerRef} className="h-full overflow-y-auto bg-white @container">
          {mainContent}
        </div>
      )}
    </div>
  );
}
