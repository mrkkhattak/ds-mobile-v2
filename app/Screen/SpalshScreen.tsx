import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Top Section with Purple Gradient */}
      <LinearGradient
        colors={["#984BDC", "#6530D0"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.topSection}
      >
        <View style={styles.lottieContainer}>
          <LottieView
            source={require("../../assets/animations/assuta.loader.json")}
            autoPlay
            loop
            style={styles.lottie}
            resizeMode="contain"
            hardwareAccelerationAndroid={true}
          />
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

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: height * 0.5,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  lottieContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: width * 0.9, // scale to 90% of screen width
    height: "100%",
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
