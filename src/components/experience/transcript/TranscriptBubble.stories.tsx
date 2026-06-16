import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TranscriptBubble } from "./TranscriptBubble";
import { TranscriptText } from "./TranscriptText";

/**
 * Mirrors the lib stories `App/Meeting/Transcript/TranscriptBubble/Component`
 * (LTRText, RTLText, NewSpeakerLTR, NewSpeakerRTL, WithBorder, WithHoverEffect,
 * AllCombinations), kept under our `Experience/Transcript` namespace.
 *
 * The lib stories pass `WordlyColors.lightGrayish` (the default neutral fill,
 * mapped to our `bg-gray-100` token by leaving `color` unset) and
 * `WordlyColors.wordlyBlue` (the teal "your speech" fill). Per the lab no-raw-hex
 * guardrail and "keep Brand Blue primary", the blue bubble uses our Brand Blue
 * primary token via className instead of a raw hex `color`.
 */
const meta: Meta<typeof TranscriptBubble> = {
  title: "Experience/Transcript/TranscriptBubble",
  component: TranscriptBubble,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    color: { control: "color" },
    borderColor: { control: "color" },
    showBorder: { control: "boolean" },
    showHoverEffect: { control: "boolean" },
    isNewSpeaker: {
      control: "boolean",
      description: "If true, renders a new speaker indicator above the bubble",
    },
    rtl: {
      control: "boolean",
      description: "Indicates if the language is right-to-left",
    },
    alignRight: {
      control: "boolean",
      description: "Aligns the bubble to the right side",
    },
    children: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof TranscriptBubble>;

const DefaultText = <TranscriptText>Lorem ipsum</TranscriptText>;
const RtlText = <TranscriptText rtl>هذا نص نموذجي</TranscriptText>;

export const LTRText: Story = {
  args: {
    children: DefaultText,
    isNewSpeaker: false,
    rtl: false,
    alignRight: false,
  },
};

export const RTLText: Story = {
  args: {
    children: RtlText,
    alignRight: true,
    rtl: true,
    isNewSpeaker: false,
  },
};

export const NewSpeakerLTR: Story = {
  args: {
    children: DefaultText,
    isNewSpeaker: true,
    rtl: false,
    alignRight: false,
  },
};

export const NewSpeakerRTL: Story = {
  args: {
    children: RtlText,
    alignRight: true,
    rtl: true,
    isNewSpeaker: true,
  },
};

export const WithBorder: Story = {
  args: {
    children: DefaultText,
    showBorder: true,
    isNewSpeaker: false,
  },
};

export const WithHoverEffect: Story = {
  args: {
    children: DefaultText,
    showHoverEffect: true,
    isNewSpeaker: false,
  },
};

/**
 * Demo showing all combinations of alignRight and rtl with new-speaker
 * indicators (mirrors the lib `AllCombinations` story). "Your speech" bubbles
 * use the Brand Blue primary token in place of the lib's teal `wordlyBlue`.
 */
export const AllCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold">LTR Language (rtl=false)</h3>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs text-gray-500">
              Another presenter (alignRight=false, gray):
            </p>
            <TranscriptBubble alignRight={false} rtl={false} isNewSpeaker>
              {DefaultText}
            </TranscriptBubble>
            <TranscriptBubble alignRight={false} rtl={false} isNewSpeaker>
              {DefaultText}
            </TranscriptBubble>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              Your speech (alignRight=true, Brand Blue):
            </p>
            <TranscriptBubble
              alignRight
              rtl={false}
              isNewSpeaker
              className="bg-primary text-primary-foreground"
            >
              <TranscriptText className="text-primary-foreground">
                Lorem ipsum
              </TranscriptText>
            </TranscriptBubble>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">RTL Language (rtl=true)</h3>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs text-gray-500">
              Another presenter (alignRight=false, gray):
            </p>
            <TranscriptBubble alignRight={false} rtl isNewSpeaker>
              {RtlText}
            </TranscriptBubble>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              Your speech (alignRight=true, Brand Blue):
            </p>
            <TranscriptBubble
              alignRight
              rtl
              isNewSpeaker
              className="bg-primary text-primary-foreground"
            >
              <TranscriptText rtl className="text-primary-foreground">
                هذا نص نموذجي
              </TranscriptText>
            </TranscriptBubble>
          </div>
        </div>
      </div>
    </div>
  ),
};
