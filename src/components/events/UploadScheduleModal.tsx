"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Info, Upload as UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Common timezones
const TIMEZONES = [
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "America/Anchorage", label: "America/Anchorage (AKST/AKDT)" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu (HST)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST)" },
  { value: "Europe/Rome", label: "Europe/Rome (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEDT/AEST)" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEDT/AEST)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
];

interface UploadScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, timezone: string) => Promise<void>;
}

export function UploadScheduleModal({
  open,
  onOpenChange,
  onUpload,
}: UploadScheduleModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      } else {
        alert("Please select a valid CSV or Excel file");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(selectedFile, timezone);

      // Reset form on success
      setSelectedFile(null);
      setTimezone("America/Los_Angeles");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a sample CSV template per spec
    const csvContent = `Location,Title,Presenter,Date,Start Time,End Time,Timezone
"Main Auditorium","Opening Keynote","John Doe, Jane Smith","2024-11-15","09:00","10:30","America/Los_Angeles"
"Main Auditorium","Product Showcase","Jane Smith","2024-11-15","11:00","12:00","America/Los_Angeles"
"Workshop Room A","Hands-on Workshop","Bob Johnson, Alice Lee","2024-11-15","13:00","15:00","America/Los_Angeles"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-schedule-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 space-y-8">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Upload Schedule
            </DialogTitle>
          </DialogHeader>

          {/* Description with download link */}
          <div className="space-y-2">
            <DialogDescription className="text-base text-gray-700 leading-relaxed">
              Upload a spreadsheet containing your schedule. <br />
              You can{" "}
              <button
                onClick={handleDownloadTemplate}
                className="text-blue-600 underline hover:text-blue-700 font-medium"
              >
                download this CSV of the expected format
              </button>{" "}
              first.
            </DialogDescription>
          </div>

          {/* File input area (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File upload display */}
          {selectedFile && (
            <div className="p-4 bg-primary-teal-50 border border-primary-teal-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UploadIcon className="h-5 w-5 text-primary-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
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
          )}

          {/* Timezone selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="timezone-select"
                className="text-sm font-bold text-gray-900"
              >
                Default Timezone
              </Label>
              <Info className="h-[13.33px] w-[13.33px] text-gray-500" />
            </div>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger
                id="timezone-select"
                className="w-full min-h-[36px] bg-white border-gray-300 rounded-md"
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
            <p className="text-xs text-gray-500">
              Used when the Timezone column is omitted from your spreadsheet
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {!selectedFile && (
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-[#128197] hover:bg-[#0f6b7a] text-white h-9 px-4"
              >
                Select File
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile}
              className="bg-[#128197] hover:bg-[#0f6b7a] text-white h-9 px-4"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
