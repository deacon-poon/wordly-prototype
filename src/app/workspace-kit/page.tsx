"use client";

/**
 * Workspace Kit — showcase for the portal "workspace/business" components
 * migrated from Angular to React (shadcn). One place for the team to see and
 * iterate on all of them. Storybook (Workspace Kit/*) is the interactive home;
 * this page is the in-app gallery.
 */

import * as React from "react";

import { WorkspaceSelector } from "@/components/workspace/workspace-selector";
import { AccountSelector } from "@/components/workspace/account-selector";
import { LocaleSelector } from "@/components/workspace/locale-selector";
import { VoiceSelector } from "@/components/workspace/voice-selector";
import { GlossarySelector } from "@/components/workspace/glossary-selector";
import { TranscriptSelector } from "@/components/workspace/transcript-selector";
import { TimezoneSelector } from "@/components/workspace/timezone-selector";
import { RoomSelector } from "@/components/workspace/room-selector";
import { LanguageSelector } from "@/components/workspace/language-selector";
import { UserSelectorDialog } from "@/components/workspace/user-selector-dialog";
import { WorkspaceManager } from "@/components/workspace/workspace-manager";
import { CustomFields } from "@/components/workspace/custom-fields";
import { WorkspaceFilter } from "@/components/workspace/filter";
import { ApiKey } from "@/components/workspace/api-key";

function Demo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>
      <div className="max-w-md">{children}</div>
    </section>
  );
}

/** Shared controlled wrapper for the homogeneous string-value selectors. */
function ControlledSelect({
  Component,
}: {
  Component: React.ComponentType<{
    value?: string;
    onValueChange?: (v: string) => void;
    searchable?: boolean;
  }>;
}) {
  const [value, setValue] = React.useState("");
  return <Component value={value} onValueChange={setValue} searchable />;
}

export default function WorkspaceKitPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Workspace Kit</h1>
        <p className="text-gray-500">
          14 portal business components migrated from Angular to React (shadcn).
          Browse them interactively in Storybook under{" "}
          <code className="rounded bg-gray-100 px-1">Workspace Kit/*</code>.
        </p>
      </header>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Selectors</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Demo title="WorkspaceSelector">
            <ControlledSelect Component={WorkspaceSelector} />
          </Demo>
          <Demo title="AccountSelector">
            <ControlledSelect Component={AccountSelector} />
          </Demo>
          <Demo title="LocaleSelector">
            <ControlledSelect Component={LocaleSelector} />
          </Demo>
          <Demo title="VoiceSelector">
            <ControlledSelect Component={VoiceSelector} />
          </Demo>
          <Demo title="GlossarySelector">
            <ControlledSelect Component={GlossarySelector} />
          </Demo>
          <Demo title="TranscriptSelector">
            <ControlledSelect Component={TranscriptSelector} />
          </Demo>
          <Demo title="TimezoneSelector">
            <ControlledSelect Component={TimezoneSelector} />
          </Demo>
          <Demo title="RoomSelector">
            <ControlledSelect Component={RoomSelector} />
          </Demo>
          <Demo title="LanguageSelector">
            <LanguageSelector />
          </Demo>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Dialogs & managers
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Demo title="UserSelectorDialog">
            <UserSelectorDialog />
          </Demo>
          <Demo title="WorkspaceFilter">
            <WorkspaceFilter />
          </Demo>
          <Demo title="CustomFields">
            <CustomFields />
          </Demo>
          <Demo title="ApiKey">
            <ApiKey />
          </Demo>
        </div>
        <div className="mt-4">
          <Demo title="WorkspaceManager">
            <WorkspaceManager />
          </Demo>
        </div>
      </div>
    </main>
  );
}
