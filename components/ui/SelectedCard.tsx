import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type SelectableCardProps = {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[{ width: "45%" }, style]}
    >
      {isSelected ? (
        <LinearGradient
          colors={["#16C5E0", "#8DE016"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardSelected}
        >
          <View style={styles.gradientOverlay} />
          {icon}
          <Text style={[styles.cardText, { color: "white" }]}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.card}>
          {icon}
          <Text style={[styles.cardText, { color: "#42404E" }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SelectableCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF30",
  },
  cardSelected: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
  },
  cardText: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.5,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 10,
    marginTop: 12,
  },
});
