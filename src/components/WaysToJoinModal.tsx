"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Video,
  Radio,
  Smartphone,
  Monitor,
  Code,
  Copy,
  ChevronDown,
  Check,
  Download,
  Printer,
  ExternalLink,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WaysToJoinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  roomSessionId: string;
  eventName: string;
  passcode?: string;
  /** Callback to download all sessions info (CSV/PDF) */
  onDownloadAllSessions?: () => void;
}

interface AccordionItemProps {
  title: string;
  description: string;
  illustration: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function AccordionItem({
  title,
  description,
  illustration,
  icon,
  children,
  defaultExpanded = false,
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 w-full text-left p-4"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image
            src={illustration}
            alt={title}
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-base font-semibold flex items-center gap-2 text-gray-900">
            {icon}
            {title}
          </h5>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-gray-100 pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

export function WaysToJoinModal({
  open,
  onOpenChange,
  roomName,
  roomSessionId,
  eventName,
  passcode = "327269",
  onDownloadAllSessions,
}: WaysToJoinModalProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const attendeeUrl = `https://join.wordly.ai/${roomSessionId}`;
  const presenterUrl = `https://present.wordly.ai/${roomSessionId}`;
  const displayUrl = `https://display.wordly.ai/${roomSessionId}`;
  const iframeUrl = `https://attend.wordly.ai/join/${roomSessionId}`;
  const streamUrl = `rtmps://media.wordly.ai/live`;
  const streamKey = `${roomSessionId}_${passcode}`;

  const CopyButton = ({
    text,
    label,
    itemKey,
    variant = "outline",
    className = "",
  }: {
    text: string;
    label: string;
    itemKey: string;
    variant?: "outline" | "default";
    className?: string;
  }) => (
    <Button
      onClick={() => handleCopy(text, itemKey)}
      variant={variant}
      size="sm"
      className={cn("gap-2", className)}
    >
      {copiedItem === itemKey ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Ways to Join This Session
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Presenters and attendees connect to Wordly in separate ways.{" "}
              <a href="#" className="text-primary-teal-600 hover:underline">
                Learn about the options
              </a>
            </p>
          </DialogHeader>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                Session Name: <span className="font-medium">{roomName}</span>
              </span>
              <span>
                Session ID:{" "}
                <span className="font-mono font-medium">{roomSessionId}</span>
              </span>
            </div>
            {onDownloadAllSessions && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAllSessions}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download All Sessions
              </Button>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column - For Presenters */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-teal-100 flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  For Presenters
                </h3>
                <p className="text-sm text-gray-500">Input Setup</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 -mt-2 mb-4">
              Configure how you&apos;ll send presenters&apos; audio to Wordly
            </p>

            {/* Speak Using Wordly */}
            <AccordionItem
              title="Speak Using Wordly (General Use)"
              description="Send audio through the Wordly web application"
              illustration="/asset/illustration/user-join-device-with-qr-code.png"
              icon={<Mic className="w-4 h-4 text-primary-teal-600" />}
              defaultExpanded={true}
            >
              <div className="space-y-3">
                <Button className="w-full bg-primary-teal-600 hover:bg-primary-teal-700 text-white">
                  Present Now
                </Button>
                <CopyButton
                  text={presenterUrl}
                  label="Copy Presenter Link"
                  itemKey="presenter-link"
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <CopyButton
                    text={`${presenterUrl}?passcode=${passcode}`}
                    label="Copy Link with Separate Passcode"
                    itemKey="presenter-passcode"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">
                    Passcode:{" "}
                    <span className="font-mono font-medium text-gray-900">
                      {passcode}
                    </span>
                  </span>
                </div>
              </div>
            </AccordionItem>

            {/* Video Conference */}
            <AccordionItem
              title="Video Conference"
              description="Integrate with Teams, Zoom, WebEx, and Google Meet"
              illustration="/asset/illustration/video-options.png"
              icon={<Video className="w-4 h-4 text-primary-teal-600" />}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Video className="w-4 h-4" />
                  <span>Invite Wordly to Your Meeting</span>
                </div>
                <Button className="w-full bg-primary-teal-600 hover:bg-primary-teal-700 text-white">
                  Invite Meeting Bot
                </Button>
              </div>
            </AccordionItem>

            {/* Stream Media to Wordly */}
            <AccordionItem
              title="Stream Media to Wordly"
              description="Send audio to Wordly using RTMPS"
              illustration="/asset/illustration/big-screen-display.png"
              icon={<Radio className="w-4 h-4 text-primary-teal-600" />}
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Stream URL:</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded border font-mono text-gray-700 truncate">
                      {streamUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(streamUrl, "stream-url")}
                    >
                      {copiedItem === "stream-url" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}{" "}
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Stream Key:</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded border font-mono text-gray-700 truncate">
                      {streamKey}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(streamKey, "stream-key")}
                    >
                      {copiedItem === "stream-key" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}{" "}
                      Copy
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  If the secure connection is blocked, an alternative is
                  available.
                </p>
              </div>
            </AccordionItem>
          </div>

          {/* Right Column - For Attendees */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  For Attendees
                </h3>
                <p className="text-sm text-gray-500">Output Setup</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 -mt-2 mb-4">
              Choose how attendees will receive captions and translations from
              Wordly
            </p>

            {/* Join On Personal Devices */}
            <AccordionItem
              title="Join On Personal Devices"
              description="Get links and QR codes to access captions and translations"
              illustration="/asset/illustration/user-join-device-with-qr-code.png"
              icon={<Smartphone className="w-4 h-4 text-gray-600" />}
              defaultExpanded={true}
            >
              <div className="space-y-3">
                <CopyButton
                  text={attendeeUrl}
                  label="Copy Attendee Link"
                  itemKey="attendee-link"
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <CopyButton
                    text={`${attendeeUrl}?passcode=${passcode}`}
                    label="Copy Link without Passcode"
                    itemKey="attendee-passcode"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">
                    Passcode:{" "}
                    <span className="font-mono font-medium text-gray-900">
                      {passcode}
                    </span>
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2">QR Code Options</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Printer className="w-4 h-4" />
                      Print QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* Display */}
            <AccordionItem
              title="Display"
              description="Set up a big screen display OR add captions over a video"
              illustration="/asset/illustration/big-screen-display.png"
              icon={<Monitor className="w-4 h-4 text-gray-600" />}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white">
                    Open
                  </Button>
                  <CopyButton
                    text={displayUrl}
                    label="Copy Link"
                    itemKey="display-link"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-gray-50">
                    <span>How to set up public display</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-gray-50">
                    <span>How to overlay captions</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AccordionItem>

            {/* Embed Wordly */}
            <AccordionItem
              title="Embed Wordly"
              description="Embed an iFrame into your site"
              illustration="/asset/illustration/video-options.png"
              icon={<Code className="w-4 h-4 text-gray-600" />}
            >
              <div className="space-y-3">
                <Button className="w-full bg-primary-teal-600 hover:bg-primary-teal-700 text-white gap-2">
                  <Copy className="w-4 h-4" />
                  Copy iFrame Attend URL
                </Button>
                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-gray-50">
                    <span>How to Embed Wordly</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AccordionItem>
          </div>
        </div>

        {/* Zoom Integration Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                Zoom (speakers and attendees)
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Wordly has a direct integration with Zoom. You can launch a new
                Wordly session from inside Zoom without needing to configure
                anything inside this web portal first. Input audio and output
                text are both inside Zoom.
              </p>
              <Button variant="outline" size="sm" className="mt-3 gap-2">
                <ExternalLink className="w-4 h-4" />
                Learn how to launch Wordly from Zoom
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
