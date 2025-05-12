import React from "react";
import "../src/app/globals.css";
import { roboto } from "../src/app/font";

// Create a decorator that applies the Roboto font to all stories
const withTheme = (StoryFn) => {
  // Add the Roboto font variable to the wrapper div
  return (
    <div className={`${roboto.variable} font-sans antialiased`}>
      <StoryFn />
    </div>
  );
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#FFFFFF",
        },
        {
          name: "dark",
          value: "#222222",
        },
      ],
    },
  },
  decorators: [withTheme],
};

export default preview;
