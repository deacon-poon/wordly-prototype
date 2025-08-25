"use client";

import React, { useState } from "react";
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

interface SessionJoinModalProgressiveProps {
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

interface ProgressiveMethodCardProps {
  title: string;
  description: string;
  illustration: string;
  icon: React.ReactNode;
  variant: "presenter" | "attendee";
  children: React.ReactNode;
}

function ProgressiveMethodCard({
  title,
  description,
  illustration,
  icon,
  variant,
  children,
}: ProgressiveMethodCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 h-fit",
        variant === "presenter"
          ? "border-primary-teal-200 bg-primary-teal-50/30 hover:bg-primary-teal-50/50 hover:border-primary-teal-300"
          : "border-accent-green-200 bg-accent-green-50/30 hover:bg-accent-green-50/50 hover:border-accent-green-300",
        isExpanded && "ring-2 ring-offset-1",
        variant === "presenter" && isExpanded && "ring-primary-teal-200",
        variant === "attendee" && isExpanded && "ring-accent-green-200"
      )}
    >
      <CardContent className="p-4">
        {/* Always-visible header section */}
        <div className="flex items-center gap-3 min-h-[84px]">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={illustration}
              alt={title}
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h5
              className={cn(
                "font-semibold flex items-center gap-2 mb-1",
                variant === "presenter"
                  ? "text-primary-teal-900"
                  : "text-accent-green-900"
              )}
            >
              {icon}
              {title}
            </h5>
            <p
              className={cn(
                "text-sm",
                variant === "presenter"
                  ? "text-primary-teal-700"
                  : "text-accent-green-700"
              )}
            >
              {description}
            </p>
          </div>
          <div className="flex items-center justify-center">
            {/* Clean toggle button with just chevron */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "p-2 rounded-full transition-all duration-200 touch-manipulation",
                "hover:bg-white/60 active:bg-white/80",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                variant === "presenter"
                  ? "text-primary-teal-600 hover:text-primary-teal-700 focus:ring-primary-teal-200"
                  : "text-accent-green-600 hover:text-accent-green-700 focus:ring-accent-green-200"
              )}
              aria-label={isExpanded ? "Hide options" : "Show options"}
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {/* Expandable options section */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="space-y-2">
            <div className="pt-3 mt-3 border-t border-gray-200">{children}</div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
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
    <Card className="border-primary-teal-200 bg-primary-teal-50/50 mt-6">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary-teal-700 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Invite Wordly to Your Meeting
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Enter a Microsoft Teams, Google Meet, or Zoom link to have Wordly
            join your meeting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
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

            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting link</Label>
              <Input
                id="meetingLink"
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Please note that it may take up to 30 seconds for Wordly to join
            your meeting.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!language || !meetingLink.trim()}
              className="bg-primary-teal-600 hover:bg-primary-teal-700"
            >
              Invite Wordly Bot
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function SessionJoinModalProgressive({
  open,
  onOpenChange,
  sessionId,
  onJoinAsPresenter,
  onJoinAsAttendee,
}: SessionJoinModalProgressiveProps) {
  const [showBotInvite, setShowBotInvite] = useState(false);

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
          {/* Session Info */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Session Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent-green-600" />
                    <span className="text-sm font-mono text-gray-700">
                      attend.wordly.ai/{sessionId || "ZGSG-0712"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Present Audio */}
                <ProgressiveMethodCard
                  title="Present Audio"
                  description="Speak at event or meeting"
                  illustration="/asset/illustration/speak-in-person.png"
                  icon={<Mic className="w-4 h-4" />}
                  variant="presenter"
                >
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
                </ProgressiveMethodCard>

                {/* Invite to Meeting */}
                <ProgressiveMethodCard
                  title="Invite to Meeting"
                  description="Add bot to video call"
                  illustration="/asset/illustration/video-meeting.png"
                  icon={<Video className="w-4 h-4" />}
                  variant="presenter"
                >
                  <div className="space-y-3">
                    {!showBotInvite && (
                      <Button
                        onClick={() => setShowBotInvite(true)}
                        variant="outline"
                        className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        size="sm"
                      >
                        Invite Bot
                      </Button>
                    )}

                    {/* Bot Invite Form */}
                    {showBotInvite && (
                      <div className="pt-3 border-t border-primary-teal-300">
                        <div className="bg-white p-4 rounded-lg border-2 border-primary-teal-300 shadow-sm">
                          <div className="mb-3">
                            <h5 className="font-semibold text-primary-teal-800 text-sm mb-1 flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Invite Wordly to Your Meeting
                            </h5>
                            <p className="text-xs text-primary-teal-600">
                              Enter meeting link and select language
                            </p>
                          </div>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleBotInviteSubmit({
                                language: "en-US",
                                meetingLink: "https://example.com",
                              });
                            }}
                            className="space-y-3"
                          >
                            <div className="space-y-2">
                              <Input
                                id="meetingLink"
                                type="text"
                                placeholder="https://teams.microsoft.com/..."
                                required
                                className="text-sm"
                              />
                              <Select required>
                                <SelectTrigger className="h-8 text-sm">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en-US">
                                    English (US)
                                  </SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                  <SelectItem value="it">Italian</SelectItem>
                                  <SelectItem value="pt">Portuguese</SelectItem>
                                  <SelectItem value="zh">Chinese</SelectItem>
                                  <SelectItem value="ja">Japanese</SelectItem>
                                  <SelectItem value="ko">Korean</SelectItem>
                                  <SelectItem value="ar">Arabic</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Button
                                type="submit"
                                className="bg-primary-teal-600 hover:bg-primary-teal-700 w-full"
                                size="sm"
                              >
                                Invite Bot
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowBotInvite(false)}
                                className="w-full"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => onJoinAsPresenter("meeting-setup")}
                      variant="outline"
                      className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                      size="sm"
                    >
                      Advanced Setup
                    </Button>

                    {/* Advanced Presenter Options */}
                    <div className="pt-3 border-t border-primary-teal-200">
                      <h5 className="font-medium text-primary-teal-900 mb-2">
                        Send Audio to RTMPS
                      </h5>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        onClick={() => onJoinAsPresenter("rtmps")}
                      >
                        <Radio className="w-4 h-4 mr-2" />
                        Send Audio to RTMPS
                      </Button>

                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-primary-teal-700">
                            Have multiple microphones in one room?
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-primary-teal-700">
                            Have people speaking 2+ languages in 1 microphone?
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProgressiveMethodCard>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Listen/Translate */}
                <ProgressiveMethodCard
                  title="Listen/Translate"
                  description="Join on your device"
                  illustration="/asset/illustration/user-join-device-with-qr-code.png"
                  icon={<Smartphone className="w-4 h-4" />}
                  variant="attendee"
                >
                  <div className="space-y-3">
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

                    {/* QR Code Options */}
                    <div className="pt-3 border-t border-accent-green-200">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                          onClick={() => onJoinAsAttendee("download-qr")}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download QR
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                          onClick={() => onJoinAsAttendee("print-qr")}
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Print QR
                        </Button>
                      </div>
                    </div>
                  </div>
                </ProgressiveMethodCard>

                {/* Public Display */}
                <ProgressiveMethodCard
                  title="Public Display"
                  description="Show on big screen"
                  illustration="/asset/illustration/big-screen-display.png"
                  icon={<Monitor className="w-4 h-4" />}
                  variant="attendee"
                >
                  <div className="space-y-3">
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

                    {/* Video Options */}
                    <div className="pt-3 border-t border-accent-green-200">
                      <h5 className="font-medium text-accent-green-900 mb-2">
                        Video Options
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-accent-green-700 mb-1 block">
                            iFrame (for captions with livestream)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                            onClick={() => onJoinAsAttendee("iframe")}
                          >
                            Use an iFrame
                          </Button>
                        </div>

                        <div>
                          <span className="text-sm text-accent-green-700 mb-1 block">
                            Embedded Subtitling
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                            onClick={() => onJoinAsAttendee("subtitles")}
                          >
                            Add Subtitles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProgressiveMethodCard>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
