import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type TextStyle,
} from "react-native";

import LimeIcon from "@/assets/images/icons/Lime.svg";

interface ProgressTrackerCardProps {
  progress: number;
  onProgressChange: (newProgress: number) => void;
}
const steps = 5; // 1 to 5 points

const ProgressTrackerCard: React.FC<ProgressTrackerCardProps> = ({
  progress,
  onProgressChange,
}) => {
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        handleTouch(evt);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        handleTouch(evt);
      },
    })
  ).current;
// const dashSteps = [1, 4]; // only show vertical dashes at these steps
const handleTouch = (evt: GestureResponderEvent) => {
  if (trackWidth.current === 0) return;

  const touchX = evt.nativeEvent.locationX;

  // Convert to 0–1 range
  let ratio = touchX / trackWidth.current;
  ratio = Math.max(0, Math.min(1, ratio));

  // Snap to nearest step (0 to steps)
  const step = Math.round(ratio * steps); // 0,1,2,3,4,5

  // Convert step back to progress %
  const newProgress = (step / steps) * 100;
console.log("newProgress",newProgress)
  onProgressChange(newProgress);
};

  const getLevelColor = (
    level: "Low" | "Medium" | "High" | string
  ): TextStyle["color"] => {
    if (progress <= 33 && level === "Low") return styles.textRed.color;
    if (progress > 33 && progress <= 66 && level === "Medium")
      return styles.textYellow.color;
    if (progress > 66 && level === "High") return styles.textGreen.color;
    return styles.textGray.color;
  };

  const getCurrentCategory = (): "Low" | "Medium" | "High" => {
    if (progress <= 33) return "Low";
    if (progress <= 66) return "Medium";
    return "High";
  };

  const rows = [1, 3, 6];
  return (
    <View style={styles.screenContainer}>
      <View
        style={[
          styles.cardContainer,
          Platform.OS === "android" && { width: 240 },
        ]}
      >
        <View style={styles.topSection}>
          {rows.map((count, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.iconRow,
                rowIndex === 0
                  ? { justifyContent: "center" } // first row center
                  : { justifyContent: "space-between" }, // other rows spread
              ]}
            >
              {Array.from({ length: count }).map((_, idx) => (
                <>
                  <LimeIcon key={idx} />
                </>
              ))}
            </View>
          ))}
        </View>

        <View
          style={styles.progressArea}
          {...panResponder.panHandlers}
          ref={trackRef}
          onLayout={(e) => (trackWidth.current = e.nativeEvent.layout.width)}
        > 
   {/* {dashSteps.map((pos, index) => (
    <View
      key={index}
      style={[
        styles.dash,
        {
          left: trackWidth.current
            ? (trackWidth.current / (steps - 1)) * pos - 1 // -1 to center 2px dash
            : 0,
        },
      ]}
    />
  ))} */}
          
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={["#16C5E0", "#8DE016"]} // gradient colors
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        <View style={styles.labelRow}>
          <Text style={[styles.labelText, { color: getLevelColor("Low") }]}>
            Low
          </Text>
          <Text style={[styles.labelText, { color: getLevelColor("Medium") }]}>
            Medium
          </Text>
          <Text style={[styles.labelText, { color: getLevelColor("High") }]}>
            High
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  cardContainer: {
    width: 280,
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
    justifyContent: "space-between",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  iconRow: { flexDirection: "row", alignItems: "center", height: 18 },
  iconBase: { fontSize: 14 },
  iconWrapper: { marginHorizontal: 1 },
  statusText: { fontSize: 12 },
  progressArea: { width: "100%", height: 12, marginVertical: 4 },
  progressTrack: {
    width: "100%",
    height: 11.3692,
    borderRadius: 5.68459,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5.68459,
    backgroundColor: "#38bdf8",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  labelText: { fontSize: 12 },
  textRed: { color: "#dc2626", fontWeight: "bold" },
  textYellow: { color: "#ca8a04", fontWeight: "bold" },
  textGreen: { color: "#16a34a", fontWeight: "bold" },
  textGray: { color: "#9ca3af" },
  dashesRow: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 2,
  pointerEvents: "none", // so touches pass through
},

dash: {
  position: "absolute",
  top: 0,
  width: 2,
  height: "100%",
  backgroundColor: "#000", // black dash
  zIndex: 1, // ensure it floats above the gradient
},

dashActive: {
  backgroundColor: "#000", // black dash
},
});

export default ProgressTrackerCard;
