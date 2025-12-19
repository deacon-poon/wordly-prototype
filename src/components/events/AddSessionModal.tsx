"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import {
  SessionForm,
  useStandaloneSessionForm,
  SessionFormData,
} from "./forms";

// ============================================================================
// Props
// ============================================================================

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: SessionFormData) => Promise<void>;
  locationName: string;
  locationSessionId?: string;
  locationPasscode?: string;
  eventName?: string;
  defaultDate?: string;
  defaultTimezone?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Modal for adding a new session to an existing location.
 * Uses the standalone session form hook for independent state management.
 * This demonstrates how the same SessionForm can be reused in different contexts.
 */
export function AddSessionModal({
  open,
  onOpenChange,
  onSave,
  locationName,
  locationSessionId,
  locationPasscode,
  eventName,
  defaultDate,
  defaultTimezone = "America/Los_Angeles",
}: AddSessionModalProps) {
  const { session, updateSession, errors, validate, reset } =
    useStandaloneSessionForm(
      defaultDate
        ? {
            id: undefined,
            title: "",
            presenters: "",
            scheduledDate: defaultDate,
            scheduledStart: "09:00",
            endTime: "10:00",
            timezone: defaultTimezone,
            languages: ["en-US"],
          }
        : undefined,
      defaultTimezone
    );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(session);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-teal-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Session
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationName}
                {eventName && ` • ${eventName}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <SessionForm
            data={session}
            onChange={updateSession}
            errors={errors}
            mode="create"
            locationName={locationName}
            locationSessionId={locationSessionId}
            locationPasscode={locationPasscode}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !session.title.trim()}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            {isSaving ? "Adding..." : "Add Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Edit Session Modal (Reuses the same form)
// ============================================================================

interface EditSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: SessionFormData) => Promise<void>;
  initialData: SessionFormData;
  locationName: string;
  locationSessionId?: string;
  locationPasscode?: string;
  eventName?: string;
  readOnly?: boolean;
}

/**
 * Modal for editing an existing session.
 * Demonstrates how the same form can be used for both create and edit.
 */
export function EditSessionModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  locationName,
  locationSessionId,
  locationPasscode,
  eventName,
  readOnly = false,
}: EditSessionModalProps) {
  const { session, updateSession, errors, validate, reset } =
    useStandaloneSessionForm(initialData);
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (open && initialData) {
      updateSession(initialData);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(session);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update session:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-teal-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {readOnly ? "View Session" : "Edit Session"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationName}
                {eventName && ` • ${eventName}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {readOnly && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
              <strong>Read-only:</strong> This session has already started and
              cannot be edited.
            </div>
          )}
          <SessionForm
            data={session}
            onChange={updateSession}
            errors={errors}
            mode="edit"
            readOnly={readOnly}
            locationName={locationName}
            locationSessionId={locationSessionId}
            locationPasscode={locationPasscode}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button
              onClick={handleSave}
              disabled={isSaving || !session.title.trim()}
              className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
