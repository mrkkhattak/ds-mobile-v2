import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type MainButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const MainButton: React.FC<MainButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={["#16C5E0", "#8DE016"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 328,
        height: 50,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        opacity: 1,
        ...(buttonStyle || {}),
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#FFFFFF",
          textAlign: "center",
          ...(textStyle || {}),
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
type TertiaryButtonProps = {
  label: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  label,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 74,
        height: 50,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        opacity: 0.8,
        ...(buttonStyle as object),
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
          ...(textStyle as object),
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Poppins-SemiBold", // ensure this font is loaded via expo-font
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
