import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

// Import NativeWind CSS
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerShadowVisible: Platform.OS === "ios",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Wordly",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="session/[id]"
          options={{
            title: "Session",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="present/[id]"
          options={{
            title: "Present",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="attendee-demo"
          options={{
            title: "Attendee Join Demo",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
