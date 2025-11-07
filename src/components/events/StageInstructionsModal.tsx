"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, QrCode, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageName: string;
  stageSessionId: string;
  passcode: string;
  mobileId: string;
}

export function StageInstructionsModal({
  open,
  onOpenChange,
  stageName,
  stageSessionId,
  passcode,
  mobileId,
}: StageInstructionsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  const allStepsCompleted = completedSteps.size === 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Start Stage: {stageName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Follow these steps to set up the AV equipment for this stage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Pre-Start Checklist</h3>
            <div className="space-y-2">
              <button
                onClick={() => toggleStep(1)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left",
                  completedSteps.has(1)
                    ? "border-accent-green-500 bg-accent-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {completedSteps.has(1) ? (
                    <CheckCircle2 className="h-5 w-5 text-accent-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Confirm you are physically at the stage location
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Ensure you're in the correct room/venue
                  </p>
                </div>
              </button>

              <button
                onClick={() => toggleStep(2)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left",
                  completedSteps.has(2)
                    ? "border-accent-green-500 bg-accent-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {completedSteps.has(2) ? (
                    <CheckCircle2 className="h-5 w-5 text-accent-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Verify AV equipment is powered on and connected
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Check microphones, speakers, and display screens
                  </p>
                </div>
              </button>

              <button
                onClick={() => toggleStep(3)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left",
                  completedSteps.has(3)
                    ? "border-accent-green-500 bg-accent-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {completedSteps.has(3) ? (
                    <CheckCircle2 className="h-5 w-5 text-accent-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Confirm internet/network connectivity is stable
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Test connection speed and reliability
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Session Credentials */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-900">Access Methods</h3>
            <p className="text-sm text-gray-600">
              Choose one of the following methods to start the stage:
            </p>

            {/* Method 1: Desktop/Computer */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary-teal-600" />
                <h4 className="font-semibold text-gray-900">Method 1: Desktop Computer</h4>
              </div>
              <p className="text-sm text-gray-600">
                Enter these credentials on the AV computer:
              </p>

              {/* Session ID */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Session ID
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md font-mono text-sm text-gray-900 border border-gray-300">
                    {stageSessionId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(stageSessionId, "sessionId")}
                    className="flex-shrink-0"
                  >
                    {copiedField === "sessionId" ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Passcode */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Passcode
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md font-mono text-sm text-gray-900 border border-gray-300">
                    {passcode}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(passcode, "passcode")}
                    className="flex-shrink-0"
                  >
                    {copiedField === "passcode" ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Method 2: Mobile/Tablet */}
            <div className="border border-primary-teal-200 bg-primary-teal-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary-teal-600" />
                <h4 className="font-semibold text-gray-900">
                  Method 2: Mobile/Tablet (Recommended)
                </h4>
              </div>
              <p className="text-sm text-gray-700">
                Use this 8-digit code for faster access on mobile devices:
              </p>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Mobile ID
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-white rounded-md font-mono text-lg font-bold text-primary-teal-700 border-2 border-primary-teal-300 tracking-wider">
                    {mobileId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(mobileId, "mobileId")}
                    className="flex-shrink-0 border-primary-teal-600 text-primary-teal-600 hover:bg-primary-teal-50"
                  >
                    {copiedField === "mobileId" ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <QrCode className="h-5 w-5 text-primary-teal-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700">
                  <strong>Pro tip:</strong> QR code access available in the "Ways to Join" button
                  for even faster setup
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              allStepsCompleted
                ? "bg-accent-green-50 text-accent-green-700 border-accent-green-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            )}
          >
            {allStepsCompleted ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                All checks completed
              </>
            ) : (
              `${completedSteps.size}/3 checks completed`
            )}
          </Badge>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary-teal-600 hover:bg-primary-teal-700 text-white"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

