import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  required,
  className,
  ...props
}: InputProps) {
  return (
    <View className="mb-6">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <TextInput
        className={`
          border border-gray-300 rounded-md px-3 py-3 text-base bg-white text-gray-900
          min-h-[44px]
          focus:border-primary-teal-500 focus:ring-2 focus:ring-primary-teal-500 focus:ring-opacity-20
          ${error ? "border-red-500 focus:border-red-500" : ""}
          ${className || ""}
        `}
        placeholderTextColor="#9BA3AB"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
