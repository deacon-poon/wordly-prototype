"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  isLoading?: boolean;
  validationText?: string;
  validationLabel?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  variant = "default",
  isLoading = false,
  validationText,
  validationLabel,
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const isValid = !validationText || inputValue === validationText;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      onOpenChange(false);
      setInputValue("");
    }
  };

  // Reset input when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {icon && (
            <div
              className={`mx-auto mb-4 ${
                variant === "destructive" ? "text-rose-400" : "text-gray-500"
              }`}
            >
              {icon}
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {validationText && (
          <div className="my-4">
            <label
              htmlFor="validation-input"
              className="text-sm font-medium mb-2 block"
            >
              {validationLabel || `Please type "${validationText}" to confirm`}
            </label>
            <Input
              id="validation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={validationText}
              className="mt-1"
              autoComplete="off"
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            className={
              variant === "destructive"
                ? ""
                : "bg-brand-teal hover:bg-brand-teal/90"
            }
            disabled={isLoading || (!!validationText && !isValid)}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
