import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { AttendeeJoinForm } from "../components/AttendeeJoinForm";
import { Button } from "../components/ui/Button";

type Variant = "simple" | "with-passcode" | "full-form";

export default function AttendeeDemoScreen() {
  const [currentVariant, setCurrentVariant] = useState<Variant>("simple");

  const handleJoin = (data: {
    eventId: string;
    passcode?: string;
    name?: string;
  }) => {
    Alert.alert(
      "Join Session",
      `Event ID: ${data.eventId}\nPasscode: ${data.passcode || "None"}\nName: ${
        data.name || "None"
      }`,
      [{ text: "OK" }]
    );
  };

  const getVariantDescription = () => {
    switch (currentVariant) {
      case "simple":
        return "Simple flow - Just Event ID, then check if passcode required";
      case "with-passcode":
        return "Deep link with Event ID pre-filled, user enters passcode";
      case "full-form":
        return "Deep link with Event ID and passcode pre-filled, user enters name";
      default:
        return "";
    }
  };

  const getInitialData = () => {
    switch (currentVariant) {
      case "simple":
        return { eventId: "", passcode: "" };
      case "with-passcode":
        return { eventId: "STGA-6792", passcode: "" };
      case "full-form":
        return { eventId: "STGA-6792", passcode: "P94845" };
      default:
        return { eventId: "", passcode: "" };
    }
  };

  const initialData = getInitialData();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Demo Controls */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-lg font-bold text-secondary-navy-800 mb-2">
          Attendee Join Form Demo
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          {getVariantDescription()}
        </Text>

        <View className="flex-row space-x-2">
          <Button
            variant={currentVariant === "simple" ? "primary" : "outline"}
            size="sm"
            onPress={() => setCurrentVariant("simple")}
            className="flex-1"
          >
            Simple
          </Button>
          <Button
            variant={currentVariant === "with-passcode" ? "primary" : "outline"}
            size="sm"
            onPress={() => setCurrentVariant("with-passcode")}
            className="flex-1"
          >
            With Passcode
          </Button>
          <Button
            variant={currentVariant === "full-form" ? "primary" : "outline"}
            size="sm"
            onPress={() => setCurrentVariant("full-form")}
            className="flex-1"
          >
            Full Form
          </Button>
        </View>
      </View>

      {/* Form Demo */}
      <AttendeeJoinForm
        variant={currentVariant}
        initialEventId={initialData.eventId}
        initialPasscode={initialData.passcode}
        onJoin={handleJoin}
      />
    </ScrollView>
  );
}
