import React from "react";

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`border border-blue-200 bg-blue-50 p-4 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <div className={`text-sm text-blue-800 ${className}`}>{children}</div>;
};
