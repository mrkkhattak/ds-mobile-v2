import MainLayout from "@/components/layout/MainLayout";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import CheckIcon from "../../assets/images/icons/check.svg";
import FamilyIcon from "../../assets/images/icons/icon (6).svg";
import KiteIcon from "../../assets/images/icons/icon (7).svg";
import HabitIcon from "../../assets/images/icons/wired-lineal-458-goal-target-hover-hit 1.svg";
// import KiteIcon from "../../assets/images/icons/kite.png";
import { MainButton } from "@/components/ui/Buttons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import TargetIcon from "../../assets/images/icons/icon (10).svg";
import PartyIcon from "../../assets/images/icons/icon (8).svg";
import SmileIcon from "../../assets/images/icons/icon (9).svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "YouAreInRightSpaceScreen"
>;
const cards = [
  {
    title: "Keeps you focused",
    subtitle: "so tasks actually get done",
    icon: <HabitIcon />,
  },
  {
    title: "Simplifies your routine",
    subtitle: "to reduce overwhelm",
    icon: <FamilyIcon />,
  },
  {
    title: "Frees up time",
    subtitle: "for the fun stuff",
    icon: <KiteIcon />,
  },
  {
    title: "Everyone pitches in",
    subtitle: "(without the nagging)",
    icon: <PartyIcon />,
  },
  {
    title: "Builds a positive habit",
    subtitle: "that sticks",
    icon: <SmileIcon />,
  },
  {
    title: "Celebrates progress",
    subtitle: "not perfection",
    icon: <TargetIcon />,
  },
];

const YouAreInRightSpaceScreen = () => {
  const progress = 0.98;
  const navigation = useNavigation<NavigationProp>();
  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <GradientProgressBar
            progress={progress}
            width={Platform.OS === "ios" ? 300 : 285}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Headings */}
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <MainHeading>You’re in the right place</MainHeading>
          <SubtitleText style={{ maxWidth: 300 }}>
            Here’s how Daily Spruce can lighten your load
          </SubtitleText>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {cards.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 20,
              }}
              key={index}
            >
              <CheckIcon />
              <View key={index} style={styles.card}>
                <View style={styles.textBox}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                {item.icon}
              </View>
            </View>
          ))}
        </View>
        <View
          style={{
            flexGrow: 1,
            justifyContent: "flex-end",

            width: "100%",
          }}
        >
          <MainButton
            onPress={() => {
              navigation.navigate("PaymentScreen");
            }}
            label="I’m ready"
            style={{ marginBottom: 10 }}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default YouAreInRightSpaceScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  cardsContainer: {
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  leftCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#57e69a",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  rightIcon: {
    width: 28,
    height: 28,
    marginLeft: 12,
    resizeMode: "contain",
  },
});
