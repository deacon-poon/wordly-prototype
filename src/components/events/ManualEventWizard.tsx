"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Info } from "lucide-react";
import {
  EventDetailsForm,
  EventDetailsFormData,
  DEFAULT_EVENT_DETAILS,
} from "./forms";

// ============================================================================
// Props
// ============================================================================

interface ManualEventWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: { eventDetails: EventDetailsFormData }) => void;
}

// ============================================================================
// Component - Simplified per design sync feedback
// ============================================================================

/**
 * Simplified event creation modal.
 *
 * Per design sync feedback: User sets event defaults here, then lands on the
 * blank event detail page where they can add rooms/sessions manually
 * or use bulk upload. This avoids duplicating UX between the wizard and
 * the event detail page.
 */
export function ManualEventWizard({
  open,
  onOpenChange,
  onComplete,
}: ManualEventWizardProps) {
  const [eventDetails, setEventDetails] = useState<EventDetailsFormData>(
    DEFAULT_EVENT_DETAILS
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventDetails.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!eventDetails.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!eventDetails.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (eventDetails.startDate > eventDetails.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onComplete({ eventDetails });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEventDetails(DEFAULT_EVENT_DETAILS);
    setErrors({});
    onOpenChange(false);
  };

  const handleDetailsChange = (data: Partial<EventDetailsFormData>) => {
    setEventDetails((prev) => ({ ...prev, ...data }));
    // Clear errors for changed fields
    if (data.name !== undefined && errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (data.startDate !== undefined && errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: "" }));
    }
    if (data.endDate !== undefined && errors.endDate) {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-green-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Create Event
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Set up your event details and defaults
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <EventDetailsForm
            data={eventDetails}
            onChange={handleDetailsChange}
            errors={errors}
            mode="create"
          />

          {/* Info callout about next steps */}
          <div className="mt-6 p-4 bg-accent-green-50 border border-accent-green-200 rounded-lg">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary-teal-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1">
                  What happens next?
                </p>
                <p>
                  After creating the event, you&apos;ll be taken to the event
                  detail page where you can:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                  <li>Add rooms and sessions manually</li>
                  <li>Upload a spreadsheet to bulk-add sessions</li>
                  <li>Configure additional settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting || !eventDetails.name.trim()}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
