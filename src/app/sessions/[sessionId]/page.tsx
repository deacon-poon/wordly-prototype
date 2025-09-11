"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Download,
  Printer,
  Radio,
  ChevronDown,
  ExternalLink,
  Info,
  ArrowLeft,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

export default function SessionDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [showBotInvite, setShowBotInvite] = useState(false);

  const handleBotInviteSubmit = (data: {
    language: string;
    meetingLink: string;
  }) => {
    console.log("Bot invite data:", data);
    alert(
      `Joined session ${params.sessionId} as presenter with method: invite-bot`
    );
    setShowBotInvite(false);
  };

  const onJoinAsPresenter = (method: string) => {
    console.log(
      `Joining session ${params.sessionId} as presenter with method: ${method}`
    );
    alert(
      `Joined session ${params.sessionId} as presenter with method: ${method}`
    );
  };

  const onJoinAsAttendee = (method: string) => {
    console.log(
      `Joining session ${params.sessionId} as attendee with method: ${method}`
    );
    alert(
      `Joining session ${params.sessionId} as attendee with method: ${method}`
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Back Button and Title on Same Line */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sessions
            </Button>

            <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">
              Ways to Start this Session
            </h1>

            {/* Spacer to balance the layout */}
            <div className="w-24"></div>
          </div>

          {/* Description */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-gray-600 text-sm">
            <span>
              Presenters and attendees connect to Wordly in separate ways.
            </span>
            <button
              onClick={() => window.open("https://help.wordly.ai", "_blank")}
              className="inline-flex items-center gap-1 text-primary-teal-600 hover:text-primary-teal-700 underline font-medium"
            >
              <Info className="h-4 w-4" />
              Learn about the options
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full">
          <div className="space-y-6 pb-4">
            {/* Primary Actions - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* As Presenter Section */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    For Presenters
                  </h4>
                  <p className="text-sm text-gray-600 -mt-1">
                    Send audio to Wordly
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Present Audio */}
                  <ProgressiveMethodItem
                    title="Speak at an in-person event"
                    description="Share your voice with real-time translation for live audiences"
                    illustration="/asset/illustration/speak-in-person.png"
                    icon={<Mic className="w-4 h-4" />}
                    variant="presenter"
                  >
                    <div className="space-y-3">
                      {/* Primary Present Now Button */}
                      <Button
                        onClick={() => onJoinAsPresenter("present-now")}
                        className="w-full bg-primary-teal-600 hover:bg-primary-teal-700 text-white font-semibold"
                        size="default"
                      >
                        Present Now
                      </Button>

                      <div className="space-y-3">
                        <Button
                          onClick={() => onJoinAsPresenter("quick-link")}
                          variant="outline"
                          className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                          size="sm"
                        >
                          Copy quick link
                        </Button>

                        {/* Secure link with passcode grouped together */}
                        <div className="bg-primary-teal-50/50 border border-primary-teal-200 rounded-lg p-3">
                          <div className="flex items-center justify-between gap-3">
                            <Button
                              onClick={() => onJoinAsPresenter("secure-link")}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Copy secure link (with separate passcode)
                            </Button>
                            <div className="text-xs text-gray-600 text-right">
                              <span className="text-gray-500">Passcode: </span>
                              <span className="font-mono font-semibold text-gray-900">
                                393818
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProgressiveMethodItem>

                  {/* Invite to Meeting */}
                  <ProgressiveMethodItem
                    title="Video Conference"
                    description="Integrate with Teams, Zoom, WebEx, Google Meet, and more"
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
                                    <SelectItem value="pt">
                                      Portuguese
                                    </SelectItem>
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
                    </div>
                  </ProgressiveMethodItem>

                  {/* Send Audio to RTMPS - Progressive Item */}
                  <ProgressiveMethodItem
                    title="RTMPS"
                    description="Stream audio to RTMPS"
                    illustration="/asset/illustration/rtmps-settings.png"
                    icon={<Radio className="w-4 h-4" />}
                    variant="presenter"
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button
                          onClick={() =>
                            window.open(
                              "https://help.wordly.ai/develop/rtmp-streaming/",
                              "_blank"
                            )
                          }
                          variant="outline"
                          className="border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy RTMPS Link
                        </Button>
                        <Button
                          onClick={() =>
                            window.open(
                              "https://help.wordly.ai/develop/rtmp-streaming/",
                              "_blank"
                            )
                          }
                          variant="outline"
                          className="border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Stream Key
                        </Button>
                      </div>
                    </div>
                  </ProgressiveMethodItem>
                </div>
              </div>

              {/* As Attendee Section */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    For Attendees
                  </h4>
                  <p className="text-sm text-gray-600 -mt-1">
                    Access captions & translations from Wordly
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Listen/Translate */}
                  <ProgressiveMethodItem
                    title="Join on your device"
                    description="Download QR code to access translations"
                    illustration="/asset/illustration/user-join-device-with-qr-code.png"
                    icon={<Smartphone className="w-4 h-4" />}
                    variant="attendee"
                  >
                    <div className="space-y-3">
                      {/* Primary Actions - Copy Links */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">
                          Share Link
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button
                            onClick={() => {
                              const url = `https://wordly.ai/join/${
                                params.sessionId || "demo"
                              }`;
                              navigator.clipboard.writeText(url);
                              // TODO: Show toast notification
                            }}
                            className="bg-accent-green-600 hover:bg-accent-green-700 text-white"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            onClick={() => {
                              const url = `https://wordly.ai/join/${
                                params.sessionId || "demo"
                              }?passcode=327269`;
                              navigator.clipboard.writeText(url);
                              // TODO: Show toast notification
                            }}
                            variant="outline"
                            className="border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy with Passcode
                          </Button>
                        </div>
                      </div>

                      {/* Secondary Actions - QR Code */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">
                          QR Code Options
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button
                            onClick={() => onJoinAsAttendee("download-qr")}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download QR
                          </Button>
                          <Button
                            onClick={() => onJoinAsAttendee("print-qr")}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            <Printer className="w-4 h-4 mr-2" />
                            Print QR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ProgressiveMethodItem>

                  {/* Public Display */}
                  <ProgressiveMethodItem
                    title="Display"
                    description="Set up a big screen display QR add subtitles over a video."
                    illustration="/asset/illustration/big-screen-display.png"
                    icon={<Monitor className="w-4 h-4" />}
                    variant="attendee"
                  >
                    <div className="space-y-3">
                      {/* Main action buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button
                          onClick={() => onJoinAsAttendee("big-screen")}
                          className="bg-accent-green-600 hover:bg-accent-green-700 text-white"
                          size="sm"
                        >
                          Open
                        </Button>
                        <Button
                          onClick={() => {
                            const url = `https://wordly.ai/join/${
                              params.sessionId || "demo"
                            }/display`;
                            navigator.clipboard.writeText(url);
                          }}
                          variant="outline"
                          className="border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                          size="sm"
                        >
                          Copy link
                        </Button>
                      </div>

                      {/* FAQ-style help sections */}
                      <div className="space-y-2">
                        {/* Public Display Setup */}
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-accent-green-200 rounded hover:bg-accent-green-50">
                            <span className="text-sm text-gray-900 font-medium">
                              How to set up public display
                            </span>
                            <ChevronDown className="w-4 h-4 text-accent-green-600" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-3 bg-accent-green-25 border border-accent-green-200 border-t-0 rounded-b">
                            <p className="text-sm text-gray-900 mb-3">
                              Set up large screen displays for attendees to view
                              translations and captions in real-time.
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto font-normal text-accent-green-700 hover:text-accent-green-800 underline"
                              onClick={() =>
                                window.open(
                                  "https://help.wordly.ai/public-display",
                                  "_blank"
                                )
                              }
                            >
                              View detailed setup guide
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Subtitles Setup */}
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-white border border-accent-green-200 rounded hover:bg-accent-green-50">
                            <span className="text-sm text-gray-900 font-medium">
                              How to set up subtitles
                            </span>
                            <ChevronDown className="w-4 h-4 text-accent-green-600" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-3 bg-accent-green-25 border border-accent-green-200 border-t-0 rounded-b">
                            <p className="text-sm text-gray-900 mb-3">
                              Add live subtitles directly to your video content
                              or streaming platform.
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto font-normal text-accent-green-700 hover:text-accent-green-800 underline"
                              onClick={() =>
                                window.open(
                                  "https://help.wordly.ai/subtitles",
                                  "_blank"
                                )
                              }
                            >
                              View setup instructions
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </ProgressiveMethodItem>

                  {/* iFrame Option - Progressive Item */}
                  <ProgressiveMethodItem
                    title="iFrame"
                    description="iFrame transcriptions alongside your video"
                    illustration="/asset/illustration/video-options.png"
                    icon={<Video className="w-4 h-4" />}
                    variant="attendee"
                  >
                    <div className="space-y-3">
                      <div className="bg-accent-green-50 border border-accent-green-200 rounded p-3">
                        <p className="text-sm text-gray-900 mb-3">
                          <strong>
                            iFrame (for captions with a livestream)
                          </strong>
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          Embed Wordly captions directly into your livestream or
                          video platform.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-accent-green-300 text-accent-green-700 hover:bg-accent-green-50"
                          onClick={() => onJoinAsAttendee("iframe")}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Use iFrame
                        </Button>
                      </div>
                    </div>
                  </ProgressiveMethodItem>
                </div>
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
                    onClick={() =>
                      window.open(
                        "https://help.wordly.ai/learn-how-to-launch-wordly-from-inside-zoom",
                        "_blank"
                      )
                    }
                  >
                    Learn how to launch Wordly from inside Zoom
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
