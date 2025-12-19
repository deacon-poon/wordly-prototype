"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  EventFormProvider,
  useEventForm,
  EventDetailsForm,
  LocationListForm,
  SessionListForm,
  SessionCard,
  LocationCard,
  WizardStep,
  EventDetailsFormData,
  LocationFormData,
  SessionFormData,
  DEFAULT_EVENT_DETAILS,
} from "./forms";

// ============================================================================
// Props
// ============================================================================

interface ManualEventWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: {
    eventDetails: EventDetailsFormData;
    locations: LocationFormData[];
    sessionsByLocation: Record<string, SessionFormData[]>;
  }) => void;
}

// ============================================================================
// Step Indicator
// ============================================================================

const STEPS: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: "details", label: "Event Details", icon: Calendar },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "sessions", label: "Sessions", icon: Clock },
  { key: "review", label: "Review", icon: FileText },
];

function StepIndicator({ currentStep }: { currentStep: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.key}>
            {index > 0 && (
              <div
                className={`h-0.5 w-8 ${
                  isCompleted ? "bg-primary-teal-500" : "bg-gray-200"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-primary-teal-500 text-white"
                    : isCurrent
                    ? "bg-primary-teal-100 text-primary-teal-700 border-2 border-primary-teal-500"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? "text-primary-teal-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================================
// Wizard Content (uses context)
// ============================================================================

function WizardContent({
  onComplete,
  onClose,
}: {
  onComplete: ManualEventWizardProps["onComplete"];
  onClose: () => void;
}) {
  const {
    state,
    nextStep,
    prevStep,
    updateEventDetails,
    addLocation,
    updateLocation,
    removeLocation,
    addSession,
    updateSession,
    removeSession,
    getSessionsForLocation,
    canProceed,
    isFirstStep,
    isLastStep,
    setSubmitting,
  } = useEventForm();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  // Validation for each step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (state.currentStep) {
      case "details":
        if (!state.eventDetails.name.trim()) {
          newErrors.name = "Event name is required";
        }
        if (!state.eventDetails.startDate) {
          newErrors.startDate = "Start date is required";
        }
        if (!state.eventDetails.endDate) {
          newErrors.endDate = "End date is required";
        }
        if (state.eventDetails.startDate > state.eventDetails.endDate) {
          newErrors.endDate = "End date must be after start date";
        }
        break;

      case "locations":
        if (state.locations.length === 0) {
          newErrors.locations = "At least one location is required";
        }
        state.locations.forEach((loc, index) => {
          if (!loc.name.trim()) {
            newErrors[`${index}.name`] = "Location name is required";
          }
        });
        break;

      case "sessions":
        // Sessions are optional, but validate any that exist
        state.locations.forEach((loc, locIndex) => {
          const sessions = getSessionsForLocation(locIndex);
          sessions.forEach((session, sesIndex) => {
            if (!session.title.trim()) {
              newErrors[`${locIndex}.${sesIndex}.title`] = "Title is required";
            }
            if (session.scheduledStart >= session.endTime) {
              newErrors[`${locIndex}.${sesIndex}.endTime`] =
                "End time must be after start time";
            }
          });
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        handleComplete();
      } else {
        nextStep();
        setErrors({});
      }
    }
  };

  const handleBack = () => {
    prevStep();
    setErrors({});
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await onComplete({
        eventDetails: state.eventDetails,
        locations: state.locations,
        sessionsByLocation: state.sessionsByLocation,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (state.currentStep) {
      case "details":
        return (
          <div className="max-h-[60vh] overflow-y-auto px-1">
            <EventDetailsForm
              data={state.eventDetails}
              onChange={updateEventDetails}
              errors={errors}
              mode="create"
            />
          </div>
        );

      case "locations":
        return (
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {errors.locations && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                {errors.locations}
              </div>
            )}
            <LocationListForm
              locations={state.locations}
              onUpdateLocation={updateLocation}
              onAddLocation={() => addLocation()}
              onRemoveLocation={removeLocation}
              errors={errors}
            />
          </div>
        );

      case "sessions":
        return (
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {state.locations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No locations to add sessions to.</p>
                <p className="text-sm">
                  Go back and add at least one location.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Location tabs/selector */}
                <div className="flex flex-wrap gap-2 border-b pb-3">
                  {state.locations.map((location, index) => {
                    const sessionCount = getSessionsForLocation(index).length;
                    return (
                      <Button
                        key={location.id || index}
                        variant={
                          activeLocationIndex === index ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setActiveLocationIndex(index)}
                        className={
                          activeLocationIndex === index
                            ? "bg-primary-teal-600 hover:bg-primary-teal-700"
                            : ""
                        }
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {location.name || `Location ${index + 1}`}
                        {sessionCount > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                            {sessionCount}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Session list for active location */}
                <SessionListForm
                  sessions={getSessionsForLocation(activeLocationIndex)}
                  onUpdateSession={(sessionIndex, data) =>
                    updateSession(activeLocationIndex, sessionIndex, data)
                  }
                  onAddSession={() => addSession(activeLocationIndex)}
                  onRemoveSession={(sessionIndex) =>
                    removeSession(activeLocationIndex, sessionIndex)
                  }
                  locationName={
                    state.locations[activeLocationIndex]?.name ||
                    `Location ${activeLocationIndex + 1}`
                  }
                  defaultTimezone={state.eventDetails.timezone}
                />
              </div>
            )}
          </div>
        );

      case "review":
        const totalSessions = Object.values(state.sessionsByLocation).reduce(
          (sum, sessions) => sum + sessions.length,
          0
        );

        return (
          <div className="max-h-[60vh] overflow-y-auto px-1 space-y-6">
            {/* Event summary */}
            <Card className="p-4 bg-primary-teal-50 border-primary-teal-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-teal-600" />
                Event Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Event Name:</span>
                  <p className="font-medium">{state.eventDetails.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dates:</span>
                  <p className="font-medium">
                    {state.eventDetails.startDate} to{" "}
                    {state.eventDetails.endDate}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Locations:</span>
                  <p className="font-medium">{state.locations.length}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Sessions:</span>
                  <p className="font-medium">{totalSessions}</p>
                </div>
              </div>
            </Card>

            {/* Locations and sessions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-teal-600" />
                Locations & Sessions
              </h3>

              {state.locations.map((location, locIndex) => {
                const sessions = getSessionsForLocation(locIndex);
                return (
                  <Card key={location.id || locIndex} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary-teal-600" />
                      <h4 className="font-medium text-gray-900">
                        {location.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        ({sessions.length}{" "}
                        {sessions.length === 1 ? "session" : "sessions"})
                      </span>
                    </div>

                    {sessions.length > 0 ? (
                      <div className="space-y-2">
                        {sessions.map((session, sesIndex) => (
                          <SessionCard
                            key={session.id || sesIndex}
                            session={session}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No sessions added yet. You can add them later.
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Confirmation note */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              <strong>Note:</strong> After creating the event, you can still
              edit details, add more sessions, or upload a spreadsheet to
              bulk-add sessions.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with step indicator */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Create Event Manually
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {state.currentStep === "details" &&
            "Enter the basic details for your event"}
          {state.currentStep === "locations" &&
            "Add the physical locations where sessions will take place"}
          {state.currentStep === "sessions" &&
            "Add sessions to each location (you can skip this and add later)"}
          {state.currentStep === "review" &&
            "Review your event before creating it"}
        </p>
        <StepIndicator currentStep={state.currentStep} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-hidden">
        {renderStepContent()}
      </div>

      {/* Footer with navigation */}
      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={isFirstStep ? onClose : handleBack}
          disabled={state.isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {isFirstStep ? "Cancel" : "Back"}
        </Button>

        <div className="flex items-center gap-3">
          {!isLastStep && state.currentStep === "sessions" && (
            <Button
              variant="outline"
              onClick={() => {
                nextStep();
                setErrors({});
              }}
            >
              Skip for now
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              state.isSubmitting ||
              (!canProceed() && state.currentStep !== "sessions")
            }
            className="bg-primary-teal-600 hover:bg-primary-teal-700"
          >
            {state.isSubmitting ? (
              "Creating..."
            ) : isLastStep ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Create Event
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Wizard Component
// ============================================================================

export function ManualEventWizard({
  open,
  onOpenChange,
  onComplete,
}: ManualEventWizardProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleComplete: ManualEventWizardProps["onComplete"] = async (data) => {
    await onComplete(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <EventFormProvider
          initialMode="create"
          initialEventDetails={DEFAULT_EVENT_DETAILS}
          initialLocations={[]}
          initialSessionsByLocation={{}}
        >
          <WizardContent onComplete={handleComplete} onClose={handleClose} />
        </EventFormProvider>
      </DialogContent>
    </Dialog>
  );
}
