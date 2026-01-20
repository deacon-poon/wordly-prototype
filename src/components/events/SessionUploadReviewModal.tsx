"use client";

import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Check,
  AlertCircle,
  Pencil,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";
import { TIMEZONES, LANGUAGES, GLOSSARIES } from "./forms/types";

// ============================================================================
// Types
// ============================================================================

export interface UploadedSessionRow {
  id: string;
  rowNumber: number;
  title: string;
  presenter: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  duration: number; // in minutes (calculated from start/end)
  language: string;
  glossary: string;
  label: string;
  // Validation state
  isValid: boolean;
  errors: SessionValidationError[];
}

export interface SessionValidationError {
  field: string;
  message: string;
  type: "error" | "warning";
}

type StatusFilter = "all" | "valid" | "invalid";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse time string to minutes since midnight for comparison
 */
function parseTimeToMinutes(timeStr: string): number {
  const cleanTime = timeStr.trim().toUpperCase();
  const isPM = cleanTime.includes("PM");
  const isAM = cleanTime.includes("AM");
  const timeOnly = cleanTime.replace(/\s*(AM|PM)\s*/i, "").trim();

  const [hoursStr, minsStr] = timeOnly.split(":");
  let hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr || "0", 10);

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + mins;
}

/**
 * Calculate duration in minutes between two time strings
 */
function calculateDuration(startTime: string, endTime: string): number {
  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);
  return endMins - startMins;
}

// ============================================================================
// Validation Logic
// ============================================================================

function validateSession(
  session: UploadedSessionRow,
  allSessions: UploadedSessionRow[]
): SessionValidationError[] {
  const errors: SessionValidationError[] = [];

  // Check for empty required fields
  if (!session.title.trim()) {
    errors.push({
      field: "title",
      message: "Title is required",
      type: "error",
    });
  }

  if (!session.presenter.trim()) {
    errors.push({
      field: "presenter",
      message: "Presenter is required",
      type: "error",
    });
  }

  if (!session.date) {
    errors.push({
      field: "date",
      message: "Date is required",
      type: "error",
    });
  }

  if (!session.startTime) {
    errors.push({
      field: "startTime",
      message: "Start time is required",
      type: "error",
    });
  }

  if (!session.endTime) {
    errors.push({
      field: "endTime",
      message: "End time is required",
      type: "error",
    });
  }

  // Validate end time is after start time
  if (session.startTime && session.endTime) {
    const startMins = parseTimeToMinutes(session.startTime);
    const endMins = parseTimeToMinutes(session.endTime);

    if (endMins <= startMins) {
      errors.push({
        field: "endTime",
        message: "End time must be after start time",
        type: "error",
      });
    }
  }

  // Check for overlapping sessions on the same date (within same room)
  const sameDateSessions = allSessions.filter(
    (other) => other.id !== session.id && other.date === session.date
  );

  // Check for exact time conflicts
  const conflictingSessions = sameDateSessions.filter(
    (other) => other.startTime === session.startTime
  );

  if (conflictingSessions.length > 0) {
    errors.push({
      field: "startTime",
      message: `Time conflict with: ${conflictingSessions
        .map((s) => s.title || `Row ${s.rowNumber}`)
        .join(", ")}`,
      type: "error",
    });
  }

  // Check for overlapping sessions
  if (session.startTime && session.endTime) {
    const sessionStart = parseTimeToMinutes(session.startTime);
    const sessionEnd = parseTimeToMinutes(session.endTime);

    const overlapping = sameDateSessions.filter((other) => {
      if (!other.startTime || !other.endTime) return false;

      const otherStart = parseTimeToMinutes(other.startTime);
      const otherEnd = parseTimeToMinutes(other.endTime);

      // Check if ranges overlap
      return sessionStart < otherEnd && sessionEnd > otherStart;
    });

    if (overlapping.length > 0) {
      errors.push({
        field: "startTime",
        message: `Overlaps with: ${overlapping
          .map((s) => s.title || `Row ${s.rowNumber}`)
          .join(", ")}`,
        type: "error",
      });
    }
  }

  // Validate duration (warning if very short or very long)
  if (session.duration < 5) {
    errors.push({
      field: "duration",
      message: "Duration is less than 5 minutes",
      type: "warning",
    });
  }

  if (session.duration > 480) {
    errors.push({
      field: "duration",
      message: "Duration exceeds 8 hours",
      type: "warning",
    });
  }

  return errors;
}

function validateAllSessions(
  sessions: UploadedSessionRow[]
): UploadedSessionRow[] {
  return sessions.map((session) => {
    // Recalculate duration from start/end times
    let duration = session.duration;
    if (session.startTime && session.endTime) {
      const calculated = calculateDuration(session.startTime, session.endTime);
      if (calculated > 0) duration = calculated;
    }

    const updatedSession = { ...session, duration };
    const errors = validateSession(updatedSession, sessions);
    return {
      ...updatedSession,
      errors,
      isValid: errors.filter((e) => e.type === "error").length === 0,
    };
  });
}

// ============================================================================
// Generate Mock Upload Data (for prototype)
// ============================================================================

export function generateMockSessionData(
  defaultTimezone: string = "America/Los_Angeles"
): UploadedSessionRow[] {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const mockData = [
    {
      title: "Opening Keynote",
      presenter: "John Doe, Jane Smith",
      date: today,
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      title: "Product Showcase",
      presenter: "Jane Smith",
      date: today,
      startTime: "10:30",
      endTime: "11:30",
    },
    {
      title: "Hands-on Workshop",
      presenter: "Bob Johnson",
      date: today,
      startTime: "13:00",
      endTime: "15:00",
    },
    {
      title: "Q&A Session",
      presenter: "Alice Lee",
      date: today,
      startTime: "15:30",
      endTime: "16:30",
    },
    {
      title: "Day 2 Opening",
      presenter: "John Doe",
      date: tomorrow,
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      title: "Deep Dive Technical",
      presenter: "Bob Johnson, Alice Lee",
      date: tomorrow,
      startTime: "10:30",
      endTime: "12:00",
    },
  ];

  const sessions: UploadedSessionRow[] = mockData.map((item, index) => ({
    id: `session-${index + 1}`,
    rowNumber: index + 1,
    title: item.title,
    presenter: item.presenter,
    date: item.date,
    startTime: item.startTime,
    endTime: item.endTime,
    timezone: defaultTimezone,
    duration: calculateDuration(item.startTime, item.endTime),
    language: "en-US",
    glossary: "none",
    label: "",
    isValid: true,
    errors: [],
  }));

  return validateAllSessions(sessions);
}

// ============================================================================
// Props
// ============================================================================

interface SessionUploadReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sessions: UploadedSessionRow[]) => void;
  roomName: string;
  initialSessions?: UploadedSessionRow[];
  defaultTimezone?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SessionUploadReviewModal({
  open,
  onOpenChange,
  onSubmit,
  roomName,
  initialSessions,
  defaultTimezone = "America/Los_Angeles",
}: SessionUploadReviewModalProps) {
  // State
  const [sessions, setSessions] = useState<UploadedSessionRow[]>(
    initialSessions || generateMockSessionData(defaultTimezone)
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered and sorted sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Filter by status
    if (statusFilter === "valid") {
      filtered = filtered.filter((s) => s.isValid);
    } else if (statusFilter === "invalid") {
      filtered = filtered.filter((s) => !s.isValid);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.presenter.toLowerCase().includes(query)
      );
    }

    // Sort: invalid sessions first
    filtered = [...filtered].sort((a, b) => {
      if (a.isValid === b.isValid) {
        return a.rowNumber - b.rowNumber;
      }
      return a.isValid ? 1 : -1;
    });

    return filtered;
  }, [sessions, statusFilter, searchQuery]);

  // Stats
  const validCount = sessions.filter((s) => s.isValid).length;
  const invalidCount = sessions.filter((s) => !s.isValid).length;

  // Update a session field
  const updateSession = useCallback(
    (id: string, field: keyof UploadedSessionRow, value: string) => {
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        );
        return validateAllSessions(updated);
      });
    },
    []
  );

  // Delete a session
  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      const renumbered = filtered.map((s, i) => ({
        ...s,
        rowNumber: i + 1,
      }));
      return validateAllSessions(renumbered);
    });
  }, []);

  // Get field errors
  const getFieldErrors = (
    session: UploadedSessionRow,
    field: string
  ): SessionValidationError[] => {
    return session.errors.filter((e) => e.field === field);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (invalidCount > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(sessions);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render cell with error/warning tooltip
  const renderCellWithTooltip = (
    session: UploadedSessionRow,
    field: string,
    content: React.ReactNode
  ) => {
    const fieldErrors = getFieldErrors(session, field);
    const hasError = fieldErrors.some((e) => e.type === "error");
    const hasWarning = fieldErrors.some((e) => e.type === "warning");

    if (fieldErrors.length === 0) {
      return content;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded cursor-help ${
              hasError
                ? "bg-red-100 text-red-800 border border-red-300"
                : hasWarning
                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                : ""
            }`}
          >
            {content}
            {hasError && <AlertCircle className="h-3 w-3 text-red-600" />}
            {!hasError && hasWarning && (
              <AlertCircle className="h-3 w-3 text-yellow-600" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            {fieldErrors.map((err, i) => (
              <div
                key={i}
                className={`text-xs ${
                  err.type === "error" ? "text-red-600" : "text-yellow-600"
                }`}
              >
                {err.type === "error" ? "⛔" : "⚠️"} {err.message}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Render editable cell
  const renderEditableCell = (
    session: UploadedSessionRow,
    field: keyof UploadedSessionRow,
    type: "text" | "date" | "time" | "select",
    options?: { id: string; name: string }[]
  ) => {
    const isEditing = editingRowId === session.id;
    const value = session[field] as string;
    const fieldErrors = getFieldErrors(session, field);
    const hasError = fieldErrors.some((e) => e.type === "error");
    const hasWarning = fieldErrors.some((e) => e.type === "warning");

    if (!isEditing) {
      const displayValue =
        type === "select"
          ? options?.find((o) => o.id === value)?.name || value
          : value || "—";

      return renderCellWithTooltip(session, field, displayValue);
    }

    // Editing mode
    const inputClassName = `h-8 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : hasWarning
        ? "border-yellow-500 focus:ring-yellow-500"
        : ""
    }`;

    switch (type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={inputClassName}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={`${inputClassName} w-32`}
          />
        );
      case "time":
        return (
          <Input
            type="time"
            value={value || ""}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={`${inputClassName} w-24`}
          />
        );
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(v) => updateSession(session.id, field, v)}
          >
            <SelectTrigger className={`${inputClassName} w-32`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1100px] max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-blue-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-teal-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Review Sessions for {roomName}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-0.5">
                  Review and edit the parsed sessions before adding to the
                  room
                </p>
              </div>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {validCount} valid
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                {invalidCount} invalid
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Show all</SelectItem>
                  <SelectItem value="valid">
                    <span className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-600" />
                      Valid
                    </span>
                  </SelectItem>
                  <SelectItem value="invalid">
                    <span className="flex items-center gap-2">
                      <X className="h-3 w-3 text-red-600" />
                      Invalid
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter by title or presenter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <TooltipProvider delayDuration={200}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="w-16 text-center">Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                  <TableHead className="min-w-[180px]">Title</TableHead>
                  <TableHead className="min-w-[150px]">Presenter</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-28">Start Time</TableHead>
                  <TableHead className="w-28">End Time</TableHead>
                  <TableHead className="w-24">Duration</TableHead>
                  <TableHead className="w-40">Timezone</TableHead>
                  <TableHead className="w-32">Language</TableHead>
                  <TableHead className="w-40">Glossary</TableHead>
                  <TableHead className="min-w-[120px]">Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => {
                  const isEditing = editingRowId === session.id;

                  return (
                    <TableRow
                      key={session.id}
                      className={`${!session.isValid ? "bg-red-50" : ""} ${
                        isEditing ? "bg-blue-50" : ""
                      }`}
                    >
                      {/* Row number */}
                      <TableCell className="text-center text-gray-500">
                        {session.rowNumber}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {session.isValid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-green-600"
                                onClick={() => setEditingRowId(null)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => setEditingRowId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-primary-teal-600"
                                onClick={() => setEditingRowId(session.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600"
                                onClick={() => deleteSession(session.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell>
                        {renderEditableCell(session, "title", "text")}
                      </TableCell>

                      {/* Presenter */}
                      <TableCell>
                        {renderEditableCell(session, "presenter", "text")}
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        {renderEditableCell(session, "date", "date")}
                      </TableCell>

                      {/* Start Time */}
                      <TableCell>
                        {renderEditableCell(session, "startTime", "time")}
                      </TableCell>

                      {/* End Time */}
                      <TableCell>
                        {renderEditableCell(session, "endTime", "time")}
                      </TableCell>

                      {/* Duration (read-only, calculated) */}
                      <TableCell>
                        {renderCellWithTooltip(
                          session,
                          "duration",
                          <span className="text-gray-600">
                            {session.duration > 0
                              ? `${session.duration} mins`
                              : "—"}
                          </span>
                        )}
                      </TableCell>

                      {/* Timezone */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "timezone",
                          "select",
                          TIMEZONES.map((tz) => ({
                            id: tz.value,
                            name: tz.label,
                          }))
                        )}
                      </TableCell>

                      {/* Language */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "language",
                          "select",
                          LANGUAGES.map((l) => ({ id: l.code, name: l.name }))
                        )}
                      </TableCell>

                      {/* Glossary */}
                      <TableCell>
                        {renderEditableCell(
                          session,
                          "glossary",
                          "select",
                          GLOSSARIES.map((g) => ({ id: g.id, name: g.name }))
                        )}
                      </TableCell>

                      {/* Label */}
                      <TableCell>
                        {renderEditableCell(session, "label", "text")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {sessions.length} sessions will be added to{" "}
            <span className="font-medium">{roomName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || invalidCount > 0}
              className="bg-primary-blue-600 hover:bg-primary-blue-700"
            >
              {isSubmitting
                ? "Adding..."
                : `Add Room with ${sessions.length} Sessions`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
