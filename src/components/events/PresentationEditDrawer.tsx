"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  SessionForm,
  useStandaloneSessionForm,
  SessionFormData,
} from "./forms";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface PresentationEditDrawerProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSession: Session) => void;
  inline?: boolean;
  locationName?: string;
}

/**
 * Presentation edit drawer - uses the shared SessionForm for consistency.
 * Can be rendered inline (in a panel) or standalone.
 */
export function PresentationEditDrawer({
  session,
  isOpen,
  onClose,
  onSave,
  inline = false,
  locationName,
}: PresentationEditDrawerProps) {
  // Convert Session to SessionFormData
  const initialFormData: SessionFormData = {
    id: session.id,
    title: session.title,
    presenters: session.presenters.join(", "),
    scheduledDate: session.scheduledDate,
    scheduledStart: session.scheduledStart,
    endTime: session.endTime,
    timezone: "America/Los_Angeles",
    languages: ["en-US", "es", "fr"],
    // Advanced settings - use defaults
    accountId: "acc-default",
    startingLanguage: "en-US",
    autoSelect: true,
    glossaryId: "none",
    transcriptSetting: "save-workspace",
    accessType: "open",
    floorAudio: false,
    voicePack: "feminine",
    label: "",
  };

  const {
    session: formData,
    updateSession,
    errors,
    validate,
    reset,
  } = useStandaloneSessionForm(initialFormData);

  const [isSaving, setIsSaving] = useState(false);

  // Check if session has started (read-only if yes)
  const hasStarted = () => {
    const now = new Date();
    const sessionDateTime = new Date(
      `${session.scheduledDate}T${session.scheduledStart}`
    );
    return now >= sessionDateTime;
  };

  const isReadOnly = hasStarted();

  // Reset form when session changes
  useEffect(() => {
    if (session) {
      updateSession({
        id: session.id,
        title: session.title,
        presenters: session.presenters.join(", "),
        scheduledDate: session.scheduledDate,
        scheduledStart: session.scheduledStart,
        endTime: session.endTime,
        timezone: "America/Los_Angeles",
        languages: ["en-US", "es", "fr"],
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSaving(true);

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

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave(updatedSession);
    setIsSaving(false);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {isReadOnly && (
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
          <strong>Read-only:</strong> This presentation has already started and
          cannot be edited.
        </div>
      )}

      {/* Use the shared SessionForm component */}
      <SessionForm
        data={formData}
        onChange={updateSession}
        errors={errors}
        mode="edit"
        readOnly={isReadOnly}
        locationName={locationName}
      />

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving || isReadOnly}
          className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );

  if (inline) {
    return <div className="h-full overflow-y-auto">{formContent}</div>;
  }

  return null; // Sheet wrapper would go here if needed
}
