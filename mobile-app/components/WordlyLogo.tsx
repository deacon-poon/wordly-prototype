import React from "react";
import { View, Text } from "react-native";

export function WordlyLogo() {
  return (
    <View className="items-center">
      <View className="bg-wordly-blue w-12 h-12 rounded-full items-center justify-center mb-2">
        <Text className="text-white text-xl font-bold">w</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-900 tracking-wide">
        wordly
      </Text>
    </View>
  );
}
