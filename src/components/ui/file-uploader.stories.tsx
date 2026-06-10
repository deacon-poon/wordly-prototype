import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FileUploader } from "./file-uploader";

const meta: Meta<typeof FileUploader> = {
  title: "Core/FileUploader",
  component: FileUploader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drag-and-drop or click-to-browse file selector ported from the Angular `wordly-file-uploader`. No real upload — selected files are surfaced via `onFiles`. Supports single (default) and multiple selection.",
      },
    },
  },
  argTypes: {
    files: { control: false },
    onFiles: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

// Small inline sample so the "with files" stories show the list state without
// needing the user to interact first.
function sampleFile(name: string, size: number, type = ""): File {
  const file = new File([new Uint8Array(0)], name, { type });
  // File.size is read-only and derived from contents; override for display.
  Object.defineProperty(file, "size", { value: size });
  return file;
}

// Controlled wrapper so removing/adding files round-trips through state.
function Controlled({
  initial = [],
  ...props
}: React.ComponentProps<typeof FileUploader> & { initial?: File[] }) {
  const [files, setFiles] = React.useState<File[]>(initial);
  return <FileUploader {...props} files={files} onFiles={setFiles} />;
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const WithFileTypeHint: Story = {
  render: () => (
    <Controlled
      accept=".csv,.xlsx"
      dropzoneText="Drag and drop your attendee list, or click to browse"
      fileTypesText="CSV or XLSX, up to 10 MB"
    />
  ),
};

export const SingleFileSelected: Story = {
  render: () => (
    <Controlled
      accept=".csv"
      initial={[sampleFile("attendees-q2.csv", 48_210, "text/csv")]}
    />
  ),
};

export const MultipleFiles: Story = {
  render: () => (
    <Controlled
      multiple
      dropzoneText="Drag and drop files here, or click to browse"
      fileTypesText="Add as many as you like"
      initial={[
        sampleFile("transcript-en.vtt", 12_400),
        sampleFile("transcript-es.vtt", 11_980),
        sampleFile("speaker-notes.pdf", 256_000, "application/pdf"),
      ]}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Controlled
      disabled
      initial={[sampleFile("locked-export.csv", 9_300, "text/csv")]}
    />
  ),
};
