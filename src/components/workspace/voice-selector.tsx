"use client";

/**
 * VoiceSelector
 *
 * React migration of the production Angular `wordly-voice-selector`
 * (wordly_portal: libs/components/business/wordly-voice-selector).
 *
 * The Angular original is a form control that proxies a trigger button to a
 * modal: the modal lets the user pick a voice pack, optionally expand a voice
 * sample player to choose a language and play a preview, then Cancel/Select to
 * commit. Here we keep the same public surface (controlled value, voice-pack
 * list, per-pack languages, expandable preview with a play button + audio
 * loading state, loading/error/empty states) but drop the Angular DI/service
 * layer (bridge service, translation service, audio playback): data arrives via
 * props and the "play" action is a mocked async delay.
 *
 * Built on the shared shadcn primitives (Dialog + Select + Button) via the
 * "@/..." alias. In production the voice packs and languages would be fetched
 * from the cloud-TTS API and audio streamed from the playback service.
 */

import * as React from "react";
import { ChevronDown, ChevronRight, Loader2, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular VoicePackOption / LanguageOption models)
// ---------------------------------------------------------------------------

export interface LanguageOption {
  label: string;
  value: string;
}

export interface VoicePackOption {
  label: string;
  value: string;
  /** Languages this pack can preview; mirrors VoicePack.voices in Angular. */
  languages?: LanguageOption[];
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the cloud-TTS voice-pack API
// ---------------------------------------------------------------------------

export const MOCK_VOICE_PACKS: VoicePackOption[] = [
  {
    label: "Aria (Neutral)",
    value: "vp-aria",
    languages: [
      { label: "English (US)", value: "en-US" },
      { label: "Spanish (Spain)", value: "es-ES" },
      { label: "French (France)", value: "fr-FR" },
    ],
  },
  {
    label: "Marcus (Warm)",
    value: "vp-marcus",
    languages: [
      { label: "English (UK)", value: "en-GB" },
      { label: "German (Germany)", value: "de-DE" },
    ],
  },
  {
    label: "Lena (Bright)",
    value: "vp-lena",
    languages: [
      { label: "Japanese (Japan)", value: "ja-JP" },
      { label: "Korean (Korea)", value: "ko-KR" },
      { label: "Mandarin (China)", value: "zh-CN" },
    ],
  },
  {
    label: "Theo (Calm)",
    value: "vp-theo",
    languages: [{ label: "Portuguese (Brazil)", value: "pt-BR" }],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface VoiceSelectorProps {
  /** Controlled selected voice-pack value (empty string when none). */
  value?: string;
  /** Fired when a voice pack is committed via the Select button. */
  onValueChange?: (value: string) => void;
  /** Available voice packs (each with its preview languages). */
  voicePacks?: VoicePackOption[];

  /** Mocked preview playback; resolves when the (fake) sample finishes. */
  onPlayPreview?: (
    voicePackValue: string,
    languageValue: string
  ) => Promise<void>;

  placeholder?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  voicePackLabel?: string;
  showVoiceSampleLabel?: string;
  chooseLanguageDescription?: string;
  languageLabel?: string;
  languagePlaceholder?: string;
  previewLabel?: string;
  selectLabel?: string;
  cancelLabel?: string;
  playButtonAriaLabel?: string;

  disabled?: boolean;
  loading?: boolean;
  error?: boolean;

  label?: string;
  required?: boolean;

  loadingText?: string;
  errorLoadingText?: string;
  noVoicePacksText?: string;

  triggerClassName?: string;
  className?: string;
}

export function VoiceSelector({
  value,
  onValueChange,
  voicePacks = MOCK_VOICE_PACKS,
  onPlayPreview,
  placeholder = "Select a voice",
  dialogTitle = "Select Voice",
  dialogDescription = "Select a voice pack that will be used when users request spoken translations during a session.",
  voicePackLabel = "Voice pack",
  showVoiceSampleLabel = "Show voice sample player",
  chooseLanguageDescription = "Choose a language and press play to hear a voice sample for this voice pack.",
  languageLabel = "Language",
  languagePlaceholder = "Select a language",
  previewLabel = "Preview",
  selectLabel = "Select Voice",
  cancelLabel = "Cancel",
  playButtonAriaLabel = "Play voice sample",
  disabled = false,
  loading = false,
  error = false,
  label,
  required = false,
  loadingText = "Loading voices...",
  errorLoadingText = "Failed to load voices",
  noVoicePacksText = "No voice packs available",
  triggerClassName,
  className,
}: VoiceSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tempPack, setTempPack] = React.useState<string | null>(null);
  const [previewLanguage, setPreviewLanguage] = React.useState<string>("");
  const [sampleExpanded, setSampleExpanded] = React.useState(false);
  const [audioLoading, setAudioLoading] = React.useState(false);

  const selectedPack = voicePacks.find((vp) => vp.value === value);
  const hasOptions = voicePacks.length > 0;

  const triggerText = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selectedPack?.label ?? placeholder);

  const languages =
    voicePacks.find((vp) => vp.value === tempPack)?.languages ?? [];
  const selectedLanguageLabel = languages.find(
    (lang) => lang.value === previewLanguage
  )?.label;

  function resetModalState() {
    setTempPack(null);
    setPreviewLanguage("");
    setSampleExpanded(false);
    setAudioLoading(false);
  }

  function openModal() {
    setTempPack(value ?? null);
    setPreviewLanguage("");
    setSampleExpanded(false);
    setAudioLoading(false);
    setOpen(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetModalState();
  }

  function onVoicePackChange(next: string) {
    setTempPack(next);
    setPreviewLanguage("");
    setSampleExpanded(false);
  }

  function cancel() {
    setOpen(false);
    resetModalState();
  }

  function commit() {
    if (tempPack) onValueChange?.(tempPack);
    setOpen(false);
    resetModalState();
  }

  async function playPreview() {
    if (!tempPack || !previewLanguage) return;
    setAudioLoading(true);
    try {
      if (onPlayPreview) {
        await onPlayPreview(tempPack, previewLanguage);
      } else {
        // Mocked sample: in production, audio streams from the playback service.
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } catch (err) {
      console.error("Error playing voice sample:", err);
    } finally {
      setAudioLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <button
        type="button"
        aria-label={placeholder}
        disabled={disabled || loading || error}
        onClick={openModal}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
          error ? "!border-destructive text-destructive" : "border-border",
          !selectedPack && !loading && !error && "text-muted-foreground",
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span className="truncate">{triggerText}</span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Voice Pack Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {voicePackLabel}
              </label>
              <Select
                value={tempPack ?? undefined}
                onValueChange={onVoicePackChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice pack" />
                </SelectTrigger>
                <SelectContent>
                  {hasOptions ? (
                    voicePacks.map((vp) => (
                      <SelectItem key={vp.value} value={vp.value}>
                        {vp.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {noVoicePacksText}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Voice Sample Preview Section */}
            {tempPack ? (
              <div className="rounded-lg border border-border p-4">
                <button
                  type="button"
                  onClick={() => setSampleExpanded((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                >
                  {sampleExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  {showVoiceSampleLabel}
                </button>

                {sampleExpanded ? (
                  <div className="mt-4 space-y-4">
                    <div className="block text-sm font-normal text-gray-700">
                      {chooseLanguageDescription}
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {languageLabel}
                        </label>
                        <Select
                          value={previewLanguage || undefined}
                          onValueChange={setPreviewLanguage}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={languagePlaceholder} />
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

                      <div className="flex h-10 w-full items-center gap-2">
                        {selectedLanguageLabel ? (
                          <span className="text-sm text-gray-600">
                            {previewLabel}: {selectedLanguageLabel}
                          </span>
                        ) : null}
                        {audioLoading ? (
                          <div
                            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
                            aria-label="Loading voice sample"
                            role="status"
                          />
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={playButtonAriaLabel}
                            disabled={!previewLanguage}
                            onClick={playPreview}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <DialogFooter className="sm:gap-3 sm:space-x-0">
            <Button type="button" variant="outline" onClick={cancel}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={!tempPack || audioLoading}
              onClick={commit}
            >
              {selectLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
