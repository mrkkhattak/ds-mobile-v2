import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FeatureCardProps {
  Icon: React.FC<any>;
  label: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  Icon,
  label,
  description,
}) => {
  return (
    <View style={styles.card}>
      <Icon />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default FeatureCard;

const styles = StyleSheet.create({
  card: {
    width: 283,
    height: 409,
    backgroundColor: "#F6F5F7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 36,
    letterSpacing: -0.01,
    color: "#6530D0",
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontFamily: "Inter",
    fontWeight: "300",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.01,
    color: "#362B32",
    textAlign: "center",
    marginTop: 10,
  },
});
