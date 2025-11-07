"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import { X, Info, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Language options
const LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "es", name: "Spanish (ES)" },
  { code: "es-LatAm", name: "Spanish (LatAm)" },
  { code: "fr", name: "French (FR)" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "nl", name: "Dutch" },
  { code: "cy", name: "Welsh - Cymraeg" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
];

interface EventSettings {
  eventName: string;
  glossaryId: string;
  accountId: string;
  publishSummaryPublicly: boolean;
  startingPresenterLanguage: string;
  otherPresenterLanguages: string[];
  customFields?: Record<string, string>;
}

interface EventSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: EventSettings) => Promise<void>;
  availableGlossaries?: Array<{ id: string; name: string }>;
  availableAccounts?: Array<{ id: string; name: string }>;
  customFields?: Array<{ name: string; defaultValue?: string }>;
}

export function EventSettingsModal({
  open,
  onOpenChange,
  onSave,
  availableGlossaries = [
    { id: "1", name: "ABC Co Default" },
    { id: "2", name: "Council Meetings" },
    { id: "3", name: "Technical Terms" },
  ],
  availableAccounts = [
    { id: "1", name: "MyAcct (4ac01)" },
    { id: "2", name: "Main Account (8ff07)" },
    { id: "3", name: "Development (3a2b5)" },
  ],
  customFields = [{ name: "Custom Field Name", defaultValue: "default value" }],
}: EventSettingsModalProps) {
  const [eventName, setEventName] = useState("");
  const [glossaryId, setGlossaryId] = useState(
    availableGlossaries[0]?.id || ""
  );
  const [accountId, setAccountId] = useState(availableAccounts[0]?.id || "");
  const [publishSummaryPublicly, setPublishSummaryPublicly] = useState("yes");
  const [startingLanguage, setStartingLanguage] = useState("en-US");
  const [otherLanguages, setOtherLanguages] = useState<string[]>(["en-US"]);
  const [customFieldValues, setCustomFieldValues] = useState<
    Record<string, string>
  >(
    customFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, string>)
  );
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddLanguage = (languageCode: string) => {
    if (!otherLanguages.includes(languageCode)) {
      setOtherLanguages([...otherLanguages, languageCode]);
    }
    setIsAddingLanguage(false);
  };

  const handleRemoveLanguage = (languageCode: string) => {
    setOtherLanguages(otherLanguages.filter((lang) => lang !== languageCode));
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code;
  };

  const availableLanguagesToAdd = LANGUAGES.filter(
    (lang) => !otherLanguages.includes(lang.code)
  );

  const handleSave = async () => {
    if (!eventName.trim()) {
      alert("Please enter an event name");
      return;
    }
    
    try {
      setIsSaving(true);
      await onSave({
        eventName: eventName.trim(),
        glossaryId,
        accountId,
        publishSummaryPublicly: publishSummaryPublicly === "yes",
        startingPresenterLanguage: startingLanguage,
        otherPresenterLanguages: otherLanguages,
        customFields: customFieldValues,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving event settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Standard Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            By default, all links for this event will use these settings, but
            you can change them on a per-room basis afterward if you need to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label
              htmlFor="event-name"
              className="text-sm font-semibold text-gray-900"
            >
              Event Name *
            </Label>
            <Input
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              className="w-full"
            />
          </div>

          {/* Glossary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="glossary"
                className="text-sm font-semibold text-gray-900"
              >
                Glossary
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Select a glossary to use for consistent terminology across
                      this event
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={glossaryId} onValueChange={setGlossaryId}>
              <SelectTrigger id="glossary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableGlossaries.map((glossary) => (
                  <SelectItem key={glossary.id} value={glossary.id}>
                    {glossary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="account"
                className="text-sm font-semibold text-gray-900"
              >
                Account
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Select which account will be billed for this event
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger id="account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Publish Summary Publicly */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="publish"
                className="text-sm font-semibold text-gray-900"
              >
                Publish summary publicly?
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Make event summaries publicly accessible without login
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={publishSummaryPublicly}
              onValueChange={setPublishSummaryPublicly}
            >
              <SelectTrigger id="publish">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Starting Presenter Language */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="starting-language"
                className="text-sm font-semibold text-gray-900"
              >
                Starting presenter language
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      The primary language that presenters will speak in
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={startingLanguage}
              onValueChange={setStartingLanguage}
            >
              <SelectTrigger id="starting-language">
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
          </div>

          {/* Other Presenter Languages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold text-gray-900">
                Other presenter languages
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Additional languages that presenters may use during
                      sessions
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md min-h-[44px]">
              {otherLanguages.map((langCode) => (
                <Badge
                  key={langCode}
                  variant="outline"
                  className="bg-primary-teal-600 text-white border-primary-teal-600 hover:bg-primary-teal-700 pl-3 pr-2 py-1 gap-1.5"
                >
                  <span>{getLanguageName(langCode)}</span>
                  <button
                    onClick={() => handleRemoveLanguage(langCode)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {isAddingLanguage ? (
              <div className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    handleAddLanguage(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguagesToAdd.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingLanguage(false)}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingLanguage(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -ml-2"
                disabled={availableLanguagesToAdd.length === 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add another language
              </Button>
            )}
          </div>

          {/* Custom Fields */}
          {customFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`custom-${field.name}`}
                  className="text-sm font-semibold text-gray-900"
                >
                  {field.name}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Custom field for this event
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id={`custom-${field.name}`}
                value={customFieldValues[field.name] || ""}
                onChange={(e) =>
                  setCustomFieldValues({
                    ...customFieldValues,
                    [field.name]: e.target.value,
                  })
                }
                placeholder={field.defaultValue || "Enter value"}
              />
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            {isSaving ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
