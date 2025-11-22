"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface PresentationEditDrawerProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSession: Session) => void;
  inline?: boolean;
  stageName?: string;
  stageSessionId?: string;
  stagePasscode?: string;
}

// Language options (ALS supports up to 8)
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
];

export function PresentationEditDrawer({
  session,
  isOpen,
  onClose,
  onSave,
  inline = false,
  stageName,
  stageSessionId,
  stagePasscode,
}: PresentationEditDrawerProps) {
  const [formData, setFormData] = useState({
    title: session.title,
    presenters: session.presenters.join(", "),
    scheduledDate: session.scheduledDate,
    scheduledStart: session.scheduledStart,
    endTime: session.endTime,
    selectedLanguages: ["en", "es", "fr"], // Default languages
  });

  const [isSaving, setIsSaving] = useState(false);

  // Check if session has started (read-only if yes)
  const hasStarted = () => {
    const now = new Date();
    const sessionDateTime = new Date(`${session.scheduledDate}T${session.scheduledStart}`);
    return now >= sessionDateTime;
  };

  const isReadOnly = hasStarted();

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        presenters: session.presenters.join(", "),
        scheduledDate: session.scheduledDate,
        scheduledStart: session.scheduledStart,
        endTime: session.endTime,
        selectedLanguages: ["en", "es", "fr"],
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      return;
    }

    setIsSaving(true);

    // Convert presenters string back to array
    const presentersArray = formData.presenters
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const updatedSession: Session = {
      ...session,
      title: formData.title,
      presenters: presentersArray,
      scheduledDate: formData.scheduledDate,
      scheduledStart: formData.scheduledStart,
      endTime: formData.endTime,
    };

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave(updatedSession);
    setIsSaving(false);
  };

  const handleLanguageToggle = (code: string) => {
    if (isReadOnly) return;

    setFormData((prev) => {
      const selected = prev.selectedLanguages.includes(code)
        ? prev.selectedLanguages.filter((l) => l !== code)
        : [...prev.selectedLanguages, code];
      
      // Limit to 8 languages (ALS limit)
      return {
        ...prev,
        selectedLanguages: selected.slice(0, 8),
      };
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {isReadOnly && (
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
          <strong>Read-only:</strong> This presentation has already started and cannot be edited.
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          disabled={isReadOnly}
          required
        />
      </div>

      {/* Stage (Read-only in event context) */}
      {stageName && (
        <div className="space-y-2">
          <Label>Stage</Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            {stageName}
          </div>
        </div>
      )}

      {/* Presenters */}
      <div className="space-y-2">
        <Label htmlFor="presenters">Presenters *</Label>
        <Input
          id="presenters"
          value={formData.presenters}
          onChange={(e) =>
            setFormData({ ...formData, presenters: e.target.value })
          }
          placeholder="Enter names separated by commas"
          disabled={isReadOnly}
          required
        />
        <p className="text-xs text-gray-500">
          Separate multiple presenters with commas
        </p>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) =>
            setFormData({ ...formData, scheduledDate: e.target.value })
          }
          disabled={isReadOnly}
          required
        />
      </div>

      {/* Start Time & End Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.scheduledStart}
            onChange={(e) =>
              setFormData({ ...formData, scheduledStart: e.target.value })
            }
            disabled={isReadOnly}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            disabled={isReadOnly}
            required
          />
        </div>
      </div>

      {/* Session ID (Read-only, room-level) */}
      {stageSessionId && (
        <div className="space-y-2">
          <Label>Session ID (Room-level)</Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-900">
            {stageSessionId}
          </div>
          <p className="text-xs text-gray-500">
            Shared across all presentations in this stage
          </p>
        </div>
      )}

      {/* Passcode (Read-only in this context) */}
      {stagePasscode && (
        <div className="space-y-2">
          <Label>Passcode (Room-level)</Label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm text-gray-900">
            {stagePasscode}
          </div>
          <p className="text-xs text-gray-500">
            Shared across all presentations in this stage
          </p>
        </div>
      )}

      {/* Languages */}
      <div className="space-y-3">
        <Label>Languages (up to 8)</Label>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang.code}`}
                checked={formData.selectedLanguages.includes(lang.code)}
                onCheckedChange={() => handleLanguageToggle(lang.code)}
                disabled={isReadOnly || (formData.selectedLanguages.length >= 8 && !formData.selectedLanguages.includes(lang.code))}
              />
              <label
                htmlFor={`lang-${lang.code}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {lang.name}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Selected: {formData.selectedLanguages.length}/8 (ALS automatically detects languages)
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving || isReadOnly}
          className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );

  if (inline) {
    return <div className="h-full overflow-y-auto">{formContent}</div>;
  }

  return null; // Sheet wrapper would go here if needed
}

