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
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.topSection}
      >
        {/* Brush Pattern Overlay - Rotated */}
        <View style={styles.brushPatternOverlay}>
          <Svg
            width={width * 1.5}
            height={height * 0.7}
            viewBox="0 0 393 493"
            style={styles.brushPattern}
          >
            <Defs>
              <Pattern
                id="pattern0_1_490"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <SvgImage
                  x="-0.00110179"
                  y="0"
                  width="950"
                  height="1026"
                  preserveAspectRatio="none"
                  opacity="0.15"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA7YAAAQCCAYAAACYBmR1AAAACXBIWXMAABYlAAAWJQFJUiTwAADa4UlEQVR4nO..."
                />
              </Pattern>
            </Defs>
            <Rect
              x="173.471"
              y="-122"
              width="437"
              height="473"
              transform="rotate(25.3443 173.471 -122)"
              fill="url(#pattern0_1_490)"
              opacity="0.3"
            />
          </Svg>
        </View>

        {/* Star Icon */}
        <View style={styles.starContainer}>
          <Svg width="70" height="70" viewBox="0 0 70 70">
            {/* Outer diamond */}
            <Rect
              x="10"
              y="10"
              width="50"
              height="50"
              fill="#FFC107"
              transform="rotate(45 35 35)"
            />
            {/* Inner lighter diamond for depth */}
            <Rect
              x="20"
              y="20"
              width="30"
              height="30"
              fill="#FFD54F"
              transform="rotate(45 35 35)"
            />
          </Svg>
        </View>

        {/* Brush Icon - Large Diagonal */}
        <View style={styles.brushContainer}>
          <Svg width="300" height="400" viewBox="0 0 300 400">
            {/* Brush Handle (Teal/Turquoise) */}
            <Rect
              x="180"
              y="20"
              width="50"
              height="280"
              fill="#4DB8AC"
              rx="10"
            />
            {/* Handle highlight */}
            <Rect
              x="190"
              y="30"
              width="15"
              height="260"
              fill="#6ECFC2"
              rx="7"
              opacity="0.6"
            />

            {/* Brush Head (Green) */}
            <Rect
              x="140"
              y="260"
              width="130"
              height="110"
              fill="#8BC34A"
              rx="10"
            />
            {/* Brush head highlight */}
            <Rect
              x="150"
              y="270"
              width="110"
              height="30"
              fill="#AED581"
              rx="8"
              opacity="0.7"
            />

            {/* Bristle details */}
            <Rect x="155" y="290" width="10" height="70" fill="#7CB342" opacity="0.5" />
            <Rect x="175" y="290" width="10" height="70" fill="#7CB342" opacity="0.5" />
            <Rect x="195" y="290" width="10" height="70" fill="#7CB342" opacity="0.5" />
            <Rect x="215" y="290" width="10" height="70" fill="#7CB342" opacity="0.5" />
            <Rect x="235" y="290" width="10" height="70" fill="#7CB342" opacity="0.5" />
          </Svg>
        </View>

        {/* Lime/Lemon Slice at bottom of gradient */}
        <View style={styles.limeContainer}>
          <Svg width="140" height="70" viewBox="0 0 140 70">
            {/* Outer rim - darker green */}
            <Rect x="0" y="35" width="140" height="35" fill="#00C853" rx="70" />
            {/* Inner section - lighter green */}
            <Rect x="12" y="40" width="116" height="30" fill="#69F0AE" rx="58" />
            {/* Center line */}
            <Rect x="68" y="40" width="4" height="30" fill="#00C853" />
            {/* Lime segments - radiating lines */}
            <Rect x="45" y="42" width="3" height="28" fill="#00C853" transform="rotate(-35 46.5 56)" />
            <Rect x="90" y="42" width="3" height="28" fill="#00C853" transform="rotate(35 91.5 56)" />
            <Rect x="28" y="45" width="3" height="25" fill="#00C853" transform="rotate(-60 29.5 57.5)" />
            <Rect x="107" y="45" width="3" height="25" fill="#00C853" transform="rotate(60 108.5 57.5)" />
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
  brushPatternOverlay: {
    position: "absolute",
    top: -100,
    right: -100,
    transform: [{ rotate: "25deg" }],
    opacity: 0.2,
  },
  brushPattern: {
    opacity: 0.3,
  },
  starContainer: {
    position: "absolute",
    top: 100,
    left: width / 2 - 35,
    zIndex: 10,
  },
  brushContainer: {
    position: "absolute",
    top: 60,
    right: -30,
    transform: [{ rotate: "25deg" }],
    zIndex: 5,
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
