"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  Check,
  AlertCircle,
  Pencil,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TIMEZONES, LANGUAGES } from "./forms/types";

// ============================================================================
// Types
// ============================================================================

export interface UploadedSession {
  id: string;
  rowNumber: number;
  title: string;
  presenter: string;
  date: string;
  time: string;
  endTime?: string;
  timezone: string;
  duration: number; // in minutes
  glossary: string;
  account: string;
  voicePack: string;
  language: string;
  label?: string;
  location?: string; // For events flow
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
// Mock Data (for dropdowns)
// ============================================================================

const GLOSSARIES = [
  { id: "none", name: "None" },
  { id: "tech", name: "Technical Terms" },
  { id: "medical", name: "Medical Terminology" },
  { id: "legal", name: "Legal Terms" },
];

const ACCOUNTS = [
  { id: "1", name: "Deacon Poon (2a4...)" },
  { id: "2", name: "Main Account (8ff...)" },
  { id: "3", name: "Development (3a2...)" },
];

const VOICE_PACKS = [
  { id: "feminine", name: "Feminine Voice" },
  { id: "masculine", name: "Masculine Voice" },
  { id: "neutral", name: "Neutral Voice" },
];

// ============================================================================
// Validation Logic
// ============================================================================

function validateSession(
  session: UploadedSession,
  allSessions: UploadedSession[]
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

  if (!session.time) {
    errors.push({
      field: "time",
      message: "Start time is required",
      type: "error",
    });
  }

  // Check for time conflicts with other sessions on the same date
  const conflictingSessions = allSessions.filter(
    (other) =>
      other.id !== session.id &&
      other.date === session.date &&
      other.time === session.time
  );

  if (conflictingSessions.length > 0) {
    errors.push({
      field: "time",
      message: `Time conflict with session(s): ${conflictingSessions
        .map((s) => s.title || `Row ${s.rowNumber}`)
        .join(", ")}`,
      type: "error",
    });
  }

  // Check for overlapping sessions (if end time exists)
  if (session.endTime) {
    const overlapping = allSessions.filter((other) => {
      if (other.id === session.id || other.date !== session.date) return false;
      // Simple overlap check
      const sessionStart = session.time;
      const sessionEnd = session.endTime!;
      const otherStart = other.time;
      const otherEnd = other.endTime || other.time;

      return (
        (sessionStart >= otherStart && sessionStart < otherEnd) ||
        (sessionEnd > otherStart && sessionEnd <= otherEnd) ||
        (sessionStart <= otherStart && sessionEnd >= otherEnd)
      );
    });

    if (overlapping.length > 0) {
      errors.push({
        field: "time",
        message: "Session time overlaps with another session",
        type: "warning",
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
  sessions: UploadedSession[]
): UploadedSession[] {
  return sessions.map((session) => {
    const errors = validateSession(session, sessions);
    return {
      ...session,
      errors,
      isValid: errors.filter((e) => e.type === "error").length === 0,
    };
  });
}

// ============================================================================
// Generate Mock Upload Data
// ============================================================================

function generateMockUploadData(): UploadedSession[] {
  const baseDate = "2025-12-18";
  const times = [
    "1:00 PM", "2:00 PM", "1:00 PM", "3:00 PM", "1:00 PM", 
    "4:00 PM", "1:00 PM", "5:00 PM", "1:00 PM", "6:00 PM",
    "1:00 PM", "7:00 PM", "1:00 PM", "8:00 PM", "1:00 PM"
  ];

  const sessions: UploadedSession[] = times.map((time, index) => ({
    id: `session-${index + 1}`,
    rowNumber: index + 1,
    title: `Example Session Title ${index + 1}`,
    presenter: "John Doe",
    date: index === 14 ? "2025-12-19" : baseDate,
    time,
    timezone: "America/Los_Angeles",
    duration: 45 + index,
    glossary: "none",
    account: "1",
    voicePack: "feminine",
    language: "en-US",
    isValid: true,
    errors: [],
  }));

  return validateAllSessions(sessions);
}

// ============================================================================
// Props
// ============================================================================

interface BulkUploadReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sessions: UploadedSession[]) => void;
  initialSessions?: UploadedSession[];
}

// ============================================================================
// Component
// ============================================================================

export function BulkUploadReviewModal({
  open,
  onOpenChange,
  onSubmit,
  initialSessions,
}: BulkUploadReviewModalProps) {
  // State
  const [sessions, setSessions] = useState<UploadedSession[]>(
    initialSessions || generateMockUploadData()
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered sessions
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

    return filtered;
  }, [sessions, statusFilter, searchQuery]);

  // Stats
  const validCount = sessions.filter((s) => s.isValid).length;
  const invalidCount = sessions.filter((s) => !s.isValid).length;

  // Update a session field
  const updateSession = useCallback(
    (id: string, field: keyof UploadedSession, value: any) => {
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        );
        // Re-validate all sessions
        return validateAllSessions(updated);
      });
    },
    []
  );

  // Delete a session
  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // Re-number and re-validate
      const renumbered = filtered.map((s, i) => ({
        ...s,
        rowNumber: i + 1,
      }));
      return validateAllSessions(renumbered);
    });
  }, []);

  // Check if field has error
  const hasFieldError = (session: UploadedSession, field: string): boolean => {
    return session.errors.some((e) => e.field === field && e.type === "error");
  };

  // Get field error message
  const getFieldError = (
    session: UploadedSession,
    field: string
  ): string | undefined => {
    const error = session.errors.find((e) => e.field === field);
    return error?.message;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (invalidCount > 0) {
      alert("Please fix all errors before submitting");
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

  // Render editable cell
  const renderEditableCell = (
    session: UploadedSession,
    field: keyof UploadedSession,
    type: "text" | "date" | "time" | "select",
    options?: { id: string; name: string }[]
  ) => {
    const isEditing = editingRowId === session.id;
    const value = session[field] as string;
    const hasError = hasFieldError(session, field);

    if (!isEditing) {
      return (
        <span
          className={`${
            hasError
              ? "bg-red-100 text-red-800 px-2 py-1 rounded border border-red-300"
              : ""
          }`}
          title={hasError ? getFieldError(session, field) : undefined}
        >
          {type === "select"
            ? options?.find((o) => o.id === value)?.name || value
            : value}
        </span>
      );
    }

    // Editing mode
    switch (type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => updateSession(session.id, field, e.target.value)}
            className={`h-8 ${hasError ? "border-red-500" : ""}`}
          />
        );
      case "date":
        return (
          <div className="flex items-center gap-1">
            <Input
              type="date"
              value={value}
              onChange={(e) => updateSession(session.id, field, e.target.value)}
              className={`h-8 w-32 ${hasError ? "border-red-500" : ""}`}
            />
          </div>
        );
      case "time":
        return (
          <div className="flex items-center gap-1">
            <Input
              type="time"
              value={value}
              onChange={(e) => updateSession(session.id, field, e.target.value)}
              className={`h-8 w-24 ${hasError ? "border-red-500" : ""}`}
            />
          </div>
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(v) => updateSession(session.id, field, v)}
          >
            <SelectTrigger
              className={`h-8 w-32 ${hasError ? "border-red-500" : ""}`}
            >
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
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Review Uploaded Sessions
            </DialogTitle>
            <div className="flex items-center gap-4">
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
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
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
                  <SelectItem value="all">
                    <span className="flex items-center gap-2">
                      Show all
                    </span>
                  </SelectItem>
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
                placeholder="Filter by content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="w-16 text-center">Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="min-w-[150px]">Presenter</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="w-28">Time</TableHead>
                <TableHead className="w-40">Timezone</TableHead>
                <TableHead className="w-24">Duration</TableHead>
                <TableHead className="w-32">Glossary</TableHead>
                <TableHead className="w-40">Account</TableHead>
                <TableHead className="w-36">Voice Pack</TableHead>
                <TableHead className="w-32">Language</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => {
                const isEditing = editingRowId === session.id;

                return (
                  <TableRow
                    key={session.id}
                    className={`${
                      !session.isValid ? "bg-red-50" : ""
                    } ${isEditing ? "bg-blue-50" : ""}`}
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

                    {/* Time */}
                    <TableCell>
                      {renderEditableCell(session, "time", "time")}
                    </TableCell>

                    {/* Timezone */}
                    <TableCell>
                      {renderEditableCell(
                        session,
                        "timezone",
                        "select",
                        TIMEZONES.map((tz) => ({ id: tz.value, name: tz.label }))
                      )}
                    </TableCell>

                    {/* Duration */}
                    <TableCell>
                      <span
                        className={`${
                          hasFieldError(session, "duration")
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {session.duration} mins
                      </span>
                    </TableCell>

                    {/* Glossary */}
                    <TableCell>
                      {renderEditableCell(session, "glossary", "select", GLOSSARIES)}
                    </TableCell>

                    {/* Account */}
                    <TableCell>
                      {renderEditableCell(session, "account", "select", ACCOUNTS)}
                    </TableCell>

                    {/* Voice Pack */}
                    <TableCell>
                      {renderEditableCell(session, "voicePack", "select", VOICE_PACKS)}
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            Showing {filteredSessions.length} of {sessions.length} sessions
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
              className="bg-primary-teal-600 hover:bg-primary-teal-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
