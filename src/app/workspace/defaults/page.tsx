"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, ChevronDown, Search, Info } from "lucide-react";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Comprehensive language data
const availableLanguages = [
  {
    code: "en-US",
    name: "English (US)",
    autoDetect: true,
    category: "popular",
  },
  { code: "es", name: "Spanish (ES)", autoDetect: true, category: "popular" },
  {
    code: "es-LatAm",
    name: "Spanish (LatAm)",
    autoDetect: true,
    category: "popular",
  },
  { code: "fr", name: "French (FR)", autoDetect: true, category: "popular" },
  { code: "de", name: "German", autoDetect: true, category: "popular" },
  { code: "it", name: "Italian", autoDetect: true, category: "popular" },
  { code: "pt", name: "Portuguese", autoDetect: true, category: "popular" },
  {
    code: "zh-CN",
    name: "Chinese (Simplified)",
    autoDetect: true,
    category: "popular",
  },
  {
    code: "zh-TW",
    name: "Chinese (Traditional)",
    autoDetect: true,
    category: "asian",
  },
  { code: "ja", name: "Japanese", autoDetect: true, category: "asian" },
  { code: "ko", name: "Korean", autoDetect: true, category: "asian" },
  { code: "ar", name: "Arabic", autoDetect: true, category: "middle-east" },
  { code: "ru", name: "Russian", autoDetect: true, category: "european" },
  {
    code: "nl",
    name: "Dutch — Nederlands",
    autoDetect: true,
    category: "european",
  },
  { code: "af", name: "Afrikaans", autoDetect: false, category: "african" },
  { code: "sq", name: "Albanian", autoDetect: false, category: "european" },
  { code: "hy", name: "Armenian", autoDetect: false, category: "middle-east" },
  { code: "bn", name: "Bengali", autoDetect: false, category: "asian" },
  { code: "bg", name: "Bulgarian", autoDetect: false, category: "european" },
  { code: "ca", name: "Catalan", autoDetect: false, category: "european" },
  { code: "hr", name: "Croatian", autoDetect: false, category: "european" },
  { code: "cs", name: "Czech", autoDetect: false, category: "european" },
  { code: "da", name: "Danish", autoDetect: false, category: "european" },
  { code: "et", name: "Estonian", autoDetect: false, category: "european" },
  { code: "fi", name: "Finnish", autoDetect: false, category: "european" },
  { code: "gl", name: "Galician", autoDetect: false, category: "european" },
  { code: "ka", name: "Georgian", autoDetect: false, category: "middle-east" },
  { code: "el", name: "Greek", autoDetect: false, category: "european" },
  { code: "gu", name: "Gujarati", autoDetect: false, category: "asian" },
  { code: "he", name: "Hebrew", autoDetect: false, category: "middle-east" },
  { code: "hi", name: "Hindi", autoDetect: false, category: "asian" },
  { code: "hu", name: "Hungarian", autoDetect: false, category: "european" },
  { code: "is", name: "Icelandic", autoDetect: false, category: "european" },
  { code: "id", name: "Indonesian", autoDetect: false, category: "asian" },
  { code: "ga", name: "Irish", autoDetect: false, category: "european" },
  { code: "lv", name: "Latvian", autoDetect: false, category: "european" },
  { code: "lt", name: "Lithuanian", autoDetect: false, category: "european" },
  { code: "mk", name: "Macedonian", autoDetect: false, category: "european" },
  { code: "ms", name: "Malay", autoDetect: false, category: "asian" },
  { code: "mt", name: "Maltese", autoDetect: false, category: "european" },
  { code: "mr", name: "Marathi", autoDetect: false, category: "asian" },
  { code: "no", name: "Norwegian", autoDetect: false, category: "european" },
  { code: "fa", name: "Persian", autoDetect: false, category: "middle-east" },
  { code: "pl", name: "Polish", autoDetect: false, category: "european" },
  { code: "ro", name: "Romanian", autoDetect: false, category: "european" },
  { code: "sr", name: "Serbian", autoDetect: false, category: "european" },
  { code: "sk", name: "Slovak", autoDetect: false, category: "european" },
  { code: "sl", name: "Slovenian", autoDetect: false, category: "european" },
  { code: "sv", name: "Swedish", autoDetect: false, category: "european" },
  { code: "ta", name: "Tamil", autoDetect: false, category: "asian" },
  { code: "te", name: "Telugu", autoDetect: false, category: "asian" },
  { code: "th", name: "Thai", autoDetect: false, category: "asian" },
  { code: "tr", name: "Turkish", autoDetect: false, category: "middle-east" },
  { code: "uk", name: "Ukrainian", autoDetect: false, category: "european" },
  { code: "ur", name: "Urdu", autoDetect: false, category: "asian" },
  { code: "vi", name: "Vietnamese", autoDetect: false, category: "asian" },
  {
    code: "cy",
    name: "Welsh — Cymraeg",
    autoDetect: false,
    category: "european",
  },
];

const categoryLabels = {
  popular: "Popular Languages",
  asian: "Asian Languages",
  european: "European Languages",
  "middle-east": "Middle East & Africa",
  african: "African Languages",
};

export default function SessionDefaultsPage() {
  const [minutesPool, setMinutesPool] = useState(
    "Gardendale City (8ff07) - 3142 minutes remaining"
  );
  const [glossary, setGlossary] = useState("Council Meetings");
  const [saveTranscript, setSaveTranscript] = useState("private");
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [voicePack, setVoicePack] = useState("feminine");
  const [autoSelectLanguages, setAutoSelectLanguages] = useState(true);
  const [inputLanguages, setInputLanguages] = useState([
    "Chinese (Simplified)",
    "English (US)",
    "Spanish (LatAm)",
  ]);
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false);
  const [selectedLanguagesToAdd, setSelectedLanguagesToAdd] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper functions
  const removeInputLanguage = (languageToRemove: string) => {
    setInputLanguages((prev) =>
      prev.filter((lang) => lang !== languageToRemove)
    );
  };

  const addSelectedLanguages = () => {
    try {
      console.log("Adding languages:", selectedLanguagesToAdd);
      console.log("Current input languages:", inputLanguages);

      if (selectedLanguagesToAdd.length > 0) {
        const newLanguages = selectedLanguagesToAdd.filter(
          (lang) => !inputLanguages.includes(lang)
        );

        console.log("New languages to add:", newLanguages);

        setInputLanguages((prev) => {
          const updated = [...prev, ...newLanguages];
          console.log("Updated input languages:", updated);
          return updated;
        });

        setSelectedLanguagesToAdd([]);
        setIsAddLanguageOpen(false);
      }
    } catch (error) {
      console.error("Error adding languages:", error);
    }
  };

  const toggleLanguageSelection = (languageName: string) => {
    try {
      console.log("Toggling language:", languageName);
      setSelectedLanguagesToAdd((prev) => {
        const newSelection = prev.includes(languageName)
          ? prev.filter((lang) => lang !== languageName)
          : [...prev, languageName];
        console.log("New selection:", newSelection);
        return newSelection;
      });
    } catch (error) {
      console.error("Error toggling language selection:", error);
    }
  };

  // Get available languages for the dropdown (not already selected)
  const availableLanguageOptions = availableLanguages.filter(
    (lang) => !inputLanguages.includes(lang.name)
  );

  // Filter languages based on search query
  const filteredLanguageOptions = availableLanguageOptions.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Language selection limit
  const MAX_LANGUAGES = 8;

  return (
    <CardHeaderLayout
      title="Session Defaults"
      description="Configure your workspace settings and preferences."
    >
      <div className="space-y-6 relative">
        {/* Minutes Pool */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label htmlFor="minutes-pool" className="font-medium">
              Pool of minutes:
            </Label>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-1">
            <div className="relative">
              <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <span>{minutesPool}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This field is the minutes used by this session should be billed
              to.
            </p>
          </div>
        </div>

        <Separator />

        {/* Glossary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label htmlFor="glossary" className="font-medium">
              Glossary:
            </Label>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 sm:gap-0">
              <div className="relative flex-1 w-full">
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span>{glossary}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" className="whitespace-nowrap">
                  edit glossary
                </Button>
                <Button variant="outline" className="whitespace-nowrap">
                  share glossary
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              A glossary allows you to tweak the transcription/translation for
              your specific context.
            </p>
          </div>
        </div>

        <Separator />

        {/* Save Transcript */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Save transcript?*</Label>
          </div>
          <div className="col-span-1 md:col-span-2">
            <RadioGroup
              defaultValue={saveTranscript}
              onValueChange={(value) => setSaveTranscript(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Save private transcript</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="workspace" id="workspace" />
                <Label htmlFor="workspace">Save transcript to Workspace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-save" id="no-save" />
                <Label htmlFor="no-save">Do not save transcript</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        {/* Require Attendee Passcode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Require attendee Passcode?*</Label>
          </div>
          <div className="col-span-1 md:col-span-2">
            <RadioGroup
              defaultValue={requirePasscode ? "yes" : "no"}
              onValueChange={(value) => setRequirePasscode(value === "yes")}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-passcode" />
                <Label htmlFor="yes-passcode">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-passcode" />
                <Label htmlFor="no-passcode">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        {/* Voice Pack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Voice pack:*</Label>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <RadioGroup
              defaultValue={voicePack}
              onValueChange={(value) => setVoicePack(value)}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feminine" id="feminine" />
                <Label htmlFor="feminine">Feminine Voice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masculine" id="masculine" />
                <Label htmlFor="masculine">Masculine Voice</Label>
              </div>
            </RadioGroup>
            <Button variant="link" className="p-0 h-auto text-sm">
              play sample voice
            </Button>
          </div>
        </div>

        <Separator />

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Language selection</Label>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-4">
            <p className="text-sm text-muted-foreground">
              Any supported languages can be manually selected by speakers
              during the event. These settings enable quick selection. (Add only
              languages that you know will be spoken.)
            </p>

            {/* Input Languages */}
            <div className="space-y-1">
              <Label>Input languages:</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                {inputLanguages.map((lang) => {
                  const languageData = availableLanguages.find(
                    (l) => l.name === lang
                  );
                  const hasAutoDetect = languageData?.autoDetect;

                  return (
                    <div
                      key={lang}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-sm"
                    >
                      {lang}
                      <button
                        onClick={() => removeInputLanguage(lang)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

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
                  <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col p-0">
                    <div className="p-6 pb-0">
                      <DialogHeader>
                        <DialogTitle>Add Languages</DialogTitle>
                        <DialogDescription>
                          Select multiple languages to add to your input
                          languages.
                          {selectedLanguagesToAdd.length > 0 && (
                            <span className="font-medium text-primary-teal-600 ml-1">
                              ({selectedLanguagesToAdd.length} selected)
                            </span>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-3 px-6">
                      <Search className="absolute left-9 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for languages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Language Counter */}
                    <div className="mb-3 mx-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Select up to {MAX_LANGUAGES} languages
                        <span className="text-blue-600 ml-1">
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
                            <div
                              key={language.code}
                              className={`flex items-center p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? "bg-primary-teal-50 border-primary-teal-200"
                                  : "border-gray-200 hover:bg-gray-50"
                              } ${isDisabled ? "opacity-50" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (!isDisabled) {
                                    toggleLanguageSelection(language.name);
                                  }
                                }}
                                disabled={isDisabled}
                                className="mr-3 h-4 w-4 text-primary-teal-600 focus:ring-primary-teal-500 border-gray-300 rounded cursor-pointer"
                              />
                              <div
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => {
                                  if (!isDisabled) {
                                    toggleLanguageSelection(language.name);
                                  }
                                }}
                              >
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {language.name}
                                  </span>
                                  {!language.autoDetect && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                      <Info className="h-3 w-3 text-blue-500" />
                                      No auto-selection supported
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {filteredLanguageOptions.length === 0 &&
                          searchQuery && (
                            <div className="text-center py-8 text-gray-400">
                              No languages found matching "{searchQuery}"
                            </div>
                          )}

                        {availableLanguageOptions.length === 0 &&
                          !searchQuery && (
                            <div className="text-center py-8 text-gray-400">
                              All available languages have been added
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-2 px-6 py-4 border-t bg-white">
                      <Button
                        onClick={addSelectedLanguages}
                        disabled={selectedLanguagesToAdd.length === 0}
                        className="flex-1"
                      >
                        Add{" "}
                        {selectedLanguagesToAdd.length > 0
                          ? `${selectedLanguagesToAdd.length} `
                          : ""}
                        Language{selectedLanguagesToAdd.length !== 1 ? "s" : ""}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedLanguagesToAdd([]);
                          setSearchQuery("");
                          setIsAddLanguageOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Languages with an info icon do not support auto-detection and
                  require manual selection.
                </p>
                <p>(Auto-detection takes up to 15 seconds.)</p>
              </div>
            </div>

            {/* Auto-select Languages */}
            <div className="space-y-1">
              <Label>Automatically switch input language?*</Label>
              <RadioGroup
                defaultValue={autoSelectLanguages ? "yes" : "no"}
                onValueChange={(value) =>
                  setAutoSelectLanguages(value === "yes")
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes-auto" />
                  <Label htmlFor="yes-auto">
                    Yes, auto-select languages from the above list
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-auto" />
                  <Label htmlFor="no-auto">No, only select manually</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-6 border-t">
          <div className="flex justify-end">
            <Button
              variant="default"
              className="bg-brand-teal hover:bg-brand-teal/90 text-white px-6"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </CardHeaderLayout>
  );
}
