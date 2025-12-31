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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Upload, X, FileSpreadsheet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TIMEZONES } from "./forms/types";

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

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(selectedFile, timezone);

      // Reset form on success
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTimezone("America/Los_Angeles");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-teal-100 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-primary-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Upload Schedule
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Import locations and sessions from a spreadsheet
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Upload Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Upload instructions */}
            <div className="text-sm text-gray-700">
              Upload a spreadsheet containing your event schedule.{" "}
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
                <SelectTrigger id="timezone-select" className="w-full bg-white">
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
                    <li>Locations will be created automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            {isUploading ? "Processing..." : "Review Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
