import { LinearGradient } from "expo-linear-gradient";

import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
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

type SlideButtonProps = {
  label: string;
  icon: React.ReactNode;
  onSlideComplete: () => void;
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
  width?: number;
  height?: number;
};

export const SlideButton: React.FC<SlideButtonProps> = ({
  label,
  icon,
  onSlideComplete,
  width = 329,
  height = 48,
  viewStyle,
  textStyle,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const maxSlide = width - height;

  // Interpolate slider progress to background color
  const bgColor = slideAnim.interpolate({
    inputRange: [0, maxSlide],
    outputRange: ["#16C5E0", "#8DE016"],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(gestureState.dx, maxSlide));
        slideAnim.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.8) {
          Animated.timing(slideAnim, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSlideComplete();
            slideAnim.setValue(0); // reset
          });
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: bgColor,
        justifyContent: "center",
        ...viewStyle,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
          position: "absolute",
          left: 20,
          ...textStyle,
          paddingLeft: 40,
        }}
      >
        {label}
      </Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          width: height,
          height: height,
          borderRadius: height / 2,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: 0,
          top: 0,
          transform: [{ translateX: slideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        {icon}
      </Animated.View>
    </Animated.View>
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
