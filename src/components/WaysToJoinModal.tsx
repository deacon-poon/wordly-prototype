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
  QrCode,
  Link as LinkIcon,
  Smartphone,
  Monitor,
  Download,
  Printer,
  Copy,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WaysToJoinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  roomSessionId: string;
  eventName: string;
  type?: "session" | "location";
  sessionCount?: number;
  sessions?: Array<{ title: string; scheduledStart: string; endTime: string }>;
}

interface MethodItemProps {
  title: string;
  description: string;
  illustration: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function MethodItem({
  title,
  description,
  illustration,
  icon,
  children,
}: MethodItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        "border rounded-xl",
        "border-primary-teal-200 bg-primary-teal-50/30 hover:bg-primary-teal-50/50 hover:border-primary-teal-300",
        isExpanded && "ring-2 ring-offset-1 shadow-lg ring-primary-teal-200"
      )}
    >
      <div className="p-6">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-6 w-full text-left"
        >
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
            <Image
              src={illustration}
              alt={title}
              width={72}
              height={72}
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
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-primary-teal-600 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-primary-teal-200">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function WaysToJoinModal({
  open,
  onOpenChange,
  roomName,
  roomSessionId,
  eventName,
  type = "session",
  sessionCount,
  sessions = [],
}: WaysToJoinModalProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const webUrl = `https://wordly.ai/join/${roomSessionId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    webUrl
  )}`;

  const isLocation = type === "location";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isLocation
              ? "Ways to Join this Location"
              : "Ways to Join this Session"}
          </DialogTitle>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">
                {isLocation ? "Location" : "Room"}:
              </span>{" "}
              {roomName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Event:</span> {eventName}
            </p>
            {isLocation && sessionCount && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sessions:</span> {sessionCount}{" "}
                sessions in this location
              </p>
            )}
            <p className="text-sm text-gray-600">
              <span className="font-medium">Session ID:</span>{" "}
              <span className="font-mono font-semibold text-primary-teal-600">
                {roomSessionId}
              </span>
            </p>
          </div>

          {isLocation && sessions.length > 0 && (
            <div className="mt-4 p-4 bg-primary-teal-50 border border-primary-teal-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Sessions in this Location
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-700 flex items-center justify-between gap-2"
                  >
                    <span className="font-medium truncate">
                      {session.title}
                    </span>
                    <span className="text-gray-500 whitespace-nowrap">
                      {session.scheduledStart} - {session.endTime}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                This single session ID provides access to all sessions in this
                location
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Join on Their Own Devices */}
          <MethodItem
            title="Join on Their Own Devices"
            description="Download QR Code to Access Translations"
            illustration="/asset/illustration/user-join-device-with-qr-code.png"
            icon={<Smartphone className="w-5 h-5 text-primary-teal-600" />}
          >
            <div className="space-y-3">
              {/* Links */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleCopy(webUrl, "quick-link")}
                  variant="outline"
                  className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                  size="sm"
                >
                  {copiedItem === "quick-link" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Quick Link
                    </>
                  )}
                </Button>

                {/* Secure link with passcode */}
                <div className="bg-primary-teal-50/50 border border-primary-teal-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      onClick={() =>
                        handleCopy(`${webUrl}?passcode=327269`, "secure-link")
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {copiedItem === "secure-link"
                        ? "Copied!"
                        : "Copy Secure Link (with Separate Passcode)"}
                    </Button>
                    <div className="text-xs text-gray-600 text-right">
                      <span className="text-gray-500">Passcode: </span>
                      <span className="font-mono font-semibold text-gray-900">
                        327269
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Options */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">
                  QR Code Options
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    size="sm"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR Code
                  </Button>
                </div>
              </div>
            </div>
          </MethodItem>

          {/* Display */}
          <MethodItem
            title="Display"
            description="Set Up a Big Screen Display QR Add Subtitles Over a Video."
            illustration="/asset/illustration/big-screen-display.png"
            icon={<Monitor className="w-5 h-5 text-primary-teal-600" />}
          >
            <div className="space-y-3">
              {/* Main action buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
                  size="sm"
                >
                  Open
                </Button>
                <Button
                  onClick={() =>
                    handleCopy(`${webUrl}/display`, "display-link")
                  }
                  variant="outline"
                  className="border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                  size="sm"
                >
                  {copiedItem === "display-link" ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          </MethodItem>

          {/* iFrame */}
          <MethodItem
            title="iFrame"
            description="iFrame Transcriptions Directly Into Your Video"
            illustration="/asset/illustration/video-options.png"
            icon={<LinkIcon className="w-5 h-5 text-primary-teal-600" />}
          >
            <div className="space-y-3">
              <Button
                onClick={() =>
                  handleCopy(
                    `https://attend.wordly.ai/frame/${roomSessionId}`,
                    "iframe-link"
                  )
                }
                variant="outline"
                className="w-full border-primary-teal-300 text-primary-teal-700 hover:bg-primary-teal-50"
                size="sm"
              >
                {copiedItem === "iframe-link" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy iFrame Link
                  </>
                )}
              </Button>
            </div>
          </MethodItem>
        </div>
      </DialogContent>
    </Dialog>
  );
}
