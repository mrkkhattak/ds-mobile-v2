import MainLayout from "@/components/layout/MainLayout";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

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
    }, 5000);
  }, []);
  return (
    <MainLayout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 24,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flex: 2 }}>
          <View style={styles.progressRow}>
            {/* <GradientProgressBar
              progress={progress}
              width={Platform.OS === "ios" ? 300 : 285}
            />
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text> */}
          </View>

          {/* Headings */}
          <View style={{ marginTop: 32 }}>
            <MainHeading>Setting up your Daily Spruce...</MainHeading>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SecondryHeading style={{ color: "#FFFFFF" }}>
            Creating your home...
          </SecondryHeading>
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
