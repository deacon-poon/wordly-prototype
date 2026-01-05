"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Plus, Edit2, MapPin } from "lucide-react";
import {
  SessionForm,
  useStandaloneSessionForm,
  SessionFormData,
} from "./forms";

// ============================================================================
// Types
// ============================================================================

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface SessionPanelProps {
  mode: "add" | "edit";
  /** Required for edit mode */
  session?: Session;
  /** Location details */
  locationName: string;
  locationSessionId: string;
  locationPasscode: string;
  eventName: string;
  /** Default date for new sessions */
  defaultDate?: string;
  defaultTimezone?: string;
  /** Callbacks */
  onClose: () => void;
  onSave: (session: Session | SessionFormData, isNew: boolean) => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Unified session panel for both adding and editing sessions.
 * Renders inline in a resizable panel - the parent component handles the panel chrome.
 */
export function SessionPanel({
  mode,
  session,
  locationName,
  locationSessionId,
  locationPasscode,
  eventName,
  defaultDate,
  defaultTimezone = "America/Los_Angeles",
  onClose,
  onSave,
}: SessionPanelProps) {
  // Convert Session to SessionFormData for edit mode
  const getInitialFormData = (): SessionFormData => {
    if (mode === "edit" && session) {
      return {
        id: session.id,
        title: session.title,
        presenters: session.presenters.join(", "),
        scheduledDate: session.scheduledDate,
        scheduledStart: session.scheduledStart,
        endTime: session.endTime,
        timezone: defaultTimezone,
        languages: ["en-US"],
      };
    }
    // Add mode - start with empty form
    return {
      id: undefined,
      title: "",
      presenters: "",
      scheduledDate: defaultDate || new Date().toISOString().split("T")[0],
      scheduledStart: "09:00",
      endTime: "10:00",
      timezone: defaultTimezone,
      languages: ["en-US"],
    };
  };

  const {
    session: formData,
    updateSession,
    errors,
    validate,
    reset,
  } = useStandaloneSessionForm(getInitialFormData(), defaultTimezone);

  const [isSaving, setIsSaving] = useState(false);

  // Check if session has started (read-only if yes) - only for edit mode
  const hasStarted = () => {
    if (mode !== "edit" || !session) return false;
    const now = new Date();
    const sessionDateTime = new Date(
      `${session.scheduledDate}T${session.scheduledStart}`
    );
    return now >= sessionDateTime;
  };

  const isReadOnly = hasStarted();

  // Reset form when session changes (edit mode)
  useEffect(() => {
    if (mode === "edit" && session) {
      updateSession({
        id: session.id,
        title: session.title,
        presenters: session.presenters.join(", "),
        scheduledDate: session.scheduledDate,
        scheduledStart: session.scheduledStart,
        endTime: session.endTime,
        timezone: defaultTimezone,
        languages: ["en-US"],
      });
    } else if (mode === "add") {
      reset();
    }
  }, [session, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      if (mode === "edit" && session) {
        // Convert presenters string back to array
        const presentersArray = formData.presenters
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        const updatedSession: Session = {
          ...session,
          title: formData.title,
          presenters: presentersArray,
          scheduledDate: formData.scheduledDate,
          scheduledStart: formData.scheduledStart,
          endTime: formData.endTime,
        };

        onSave(updatedSession, false);
      } else {
        // Add mode - pass the form data
        onSave(formData, true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Sticky Header */}
      <div className="flex-shrink-0 border-b px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2">
            {mode === "add" ? (
              <Plus className="h-5 w-5 text-primary-teal-600" />
            ) : (
              <Edit2 className="h-5 w-5 text-primary-teal-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === "add" ? "Add Session" : "Edit Session"}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {locationName} · {eventName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form
        id="session-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto min-h-0"
      >
        <div className="p-6 space-y-6">
          {isReadOnly && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
              <strong>Read-only:</strong> This session has already started and
              cannot be edited.
            </div>
          )}

          <SessionForm
            data={formData}
            onChange={updateSession}
            errors={errors}
            mode={mode === "add" ? "create" : "edit"}
            readOnly={isReadOnly}
            locationName={locationName}
          />
        </div>
      </form>

      {/* Sticky Footer Actions */}
      <div className="flex-shrink-0 border-t px-6 py-4 flex justify-end gap-3 bg-white">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="session-form"
          disabled={isSaving || isReadOnly || !formData.title.trim()}
          className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {mode === "add" ? "Adding..." : "Saving..."}
            </>
          ) : mode === "add" ? (
            "Add Session"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
