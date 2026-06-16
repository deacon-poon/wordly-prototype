"use client";

/**
 * VoiceSelector
 *
 * EXACT React mirror of the production Angular `wordly-voice-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-voice-selector/
 *       wordly-voice-selector.component.{ts,html}
 *
 * Unlike the pure-proxy selectors (account/transcript), the Angular original is
 * a form control whose `<ng-content>` is a *custom trigger button* (not a
 * wordly-select) that opens a modal dialog. So the React port keeps the same
 * anatomy 1:1:
 *
 *   Angular:  voice-selector
 *               → wordly-form-control-wrapper { custom trigger button }   (label/grid/error)
 *               + wordly-dialog { wordly-select (voice pack) + sample preview + footer }
 *   React:    VoiceSelector
 *               → FormControlWrapper { custom trigger button }
 *               + Dialog { Select (voice pack) + sample preview + footer }
 *
 * The trigger button's classes are ported VERBATIM from the Angular template
 * (`flex items-center justify-between w-full px-3 py-2 text-left bg-white border
 * rounded-md shadow-sm ... hover:border-gray-400 transition-colors`, with
 * `!border-destructive` on error / `border-border` otherwise, chevron
 * `w-5 h-5 text-gray-400`). The default LAYOUT is the responsive
 * label-beside-control grid (design variant "default"), matching the portal.
 *
 * The Angular DI/service layer (bridge service, translation service, audio
 * playback) is dropped: voice packs + per-pack languages arrive via props
 * (mock default), and "play" is a mocked async delay. The modal flow
 * (pick pack → expand sample player → choose language → play → Cancel/Select)
 * and all computed labels are preserved 1:1.
 */

import * as React from "react";
import { ChevronDown, ChevronRight, Play } from "lucide-react";

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
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

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
  /** Languages this pack can preview; mirrors VoicePack.data.voices in Angular. */
  languages?: LanguageOption[];
}

export type VoiceSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the cloud-TTS voice-pack API via the
// bridge service. Mirrors the dataset used by the portal Overview story.
// ---------------------------------------------------------------------------

export const MOCK_VOICE_PACKS: VoicePackOption[] = [
  {
    label: "Masculine Voice",
    value: "1",
    languages: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
    ],
  },
  {
    label: "Feminine Voice",
    value: "2",
    languages: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface VoiceSelectorProps {
  /** Controlled selected voice-pack value (empty string when none). */
  value?: string;
  /** Fired when a voice pack is committed via the Select button (Angular valueChange/valueChanged). */
  onValueChange?: (value: string) => void;
  /** Available voice packs (each with its preview languages). */
  voicePacks?: VoicePackOption[];

  /** Mocked preview playback; resolves when the (fake) sample finishes. */
  onPlayPreview?: (
    voicePackValue: string,
    languageValue: string
  ) => Promise<void>;

  placeholder?: string;
  /** CSS class(es) applied to the trigger button (portal `triggerClass`). */
  triggerClass?: string;

  // ===== Dialog copy (mirror the Angular computed* getters) =====
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
  /** Read-only: blocks opening the modal (portal `readonly`). */
  readonly?: boolean;
  /** Error/invalid state (portal `displayError`). */
  error?: boolean;
  /** Error text shown below the control when `error` is set (portal errorMessage). */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;
  /** Place helper text above the control (stacked layout only). */
  helperTextOnTop?: boolean;

  label?: string;
  required?: boolean;
  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

  noVoicePacksText?: string;

  /** Fired when the trigger loses focus (Angular `onBlur`). */
  onBlur?: () => void;
  /** Fired when the trigger gains focus (Angular `onFocus`). */
  onFocus?: () => void;

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  /** Container layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

  className?: string;
}

export function VoiceSelector({
  value,
  onValueChange,
  voicePacks = MOCK_VOICE_PACKS,
  onPlayPreview,
  placeholder = "Select a voice",
  triggerClass = "",
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
  readonly = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  label,
  required = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  noVoicePacksText = "No voice packs available",
  onBlur,
  onFocus,
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: VoiceSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tempPack, setTempPack] = React.useState<string | null>(null);
  const [previewLanguage, setPreviewLanguage] = React.useState<string>("");
  const [sampleExpanded, setSampleExpanded] = React.useState(false);
  const [audioLoading, setAudioLoading] = React.useState(false);

  const showError = error;
  const hasOptions = voicePacks.length > 0;

  // selectedVoicePackName: label of the selected pack OR the placeholder.
  const selectedVoicePackName =
    voicePacks.find((vp) => vp.value === value)?.label ?? placeholder;

  // availableLanguages for the temp-selected pack (loadLanguagesForVoicePack).
  const availableLanguages =
    voicePacks.find((vp) => vp.value === tempPack)?.languages ?? [];
  const selectedLanguageLabel = availableLanguages.find(
    (lang) => lang.value === previewLanguage
  )?.label;

  function resetModalState() {
    setTempPack(null);
    setPreviewLanguage("");
    setSampleExpanded(false);
    setAudioLoading(false);
  }

  // openModal(): mirrors Angular — initialize temp selection with current value.
  function openModal() {
    if (disabled || readonly) return;
    setTempPack(value || null);
    setPreviewLanguage("");
    setSampleExpanded(false);
    setAudioLoading(false);
    setOpen(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetModalState(); // onModalClosed()
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

  function select() {
    if (tempPack) onValueChange?.(tempPack);
    setOpen(false);
    resetModalState();
  }

  function toggleVoiceSample() {
    setSampleExpanded((v) => !v);
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
    <>
      <FormControlWrapper
        label={label}
        required={required}
        helperText={!error ? helperText : undefined}
        helperTextOnTop={helperTextOnTop}
        showError={showError}
        currentErrorMessage={errorMessage}
        extraInfo={extraInfo}
        showInfoIcon={showInfoIcon}
        infoTooltipText={infoTooltipText}
        layoutVariant={layoutVariant}
        labelStyleVariant={labelStyleVariant}
        labelSizeVariant={labelSizeVariant}
        labelContextVariant={labelContextVariant}
        spacingVariant={spacingVariant}
        contentContextVariant={contentContextVariant}
        className={className}
      >
        {/* Voice Selector Trigger — classes ported verbatim from the Angular template */}
        <button
          type="button"
          disabled={disabled || readonly}
          aria-label={placeholder}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          onClick={openModal}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-400 transition-colors",
            showError ? "!border-destructive" : "border-border",
            triggerClass
          )}
        >
          <span className="truncate">{selectedVoicePackName}</span>
          {/* Chevron Down Icon (Angular ng-icon lucideChevronDown w-5 h-5 text-gray-400) */}
          <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </button>
      </FormControlWrapper>

      {/* Voice Selector Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Voice Pack Selector */}
            <div>
              <FormControlWrapper
                label={voicePackLabel}
                layoutVariant="stacked"
              >
                <Select
                  value={tempPack ?? undefined}
                  onValueChange={onVoicePackChange}
                >
                  <SelectTrigger className="w-full">
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
              </FormControlWrapper>
            </div>

            {/* Voice Sample Preview Section */}
            {tempPack ? (
              <div className="border border-border rounded-lg p-4">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={toggleVoiceSample}
                >
                  {sampleExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 transition-transform" />
                  )}
                  {showVoiceSampleLabel}
                </button>

                {sampleExpanded ? (
                  <div className="mt-4 space-y-4">
                    {/* Language Selector */}
                    <div>
                      <div className="block text-sm font-normal text-gray-700 mb-2">
                        {chooseLanguageDescription}
                      </div>
                      <div className="flex items-end gap-4">
                        <FormControlWrapper
                          label={languageLabel}
                          layoutVariant="stacked"
                        >
                          <Select
                            value={previewLanguage || undefined}
                            onValueChange={setPreviewLanguage}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={languagePlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLanguages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControlWrapper>

                        {/* Play Button */}
                        <div className="flex items-center gap-2 h-8 w-full">
                          {previewLanguage && selectedLanguageLabel ? (
                            <span className="text-sm text-gray-600">
                              {previewLabel}: {selectedLanguageLabel}
                            </span>
                          ) : null}

                          {!audioLoading ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              aria-label={playButtonAriaLabel}
                              disabled={!previewLanguage || audioLoading}
                              onClick={playPreview}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="h-4 w-4">
                              <div
                                className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"
                                aria-label="Loading voice sample"
                                role="status"
                              />
                            </div>
                          )}
                        </div>
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
              onClick={select}
            >
              {selectLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
