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
import { MapPin } from "lucide-react";
import {
  LocationForm,
  useStandaloneLocationForm,
  LocationFormData,
} from "./forms";

// ============================================================================
// Props
// ============================================================================

interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (location: LocationFormData) => Promise<void>;
  eventName?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Modal for adding a new location to an existing event.
 * Uses the standalone location form hook for independent state management.
 * This demonstrates how the same LocationForm can be reused in different contexts.
 */
export function AddLocationModal({
  open,
  onOpenChange,
  onSave,
  eventName,
}: AddLocationModalProps) {
  const { location, updateLocation, errors, validate, reset } =
    useStandaloneLocationForm();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(location);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add location:", error);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-teal-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Location
              </DialogTitle>
              {eventName && (
                <DialogDescription className="text-sm text-gray-600">
                  Adding location to: {eventName}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <LocationForm
            data={location}
            onChange={updateLocation}
            errors={errors}
            mode="create"
          />

          <p className="mt-4 text-sm text-gray-500">
            After creating the location, you can add sessions to it from the
            event detail page.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !location.name.trim()}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            {isSaving ? "Adding..." : "Add Location"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Edit Location Modal (Reuses the same form)
// ============================================================================

interface EditLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (location: LocationFormData) => Promise<void>;
  initialData: LocationFormData;
  eventName?: string;
}

/**
 * Modal for editing an existing location.
 * Demonstrates how the same form can be used for both create and edit.
 */
export function EditLocationModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  eventName,
}: EditLocationModalProps) {
  const { location, updateLocation, errors, validate, reset } =
    useStandaloneLocationForm(initialData);
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (open && initialData) {
      updateLocation(initialData);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(location);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update location:", error);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-teal-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Edit Location
              </DialogTitle>
              {eventName && (
                <DialogDescription className="text-sm text-gray-600">
                  Editing location in: {eventName}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <LocationForm
            data={location}
            onChange={updateLocation}
            errors={errors}
            mode="edit"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !location.name.trim()}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
