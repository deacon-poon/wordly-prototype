import React from "react";
import { Pressable, Text, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = "rounded-md items-center justify-center";

    const sizeClasses = {
      sm: "px-3 py-1 min-h-[32px]",
      md: "px-4 py-2 min-h-[40px]",
      lg: "px-6 py-3 min-h-[44px]",
    };

    const variantClasses = {
      primary: disabled
        ? "bg-gray-300"
        : "bg-primary-teal-500 active:bg-primary-teal-600",
      secondary: disabled ? "bg-gray-200" : "bg-gray-200 active:bg-gray-300",
      outline: disabled
        ? "bg-white border border-gray-300"
        : "bg-white border border-gray-300 active:bg-gray-50",
      destructive: disabled ? "bg-gray-300" : "bg-red-500 active:bg-red-600",
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const getTextClasses = () => {
    const baseClasses = "font-medium text-center";

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const variantClasses = {
      primary: disabled ? "text-gray-500" : "text-white",
      secondary: disabled ? "text-gray-400" : "text-gray-800",
      outline: disabled ? "text-gray-400" : "text-gray-700",
      destructive: disabled ? "text-gray-500" : "text-white",
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <Pressable
      className={`${getButtonClasses()} ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      <Text className={getTextClasses()}>{children}</Text>
    </Pressable>
  );
}
