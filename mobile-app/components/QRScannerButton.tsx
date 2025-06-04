import React from "react";
import { Pressable, Text, View } from "react-native";

interface QRScannerButtonProps {
  onScan: () => void;
}

export function QRScannerButton({ onScan }: QRScannerButtonProps) {
  return (
    <View className="items-center mb-6">
      <Pressable
        onPress={onScan}
        className="flex-row items-center justify-center bg-gray-100 border border-gray-300 rounded-lg px-6 py-4"
      >
        {/* QR Code Icon */}
        <View className="mr-3">
          <View className="w-6 h-6 border-2 border-gray-600 rounded">
            <View className="absolute top-0 left-0 w-2 h-2 bg-gray-600"></View>
            <View className="absolute top-0 right-0 w-2 h-2 bg-gray-600"></View>
            <View className="absolute bottom-0 left-0 w-2 h-2 bg-gray-600"></View>
            <View className="absolute bottom-0 right-0 w-2 h-2 bg-gray-600"></View>
            <View className="absolute top-1 left-1 w-1 h-1 bg-gray-600"></View>
            <View className="absolute top-1 right-1 w-1 h-1 bg-gray-600"></View>
            <View className="absolute bottom-1 left-1 w-1 h-1 bg-gray-600"></View>
          </View>
        </View>

        <Text className="text-gray-700 font-medium text-base">
          Scan QR Code
        </Text>
      </Pressable>

      <Text className="text-gray-500 text-sm mt-2 text-center">or</Text>
    </View>
  );
}
