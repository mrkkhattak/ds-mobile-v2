import MainLayout from "@/components/layout/MainLayout";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import React, { useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

import { MainButton } from "@/components/ui/Buttons";
import { useNavigation } from "expo-router";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SettingUpYourRoomScreen"
>;
const SettingUpYourRoomScreen = () => {
  const progress = 0.95;
  const navigation = useNavigation<NavigationProp>();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("CreateYourAccountScreen");
    }, 2000);
  }, []);
  return (
    <MainLayout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,

          paddingVertical: 24,
        }}
      >
        <View style={{ flex: 2 }}>
          <View style={styles.progressRow}>
            <GradientProgressBar
              progress={progress}
              width={Platform.OS === "ios" ? 300 : 285}
            />
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          {/* Headings */}
          <View style={{ marginTop: 32 }}>
            <MainHeading>Setting up your Daily Spruce...</MainHeading>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <SecondryHeading style={{ color: "#FFFFFF" }}>
            Creating your home...
          </SecondryHeading>
        </View>
        <View
          style={{
            flex: 1,

            justifyContent: "flex-end",
          }}
        >
          <MainButton
            onPress={() => {}}
            label="NEXT"
            style={{ marginBottom: 10 }}
          />
          <MainButton
            onPress={() => {}}
            label="BACK"
            style={{ marginBottom: 30 }}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default SettingUpYourRoomScreen;

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
