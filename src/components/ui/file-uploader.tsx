"use client";

/**
 * FileUploader
 *
 * React migration of the production Angular `app-wordly-file-uploader`
 * (wordly_portal: libs/components/core/file-uploader).
 *
 * The Angular original is a single drag-and-drop / click dropzone backed by a
 * `file` model signal, with `accept`, `dropzoneText`, `fileTypesText` and
 * `removeFileLabel` inputs and drag-over visual feedback. We keep that public
 * surface and extend it to a selected-files *list* (the `multiple` prop) per the
 * prototype brief, exposing changes via an `onFiles` callback. There is no real
 * upload — selection is local and the consumer decides what to do with the files.
 *
 * The Angular DI/translation layer is dropped: copy arrives via props with
 * sensible English defaults. Built to be controlled (`files` + `onFiles`) or
 * uncontrolled (internal state).
 */

import * as React from "react";
import { Upload, FileIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface FileUploaderProps {
  /** Controlled list of selected files. When set, the component is controlled. */
  files?: File[];
  /** Fired whenever the selection changes (add, drop, or remove). */
  onFiles?: (files: File[]) => void;

  /** Native `accept` attribute, e.g. ".csv,.xlsx" or "image/*". Defaults to any. */
  accept?: string;
  /** Allow selecting / dropping more than one file. Mirrors the brief's list. */
  multiple?: boolean;

  /** Primary dropzone instruction. */
  dropzoneText?: string;
  /** Secondary hint describing accepted file types/sizes. */
  fileTypesText?: string;
  /** Accessible label for the per-file remove button. */
  removeFileLabel?: string;

  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  files: controlledFiles,
  onFiles,
  accept = "*",
  multiple = false,
  dropzoneText = "Drag and drop a file here, or click to browse",
  fileTypesText,
  removeFileLabel = "Remove file",
  disabled = false,
  className,
}: FileUploaderProps) {
  const isControlled = controlledFiles !== undefined;
  const [internalFiles, setInternalFiles] = React.useState<File[]>([]);
  const files = isControlled ? controlledFiles : internalFiles;

  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commit = React.useCallback(
    (next: File[]) => {
      if (!isControlled) setInternalFiles(next);
      onFiles?.(next);
    },
    [isControlled, onFiles]
  );

  const addFiles = React.useCallback(
    (incoming: FileList | null | undefined) => {
      if (!incoming || incoming.length === 0) return;
      const list = Array.from(incoming);
      const next = multiple ? [...files, ...list] : list.slice(0, 1);
      commit(next);
    },
    [files, multiple, commit]
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    // Reset so selecting the same file again re-fires change (Angular parity).
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent) {
    if (disabled) return;
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    addFiles(event.dataTransfer?.files);
  }

  function removeFile(index: number) {
    commit(files.filter((_, i) => i !== index));
  }

  const showDropzone = multiple || files.length === 0;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showDropzone ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 text-center shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:border-ring",
            isDragOver
              ? "border-primary bg-primary-blue-50"
              : "border-border hover:border-primary",
            disabled && "cursor-not-allowed opacity-50 hover:border-border"
          )}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{dropzoneText}</span>
          {fileTypesText ? (
            <span className="text-xs text-muted-foreground/70">
              {fileTypesText}
            </span>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
          />
        </div>
      ) : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2" aria-label="Selected files">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-md border border-border px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-foreground">
                  {file.name}
                </span>
                {file.size > 0 ? (
                  <span className="shrink-0 text-xs text-muted-foreground/70">
                    {formatBytes(file.size)}
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                className="ml-2 shrink-0 cursor-pointer text-lg leading-none text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={removeFileLabel}
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
