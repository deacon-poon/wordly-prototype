"use client";

/**
 * FileUploader
 *
 * EXACT React port of the production Angular `app-wordly-file-uploader`
 * (wordly_portal: libs/components/core/file-uploader/wordly-file-uploader.component.{ts,html}).
 *
 * The Angular original is a single drag-and-drop / click dropzone backed by a
 * `file` model signal (one file, not a list), with `accept`, `dropzoneText`,
 * `fileTypesText` and `removeFileLabel` inputs and drag-over visual feedback.
 * When a file is selected the dropzone is replaced by a single row showing the
 * file name and an `×` remove button. We mirror that structure, props, states
 * and Tailwind classes 1:1.
 *
 * The Angular DI/translation layer is dropped: copy arrives via props with the
 * same English defaults the translation keys resolve to. Built to be controlled
 * (`file` + `onFileChange`) — mirroring Angular's two-way `file` model — or
 * uncontrolled (internal state). There is no real upload; selection is local
 * and the consumer decides what to do with the file.
 */

import * as React from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FileUploaderProps {
  /**
   * Controlled selected file. When provided (including `null`), the component
   * is controlled. Mirrors Angular's two-way `file` model.
   */
  file?: File | null;
  /** Fired whenever the selection changes (select, drop, or remove). */
  onFileChange?: (file: File | null) => void;

  /** Native `accept` attribute, e.g. ".csv,.xlsx" or "image/*". Defaults to any. */
  accept?: string;

  /** Primary dropzone instruction (Angular `dropzoneText`). */
  dropzoneText?: string;
  /** Secondary hint describing accepted file types (Angular `fileTypesText`). */
  fileTypesText?: string;
  /** Accessible label for the remove button (Angular `removeFileLabel`). */
  removeFileLabel?: string;

  className?: string;
}

export function FileUploader({
  file: controlledFile,
  onFileChange,
  accept = "*",
  // Defaults mirror the Angular translation fallbacks.
  dropzoneText = "Drag and drop a file here, or click to browse",
  fileTypesText = "",
  removeFileLabel = "Remove file",
  className,
}: FileUploaderProps) {
  const isControlled = controlledFile !== undefined;
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const file = isControlled ? controlledFile : internalFile;

  const [isDragOver, setIsDragOver] = React.useState(false);

  const setFile = React.useCallback(
    (next: File | null) => {
      if (!isControlled) setInternalFile(next);
      onFileChange?.(next);
    },
    [isControlled, onFileChange]
  );

  function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    if (input.files?.length) {
      setFile(input.files[0]);
      // Reset so selecting the same file again re-fires change (Angular parity).
      input.value = "";
    }
  }

  function onDragOver(event: React.DragEvent) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragOver(false);
    const dropped = event.dataTransfer?.files[0];
    if (dropped) {
      setFile(dropped);
    }
  }

  function removeFile() {
    setFile(null);
  }

  // ── No file → dropzone (Angular `@if (!file())`) ─────────────────────────
  if (!file) {
    return (
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragOver
            ? "border-primary bg-primary"
            : "border-border hover:border-primary",
          className
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{dropzoneText}</span>
        {fileTypesText ? (
          <span className="text-xs text-muted-foreground/70">
            {fileTypesText}
          </span>
        ) : null}
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={onFileSelected}
        />
      </label>
    );
  }

  // ── File selected → name + remove (Angular `@else`) ──────────────────────
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-border px-4 py-3",
        className
      )}
    >
      <span className="truncate text-sm text-foreground">{file.name}</span>
      <button
        type="button"
        className="ml-2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        aria-label={removeFileLabel}
        onClick={removeFile}
      >
        &times;
      </button>
    </div>
  );
}
