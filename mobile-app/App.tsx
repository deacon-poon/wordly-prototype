import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Add console log to verify component is loading
console.log("App component loading...", { Platform: Platform.OS });

// Get screen dimensions for responsive design
const { width: screenWidth } = Dimensions.get("window");
const isMobileWeb = Platform.OS === "web" && screenWidth < 768;

// Language options from specification: English, Spanish, French, Japanese, Chinese (Simplified), German
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export default function App() {
  console.log("App component rendering...", { screenWidth, isMobileWeb });

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionId, setSessionId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [joinMode, setJoinMode] = useState<"attendee" | "presenter">(
    "attendee"
  );
  const [showPasscode, setShowPasscode] = useState(false);

  const handleJoinSession = () => {
    console.log("Join session clicked", {
      sessionId,
      joinMode,
      selectedLanguage,
    });
    if (!sessionId.trim()) {
      Alert.alert("Error", "Please enter a Session ID");
      return;
    }

    if (showPasscode && !passcode.trim()) {
      Alert.alert("Error", "Please enter the session passcode");
      return;
    }

    // TODO: Implement actual session joining logic
    Alert.alert(
      "Joining Session",
      `Mode: ${joinMode}\nSession ID: ${sessionId}\nLanguage: ${selectedLanguage}${
        showPasscode ? `\nPasscode: ${passcode}` : ""
      }`
    );
  };

  const handleQRScan = () => {
    console.log("QR scan clicked");
    // TODO: Implement QR scanner
    Alert.alert("QR Scanner", "QR scanner will be implemented next");
  };

  // Use regular View instead of SafeAreaView for web compatibility
  const ContainerView =
    Platform.OS === "web"
      ? View
      : require("react-native-safe-area-context").SafeAreaView;

  // Mobile-like container styling for web
  const containerStyle =
    Platform.OS === "web"
      ? {
          flex: 1,
          backgroundColor: "#f8fafc",
          maxWidth: 400,
          marginHorizontal: "auto" as any,
          minHeight: "100vh" as any,
        }
      : {
          flex: 1,
          backgroundColor: "#f8fafc",
        };

  return (
    <ContainerView style={containerStyle}>
      <StatusBar style="dark" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 32, marginTop: 16 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: 8,
            }}
          >
            Wordly
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            AI-POWERED INTERPRETATION
          </Text>
        </View>

        {/* Language Selection */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: 16,
            }}
          >
            Choose your language
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    selectedLanguage === lang.code ? "#00B4D8" : "#ffffff",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    selectedLanguage === lang.code ? "#00B4D8" : "#e2e8f0",
                  minWidth: 100,
                }}
                onPress={() => {
                  console.log("Language selected:", lang.code);
                  setSelectedLanguage(lang.code);
                }}
              >
                <Text style={{ fontSize: 18, marginRight: 8 }}>
                  {lang.flag}
                </Text>
                <Text
                  style={{
                    color:
                      selectedLanguage === lang.code ? "#ffffff" : "#1e293b",
                    fontWeight: selectedLanguage === lang.code ? "600" : "400",
                    fontSize: 14,
                  }}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Join Mode Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: 16,
            }}
          >
            Join as
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor:
                  joinMode === "attendee" ? "#00B4D8" : "#ffffff",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: joinMode === "attendee" ? "#00B4D8" : "#e2e8f0",
                alignItems: "center",
              }}
              onPress={() => {
                console.log("Join mode selected: attendee");
                setJoinMode("attendee");
              }}
            >
              <Text
                style={{
                  color: joinMode === "attendee" ? "#ffffff" : "#1e293b",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Attendee
              </Text>
              <Text
                style={{
                  color: joinMode === "attendee" ? "#ffffff" : "#64748b",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Listen to interpretation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor:
                  joinMode === "presenter" ? "#00B4D8" : "#ffffff",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: joinMode === "presenter" ? "#00B4D8" : "#e2e8f0",
                alignItems: "center",
              }}
              onPress={() => {
                console.log("Join mode selected: presenter");
                setJoinMode("presenter");
              }}
            >
              <Text
                style={{
                  color: joinMode === "presenter" ? "#ffffff" : "#1e293b",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Presenter
              </Text>
              <Text
                style={{
                  color: joinMode === "presenter" ? "#ffffff" : "#64748b",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Speak and present
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Session ID Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: 8,
            }}
          >
            Session ID
          </Text>
          <TextInput
            style={{
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: "#1e293b",
            }}
            placeholder="Enter session ID"
            value={sessionId}
            onChangeText={(text) => {
              console.log("Session ID changed:", text);
              setSessionId(text);
            }}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        {/* Passcode Toggle */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: showPasscode ? 16 : 24,
          }}
          onPress={() => {
            console.log("Passcode toggle clicked:", !showPasscode);
            setShowPasscode(!showPasscode);
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: "#00B4D8",
              borderRadius: 4,
              backgroundColor: showPasscode ? "#00B4D8" : "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            {showPasscode && (
              <Text
                style={{ color: "#ffffff", fontSize: 12, fontWeight: "bold" }}
              >
                ✓
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 16, color: "#1e293b" }}>
            This session requires a passcode
          </Text>
        </TouchableOpacity>

        {/* Passcode Input */}
        {showPasscode && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: 8,
              }}
            >
              Passcode
            </Text>
            <TextInput
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "#1e293b",
              }}
              placeholder="Enter passcode"
              value={passcode}
              onChangeText={(text) => {
                console.log("Passcode changed");
                setPasscode(text);
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: "#00B4D8",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={handleJoinSession}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Join Session
          </Text>
        </TouchableOpacity>

        {/* QR Scanner */}
        <TouchableOpacity
          style={{
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#00B4D8",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 32,
          }}
          onPress={handleQRScan}
        >
          <Text
            style={{
              color: "#00B4D8",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            📱 Scan QR Code
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingBottom: 32 }}>
          <Text style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
            Wordly AI Interpretation
          </Text>
          <Text style={{ fontSize: 10, color: "#cbd5e1" }}>
            Version 3.5.0+dev.635
          </Text>
        </View>
      </ScrollView>
    </ContainerView>
  );
}
