"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  EventDetailsFormData,
  FormMode,
  LANGUAGES,
  TIMEZONES,
  getLanguageName,
} from "./types";

// ============================================================================
// Props
// ============================================================================

interface EventDetailsFormProps {
  /** Form data */
  data: EventDetailsFormData;
  /** Callback when any field changes */
  onChange: (data: Partial<EventDetailsFormData>) => void;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Form mode (create or edit) */
  mode?: FormMode;
  /** Whether the form is read-only */
  readOnly?: boolean;
  /** Available glossaries from API */
  availableGlossaries?: Array<{ id: string; name: string }>;
  /** Available accounts from API */
  availableAccounts?: Array<{ id: string; name: string }>;
  /** Custom fields configuration */
  customFieldsConfig?: Array<{ name: string; defaultValue?: string }>;
  /** Whether to show the full form or a compact version */
  compact?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function EventDetailsForm({
  data,
  onChange,
  errors = {},
  mode = "create",
  readOnly = false,
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
  customFieldsConfig = [],
  compact = false,
}: EventDetailsFormProps) {
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  const handleAddLanguage = (languageCode: string) => {
    if (!data.otherLanguages.includes(languageCode)) {
      onChange({ otherLanguages: [...data.otherLanguages, languageCode] });
    }
    setIsAddingLanguage(false);
  };

  const handleRemoveLanguage = (languageCode: string) => {
    onChange({
      otherLanguages: data.otherLanguages.filter(
        (lang) => lang !== languageCode
      ),
    });
  };

  const availableLanguagesToAdd = LANGUAGES.filter(
    (lang) => !data.otherLanguages.includes(lang.code)
  );

  // Helper for field labels with tooltips
  const FieldLabel = ({
    htmlFor,
    label,
    tooltip,
    required,
  }: {
    htmlFor: string;
    label: string;
    tooltip?: string;
    required?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-gray-900">
        {label}
        {required && " *"}
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Event Name */}
      <div className="space-y-2">
        <FieldLabel htmlFor="event-name" label="Event Name" required />
        <Input
          id="event-name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter event name"
          disabled={readOnly}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Description (optional) */}
      {!compact && (
        <div className="space-y-2">
          <FieldLabel htmlFor="description" label="Description" />
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Brief description of the event"
            disabled={readOnly}
            rows={2}
          />
        </div>
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel htmlFor="start-date" label="Start Date" required />
          <Input
            id="start-date"
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            disabled={readOnly}
            className={errors.startDate ? "border-red-500" : ""}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="end-date" label="End Date" required />
          <Input
            id="end-date"
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            disabled={readOnly}
            min={data.startDate}
            className={errors.endDate ? "border-red-500" : ""}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <FieldLabel
          htmlFor="timezone"
          label="Default Timezone"
          tooltip="Default timezone for all sessions in this event"
        />
        <Select
          value={data.timezone}
          onValueChange={(value) => onChange({ timezone: value })}
          disabled={readOnly}
        >
          <SelectTrigger id="timezone">
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
      <div className="space-y-2">
        <FieldLabel
          htmlFor="glossary"
          label="Glossary"
          tooltip="Select a glossary to use for consistent terminology across this event"
        />
        <Select
          value={data.glossaryId}
          onValueChange={(value) => onChange({ glossaryId: value })}
          disabled={readOnly}
        >
          <SelectTrigger id="glossary">
            <SelectValue placeholder="Select a glossary" />
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
        <FieldLabel
          htmlFor="account"
          label="Account"
          tooltip="Select which account will be billed for this event"
        />
        <Select
          value={data.accountId}
          onValueChange={(value) => onChange({ accountId: value })}
          disabled={readOnly}
        >
          <SelectTrigger id="account">
            <SelectValue placeholder="Select an account" />
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

      {/* Access Type */}
      <div className="space-y-2">
        <FieldLabel
          htmlFor="access-type"
          label="Access"
          tooltip="Open allows anyone to join. Passcode requires attendees to enter a passcode."
        />
        <Select
          value={data.accessType}
          onValueChange={(value: "open" | "passcode") =>
            onChange({ accessType: value })
          }
          disabled={readOnly}
        >
          <SelectTrigger id="access-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open (no passcode required)</SelectItem>
            <SelectItem value="passcode">Require attendee passcode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publish Summary Publicly */}
      <div className="space-y-2">
        <FieldLabel
          htmlFor="publish"
          label="Publish summary publicly?"
          tooltip="Make event summaries publicly accessible without login"
        />
        <Select
          value={data.publishTranscripts ? "yes" : "no"}
          onValueChange={(value) =>
            onChange({ publishTranscripts: value === "yes" })
          }
          disabled={readOnly}
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
        <FieldLabel
          htmlFor="starting-language"
          label="Starting presenter language"
          tooltip="The primary language that presenters will speak in"
        />
        <Select
          value={data.startingLanguage}
          onValueChange={(value) => onChange({ startingLanguage: value })}
          disabled={readOnly}
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
        <FieldLabel
          htmlFor="other-languages"
          label="Other presenter languages"
          tooltip="Additional languages that presenters may use during sessions"
        />
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md min-h-[44px]">
          {data.otherLanguages.map((langCode) => (
            <Badge
              key={langCode}
              variant="outline"
              className="bg-primary-teal-600 text-white border-primary-teal-600 hover:bg-primary-teal-700 pl-3 pr-2 py-1 gap-1.5"
            >
              <span>{getLanguageName(langCode)}</span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(langCode)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
        {!readOnly && (
          <>
            {isAddingLanguage ? (
              <div className="space-y-2">
                <Select onValueChange={handleAddLanguage}>
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
                  type="button"
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
                type="button"
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
          </>
        )}
      </div>

      {/* Custom Fields */}
      {customFieldsConfig.map((field) => (
        <div key={field.name} className="space-y-2">
          <FieldLabel htmlFor={`custom-${field.name}`} label={field.name} />
          <Input
            id={`custom-${field.name}`}
            value={data.customFields[field.name] || ""}
            onChange={(e) =>
              onChange({
                customFields: {
                  ...data.customFields,
                  [field.name]: e.target.value,
                },
              })
            }
            placeholder={field.defaultValue || "Enter value"}
            disabled={readOnly}
          />
        </div>
      ))}
    </div>
  );
}
