import React from "react";
import { cva } from "class-variance-authority";

// Add ColorVariant interface for use in colors.ts
export interface ColorVariant {
  name: string;
  value: string;
  contrast?: {
    white: number;
    black: number;
  };
  wcag?: {
    aa: boolean;
    aaa: boolean;
  };
}

interface ColorSwatchProps {
  colorName: string;
  colorValue: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colorName,
  colorValue,
  textColor = "text-foreground",
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={`w-full h-16 rounded-md mb-2 shadow-sm`}
        style={{ backgroundColor: colorValue }}
      />
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${textColor}`}>{colorName}</span>
        <span className="text-xs text-muted-foreground">{colorValue}</span>
      </div>
    </div>
  );
};

interface ColorPaletteProps {
  title: string;
  description?: string;
  colors: Array<{
    name: string;
    value: string;
    textColor?: string;
  }>;
  className?: string;
}

const colorPaletteVariants = cva("p-6 rounded-lg border", {
  variants: {
    variant: {
      default: "bg-card",
      ghost: "bg-transparent border-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const ColorPalette: React.FC<
  ColorPaletteProps & { variant?: "default" | "ghost" }
> = ({ title, description, colors, className, variant }) => {
  return (
    <div className={colorPaletteVariants({ variant, className })}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {colors.map((color) => (
          <ColorSwatch
            key={color.name}
            colorName={color.name}
            colorValue={color.value}
            textColor={color.textColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
