import React from "react";
import { Text } from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export const MainHeading = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) => {
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
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export const SubtitleText = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: TextStyle;
}) => {
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
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

interface SecondryHeadingProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const SecondryHeading: React.FC<SecondryHeadingProps> = ({
  children,
  style,
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: "Poppins",
          fontWeight: "300",
          fontSize: 24,
          lineHeight: 48,
          letterSpacing: -0.01,
          textAlign: "center",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
