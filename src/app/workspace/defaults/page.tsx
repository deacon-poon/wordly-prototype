"use client";

/**
 * Session Defaults — 1:1 port of the deployed Angular screen.
 *
 *   wordly_portal@origin/main:
 *     src/app/modules/v2/sessions-default/sessions-default.component.html / .ts
 *
 * Canonical route: /workspace/defaults (consolidated from the former
 * /wssessions-default duplicate). MainContainer (title/description/content/
 * footer) wrapping the workspace session-defaults form: Pool of Minutes
 * (AccountSelector), Glossary (GlossarySelector), Save transcript (radio),
 * Floor Audio (checkbox), Voice (VoiceSelector), Default input language +
 * Speaker's languages (LanguageSelector), and Auto-switch input language
 * (radio); footer Save button.
 *
 * Angular DI (WorkspaceState/Api services, i18next, form builder, role/feature
 * services) is dropped: fields are local mock state and the ported selectors
 * carry their own FormControlWrapper. Labels are the deployed English fallbacks.
 */

import * as React from "react";
import { toast } from "sonner";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AccountSelector } from "@/components/workspace/account-selector";
import { GlossarySelector } from "@/components/workspace/glossary-selector";
import { VoiceSelector } from "@/components/workspace/voice-selector";
import { LanguageSelector } from "@/components/workspace/language-selector";

const SAVE_TRANSCRIPT_OPTIONS = [
  { value: "none", label: "Don’t save" },
  { value: "private", label: "Save for presenter" },
  { value: "workspace", label: "Save for workspace" },
];

const DLS_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

/** FormControlWrapper-wrapped radio group (Angular app-wordly-radio-group). */
function RadioField({
  label,
  infoTooltipText,
  options,
  value,
  onValueChange,
}: {
  label: string;
  infoTooltipText: string;
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <FormControlWrapper
      label={label}
      required
      showInfoIcon
      infoTooltipText={infoTooltipText}
      showError={false}
    >
      <RadioGroup value={value} onValueChange={onValueChange} className="gap-2">
        {options.map((o) => (
          <div key={o.value} className="flex items-center gap-2">
            <RadioGroupItem value={o.value} id={`${label}-${o.value}`} />
            <Label htmlFor={`${label}-${o.value}`} className="font-normal">
              {o.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormControlWrapper>
  );
}

export default function SessionsDefaultPage() {
  const [poolOfMinutes, setPoolOfMinutes] = React.useState("");
  const [glossaryId, setGlossaryId] = React.useState("");
  const [voicePackId, setVoicePackId] = React.useState("");
  const [saveTranscriptMode, setSaveTranscriptMode] = React.useState("none");
  const [floorAudioEnabled, setFloorAudioEnabled] = React.useState(false);
  const [dlsEnabled, setDlsEnabled] = React.useState("false");

  return (
    <div className="p-8">
      <MainContainer
        title={
          <span className="font-bold">
            Workspace Default Settings for New Sessions
          </span>
        }
        description="The below settings are used as the default when adding new sessions within the workspace"
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button onClick={() => toast.success("Session defaults saved.")}>
              Save
            </Button>
          </div>
        }
      >
        <div className="pl-4 pr-4">
          <div className="flex flex-col gap-6 wordly-form-group">
            <AccountSelector
              value={poolOfMinutes}
              onValueChange={setPoolOfMinutes}
              label="Pool of Minute"
              placeholder="Select account"
              required
              showInfoIcon
              infoTooltipText="Select the account from which to pull minutes for sessions created in this workspace by default."
            />

            <GlossarySelector
              value={glossaryId}
              onValueChange={setGlossaryId}
              label="Glossary"
              placeholder="Select glossary"
              required
              showInfoIcon
              infoTooltipText="Select the glossary to be used by default for sessions created in this workspace."
            />

            <RadioField
              label="Save transcript"
              infoTooltipText="Select how transcripts are saved by default for sessions created in this workspace."
              options={SAVE_TRANSCRIPT_OPTIONS}
              value={saveTranscriptMode}
              onValueChange={setSaveTranscriptMode}
            />

            <FormControlWrapper
              label="Floor Audio"
              required
              showInfoIcon
              infoTooltipText="Select whether floor audio is enabled by default for sessions created in this workspace."
              showError={false}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id="floorAudio"
                  checked={floorAudioEnabled}
                  onCheckedChange={(c) => setFloorAudioEnabled(c === true)}
                />
                <Label htmlFor="floorAudio" className="font-normal">
                  Enable floor audio
                </Label>
              </div>
            </FormControlWrapper>

            <VoiceSelector
              value={voicePackId}
              onValueChange={setVoicePackId}
              label="Voice for attendees using text to speech"
              placeholder="Select a voice pack"
              required
              showInfoIcon
              infoTooltipText="Select the voice pack to be used by default for sessions created in this workspace."
            />

            <LanguageSelector
              singleSelection
              label="Default input language"
              placeholder="Select a default input language"
              required
              showInfoIcon
              infoTooltipText="Select the default language to be used for sessions created in this workspace."
            />

            <LanguageSelector
              searchable
              label="Speaker’s language selector"
              placeholder="Select languages"
              required
              showInfoIcon
              infoTooltipText="Select the languages that will be available for automatic language selection by default for sessions created in this workspace."
              helperText="Any supported languages can be manually selected by speakers during the event. These settings enable quick selection. Add only languages that you know will be spoken."
            />

            <RadioField
              label="Automatically switch input language?"
              infoTooltipText="Enable this option to automatically switch the input language based on the speaker’s language."
              options={DLS_OPTIONS}
              value={dlsEnabled}
              onValueChange={setDlsEnabled}
            />
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
