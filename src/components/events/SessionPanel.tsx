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

/** Location option for dropdown */
interface LocationOption {
  id: string;
  name: string;
}

interface SessionPanelProps {
  mode: "add" | "edit";
  /** Required for edit mode */
  session?: Session;
  /** Location details */
  locationName: string;
  locationId?: string;
  eventName: string;
  /** Default date for new sessions */
  defaultDate?: string;
  defaultTimezone?: string;
  /** Available locations for move functionality */
  locations?: LocationOption[];
  /** Callbacks */
  onClose: () => void;
  onSave: (session: Session | SessionFormData, isNew: boolean, newLocationId?: string) => void;
  onAddLocation?: () => void;
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
  locationId,
  eventName,
  defaultDate,
  defaultTimezone = "America/Los_Angeles",
  locations,
  onClose,
  onSave,
  onAddLocation,
}: SessionPanelProps) {
  // Track selected location for move functionality
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);
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
        // Advanced settings - inherit from Session Defaults
        accountId: "acc-default",
        startingLanguage: "en-US",
        autoSelect: true,
        languages: ["en-US"],
        glossaryId: "none",
        transcriptSetting: "save-workspace",
        accessType: "open",
        floorAudio: false,
        voicePack: "feminine",
        label: "",
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
      // Advanced settings - inherit from Session Defaults
      accountId: "acc-default",
      startingLanguage: "en-US",
      autoSelect: true,
      languages: ["en-US"],
      glossaryId: "none",
      transcriptSetting: "save-workspace",
      accessType: "open",
      floorAudio: false,
      voicePack: "feminine",
      label: "",
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

  // Reset form and location when session changes (edit mode)
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
      setSelectedLocationId(locationId);
    } else if (mode === "add") {
      reset();
      setSelectedLocationId(locationId);
    }
  }, [session, mode, locationId]);

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
      // Check if location changed
      const locationChanged = selectedLocationId && selectedLocationId !== locationId;
      
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

        onSave(updatedSession, false, locationChanged ? selectedLocationId : undefined);
      } else {
        // Add mode - pass the form data
        onSave(formData, true, selectedLocationId);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Sticky Header */}
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-gray-200">
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
            locations={locations}
            selectedLocationId={selectedLocationId}
            onLocationChange={setSelectedLocationId}
            onAddLocation={onAddLocation}
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
