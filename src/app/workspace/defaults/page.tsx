"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, ChevronDown } from "lucide-react";
import { CardHeaderLayout } from "@/components/workspace/card-header-layout";

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

  return (
    <CardHeaderLayout
      title="Session Defaults"
      description="Configure your workspace settings and preferences."
    >
      <div className="space-y-6 relative pb-16">
        {/* Minutes Pool */}
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label htmlFor="minutes-pool" className="font-medium">
              Pool of minutes:
            </Label>
          </div>
          <div className="col-span-2 space-y-1">
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
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label htmlFor="glossary" className="font-medium">
              Glossary:
            </Label>
          </div>
          <div className="col-span-2 space-y-1">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span>{glossary}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </div>
              <Button variant="outline" className="whitespace-nowrap">
                edit glossary
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                share glossary
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A glossary allows you to tweak the transcription/translation for
              your specific context.
            </p>
          </div>
        </div>

        <Separator />

        {/* Save Transcript */}
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Save transcript?*</Label>
          </div>
          <div className="col-span-2">
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
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Require attendee Passcode?*</Label>
          </div>
          <div className="col-span-2">
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
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Voice pack:*</Label>
          </div>
          <div className="col-span-2 space-y-2">
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
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="pt-2">
            <Label className="font-medium">Language selection</Label>
          </div>
          <div className="col-span-2 space-y-4">
            <p className="text-sm text-muted-foreground">
              Any supported languages can be manually selected by speakers
              during the event. These settings enable quick selection. (Add only
              languages that you know will be spoken.)
            </p>

            {/* Input Languages */}
            <div className="space-y-1">
              <Label>Input languages:</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                {inputLanguages.map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-sm"
                  >
                    <span className="mr-1">🌐</span>
                    {lang}
                    <button className="ml-1 text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="text-sm">
                  + Add Language
                </Button>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Languages with the 🌐 icon can be automatically selected by
                  Wordly.
                </p>
                <p>(This takes up to 15 seconds.)</p>
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

        {/* Fixed position Save button at bottom */}
        <div className="absolute bottom-0 right-0 py-4 px-6">
          <Button
            variant="default"
            className="bg-brand-teal hover:bg-brand-teal/90 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </CardHeaderLayout>
  );
}
