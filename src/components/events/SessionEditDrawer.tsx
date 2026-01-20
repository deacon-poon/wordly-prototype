"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { X, Check, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Session {
  id: string;
  title: string;
  presenters: string[];
  scheduledDate: string;
  scheduledStart: string;
  endTime: string;
  status: "pending" | "active" | "completed" | "skipped";
}

interface SessionEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  eventName: string;
  locationName: string;
  onSave: (updatedSession: Session) => void;
  inline?: boolean; // If true, renders content without Sheet wrapper
}

// Language options
const LANGUAGES = [
  { code: "ar", name: "Arabic" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "en-US", name: "English (US)" },
  { code: "fr-FR", name: "French (FR)" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "es-ES", name: "Spanish (ES)" },
];

export function SessionEditDrawer({
  open,
  onOpenChange,
  session,
  eventName,
  locationName,
  onSave,
  inline = false,
}: SessionEditDrawerProps) {
  const [formData, setFormData] = useState<any>({
    title: "",
    presenters: [],
    sessionId: "",
    passcode: "",
    scheduledDate: "",
    scheduledStart: "",
    duration: "",
    account: "",
    language: "en-US",
    autoSelect: "enabled",
    selections: ["ar", "zh-CN", "en-US", "fr-FR", "de", "ja", "ko", "es-ES"],
    glossary: "none",
    transcript: "private",
    access: "open",
    floorAudio: false,
    pinned: true,
  });

  useEffect(() => {
    if (session) {
      // Calculate duration from start and end time
      const calculateDuration = (start: string, end: string) => {
        const [startHour, startMin] = start.split(":").map(Number);
        const [endHour, endMin] = end.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const diffMinutes = endMinutes - startMinutes;
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        return `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}`;
      };

      setFormData({
        ...formData,
        title: session.title,
        presenters: session.presenters,
        sessionId: `SSOD-${session.id.split("-")[1]}`,
        passcode: Math.floor(100000 + Math.random() * 900000).toString(),
        scheduledDate: session.scheduledDate,
        scheduledStart: session.scheduledStart,
        duration: calculateDuration(session.scheduledStart, session.endTime),
      });
    }
  }, [session]);

  const handleRemoveLanguage = (langCode: string) => {
    setFormData({
      ...formData,
      selections: formData.selections.filter(
        (code: string) => code !== langCode
      ),
    });
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code;
  };

  const handleSave = () => {
    if (session) {
      // Calculate new end time based on duration
      const [startHour, startMin] = formData.scheduledStart
        .split(":")
        .map(Number);
      const [durHour, durMin] = formData.duration.split(":").map(Number);
      const endHour = (startHour + durHour) % 24;
      const endMin = startMin + durMin;
      const adjustedEndHour = endHour + Math.floor(endMin / 60);
      const adjustedEndMin = endMin % 60;
      const endTime = `${adjustedEndHour
        .toString()
        .padStart(2, "0")}:${adjustedEndMin.toString().padStart(2, "0")}`;

      const updatedSession: Session = {
        ...session,
        title: formData.title,
        presenters: formData.presenters,
        scheduledDate: formData.scheduledDate,
        scheduledStart: formData.scheduledStart,
        endTime,
      };

      onSave(updatedSession);
      onOpenChange(false);
    }
  };

  if (!session) return null;

  const formContent = (
    <>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title:*
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full"
          />
        </div>

        {/* Presenter */}
        <div className="space-y-2">
          <Label htmlFor="presenter" className="text-sm font-medium">
            Presenter:
          </Label>
          <Input
            id="presenter"
            value={formData.presenters.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                presenters: e.target.value.split(",").map((p) => p.trim()),
              })
            }
            className="w-full"
          />
        </div>

        {/* Session ID */}
        <div className="space-y-2">
          <Label htmlFor="sessionId" className="text-sm font-medium">
            Session ID:
          </Label>
          <Input
            id="sessionId"
            value={formData.sessionId}
            disabled
            className="w-full bg-gray-50"
          />
        </div>

        {/* Passcode */}
        <div className="space-y-2">
          <Label htmlFor="passcode" className="text-sm font-medium">
            Passcode:
          </Label>
          <div className="flex gap-2">
            <Input
              id="passcode"
              value={formData.passcode}
              onChange={(e) =>
                setFormData({ ...formData, passcode: e.target.value })
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-teal-600 hover:text-primary-blue-700"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start date:
          </Label>
          <div className="flex gap-2">
            <Input
              id="startDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Start time:
          </Label>
          <div className="flex gap-2">
            <Input
              id="startTime"
              type="time"
              value={formData.scheduledStart}
              onChange={(e) =>
                setFormData({ ...formData, scheduledStart: e.target.value })
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-teal-600 hover:text-primary-blue-700"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Account */}
        <div className="space-y-2">
          <Label htmlFor="account" className="text-sm font-medium">
            Account:
          </Label>
          <Select
            value={formData.account}
            onValueChange={(value) =>
              setFormData({ ...formData, account: value })
            }
          >
            <SelectTrigger id="account">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deacon-poon-2a49e">
                Deacon Poon (2a49e)
              </SelectItem>
              <SelectItem value="main-account">Main Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Duration:
          </Label>
          <div className="flex gap-2">
            <Input
              id="duration"
              type="time"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-teal-600 hover:text-primary-blue-700"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">
            Language:
          </Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger id="language">
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

        {/* Auto Select */}
        <div className="space-y-2">
          <Label htmlFor="autoSelect" className="text-sm font-medium">
            Auto Select:
          </Label>
          <Select
            value={formData.autoSelect}
            onValueChange={(value) =>
              setFormData({ ...formData, autoSelect: value })
            }
          >
            <SelectTrigger id="autoSelect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selections */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selections:</Label>
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md min-h-[60px]">
            {formData.selections.map((langCode: string) => (
              <Badge
                key={langCode}
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 pl-3 pr-2 py-1 gap-1.5"
              >
                <span>{getLanguageName(langCode)}</span>
                <button
                  onClick={() => handleRemoveLanguage(langCode)}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="space-y-2">
          <Label htmlFor="glossary" className="text-sm font-medium">
            Glossary:
          </Label>
          <Select
            value={formData.glossary}
            onValueChange={(value) =>
              setFormData({ ...formData, glossary: value })
            }
          >
            <SelectTrigger id="glossary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="tech-terms">Technical Terms</SelectItem>
              <SelectItem value="medical">Medical Glossary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transcript */}
        <div className="space-y-2">
          <Label htmlFor="transcript" className="text-sm font-medium">
            Transcript:
          </Label>
          <Select
            value={formData.transcript}
            onValueChange={(value) =>
              setFormData({ ...formData, transcript: value })
            }
          >
            <SelectTrigger id="transcript">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private Transcript Only</SelectItem>
              <SelectItem value="public">Public Transcript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Access */}
        <div className="space-y-2">
          <Label htmlFor="access" className="text-sm font-medium">
            Access:
          </Label>
          <Select
            value={formData.access}
            onValueChange={(value) =>
              setFormData({ ...formData, access: value })
            }
          >
            <SelectTrigger id="access">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Floor Audio */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="floorAudio" className="text-sm font-medium">
              Floor audio:
            </Label>
            <span className="text-xs text-gray-500">(i)</span>
          </div>
          <Switch
            id="floorAudio"
            checked={formData.floorAudio}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, floorAudio: checked })
            }
          />
        </div>

        {/* Pinned */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="pinned" className="text-sm font-medium">
            Pinned:
          </Label>
          <Switch
            id="pinned"
            checked={formData.pinned}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, pinned: checked })
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[500px] sm:max-w-[500px] overflow-y-auto p-0"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
            <SheetTitle className="text-lg font-semibold">
              Presentation
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              {eventName} • {locationName}
            </SheetDescription>
          </SheetHeader>

          {formContent}
        </div>
      </SheetContent>
    </Sheet>
  );
}
