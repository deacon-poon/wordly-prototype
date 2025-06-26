import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function SplashScreen() {
  // Auto-navigate after a delay (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // You can enable auto-navigation later
      // router.replace("/attendee-join");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.push("/attendee-demo"); // Or wherever you want to navigate
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-6 justify-center items-center">
        {/* Logo Container - Ready for Figma design */}
        <View className="items-center mb-12">
          {/* Placeholder for Figma logo - replace with actual logo component */}
          <View className="w-24 h-24 bg-primary-teal-500 rounded-2xl items-center justify-center mb-6 shadow-lg">
            <Text className="text-white text-2xl font-bold">W</Text>
          </View>

          <Text className="text-4xl font-bold text-secondary-navy-500 mb-2">
            Wordly
          </Text>

          <Text className="text-gray-600 text-center text-lg font-medium">
            AI-Powered Interpretation
          </Text>
        </View>

        {/* Tagline */}
        <View className="items-center mb-16">
          <Text className="text-gray-700 text-center text-base leading-6 max-w-sm">
            Breaking language barriers with intelligent real-time translation
          </Text>
        </View>

        {/* Call to Action */}
        <Pressable
          onPress={handleContinue}
          className="bg-primary-teal-500 px-8 py-4 rounded-lg shadow-sm active:bg-primary-teal-600 min-h-[44px] items-center justify-center"
        >
          <Text className="text-white font-semibold text-lg">Get Started</Text>
        </Pressable>

        {/* Footer */}
        <View className="absolute bottom-8 items-center">
          <Text className="text-gray-400 text-sm">
            Powered by advanced AI technology
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
