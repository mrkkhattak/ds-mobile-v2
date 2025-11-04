import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

interface GradientProgressBarProps {
  width?: number;
  height?: number;
  progress: number; // between 0 and 1
  showLabel?: boolean;
}

const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  width = 300,
  height = 18,
  progress,
  showLabel = true,
}) => {
  const borderRadius = height / 2;
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const progressWidth = clampedProgress * width;

  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient
            id="progressGradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="7.95%" stopColor="#16C5E0" />
            <Stop offset="97.3%" stopColor="#8DE016" />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={borderRadius}
          fill="rgba(255,255,255,0.2)"
        />

        {/* Progress fill */}
        <Rect
          x={0}
          y={0}
          width={progressWidth}
          height={height}
          rx={borderRadius}
          fill="url(#progressGradient)"
        />
      </Svg>

      {/* Floating text at end of progress */}
      {/* {showLabel && (
        <Text
          style={[
            styles.label,
            {
              left: progressWidth - 25 < 0 ? 0 : progressWidth - 25, // offset
            },
          ]}
        >
          {Math.round(clampedProgress * 100)}%
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    top: -24,
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default GradientProgressBar;
