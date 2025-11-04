import React from "react";
import { Text } from "react-native";

export const MainHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text
      style={{
        fontFamily: "Poppins-SemiBold", // make sure it's loaded via expo-font
        fontWeight: "600",
        fontSize: 28,
        lineHeight: 32,
        letterSpacing: -0.01,
        textAlign: "center",
        color: "#FFFFFF",
      }}
    >
      {children}
    </Text>
  );
};

export const SubtitleText = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text
      style={{
        fontFamily: "Inter-Light", // Make sure it's loaded with expo-font
        fontWeight: "300",
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: 0.01, // 1%
        textAlign: "center",
        color: "#FFFFFF",
      }}
    >
      {children}
    </Text>
  );
};
