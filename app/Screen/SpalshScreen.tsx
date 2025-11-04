import React from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Rect, Defs, Pattern, Use, Image as SvgImage } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const SpalshScreen = () => {
  return (
    <View style={styles.container}>
      {/* Top Section with Purple Gradient */}
      <LinearGradient
        colors={["#984BDC", "#6530D0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        {/* Decorative Pattern/Brush Overlay */}
        <View style={styles.brushOverlay}>
          {/* Star Icon */}
          <View style={styles.starContainer}>
            <Svg width="60" height="60" viewBox="0 0 60 60">
              <Rect
                x="15"
                y="15"
                width="30"
                height="30"
                fill="#FFC107"
                transform="rotate(45 30 30)"
              />
            </Svg>
          </View>

          {/* Brush/Broom Icon */}
          <View style={styles.brushContainer}>
            <Svg width="250" height="300" viewBox="0 0 250 300" style={styles.brush}>
              {/* Brush Handle */}
              <Rect
                x="150"
                y="0"
                width="40"
                height="220"
                fill="#4DB8AC"
                rx="8"
                transform="rotate(35 170 110)"
              />
              {/* Brush Head (wider part) */}
              <Rect
                x="100"
                y="180"
                width="80"
                height="90"
                fill="#8BC34A"
                rx="6"
                transform="rotate(35 140 225)"
              />
              {/* Bristle detail lines */}
              <Rect
                x="110"
                y="195"
                width="8"
                height="50"
                fill="#7CB342"
                opacity="0.6"
                transform="rotate(35 114 220)"
              />
              <Rect
                x="125"
                y="195"
                width="8"
                height="50"
                fill="#7CB342"
                opacity="0.6"
                transform="rotate(35 129 220)"
              />
              <Rect
                x="140"
                y="195"
                width="8"
                height="50"
                fill="#7CB342"
                opacity="0.6"
                transform="rotate(35 144 220)"
              />
            </Svg>
          </View>
        </View>

        {/* Lime/Lemon Slice at bottom of gradient */}
        <View style={styles.limeContainer}>
          <Svg width="120" height="60" viewBox="0 0 120 60">
            {/* Outer rim */}
            <Rect x="0" y="30" width="120" height="30" fill="#00C853" rx="60" />
            {/* Inner lighter section */}
            <Rect x="10" y="35" width="100" height="25" fill="#69F0AE" rx="50" />
            {/* Lime segments */}
            <Rect x="55" y="35" width="3" height="25" fill="#00C853" />
            <Rect x="35" y="40" width="2" height="20" fill="#00C853" transform="rotate(-30 36 50)" />
            <Rect x="75" y="40" width="2" height="20" fill="#00C853" transform="rotate(30 76 50)" />
            <Rect x="20" y="45" width="2" height="15" fill="#00C853" transform="rotate(-50 21 52)" />
            <Rect x="90" y="45" width="2" height="15" fill="#00C853" transform="rotate(50 91 52)" />
          </Svg>
        </View>
      </LinearGradient>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        {/* App Name */}
        <View style={styles.titleContainer}>
          <Text style={styles.dailyText}>Daily</Text>
          <View style={styles.spruceContainer}>
            <Text style={styles.spruceText}>Spruce</Text>
            <View style={styles.timerIcon}>
              <Svg width="32" height="32" viewBox="0 0 32 32">
                <Rect
                  x="8"
                  y="4"
                  width="16"
                  height="16"
                  rx="8"
                  fill="none"
                  stroke="#7B5FC7"
                  strokeWidth="2.5"
                />
                <Rect x="15" y="8" width="2" height="6" fill="#7B5FC7" />
                <Rect x="15" y="12" width="4" height="2" fill="#7B5FC7" />
                <Rect x="14" y="2" width="4" height="3" rx="1" fill="#7B5FC7" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Squeeze in a spruce & stretch{"\n"}out your weekend!
        </Text>

        {/* CTA Button */}
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={["#00BCD4", "#8BC34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>GET SPRUCING</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpalshScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: height * 0.58,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
  },
  brushOverlay: {
    flex: 1,
    position: "relative",
  },
  starContainer: {
    position: "absolute",
    top: 80,
    left: width / 2 - 30,
  },
  brushContainer: {
    position: "absolute",
    top: 80,
    right: -40,
  },
  brush: {
    transform: [{ rotate: "45deg" }],
  },
  limeContainer: {
    position: "absolute",
    bottom: -30,
    left: width / 2 - 60,
    zIndex: 10,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 60,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  dailyText: {
    fontSize: 72,
    fontWeight: "900",
    color: "#7B5FC7",
    letterSpacing: -2,
    lineHeight: 72,
  },
  spruceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
  },
  spruceText: {
    fontSize: 72,
    fontWeight: "900",
    color: "#7B5FC7",
    letterSpacing: -2,
    lineHeight: 72,
  },
  timerIcon: {
    position: "absolute",
    right: -38,
    top: -8,
  },
  tagline: {
    fontSize: 18,
    color: "#757575",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 60,
    fontWeight: "500",
  },
  ctaButton: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
