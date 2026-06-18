"use client";

/**
 * Session Defaults — faithful port of the Angular portal
 * (wordly_portal: src/app/modules/v2/sessions-default/sessions-default.component).
 *
 * MainContainer (title + description + footer Save) wrapping a single-column
 * stacked form with the same eight controls in the same order:
 *   1. Pool of Minute (account selector)
 *   2. Glossary (glossary selector, "None" option)
 *   3. Save transcript (radio: private / workspace / none)
 *   4. Floor Audio (checkbox)
 *   5. Voice for attendees using text to speech (voice pack selector)
 *   6. Default input language (single-select language)
 *   7. Speaker's language selector (multi-select, max 8)
 *   8. Automatically switch input language? (radio: yes / no)
 *
 * Representative mock data; selectors use the shared shadcn atoms.
 */

import { useState } from "react";
import { Info, Search, X } from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MAX_LANGUAGES = 8;

const ACCOUNT_OPTIONS = [
  "Gardendale City (8ff07) — 3,142 minutes remaining",
  "Main HQ Pool (1a2b3) — 12,400 minutes remaining",
  "Marketing (a91c2) — 880 minutes remaining",
];

const GLOSSARY_OPTIONS = ["None", "Council Meetings", "Legal Terms", "Medical"];

const VOICE_OPTIONS = [
  "Feminine",
  "Masculine",
  "Neural Feminine",
  "Neural Masculine",
];

const availableLanguages = [
  { code: "en-US", name: "English (US)", autoDetect: true },
  { code: "es", name: "Spanish (ES)", autoDetect: true },
  { code: "es-LatAm", name: "Spanish (LatAm)", autoDetect: true },
  { code: "fr", name: "French (FR)", autoDetect: true },
  { code: "de", name: "German", autoDetect: true },
  { code: "it", name: "Italian", autoDetect: true },
  { code: "pt", name: "Portuguese", autoDetect: true },
  { code: "zh-CN", name: "Chinese (Simplified)", autoDetect: true },
  { code: "zh-TW", name: "Chinese (Traditional)", autoDetect: true },
  { code: "ja", name: "Japanese", autoDetect: true },
  { code: "ko", name: "Korean", autoDetect: true },
  { code: "ar", name: "Arabic", autoDetect: true },
  { code: "ru", name: "Russian", autoDetect: true },
  { code: "nl", name: "Dutch — Nederlands", autoDetect: true },
  { code: "pl", name: "Polish", autoDetect: false },
  { code: "tr", name: "Turkish", autoDetect: false },
  { code: "hi", name: "Hindi", autoDetect: false },
  { code: "th", name: "Thai", autoDetect: false },
  { code: "vi", name: "Vietnamese", autoDetect: false },
  { code: "cy", name: "Welsh — Cymraeg", autoDetect: false },
];

/** Label row with the Angular info-icon affordance (native tooltip). */
function FieldLabel({
  label,
  tooltip,
  required,
}: {
  label: string;
  tooltip?: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className="font-medium text-gray-700">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {tooltip ? (
        <span
          title={tooltip}
          className="inline-flex cursor-help text-muted-foreground"
        >
          <Info className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </div>
  );
}

export default function SessionDefaultsPage() {
  const [poolOfMinutes, setPoolOfMinutes] = useState(ACCOUNT_OPTIONS[0]);
  const [glossary, setGlossary] = useState("Council Meetings");
  const [saveTranscriptMode, setSaveTranscriptMode] = useState("private");
  const [floorAudioEnabled, setFloorAudioEnabled] = useState(false);
  const [voicePackId, setVoicePackId] = useState(VOICE_OPTIONS[0]);
  const [defaultLanguageCode, setDefaultLanguageCode] = useState("en-US");
  const [dlsLanguages, setDlsLanguages] = useState<string[]>([
    "Chinese (Simplified)",
    "English (US)",
    "Spanish (LatAm)",
  ]);
  const [dlsEnabled, setDlsEnabled] = useState(true);

  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false);
  const [selectedLanguagesToAdd, setSelectedLanguagesToAdd] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const removeLanguage = (name: string) =>
    setDlsLanguages((prev) => prev.filter((l) => l !== name));

  const addSelectedLanguages = () => {
    const fresh = selectedLanguagesToAdd.filter(
      (l) => !dlsLanguages.includes(l)
    );
    setDlsLanguages((prev) => [...prev, ...fresh]);
    setSelectedLanguagesToAdd([]);
    setIsAddLanguageOpen(false);
  };

  const toggleLanguageSelection = (name: string) =>
    setSelectedLanguagesToAdd((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );

  const availableLanguageOptions = availableLanguages.filter(
    (l) => !dlsLanguages.includes(l.name)
  );
  const filteredLanguageOptions = availableLanguageOptions.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const nonDetectableSelected = dlsLanguages.some(
    (name) =>
      availableLanguages.find((l) => l.name === name)?.autoDetect === false
  );

  return (
    <div className="p-8">
      <MainContainer
        title={
          <h1 className="text-2xl font-bold">
            Workspace Default Settings for New Sessions
          </h1>
        }
        description="The below settings are used as the default when adding new sessions within the workspace"
        footerAlignment="right"
        footer={<Button>save</Button>}
      >
        <div className="flex max-w-2xl flex-col gap-6 px-4">
          {/* 1. Pool of Minute */}
          <div className="space-y-1.5">
            <FieldLabel
              label="Pool of Minute"
              required
              tooltip="Select the account from which to pull minutes for sessions created in this workspace by default."
            />
            <Select value={poolOfMinutes} onValueChange={setPoolOfMinutes}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Glossary */}
          <div className="space-y-1.5">
            <FieldLabel
              label="Glossary"
              required
              tooltip="Select the glossary to be used by default for sessions created in this workspace."
            />
            <Select value={glossary} onValueChange={setGlossary}>
              <SelectTrigger>
                <SelectValue placeholder="Select glossary" />
              </SelectTrigger>
              <SelectContent>
                {GLOSSARY_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Save transcript */}
          <div className="space-y-2">
            <FieldLabel
              label="Save transcript"
              required
              tooltip="Select how transcripts are saved by default for sessions created in this workspace."
            />
            <RadioGroup
              value={saveTranscriptMode}
              onValueChange={setSaveTranscriptMode}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="t-private" />
                <Label htmlFor="t-private">Save private transcript</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="workspace" id="t-workspace" />
                <Label htmlFor="t-workspace">
                  Save transcript to Workspace
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="t-none" />
                <Label htmlFor="t-none">Do not save transcript</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 4. Floor Audio */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="floor-audio"
                checked={floorAudioEnabled}
                onCheckedChange={(c) => setFloorAudioEnabled(c === true)}
              />
              <FieldLabel
                label="Floor Audio"
                required
                tooltip="Select whether floor audio is enabled by default for sessions created in this workspace."
              />
            </div>
          </div>

          {/* 5. Voice for attendees using text to speech */}
          <div className="space-y-1.5">
            <FieldLabel
              label="Voice for attendees using text to speech"
              required
              tooltip="Select the voice pack to be used by default for sessions created in this workspace."
            />
            <Select value={voicePackId} onValueChange={setVoicePackId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice pack" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6. Default input language */}
          <div className="space-y-1.5">
            <FieldLabel
              label="Default input language"
              required
              tooltip="Select the default language to be used for sessions created in this workspace."
            />
            <Select
              value={defaultLanguageCode}
              onValueChange={setDefaultLanguageCode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a default input language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 7. Speaker's language selector */}
          <div className="space-y-2">
            <FieldLabel
              label="Speaker's language selector"
              required
              tooltip="Select the languages that will be available for automatic language selection by default for sessions created in this workspace."
            />
            <div className="flex flex-wrap gap-2 rounded-md border p-3">
              {dlsLanguages.map((lang) => (
                <div
                  key={lang}
                  className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${lang}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <Dialog
                open={isAddLanguageOpen}
                onOpenChange={(open) => {
                  setIsAddLanguageOpen(open);
                  if (open) {
                    setSearchQuery("");
                    setSelectedLanguagesToAdd([]);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm">
                    + Add Language
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden p-0">
                  <div className="p-6 pb-0">
                    <DialogHeader>
                      <DialogTitle>Add Languages</DialogTitle>
                      <DialogDescription>
                        Select languages to add to the speaker&rsquo;s language
                        selector.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <div className="relative mb-3 px-6">
                    <Search className="absolute left-9 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for languages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="mx-6 mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-sm font-medium text-blue-800">
                      Select up to {MAX_LANGUAGES} languages
                      <span className="ml-1 text-blue-600">
                        ({selectedLanguagesToAdd.length} selected)
                      </span>
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-2 pb-4">
                      {filteredLanguageOptions.map((language) => {
                        const isSelected = selectedLanguagesToAdd.includes(
                          language.name
                        );
                        const isDisabled =
                          !isSelected &&
                          selectedLanguagesToAdd.length >= MAX_LANGUAGES;
                        return (
                          <label
                            key={language.code}
                            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                              isSelected
                                ? "border-primary-blue-200 bg-primary-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            } ${isDisabled ? "opacity-50" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() =>
                                !isDisabled &&
                                toggleLanguageSelection(language.name)
                              }
                              className="mr-3 h-4 w-4 rounded border-gray-300"
                            />
                            <span className="flex-1">
                              <span className="font-medium">
                                {language.name}
                              </span>
                              {!language.autoDetect && (
                                <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                  <Info className="h-3 w-3 text-blue-500" />
                                  No auto-selection supported
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}

                      {filteredLanguageOptions.length === 0 && (
                        <div className="py-8 text-center text-gray-400">
                          {searchQuery
                            ? `No languages found matching "${searchQuery}"`
                            : "All available languages have been added"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t bg-white px-6 py-4">
                    <Button
                      onClick={addSelectedLanguages}
                      disabled={selectedLanguagesToAdd.length === 0}
                      className="flex-1"
                    >
                      Add
                      {selectedLanguagesToAdd.length > 0
                        ? ` ${selectedLanguagesToAdd.length} `
                        : " "}
                      Language{selectedLanguagesToAdd.length !== 1 ? "s" : ""}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddLanguageOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-muted-foreground">
              Any supported languages can be manually selected by speakers
              during the event. These settings enable quick selection. Add only
              languages that you know will be spoken.
            </p>
            {nonDetectableSelected && (
              <p className="text-xs text-muted-foreground">
                One or more languages does not support auto-selection.
                (Automatic language selection will be disabled.)
              </p>
            )}
          </div>

          {/* 8. Automatically switch input language? */}
          <div className="space-y-2">
            <FieldLabel
              label="Automatically switch input language?"
              required
              tooltip="Enable this option to automatically switch the input language based on the speaker's language."
            />
            <RadioGroup
              value={dlsEnabled ? "yes" : "no"}
              onValueChange={(v) => setDlsEnabled(v === "yes")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="dls-yes" />
                <Label htmlFor="dls-yes">
                  Yes, auto-select languages from the above list
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="dls-no" />
                <Label htmlFor="dls-no">No, only select manually</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
