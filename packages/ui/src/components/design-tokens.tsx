import React from "react";
import { Typography } from "./typography";

export interface TokenProps {
  name: string;
  value: string;
  description?: string;
  preview?: React.ReactNode;
}

export const Token: React.FC<TokenProps> = ({
  name,
  value,
  description,
  preview,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md bg-card">
      {preview && (
        <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
          {preview}
        </div>
      )}
      <div className="flex-grow space-y-1">
        <Typography variant="h5">{name}</Typography>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-muted px-1 py-0.5 rounded">{value}</code>
          {value.startsWith("var(--") && (
            <Typography variant="small" className="text-muted-foreground">
              CSS Variable
            </Typography>
          )}
        </div>
        {description && (
          <Typography variant="small" className="text-muted-foreground">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};

export interface TokenCategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const TokenCategory: React.FC<TokenCategoryProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h3">{title}</Typography>
        {description && (
          <Typography variant="muted" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export interface DesignTokensProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const DesignTokens: React.FC<DesignTokensProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="mb-8">
        <Typography variant="h2">{title}</Typography>
        {description && (
          <Typography variant="lead" className="mt-2">
            {description}
          </Typography>
        )}
      </div>
      <div className="space-y-12">{children}</div>
    </div>
  );
};
