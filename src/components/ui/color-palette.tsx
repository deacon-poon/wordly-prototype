import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

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
  variant: ColorVariant;
  showContrast?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  variant,
  showContrast = false,
}) => {
  const { name, value } = variant;
  const contrast = variant.contrast || { white: 0, black: 0 };
  const wcag = variant.wcag || { aa: false, aaa: false };

  return (
    <div className="flex flex-col">
      <div
        className={`w-full h-16 rounded-md mb-2 shadow-sm`}
        style={{ backgroundColor: value }}
      />
      <div className="flex flex-col">
        <span className={`text-sm font-medium`}>{name}</span>
        <span className="text-xs text-muted-foreground">{value}</span>
        {showContrast && (
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>White: {contrast.white.toFixed(2)}</span>
              <span>{wcag.aa ? "AA ✓" : "AA ✗"}</span>
            </div>
            <div className="flex justify-between">
              <span>Black: {contrast.black.toFixed(2)}</span>
              <span>{wcag.aaa ? "AAA ✓" : "AAA ✗"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ColorPaletteProps {
  name: string;
  description?: string;
  variants: ColorVariant[];
  showContrast?: boolean;
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
> = ({
  name,
  description,
  variants,
  className,
  variant,
  showContrast = false,
}) => {
  return (
    <div className={cn(colorPaletteVariants({ variant }), className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {variants.map((colorVariant) => (
          <ColorSwatch
            key={colorVariant.name}
            variant={colorVariant}
            showContrast={showContrast}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
