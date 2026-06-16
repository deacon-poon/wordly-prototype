import type { Meta, StoryObj } from "@storybook/react";

import { FileUploader } from "./file-uploader";

/**
 * 1:1 mirror of the portal Overview.stories
 * (wordly_portal: stories/core/wordly-file-uploader/story-1.Overview.stories.ts).
 *
 * File uploader component with drag-and-drop and click-to-browse support.
 * Displays a dropzone when no file is selected and the file name with a remove
 * button when a file is present. Uses two-way model binding for the selected
 * file (here: the `file` + `onFileChange` props).
 */
const meta: Meta<typeof FileUploader> = {
  title: "Design System/Molecules/FileUploader",
  component: FileUploader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "File uploader component with drag-and-drop and click-to-browse support. " +
          "Displays a dropzone when no file is selected and the file name with a remove button when a file is present. " +
          "Uses two-way model binding for the selected file.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description: "Accepted file types (HTML accept attribute)",
    },
    dropzoneText: {
      control: "text",
      description:
        "Override the dropzone instruction text (translated by default)",
    },
    fileTypesText: {
      control: "text",
      description: "Override the file types hint text (translated by default)",
    },
    removeFileLabel: {
      control: "text",
      description:
        "Override the remove button aria-label (translated by default)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Overview: Story = {
  name: "Overview",
  args: {
    accept: ".csv,.xlsx,.xls",
  },
};

export const CustomAccept: Story = {
  name: "Images Only",
  args: {
    accept: ".png,.jpg,.jpeg,.gif",
    dropzoneText: "Drop an image here, or click to browse",
    fileTypesText: ".png, .jpg, .gif",
  },
};
