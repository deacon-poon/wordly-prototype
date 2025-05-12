import type { Meta, StoryObj } from "@storybook/react";
import { ColorPalette } from "./ColorPalette";

const meta: Meta<typeof ColorPalette> = {
  title: "Design System/ColorPalette",
  component: ColorPalette,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

// Helper function to convert HSL CSS variables to hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const BrandColors: Story = {
  args: {
    title: "Brand Colors",
    description:
      "The primary brand colors that define Wordly's visual identity.",
    colors: [
      {
        name: "Teal 500",
        value: "hsl(187, 76%, 33%)",
        textColor: "text-white",
      },
      {
        name: "Pink 500",
        value: "hsl(328, 100%, 44%)",
        textColor: "text-white",
      },
    ],
  },
};

export const TealPalette: Story = {
  args: {
    title: "Teal Palette",
    description:
      "Primary brand color with 10 shades for various UI applications.",
    colors: [
      { name: "Teal 50", value: "hsl(187, 60%, 94%)" },
      { name: "Teal 100", value: "hsl(187, 65%, 85%)" },
      { name: "Teal 200", value: "hsl(187, 65%, 74%)" },
      { name: "Teal 300", value: "hsl(187, 65%, 58%)" },
      { name: "Teal 400", value: "hsl(187, 71%, 45%)" },
      {
        name: "Teal 500",
        value: "hsl(187, 76%, 33%)",
        textColor: "text-white",
      },
      {
        name: "Teal 600",
        value: "hsl(187, 80%, 26%)",
        textColor: "text-white",
      },
      {
        name: "Teal 700",
        value: "hsl(187, 85%, 20%)",
        textColor: "text-white",
      },
      {
        name: "Teal 800",
        value: "hsl(187, 90%, 14%)",
        textColor: "text-white",
      },
      { name: "Teal 900", value: "hsl(187, 95%, 8%)", textColor: "text-white" },
    ],
  },
};

export const PinkPalette: Story = {
  args: {
    title: "Pink Palette",
    description:
      "Secondary brand color with 10 shades for various UI applications.",
    colors: [
      { name: "Pink 50", value: "hsl(328, 100%, 94%)" },
      { name: "Pink 100", value: "hsl(328, 100%, 86%)" },
      { name: "Pink 200", value: "hsl(328, 100%, 76%)" },
      { name: "Pink 300", value: "hsl(328, 100%, 67%)" },
      {
        name: "Pink 400",
        value: "hsl(328, 100%, 57%)",
        textColor: "text-white",
      },
      {
        name: "Pink 500",
        value: "hsl(328, 100%, 44%)",
        textColor: "text-white",
      },
      {
        name: "Pink 600",
        value: "hsl(328, 100%, 35%)",
        textColor: "text-white",
      },
      {
        name: "Pink 700",
        value: "hsl(328, 100%, 26%)",
        textColor: "text-white",
      },
      {
        name: "Pink 800",
        value: "hsl(328, 100%, 17%)",
        textColor: "text-white",
      },
      {
        name: "Pink 900",
        value: "hsl(328, 100%, 8%)",
        textColor: "text-white",
      },
    ],
  },
};

export const SemanticColors: Story = {
  args: {
    title: "Semantic Colors",
    description: "Colors that convey specific meanings across the application.",
    colors: [
      { name: "Success", value: "hsl(142, 76%, 36%)", textColor: "text-white" },
      { name: "Error", value: "hsl(5, 100%, 44%)", textColor: "text-white" },
    ],
  },
};

export const GrayPalette: Story = {
  args: {
    title: "Gray Palette",
    description: "Neutral gray scale for backgrounds, text, and UI elements.",
    colors: [
      { name: "Gray 50", value: "hsl(210, 20%, 98%)" },
      { name: "Gray 100", value: "hsl(210, 17%, 95%)" },
      { name: "Gray 200", value: "hsl(210, 16%, 90%)" },
      { name: "Gray 300", value: "hsl(210, 14%, 83%)" },
      { name: "Gray 400", value: "hsl(210, 12%, 64%)" },
      {
        name: "Gray 500",
        value: "hsl(210, 10%, 43%)",
        textColor: "text-white",
      },
      { name: "Gray 600", value: "hsl(210, 9%, 31%)", textColor: "text-white" },
      {
        name: "Gray 700",
        value: "hsl(210, 10%, 23%)",
        textColor: "text-white",
      },
      {
        name: "Gray 800",
        value: "hsl(210, 11%, 15%)",
        textColor: "text-white",
      },
      { name: "Gray 900", value: "hsl(210, 12%, 8%)", textColor: "text-white" },
    ],
  },
};

export const SystemColors: Story = {
  args: {
    title: "System UI Colors",
    description: "Colors used for application interface elements.",
    colors: [
      { name: "Background", value: "hsl(0, 0%, 100%)" },
      {
        name: "Foreground",
        value: "hsl(222.2, 84%, 4.9%)",
        textColor: "text-white",
      },
      { name: "Card", value: "hsl(0, 0%, 100%)" },
      {
        name: "Card Foreground",
        value: "hsl(222.2, 84%, 4.9%)",
        textColor: "text-white",
      },
      { name: "Border", value: "hsl(214.3, 31.8%, 91.4%)" },
      { name: "Input", value: "hsl(214.3, 31.8%, 91.4%)" },
      { name: "Ring", value: "hsl(222.2, 84%, 4.9%)", textColor: "text-white" },
      { name: "Muted", value: "hsl(210, 40%, 96.1%)" },
      { name: "Muted Foreground", value: "hsl(215.4, 16.3%, 46.9%)" },
    ],
  },
};
