import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WordlyLogo } from "./WordlyLogo";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface AttendeeJoinFormProps {
  variant: "simple" | "with-passcode" | "full-form";
  initialEventId?: string;
  initialPasscode?: string;
  onJoin: (data: { eventId: string; passcode?: string; name?: string }) => void;
}

export function AttendeeJoinForm({
  variant,
  initialEventId = "",
  initialPasscode = "",
  onJoin,
}: AttendeeJoinFormProps) {
  const [eventId, setEventId] = useState(initialEventId);
  const [passcode, setPasscode] = useState(initialPasscode);
  const [requiresPasscode, setRequiresPasscode] = useState(
    variant !== "simple"
  );

  const handleJoin = () => {
    if (!eventId.trim()) {
      Alert.alert("Error", "Please enter a Session ID");
      return;
    }

    if (requiresPasscode && !passcode.trim()) {
      Alert.alert("Error", "Please enter the session passcode");
      return;
    }

    onJoin({
      eventId: eventId.trim(),
      passcode: passcode.trim() || undefined,
    });
  };

  const handleEventIdChange = (value: string) => {
    setEventId(value);

    // For simple variant, dynamically check if passcode is required
    if (variant === "simple" && value.length >= 4) {
      const needsPasscode = value.toUpperCase().includes("STGA");
      setRequiresPasscode(needsPasscode);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-6 justify-center">
        {/* Logo Section */}
        <View className="items-center mb-12">
          <WordlyLogo />
          <Text className="text-gray-600 text-center mt-4 text-sm">
            AI-POWERED INTERPRETATION
          </Text>
        </View>

        {/* Form Section */}
        <View>
          <Input
            label="Session ID"
            value={eventId}
            onChangeText={handleEventIdChange}
            placeholder="Enter session ID"
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {requiresPasscode && (
            <>
              <Text className="text-sm text-gray-600 mb-4">
                ✓ This session requires a passcode
              </Text>
              <Input
                label="Passcode"
                value={passcode}
                onChangeText={setPasscode}
                placeholder="Enter passcode"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          )}
        </View>

        {/* Action Section */}
        <View className="mt-6">
          <Button
            onPress={handleJoin}
            disabled={!eventId.trim()}
            size="lg"
            className="mb-4"
          >
            Join Session
          </Button>

          <Button
            variant="outline"
            onPress={() => Alert.alert("QR Scanner", "QR scanner coming soon")}
            size="lg"
          >
            📱 Scan QR Code
          </Button>
        </View>

        {/* Footer */}
        <Text className="text-center text-gray-400 text-xs mt-12">
          Wordly AI Interpretation
        </Text>
      </View>
    </SafeAreaView>
  );
}
