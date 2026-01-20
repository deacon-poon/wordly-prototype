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
import { Input } from "@/components/ui/input";
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
  ChevronRight,
  Sparkles,
  Settings2,
  AlertTriangle,
  Download,
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
  /** Whether the event already has sessions (affects warning messaging) */
  hasExistingSessions?: boolean;
}

export function UploadScheduleModal({
  open,
  onOpenChange,
  onUpload,
  hasExistingSessions = false,
}: UploadScheduleModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvancedDefaults, setShowAdvancedDefaults] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
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
    // Generate CSV template with headers and example row
    const headers = ["Room", "Title", "Presenter", "Date", "Start Time", "End Time", "Timezone", "Glossary", "Account", "Voice Pack", "Language", "Label"];
    const exampleRow = ["Main Stage", "Example Session Title", "John Doe", "12/04/2025", "1:00 PM", "1:50 PM", "America/Los_Angeles", "", "", "", "English (US)", ""];

    const csvContent = [
      headers.join(","),
      exampleRow.join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-schedule-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    setShowAdvancedDefaults(false);
    setConfirmOverwrite(false);
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
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-blue-50 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-primary-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Upload Schedule
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Import rooms and sessions from a spreadsheet
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {/* ─────────────────────────────────────────────────────────────────
              SECTION 1: Schedule File Upload
          ───────────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-900">
                Schedule File
              </Label>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-blue-600 hover:text-primary-blue-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
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
              <div className="flex items-center justify-between p-3 border border-primary-blue-200 rounded-lg bg-primary-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-blue-100 flex items-center justify-center">
                    <FileSpreadsheet className="h-4 w-4 text-primary-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
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
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-blue-400 hover:text-primary-blue-600 hover:bg-primary-blue-50/30 transition-all"
              >
                <Upload className="h-4 w-4" />
                Select CSV or Excel file
              </button>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              SECTION 2: Session Defaults (Matches SessionForm structure)
          ───────────────────────────────────────────────────────────────── */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden">
            {/* Section Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Session Defaults
                  </h3>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  From workspace settings
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                These settings apply to all uploaded sessions unless overridden in your spreadsheet.
              </p>
            </div>

            {/* Primary Defaults - Always visible (matches SessionForm) */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Timezone */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-900">
                    Timezone
                  </Label>
                  <Select
                    value={defaults.timezone}
                    onValueChange={(value) => updateDefault("timezone", value)}
                  >
                    <SelectTrigger className="bg-white">
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

                {/* Glossary */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-900">
                    Glossary
                  </Label>
                  <Select
                    value={defaults.glossaryId}
                    onValueChange={(value) => updateDefault("glossaryId", value)}
                  >
                    <SelectTrigger className="bg-white">
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

              {/* Advanced Settings Accordion - matches SessionForm structure */}
              <div
                className={cn(
                  "rounded-lg border overflow-hidden transition-all duration-200",
                  showAdvancedDefaults ? "border-gray-300 bg-white" : "border-gray-200"
                )}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedDefaults(!showAdvancedDefaults)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 transition-colors",
                    showAdvancedDefaults
                      ? "bg-gray-50 border-b border-gray-200"
                      : "bg-white hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-md transition-colors",
                      showAdvancedDefaults ? "bg-primary-teal-100" : "bg-gray-100"
                    )}>
                      <Settings2 className={cn(
                        "h-4 w-4 transition-colors",
                        showAdvancedDefaults ? "text-primary-teal-600" : "text-gray-500"
                      )} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-900">
                        Advanced Settings
                      </span>
                      <p className="text-xs text-gray-500">
                        Language, output, access & audio options
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 text-gray-400 transition-transform duration-200",
                      showAdvancedDefaults && "rotate-90"
                    )}
                  />
                </button>

                {/* Accordion Content */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    showAdvancedDefaults ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-4 space-y-6 bg-white">
                  {/* Info banner */}
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      These settings inherit from your Session Defaults. Override only if needed.
                    </p>
                  </div>

                  {/* Account */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Account
                    </Label>
                    <Select
                      value={defaults.accountId}
                      onValueChange={(value) => updateDefault("accountId", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNTS.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ─── Language & Translation ─────────────────────────────── */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                      Language & Translation
                    </h4>

                    <div className="space-y-4">
                      {/* Starting Language */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Language
                        </Label>
                        <Select
                          value={defaults.startingLanguage}
                          onValueChange={(value) => updateDefault("startingLanguage", value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <span className="flex items-center gap-2">
                                  <Sparkles className="h-3 w-3 text-primary-teal-500" />
                                  {lang.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Auto Select */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Auto Select
                        </Label>
                        <Select
                          value={defaults.autoSelect ? "enabled" : "disabled"}
                          onValueChange={(value) =>
                            updateDefault("autoSelect", value === "enabled")
                          }
                        >
                          <SelectTrigger className="bg-white">
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
                              const lang = LANGUAGES.find((l) => l.code === langCode);
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
                        {/* Add language dropdown */}
                        {defaults.languages.length < 8 && (
                          <Select
                            value={undefined}
                            onValueChange={(value) => {
                              if (value && !defaults.languages.includes(value)) {
                                handleLanguageToggle(value);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-white">
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
                    </div>
                  </div>

                  {/* ─── Output Settings ────────────────────────────────────── */}
                  <div>
                    <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                      Output Settings
                    </h4>

                    <div className="space-y-4">
                      {/* Transcript */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Transcript
                        </Label>
                        <Select
                          value={defaults.transcriptSetting}
                          onValueChange={(value: "save" | "save-workspace" | "none") =>
                            updateDefault("transcriptSetting", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
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
                        <Label className="text-sm font-medium text-gray-700">
                          Voice Pack
                        </Label>
                        <Select
                          value={defaults.voicePack}
                          onValueChange={(value) =>
                            updateDefault("voicePack", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
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
                  <div>
                    <h4 className="text-xs font-semibold text-primary-teal-600 uppercase tracking-wide mb-4">
                      Access & Audio
                    </h4>

                    <div className="space-y-4">
                      {/* Access */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Access
                        </Label>
                        <Select
                          value={defaults.accessType}
                          onValueChange={(value: "open" | "passcode") =>
                            updateDefault("accessType", value)
                          }
                        >
                          <SelectTrigger className="bg-white">
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
                                room. Useful for Q&A sessions or audience participation.
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
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              SECTION 3: How it works (info callout)
          ───────────────────────────────────────────────────────────────── */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">How it works</p>
              <ul className="space-y-0.5 text-gray-500">
                <li>• Sessions inherit the defaults above unless overridden</li>
                <li>• Rooms are created automatically from your file</li>
                <li>• You can review and edit before saving</li>
              </ul>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              SECTION 4: Warning (only when replacing existing sessions)
          ───────────────────────────────────────────────────────────────── */}
          {hasExistingSessions && (
            <>
              <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-amber-800">
                    This will replace existing sessions
                  </p>
                  <p className="text-amber-700 mt-0.5">
                    All current sessions will be overwritten. Rooms with the same name keep their QR codes.
                  </p>
                </div>
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Checkbox
                  id="confirm-overwrite"
                  checked={confirmOverwrite}
                  onCheckedChange={(checked) => setConfirmOverwrite(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="confirm-overwrite"
                  className="text-xs text-gray-600 cursor-pointer leading-relaxed"
                >
                  I understand that uploading this schedule will{" "}
                  <strong className="text-gray-700">replace all existing sessions</strong> for this event.
                </label>
              </div>
            </>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            Footer Actions
        ───────────────────────────────────────────────────────────────── */}
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
            disabled={isUploading || !selectedFile || (hasExistingSessions && !confirmOverwrite)}
            className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
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
