"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Mic,
  Video,
  Smartphone,
  Monitor,
  Settings,
  QrCode,
  Copy,
  Key,
  Download,
  Printer,
  Globe,
  MessageSquare,
  Radio,
  Users2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SessionJoinModalCompactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId?: string;
  onJoinAsPresenter: (method: string) => void;
  onJoinAsAttendee: (method: string) => void;
}

interface BotInviteFormProps {
  onSubmit: (data: { language: string; meetingLink: string }) => void;
  onCancel: () => void;
}

function BotInviteForm({ onSubmit, onCancel }: BotInviteFormProps) {
  const [language, setLanguage] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!language) {
      setError("Please select a language");
      return;
    }

    if (!meetingLink.trim()) {
      setError("Please enter a meeting link");
      return;
    }

    if (!isValidUrl(meetingLink.trim())) {
      setError(
        "Please enter a valid URL (e.g., https://teams.microsoft.com/...)"
      );
      return;
    }

    onSubmit({ language, meetingLink: meetingLink.trim() });
  };

  const languages = [
    { value: "en-US", label: "English (US)" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
  ];

  return (
    <Card className="border-primary-teal-200 bg-primary-teal-50/50 mt-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="language" className="text-sm">
                Language
              </Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="meetingLink" className="text-sm">
                Meeting Link
              </Label>
              <Input
                id="meetingLink"
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://teams.microsoft.com/..."
                className="h-9"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={!language || !meetingLink.trim()}
              className="bg-primary-teal-600 hover:bg-primary-teal-700"
              size="sm"
            >
              Invite Bot
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function SessionJoinModalCompact({
  open,
  onOpenChange,
  sessionId,
  onJoinAsPresenter,
  onJoinAsAttendee,
}: SessionJoinModalCompactProps) {
  const [showBotInvite, setShowBotInvite] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCopySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      alert("Session ID copied to clipboard!");
    }
  };

  const handleCopyLink = () => {
    if (sessionId) {
      navigator.clipboard.writeText(
        `https://attend.wordly.ai/join/${sessionId}`
      );
      alert("Session link copied to clipboard!");
    }
  };

  const handleCopyPasscode = () => {
    if (sessionId) {
      navigator.clipboard.writeText("327269");
      alert("Passcode copied to clipboard!");
    }
  };

  const handleBotInviteSubmit = (data: {
    language: string;
    meetingLink: string;
  }) => {
    console.log("Bot invite data:", data);
    onJoinAsPresenter("invite-bot");
    setShowBotInvite(false);
  };

  const handleBotInviteCancel = () => {
    setShowBotInvite(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            🎯 Start Session {sessionId && sessionId}
            {sessionId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySessionId}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to participate in this Wordly session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Primary Actions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              I want to...
            </h3>

            {/* As Presenter Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-teal-500 rounded-full"></div>
                <h4 className="text-md font-semibold text-primary-teal-700">
                  As Presenter
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Present Audio */}
                <Card className="border-primary-teal-200 bg-primary-teal-50/30 hover:bg-primary-teal-50/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src="/asset/illustration/speak-in-person.png"
                          alt="Present Audio"
                          width={72}
                          height={72}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-primary-teal-900 flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          Present Audio
                        </h5>
                        <p className="text-sm text-primary-teal-700">
                          Speak at event or meeting
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => onJoinAsPresenter("in-person")}
                        className="w-full bg-primary-teal-600 hover:bg-primary-teal-700"
                        size="sm"
                      >
                        Present Now
                      </Button>
                      <Button
                        onClick={() => onJoinAsPresenter("quick-link")}
                        variant="outline"
                        className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        size="sm"
                      >
                        Copy Quick Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Invite to Meeting */}
                <Card className="border-primary-teal-200 bg-primary-teal-50/30 hover:bg-primary-teal-50/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src="/asset/illustration/video-meeting.png"
                          alt="Invite to Meeting"
                          width={72}
                          height={72}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-primary-teal-900 flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Invite to Meeting
                        </h5>
                        <p className="text-sm text-primary-teal-700">
                          Add bot to video call
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => setShowBotInvite(!showBotInvite)}
                        variant="outline"
                        className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        size="sm"
                      >
                        {showBotInvite ? "Cancel" : "Invite Bot"}
                      </Button>
                      <Button
                        onClick={() => onJoinAsPresenter("meeting-setup")}
                        variant="outline"
                        className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        size="sm"
                      >
                        Advanced Setup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* As Attendee Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-green-500 rounded-full"></div>
                <h4 className="text-md font-semibold text-accent-green-700">
                  As Attendee
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Listen/Translate */}
                <Card className="border-accent-green-200 bg-accent-green-50/30 hover:bg-accent-green-50/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src="/asset/illustration/user-join-device-with-qr-code.png"
                          alt="Listen/Translate"
                          width={72}
                          height={72}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-accent-green-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Listen/Translate
                        </h5>
                        <p className="text-sm text-accent-green-700">
                          Join on your device
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => onJoinAsAttendee("device")}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        size="sm"
                      >
                        Join Session
                      </Button>
                      <Button
                        onClick={() => onJoinAsAttendee("qr-options")}
                        variant="outline"
                        className="w-full border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                        size="sm"
                      >
                        QR Code Options
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Public Display */}
                <Card className="border-accent-green-200 bg-accent-green-50/30 hover:bg-accent-green-50/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src="/asset/illustration/big-screen-display.png"
                          alt="Public Display"
                          width={72}
                          height={72}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-accent-green-900 flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Public Display
                        </h5>
                        <p className="text-sm text-accent-green-700">
                          Show on big screen
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => onJoinAsAttendee("big-screen")}
                        variant="outline"
                        className="w-full border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                        size="sm"
                      >
                        Open Public Display
                      </Button>
                      <Button
                        onClick={() => onJoinAsAttendee("public-monitor")}
                        variant="outline"
                        className="w-full border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                        size="sm"
                      >
                        Monitor Setup
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Bot Invite Form */}
          {showBotInvite && (
            <BotInviteForm
              onSubmit={handleBotInviteSubmit}
              onCancel={handleBotInviteCancel}
            />
          )}

          {/* Session Info */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Session Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent-green-600" />
                    <span className="text-sm font-mono text-gray-700">
                      attend.wordly.ai/{sessionId}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyLink}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary-teal-600" />
                    <span className="text-sm font-mono text-gray-700">
                      Passcode: 327269
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPasscode}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  More Options
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    showAdvanced && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* QR Code Options */}
                <Card className="border-accent-green-200">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-accent-green-900 mb-2 flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </h5>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsAttendee("download-qr")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsAttendee("print-qr")}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Options */}
                <Card className="border-primary-teal-200">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-primary-teal-900 mb-2 flex items-center gap-2">
                      <Radio className="w-4 h-4" />
                      Technical
                    </h5>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsPresenter("rtmps")}
                      >
                        <Radio className="w-4 h-4 mr-2" />
                        RTMPS Stream
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsPresenter("multi-mic")}
                      >
                        <Users2 className="w-4 h-4 mr-2" />
                        Multi-Mic Setup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Video Options */}
                <Card className="border-accent-green-200">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-accent-green-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Video & Embed
                    </h5>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsAttendee("iframe")}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        iFrame Captions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onJoinAsAttendee("subtitles")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Subtitles
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Zoom Integration */}
                <Card className="border-blue-200 bg-blue-50/30 md:col-span-2">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Zoom Integration (speakers and attendees)
                    </h5>
                    <p className="text-xs text-blue-700 mb-3">
                      Wordly has a direct integration with Zoom. You can launch
                      a new Wordly session from inside Zoom without needing to
                      configure anything inside this web portal first. Input
                      audio and output text are both inside Zoom.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-blue-300 text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn how to launch Wordly from inside Zoom
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
}
