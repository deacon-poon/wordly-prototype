import React from "react";

export interface SpacingBoxProps {
  size: number;
  label?: string;
  showPixels?: boolean;
}

export const SpacingBox: React.FC<SpacingBoxProps> = ({
  size,
  label,
  showPixels = true,
}) => {
  const pixelValue = size * 4; // Assuming 1 spacing unit = 4px (Tailwind default)

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-2">
        <div
          className="bg-primary/20 border border-primary/40 flex items-center justify-center"
          style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }}
        >
          <span className="text-xs font-mono text-primary-foreground/70">
            {size}
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-semibold">{label || `${size}`}</span>
          {showPixels && (
            <span className="text-xs text-muted-foreground">
              {pixelValue}px
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export interface SpacingRowProps {
  values: number[];
  title: string;
  description?: string;
}

export const SpacingRow: React.FC<SpacingRowProps> = ({
  values,
  title,
  description,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-6">
        {values.map((value) => (
          <SpacingBox key={value} size={value} />
        ))}
      </div>
    </div>
  );
};

export interface SpacingGridProps {
  title: string;
  description?: string;
}

export const SpacingGrid: React.FC<
  SpacingGridProps & React.HTMLAttributes<HTMLDivElement>
> = ({ title, description, children, ...props }) => {
  return (
    <div className="p-6 border rounded-lg bg-card" {...props}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  );
};
