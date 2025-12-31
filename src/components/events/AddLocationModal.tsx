"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Upload, Info, X, FileSpreadsheet, Plus } from "lucide-react";
import {
  useStandaloneLocationForm,
  LocationFormData,
  SessionFormData,
  TIMEZONES,
} from "./forms";
import {
  SessionUploadReviewModal,
  UploadedSessionRow,
  generateMockSessionData,
} from "./SessionUploadReviewModal";

// ============================================================================
// Types
// ============================================================================

interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    location: LocationFormData,
    sessions?: SessionFormData[]
  ) => Promise<void>;
  eventName?: string;
  defaultTimezone?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Modal for adding a new location to an existing event.
 * Supports two modes:
 * 1. Create empty location (add sessions later)
 * 2. Create location with bulk uploaded sessions
 */
export function AddLocationModal({
  open,
  onOpenChange,
  onSave,
  eventName,
  defaultTimezone = "America/Los_Angeles",
}: AddLocationModalProps) {
  const { location, updateLocation, errors, validate, reset } =
    useStandaloneLocationForm();
  const [isSaving, setIsSaving] = React.useState(false);

  // Bulk upload state
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timezone, setTimezone] = useState(defaultTimezone);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [parsedSessions, setParsedSessions] = useState<UploadedSessionRow[]>(
    []
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (validTypes.includes(file.type) || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        // Parse the file (mock for prototype - generates sample data)
        const mockSessions = generateMockSessionData(timezone);
        setParsedSessions(mockSessions);
      } else {
        alert("Please select a valid CSV or Excel file");
      }
    }
  };

  const handleDownloadTemplate = () => {
    // Create a sample CSV template for sessions
    const csvContent = `Title,Presenter,Date,Start Time,End Time,Timezone
"Opening Keynote","John Doe, Jane Smith","2024-11-15","09:00","10:30","America/Los_Angeles"
"Product Showcase","Jane Smith","2024-11-15","11:00","12:00","America/Los_Angeles"
"Hands-on Workshop","Bob Johnson, Alice Lee","2024-11-15","13:00","15:00","America/Los_Angeles"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sessions-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleReviewSessions = () => {
    if (!validate()) return;
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (sessions: UploadedSessionRow[]) => {
    setIsSaving(true);
    try {
      // Convert reviewed sessions to SessionFormData
      const sessionsToAdd: SessionFormData[] = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        presenters: s.presenter,
        scheduledDate: s.date,
        scheduledStart: s.startTime,
        endTime: s.endTime,
        timezone: s.timezone,
        languages: [s.language],
      }));

      await onSave(location, sessionsToAdd);
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add location:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmpty = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onSave(location, undefined);
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add location:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    setShowBulkUpload(false);
    setSelectedFile(null);
    setParsedSessions([]);
    setTimezone(defaultTimezone);
    setShowReviewModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
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

          <div className="py-4 space-y-6">
            {/* Location Name */}
            <div className="space-y-2">
              <Label
                htmlFor="location-name"
                className="text-sm font-semibold text-gray-900"
              >
                Location Name *
              </Label>
              <Input
                id="location-name"
                value={location.name}
                onChange={(e) => updateLocation({ name: e.target.value })}
                placeholder="e.g., Main Auditorium, Workshop Room A"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Session Options */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                Add Sessions
              </Label>

              {/* Toggle between empty and bulk upload */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkUpload(false)}
                  className={`flex-1 p-3 rounded-lg border-2 text-left transition-colors ${
                    !showBulkUpload
                      ? "border-primary-teal-500 bg-primary-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Plus className="h-4 w-4 text-primary-teal-600" />
                    <span className="font-medium text-sm text-gray-900">
                      Add later
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Create empty location, add sessions one by one
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBulkUpload(true)}
                  className={`flex-1 p-3 rounded-lg border-2 text-left transition-colors ${
                    showBulkUpload
                      ? "border-primary-teal-500 bg-primary-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileSpreadsheet className="h-4 w-4 text-primary-teal-600" />
                    <span className="font-medium text-sm text-gray-900">
                      Bulk upload
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Import sessions from a spreadsheet
                  </p>
                </button>
              </div>
            </div>

            {/* Bulk Upload Section */}
            {showBulkUpload && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* Upload instructions */}
                <div className="text-sm text-gray-700">
                  Upload a spreadsheet containing sessions for this location.{" "}
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-blue-600 underline hover:text-blue-700 font-medium"
                  >
                    Download template
                  </button>
                </div>

                {/* File input (hidden) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* File upload display or button */}
                {selectedFile ? (
                  <div className="p-3 bg-white border border-primary-teal-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-primary-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {parsedSessions.length} sessions parsed
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setParsedSessions([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                )}

                {/* Timezone selector */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="timezone-select"
                      className="text-sm font-medium text-gray-700"
                    >
                      Default Timezone
                    </Label>
                    <Info className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger
                      id="timezone-select"
                      className="w-full bg-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Info about defaults */}
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">
                        How defaults work
                      </p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>Blank fields use the default timezone above</li>
                        <li>Values in your spreadsheet override defaults</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty location hint */}
            {!showBulkUpload && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">
                  After creating the location, you can add sessions from the
                  event detail page.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            {showBulkUpload ? (
              <Button
                onClick={handleReviewSessions}
                disabled={isSaving || !location.name.trim() || !selectedFile}
                className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
              >
                Review Sessions
              </Button>
            ) : (
              <Button
                onClick={handleSaveEmpty}
                disabled={isSaving || !location.name.trim()}
                className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
              >
                {isSaving ? "Adding..." : "Add Location"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Review Modal */}
      <SessionUploadReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSubmit={handleReviewSubmit}
        locationName={location.name}
        initialSessions={parsedSessions}
        defaultTimezone={timezone}
      />
    </>
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
          {/* Location Name */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-location-name"
              className="text-sm font-semibold text-gray-900"
            >
              Location Name *
            </Label>
            <Input
              id="edit-location-name"
              value={location.name}
              onChange={(e) => updateLocation({ name: e.target.value })}
              placeholder="e.g., Main Auditorium, Workshop Room A"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
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
