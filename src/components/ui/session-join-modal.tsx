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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mic,
  Video,
  Smartphone,
  Monitor,
  Settings,
  QrCode,
  ExternalLink,
  Copy,
  Key,
  Download,
  Printer,
  Globe,
  MessageSquare,
  Radio,
  Users2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SessionJoinModalProps {
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

interface JoinOptionProps {
  title: string;
  description: string;
  illustration: string;
  badge?: string;
  icon: React.ReactNode;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  primaryLabel: string;
  secondaryLabel?: string;
  variant: "presenter" | "attendee";
}

function JoinOption({
  title,
  description,
  illustration,
  badge,
  icon,
  onPrimaryAction,
  onSecondaryAction,
  primaryLabel,
  secondaryLabel,
  variant,
}: JoinOptionProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        variant === "presenter"
          ? "border-primary-teal-200 bg-primary-teal-50/30"
          : "border-accent-green-200 bg-accent-green-50/30"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg",
              variant === "presenter"
                ? "bg-primary-teal-100 text-primary-teal-700"
                : "bg-accent-green-100 text-accent-green-700"
            )}
          >
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="w-full h-48 bg-white rounded-lg overflow-hidden flex items-center justify-center p-3">
          <div className="relative w-full h-full">
            <Image
              src={illustration}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onPrimaryAction}
            variant="default"
            className={cn(
              "w-full",
              variant === "attendee" &&
                "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
            size="default"
          >
            {primaryLabel}
          </Button>

          {onSecondaryAction && secondaryLabel && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              className="w-full"
              size="default"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
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
    <Card className="border-primary-teal-200 bg-primary-teal-50/50">
      <CardHeader>
        <CardTitle className="text-primary-teal-700 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Invite Wordly to a Meeting
        </CardTitle>
        <p className="text-sm text-gray-600">
          Enter a Microsoft Teams, Google Meet, or Zoom link and click Invite to
          have Wordly attend your meeting.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Please note that it may take up to 30 seconds for Wordly to join
            your meeting.
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={!language || !meetingLink.trim()}
              className="bg-primary-teal-600 hover:bg-primary-teal-700"
            >
              Invite
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

export function SessionJoinModal({
  open,
  onOpenChange,
  sessionId,
  onJoinAsPresenter,
  onJoinAsAttendee,
}: SessionJoinModalProps) {
  const [showBotInvite, setShowBotInvite] = useState(false);

  const handleCopySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
    }
  };

  const handleBotInviteSubmit = (data: {
    language: string;
    meetingLink: string;
  }) => {
    console.log("Bot invite data:", data);
    // Here you would call the actual API to invite the bot
    onJoinAsPresenter("invite-bot");
    setShowBotInvite(false);
  };

  const handleBotInviteCancel = () => {
    setShowBotInvite(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold">
            Join Session {sessionId && `${sessionId}`}
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose how you'd like to participate in this Wordly session
          </DialogDescription>
          {sessionId && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                {sessionId}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySessionId}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Presenter Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <div className="w-3 h-3 bg-primary-teal-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-primary-teal-700">
                  Join as Presenter
                </h3>
              </div>
              <p className="text-gray-600">
                Send audio to Wordly for real-time interpretation
              </p>
              {sessionId && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 p-3 bg-primary-teal-50 rounded-lg">
                  <Key className="w-4 h-4 text-primary-teal-600" />
                  <span className="text-sm font-medium text-primary-teal-700">
                    Passcode: {sessionId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySessionId}
                    className="h-6 w-6 p-0 text-primary-teal-600"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <JoinOption
                title="In-Person Event"
                description="Present live at an event with your microphone"
                illustration="/asset/illustration/speak-in-person.png"
                badge="Most Popular"
                icon={<Mic className="w-5 h-5" />}
                onPrimaryAction={() => onJoinAsPresenter("in-person")}
                onSecondaryAction={() => onJoinAsPresenter("quick-link")}
                primaryLabel="Present Now"
                secondaryLabel="Copy Quick Link"
                variant="presenter"
              />

              <JoinOption
                title="Video Meeting"
                description="Invite Wordly bot to Microsoft Teams, WebEx, Google Meet, etc."
                illustration="/asset/illustration/video-meeting.png"
                icon={<Video className="w-5 h-5" />}
                onPrimaryAction={() => setShowBotInvite(true)}
                onSecondaryAction={() => onJoinAsPresenter("meeting-setup")}
                primaryLabel="Invite the Wordly bot to your video meeting"
                secondaryLabel="Advanced Setup"
                variant="presenter"
              />
            </div>

            {/* Bot Invite Form */}
            {showBotInvite && (
              <BotInviteForm
                onSubmit={handleBotInviteSubmit}
                onCancel={handleBotInviteCancel}
              />
            )}

            {/* Advanced Presenter Options */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-setup">
                <AccordionTrigger className="text-primary-teal-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Setup Options
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <Card className="border-primary-teal-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Radio className="w-4 h-4 text-primary-teal-600" />
                          <h4 className="font-medium">RTMPS Streaming</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Send audio via RTMPS protocol
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onJoinAsPresenter("rtmps")}
                        >
                          Configure RTMPS
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-primary-teal-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users2 className="w-4 h-4 text-primary-teal-600" />
                          <h4 className="font-medium">Multiple Microphones</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Setup for multiple speakers
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onJoinAsPresenter("multi-mic")}
                        >
                          Setup Multi-Mic
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Attendee Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <div className="w-3 h-3 bg-accent-green-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-accent-green-700">
                  Join as Attendee
                </h3>
              </div>
              <p className="text-gray-600">
                Access real-time translations from Wordly
              </p>
              {sessionId && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 p-3 bg-accent-green-50 rounded-lg">
                  <Globe className="w-4 h-4 text-accent-green-600" />
                  <span className="text-sm font-medium text-accent-green-700">
                    Link: https://attend.wordly.ai/join/{sessionId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://attend.wordly.ai/join/${sessionId}`
                      )
                    }
                    className="h-6 w-6 p-0 text-accent-green-600"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <JoinOption
                title="Join on Your Device"
                description="Use smartphone, tablet, or computer to access translations"
                illustration="/asset/illustration/user-join-device-with-qr-code.png"
                badge="Recommended"
                icon={<Smartphone className="w-5 h-5" />}
                onPrimaryAction={() => onJoinAsAttendee("device")}
                onSecondaryAction={() => onJoinAsAttendee("qr-options")}
                primaryLabel="Join Session"
                secondaryLabel="QR Code Options"
                variant="attendee"
              />

              <JoinOption
                title="Big Screen Display"
                description="Display translations on large screens or projectors"
                illustration="/asset/illustration/big-screen-display.png"
                icon={<Monitor className="w-5 h-5" />}
                onPrimaryAction={() => onJoinAsAttendee("big-screen")}
                onSecondaryAction={() => onJoinAsAttendee("public-monitor")}
                primaryLabel="Open Public Display"
                secondaryLabel="Monitor Setup"
                variant="attendee"
              />
            </div>

            {/* QR Code & Video Options */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="qr-options">
                <AccordionTrigger className="text-accent-green-700">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code & Print Options
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onJoinAsAttendee("download-qr")}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download QR Code</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onJoinAsAttendee("print-qr")}
                    >
                      <Printer className="w-5 h-5" />
                      <span>Print QR Code</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="video-options">
                <AccordionTrigger className="text-accent-green-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Video & Embedded Options
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <Card className="border-accent-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-accent-green-600" />
                          <h4 className="font-medium">
                            iFrame (for captions with livestream)
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Embed captions in your livestream
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onJoinAsAttendee("iframe")}
                        >
                          Use an iFrame
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-accent-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-accent-green-600" />
                          <h4 className="font-medium">Embedded Subtitling</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Add subtitles to your video content
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onJoinAsAttendee("subtitles")}
                        >
                          Add Subtitles
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Zoom Integration Section */}
        <div className="border-t pt-6 mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Zoom (speakers and attendees)
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Wordly has a direct integration with Zoom. You can launch
                      a new Wordly session from inside Zoom without needing to
                      configure anything inside this web portal first. Input
                      audio and output text are both inside Zoom.
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="shrink-0">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Learn how to launch Wordly from inside Zoom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
