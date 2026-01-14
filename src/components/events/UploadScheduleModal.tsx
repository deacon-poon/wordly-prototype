"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  Loader2,
  Upload,
  X,
  FileSpreadsheet,
  ChevronDown,
  Sparkles,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  TIMEZONES,
  LANGUAGES,
  ACCOUNTS,
  GLOSSARIES,
  TRANSCRIPT_SETTINGS,
  ACCESS_TYPES,
  VOICE_PACKS,
} from "./forms/types";

/**
 * Session defaults that apply to all uploaded sessions.
 * Pre-populated from workspace session defaults.
 */
export interface SessionDefaults {
  timezone: string;
  accountId: string;
  startingLanguage: string;
  autoSelect: boolean;
  languages: string[];
  glossaryId: string;
  transcriptSetting: "save" | "save-workspace" | "none";
  accessType: "open" | "passcode";
  floorAudio: boolean;
  voicePack: string;
}

// Mock workspace defaults (in production, fetched from user's workspace settings)
const WORKSPACE_SESSION_DEFAULTS: SessionDefaults = {
  timezone: "America/Los_Angeles",
  accountId: "acc-default",
  startingLanguage: "en-US",
  autoSelect: true,
  languages: ["en-US", "es"],
  glossaryId: "none",
  transcriptSetting: "save-workspace",
  accessType: "open",
  floorAudio: false,
  voicePack: "feminine",
};

interface UploadScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, defaults: SessionDefaults) => Promise<void>;
}

export function UploadScheduleModal({
  open,
  onOpenChange,
  onUpload,
}: UploadScheduleModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Session defaults state - pre-populated from workspace settings
  const [defaults, setDefaults] = useState<SessionDefaults>(
    WORKSPACE_SESSION_DEFAULTS
  );

  const updateDefault = <K extends keyof SessionDefaults>(
    key: K,
    value: SessionDefaults[K]
  ) => {
    setDefaults((prev) => ({ ...prev, [key]: value }));
  };

  const handleLanguageToggle = (langCode: string) => {
    if (defaults.languages.includes(langCode)) {
      updateDefault(
        "languages",
        defaults.languages.filter((l) => l !== langCode)
      );
    } else if (defaults.languages.length < 8) {
      updateDefault("languages", [...defaults.languages, langCode]);
    }
  };

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
        toast.error("Please select a valid CSV or Excel file");
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
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(selectedFile, defaults);

      // Reset form on success
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setDefaults(WORKSPACE_SESSION_DEFAULTS);
    setShowDefaults(false);
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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
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
          {/* File Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-900">
                Schedule File
              </Label>
              <button
                onClick={handleDownloadTemplate}
                className="text-xs font-medium text-primary-teal-600 hover:text-primary-teal-700 transition-colors"
              >
                Download template
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Upload a CSV or Excel file containing your event schedule.
            </p>

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
              <div className="flex items-center justify-between p-3 border border-primary-teal-300 rounded-lg bg-primary-teal-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-teal-100 flex items-center justify-center">
                    <FileSpreadsheet className="h-4 w-4 text-primary-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
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
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
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
          </div>

          {/* Session Defaults - Key settings always visible */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-900">
                Session Defaults
              </Label>
              <button
                type="button"
                onClick={() => setShowDefaults(!showDefaults)}
                className="text-xs font-medium text-primary-teal-600 hover:text-primary-teal-700 transition-colors"
              >
                {showDefaults ? "Done editing" : "Customize"}
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              {showDefaults
                ? "Edit these fields to change the default values for this upload only."
                : "These settings are pulled from your workspace defaults and will apply to all uploaded sessions."}
            </p>

            {/* Key defaults - always visible */}
            <div className="grid grid-cols-2 gap-4">
              {/* Account */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Account</Label>
                {showDefaults ? (
                  <Select
                    value={defaults.accountId}
                    onValueChange={(value) => updateDefault("accountId", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {ACCOUNTS.find((a) => a.id === defaults.accountId)?.name || "Default"}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Timezone</Label>
                {showDefaults ? (
                  <Select
                    value={defaults.timezone}
                    onValueChange={(value) => updateDefault("timezone", value)}
                  >
                    <SelectTrigger className="h-9">
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
                ) : (
                  <p className="text-sm text-gray-900">
                    {defaults.timezone.split("/").pop()?.replace("_", " ")}
                  </p>
                )}
            </div>

              {/* Language */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Language</Label>
                {showDefaults ? (
                  <Select
                    value={defaults.startingLanguage}
                    onValueChange={(value) => updateDefault("startingLanguage", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {LANGUAGES.find((l) => l.code === defaults.startingLanguage)?.name}
                  </p>
                )}
              </div>

              {/* Selections count */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Output Languages</Label>
                <p className="text-sm text-gray-900">
                  {defaults.languages.length} language{defaults.languages.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Session Defaults - Additional settings */}
          {showDefaults && (
            <div className="pt-4 border-t border-gray-100">
              {/* ─── Language & Translation ─────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Language & Translation
                </h4>

                <div className="space-y-4">
                  {/* Auto Select */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-autoselect"
                      className="text-sm font-medium text-gray-700"
                    >
                      Auto Select
                    </Label>
                    <Select
                      value={defaults.autoSelect ? "enabled" : "disabled"}
                      onValueChange={(value) =>
                        updateDefault("autoSelect", value === "enabled")
                      }
                    >
                      <SelectTrigger id="default-autoselect">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selections (Output Languages) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Selections
                    </Label>
                    <div className="p-3 border border-gray-200 rounded-lg bg-white min-h-[42px]">
                      <div className="flex flex-wrap gap-2">
                        {defaults.languages.map((langCode) => {
                          const lang = LANGUAGES.find(
                            (l) => l.code === langCode
                          );
                          return (
                            <span
                              key={langCode}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:border-gray-400 transition-colors"
                            >
                              <Sparkles className="h-3 w-3 text-primary-teal-500" />
                              {lang?.name || langCode}
                              <button
                                type="button"
                                onClick={() => handleLanguageToggle(langCode)}
                                className="ml-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                        {defaults.languages.length === 0 && (
                          <span className="text-sm text-gray-400 italic">
                            No languages selected
                          </span>
                        )}
                      </div>
                    </div>
                    {defaults.languages.length < 8 && (
                      <Select
                        value={undefined}
                        onValueChange={(value) => {
                          if (value && !defaults.languages.includes(value)) {
                            handleLanguageToggle(value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add language..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.filter(
                            (l) => !defaults.languages.includes(l.code)
                          ).map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-primary-teal-500" />
                                {lang.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Glossary */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-glossary"
                      className="text-sm font-medium text-gray-700"
                    >
                      Glossary
                    </Label>
                    <Select
                      value={defaults.glossaryId}
                      onValueChange={(value) =>
                        updateDefault("glossaryId", value)
                      }
                    >
                      <SelectTrigger id="default-glossary">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        {GLOSSARIES.map((glossary) => (
                          <SelectItem key={glossary.id} value={glossary.id}>
                            {glossary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ─── Output Settings ────────────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Output Settings
                </h4>

                <div className="space-y-4">
                  {/* Transcript */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-transcript"
                      className="text-sm font-medium text-gray-700"
                    >
                      Transcript
                    </Label>
                    <Select
                      value={defaults.transcriptSetting}
                      onValueChange={(value: "save" | "save-workspace" | "none") =>
                        updateDefault("transcriptSetting", value)
                      }
                    >
                      <SelectTrigger id="default-transcript">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSCRIPT_SETTINGS.map((setting) => (
                          <SelectItem key={setting.value} value={setting.value}>
                            {setting.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Pack */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-voice-pack"
                      className="text-sm font-medium text-gray-700"
                    >
                      Voice Pack
                    </Label>
                    <Select
                      value={defaults.voicePack}
                      onValueChange={(value) =>
                        updateDefault("voicePack", value)
                      }
                    >
                      <SelectTrigger id="default-voice-pack">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICE_PACKS.map((pack) => (
                          <SelectItem key={pack.id} value={pack.id}>
                            {pack.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* ─── Access & Audio ─────────────────────────────────────── */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                  Access & Audio
                </h4>

                <div className="space-y-4">
                  {/* Access */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-access"
                      className="text-sm font-medium text-gray-700"
                    >
                      Access
                    </Label>
                    <Select
                      value={defaults.accessType}
                      onValueChange={(value: "open" | "passcode") =>
                        updateDefault("accessType", value)
                      }
                    >
                      <SelectTrigger id="default-access">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCESS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor Audio */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="default-floor-audio"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Floor audio
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            Enable floor audio to capture ambient sound in the
                            room. Useful for Q&A sessions or audience
                            participation.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Checkbox
                      id="default-floor-audio"
                      checked={defaults.floorAudio}
                      onCheckedChange={(checked) =>
                        updateDefault("floorAudio", checked === true)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info callout - matches ManualEventWizard pattern */}
          <div className="p-4 bg-primary-teal-50 border border-primary-teal-200 rounded-lg">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary-teal-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1">
                  How it works
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• All sessions will inherit the defaults above</li>
                  <li>• Values in your spreadsheet override these defaults</li>
                  <li>• Locations are created automatically from your data</li>
                  <li>• Re-uploading? Locations with matching names keep their QR codes</li>
                </ul>
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
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Review Schedule"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
