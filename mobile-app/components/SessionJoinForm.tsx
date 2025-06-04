import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

interface SessionJoinFormProps {
  sessionId: string;
  onSessionIdChange: (sessionId: string) => void;
  onJoin: (data: { sessionId: string; mode: "attendee" | "presenter" }) => void;
}

export function SessionJoinForm({
  sessionId,
  onSessionIdChange,
  onJoin,
}: SessionJoinFormProps) {
  const handleAttendeeJoin = () => {
    if (sessionId.trim()) {
      onJoin({ sessionId: sessionId.trim(), mode: "attendee" });
    }
  };

  const handlePresenterJoin = () => {
    if (sessionId.trim()) {
      onJoin({ sessionId: sessionId.trim(), mode: "presenter" });
    }
  };

  return (
    <View>
      {/* Session ID Input */}
      <View className="mb-4">
        <Text className="text-gray-700 text-sm font-medium mb-3">
          Enter Session ID *
        </Text>
        <TextInput
          value={sessionId}
          onChangeText={onSessionIdChange}
          placeholder="SSOD-5071"
          className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      {/* Join Buttons */}
      <View className="space-y-3">
        <Pressable
          onPress={handleAttendeeJoin}
          className={`py-3 px-6 rounded-lg ${
            sessionId.trim() ? "bg-wordly-blue" : "bg-gray-300"
          }`}
          disabled={!sessionId.trim()}
        >
          <Text className="text-white text-center font-semibold text-base">
            Attend
          </Text>
        </Pressable>

        <Pressable
          onPress={handlePresenterJoin}
          className={`py-3 px-6 rounded-lg border-2 ${
            sessionId.trim()
              ? "border-wordly-blue bg-white"
              : "border-gray-300 bg-gray-50"
          }`}
          disabled={!sessionId.trim()}
        >
          <Text
            className={`text-center font-semibold text-base ${
              sessionId.trim() ? "text-wordly-blue" : "text-gray-400"
            }`}
          >
            Present
          </Text>
        </Pressable>
      </View>

      {/* More options */}
      <View className="mt-4 flex-row items-center justify-center">
        <Text className="text-gray-500 text-sm">More options</Text>
        <View className="ml-2 w-4 h-4 border border-gray-400 rounded-full items-center justify-center">
          <Text className="text-gray-400 text-xs">?</Text>
        </View>
      </View>
    </View>
  );
}
