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
  Download,
  Printer,
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

interface ProgressiveMethodItemProps {
  title: string;
  description: string;
  illustration: string;
  icon: React.ReactNode;
  variant: "presenter" | "attendee";
  children: React.ReactNode;
}

function ProgressiveMethodItem({
  title,
  description,
  illustration,
  icon,
  variant,
  children,
}: ProgressiveMethodItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        "border rounded-lg",
        variant === "presenter"
          ? "border-primary-teal-200 bg-primary-teal-50/30 hover:bg-primary-teal-50/50 hover:border-primary-teal-300"
          : "border-accent-green-200 bg-accent-green-50/30 hover:bg-accent-green-50/50 hover:border-accent-green-300",
        isExpanded && "ring-2 ring-offset-1 shadow-lg",
        variant === "presenter" && isExpanded && "ring-primary-teal-200",
        variant === "attendee" && isExpanded && "ring-accent-green-200"
      )}
    >
      <div className="p-6">
        {/* Always-visible header section */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={illustration}
              alt={title}
              width={88}
              height={88}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="text-lg font-semibold flex items-center gap-2 mb-2 text-gray-900">
                  {icon}
                  {title}
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
              <div className="ml-4 flex items-center justify-center">
                {/* Clean toggle button with just chevron */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    "p-3 rounded-full transition-all duration-200 touch-manipulation",
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
          </div>
        </div>

        {/* Expandable options section */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="space-y-2">
            <div className="pt-4 mt-4 border-t border-gray-200 ml-30">
              {children}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
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
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Join This Session
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to participate in this Wordly session.
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
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    Present
                  </h4>
                  <p className="text-sm text-gray-600 -mt-1">
                    Share my audio with the audience
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Present Audio */}
                <ProgressiveMethodItem
                  title="Present Audio"
                  description="Speak at event or meeting"
                  illustration="/asset/illustration/speak-in-person.png"
                  icon={<Mic className="w-4 h-4" />}
                  variant="presenter"
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        onClick={() => onJoinAsPresenter("quick-link")}
                        className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
                        size="sm"
                      >
                        Copy quick link
                      </Button>
                      <Button
                        onClick={() => onJoinAsPresenter("secure-link")}
                        variant="outline"
                        className="border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                        size="sm"
                      >
                        Copy secure link (separate passcode)
                      </Button>
                    </div>
                    <div className="pt-2 border-t border-primary-teal-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Passcode: 393818
                      </p>
                    </div>
                  </div>
                </ProgressiveMethodItem>

                {/* Invite to Meeting */}
                <ProgressiveMethodItem
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
                  </div>
                </ProgressiveMethodItem>

                {/* Send Audio to RTMPS - Progressive Item */}
                <ProgressiveMethodItem
                  title="Send Audio to RTMPS"
                  description="Advanced audio streaming options"
                  illustration="/asset/illustration/rtmps-settings.png"
                  icon={<Radio className="w-4 h-4" />}
                  variant="presenter"
                >
                  <div className="space-y-3">
                    <Button
                      onClick={() => onJoinAsPresenter("rtmps")}
                      variant="outline"
                      className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                      size="sm"
                    >
                      Configure RTMPS
                    </Button>

                    {/* FAQ-style accordion sections */}
                    <div className="pt-3 border-t border-primary-teal-200 space-y-2">
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-primary-teal-200 rounded hover:bg-primary-teal-50">
                          <span className="text-sm text-gray-900 font-medium">
                            Have multiple microphones in one room?
                          </span>
                          <ChevronDown className="w-4 h-4 text-primary-teal-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 bg-primary-teal-25 border border-primary-teal-200 border-t-0 rounded-b">
                          <p className="text-sm text-gray-900 mb-3">
                            Join using "push to talk". You will need to hold
                            down the microphone button to speak. This helps
                            avoid accidental audio interference.
                          </p>
                          <Button
                            variant="link"
                            className="text-primary-teal-600 hover:text-primary-teal-700 p-0 h-auto text-sm"
                            onClick={() => window.open("#", "_blank")}
                          >
                            Learn about push to talk →
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-primary-teal-200 rounded hover:bg-primary-teal-50">
                          <span className="text-sm text-gray-900 font-medium">
                            Have people speaking 2+ languages in 1 microphone?
                          </span>
                          <ChevronDown className="w-4 h-4 text-primary-teal-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 bg-primary-teal-25 border border-primary-teal-200 border-t-0 rounded-b">
                          <p className="text-sm text-gray-900 mb-3">
                            Wordly can automatically select the input language
                            from among the languages you've added to the
                            language panel. This takes up to 15 seconds.
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Tip:</strong> Fewer languages gives faster
                            performance. For quicker changes, manually click the
                            language in the language panel before each person
                            speaks.
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </ProgressiveMethodItem>
              </div>
            </div>

            {/* As Attendee Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-green-500 rounded-full"></div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    Listen
                  </h4>
                  <p className="text-sm text-gray-600 -mt-1">
                    Receive translations and captions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Listen/Translate */}
                <ProgressiveMethodItem
                  title="Listen/Translate"
                  description="Join on your device"
                  illustration="/asset/illustration/user-join-device-with-qr-code.png"
                  icon={<Smartphone className="w-4 h-4" />}
                  variant="attendee"
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        onClick={() => onJoinAsAttendee("download-qr")}
                        className="bg-accent-green-600 hover:bg-accent-green-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR code
                      </Button>
                      <Button
                        onClick={() => onJoinAsAttendee("print-qr")}
                        variant="outline"
                        className="border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                        size="sm"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print QR code
                      </Button>
                    </div>

                    <div className="pt-3 border-t border-accent-green-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Attendee link: https://attend.wordly.ai/join/ZGSG-0712
                      </p>
                    </div>
                  </div>
                </ProgressiveMethodItem>

                {/* Public Display */}
                <ProgressiveMethodItem
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
                  </div>
                </ProgressiveMethodItem>

                {/* Video Options - Progressive Item */}
                <ProgressiveMethodItem
                  title="Video Options"
                  description="Advanced video integration"
                  illustration="/asset/illustration/video-options.png"
                  icon={<Video className="w-4 h-4" />}
                  variant="attendee"
                >
                  <div className="space-y-3">
                    {/* FAQ-style accordion sections */}
                    <div className="space-y-2">
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-accent-green-200 rounded hover:bg-accent-green-50">
                          <span className="text-sm text-gray-900 font-medium">
                            iFrame (for captions with a livestream)
                          </span>
                          <ChevronDown className="w-4 h-4 text-accent-green-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 bg-accent-green-25 border border-accent-green-200 border-t-0 rounded-b">
                          <p className="text-sm text-gray-900 mb-3">
                            Embed Wordly captions directly into your livestream
                            or video platform.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start border-accent-green-300 text-accent-green-700 hover:bg-accent-green-100 bg-white"
                            onClick={() => onJoinAsAttendee("iframe")}
                          >
                            Use an iFrame
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-accent-green-200 rounded hover:bg-accent-green-50">
                          <span className="text-sm text-gray-900 font-medium">
                            Embedded Subtitling
                          </span>
                          <ChevronDown className="w-4 h-4 text-accent-green-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 bg-accent-green-25 border border-accent-green-200 border-t-0 rounded-b">
                          <p className="text-sm text-gray-900 mb-3">
                            Add live subtitles directly to your video content or
                            streaming platform.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start border-accent-green-300 text-accent-green-700 hover:bg-accent-green-100 bg-white"
                            onClick={() => onJoinAsAttendee("subtitles")}
                          >
                            Add Subtitles
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </ProgressiveMethodItem>
              </div>
            </div>

            {/* Zoom Integration Section */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex-shrink-0">
                  <img
                    src="/logo/zoom-icon-only.svg"
                    alt="Zoom"
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Zoom (speakers and attendees)
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Wordly has a direct integration with Zoom. You can launch a
                    new Wordly session from inside Zoom without needing to
                    configure anything inside this web portal first. Input audio
                    and output text are both inside Zoom.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://zoom.us", "_blank")}
                  >
                    Learn how to launch Wordly from inside Zoom
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
