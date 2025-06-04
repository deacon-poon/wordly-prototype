import React from "react";
import { View, Text, Pressable } from "react-native";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "es-ES", label: "Spanish (ES) — Español (ES)" },
  { code: "en-US", label: "English (US) — English (US)" },
  { code: "fr-FR", label: "French (FR) — Français (FR)" },
  { code: "de-DE", label: "German (DE) — Deutsch (DE)" },
  { code: "ja-JP", label: "Japanese (JP) — 日本語 (JP)" },
  { code: "zh-CN", label: "Chinese (CN) — 中文 (CN)" },
];

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <View className="border border-gray-300 rounded-lg">
      {languages.map((language, index) => (
        <Pressable
          key={language.code}
          onPress={() => onLanguageChange(language.code)}
          className={`p-4 ${
            index < languages.length - 1 ? "border-b border-gray-200" : ""
          } ${
            selectedLanguage === language.code ? "bg-primary-50" : "bg-white"
          }`}
        >
          <View className="flex-row items-center">
            <View
              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                selectedLanguage === language.code
                  ? "border-primary-500 bg-primary-500"
                  : "border-gray-300"
              }`}
            >
              {selectedLanguage === language.code && (
                <View className="w-2 h-2 bg-white rounded-full self-center mt-0.5" />
              )}
            </View>
            <Text
              className={`flex-1 ${
                selectedLanguage === language.code
                  ? "text-primary-700 font-medium"
                  : "text-gray-900"
              }`}
            >
              {language.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
