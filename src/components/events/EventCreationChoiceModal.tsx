"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileSpreadsheet, Plus, ArrowRight, CheckCircle } from "lucide-react";

// ============================================================================
// Props
// ============================================================================

interface EventCreationChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseSpreadsheet: () => void;
  onChooseManual: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function EventCreationChoiceModal({
  open,
  onOpenChange,
  onChooseSpreadsheet,
  onChooseManual,
}: EventCreationChoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Event
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Choose how you&apos;d like to create your event
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Option 1: Spreadsheet Upload */}
          <Card
            className="relative p-5 border-2 border-gray-200 hover:border-accent-green-400 hover:bg-accent-green-50/30 cursor-pointer transition-all group"
            onClick={() => {
              onOpenChange(false);
              onChooseSpreadsheet();
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-green-100 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-primary-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  Create from Spreadsheet
                  <span className="text-xs font-normal px-2 py-0.5 bg-accent-green-100 text-accent-green-800 rounded-full">
                    Recommended
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a CSV or Excel file with your complete event schedule.
                  Rooms and sessions will be created automatically.
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Bulk import all locations and sessions at once
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Download template to ensure correct format
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Automatic validation of schedule conflicts
                  </li>
                </ul>
              </div>
              <div className="flex-shrink-0 self-center">
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-teal-600 transition-colors" />
              </div>
            </div>
          </Card>

          {/* Option 2: Manual Creation */}
          <Card
            className="relative p-5 border-2 border-gray-200 hover:border-accent-green-400 hover:bg-accent-green-50/30 cursor-pointer transition-all group"
            onClick={() => {
              onOpenChange(false);
              onChooseManual();
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Create Manually
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Build your event step-by-step. Add locations and sessions one
                  at a time with full control over each detail.
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Perfect for smaller events or when you need flexibility
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Add sessions later as your schedule develops
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="h-3.5 w-3.5 text-accent-green-500" />
                    Full control over every field
                  </li>
                </ul>
              </div>
              <div className="flex-shrink-0 self-center">
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-teal-600 transition-colors" />
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-600"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
