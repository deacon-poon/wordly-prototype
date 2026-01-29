"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Info, AlertCircle } from "lucide-react";
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Reset form state when modal opens
  useEffect(() => {
    if (open) {
      setEventDetails(DEFAULT_EVENT_DETAILS);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventDetails.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!eventDetails.timezone) {
      newErrors.timezone = "Timezone is required";
    }

    if (!eventDetails.accountId) {
      newErrors.accountId = "Account is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation for touched fields or after submit attempt
  useEffect(() => {
    if (submitAttempted || Object.keys(touched).length > 0) {
      const newErrors: Record<string, string> = {};

      if ((touched.name || submitAttempted) && !eventDetails.name.trim()) {
        newErrors.name = "Event name is required";
      }

      if ((touched.timezone || submitAttempted) && !eventDetails.timezone) {
        newErrors.timezone = "Timezone is required";
      }

      if ((touched.accountId || submitAttempted) && !eventDetails.accountId) {
        newErrors.accountId = "Account is required";
      }

      setErrors(newErrors);
    }
  }, [eventDetails, touched, submitAttempted]);

  const handleCreate = async () => {
    setSubmitAttempted(true);
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
    setTouched({});
    setSubmitAttempted(false);
    onOpenChange(false);
  };

  const handleDetailsChange = (data: Partial<EventDetailsFormData>) => {
    setEventDetails((prev) => ({ ...prev, ...data }));
    // Mark fields as touched when they change
    const touchedFields = Object.keys(data).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched((prev) => ({ ...prev, ...touchedFields }));
  };

  // Check if form is valid for enabling/showing validation summary
  const isFormValid =
    eventDetails.name.trim() &&
    eventDetails.timezone &&
    eventDetails.accountId;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-blue-100 flex items-center justify-center">
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
          <div className="mt-6 p-4 bg-primary-blue-50 border border-primary-blue-200 rounded-lg">
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

        <div className="pt-4 border-t space-y-3">
          {/* Validation summary - shows after submit attempt with errors */}
          {submitAttempted && hasErrors && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">
                <p className="font-medium">Please fix the following:</p>
                <ul className="mt-1 list-disc list-inside text-red-600">
                  {errors.name && <li>{errors.name}</li>}
                  {errors.timezone && <li>{errors.timezone}</li>}
                  {errors.accountId && <li>{errors.accountId}</li>}
                </ul>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
