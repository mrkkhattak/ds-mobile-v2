import MainLayout from "@/components/layout/MainLayout";
import { SecondaryButton, TertiaryButton } from "@/components/ui/Buttons";
import {
  MainHeading,
  SecondryHeading,
  SubtitleText,
} from "@/components/ui/Heading";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

import { useNavigation } from "expo-router";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreateYourAccountScreen"
>;
const CreateYourAccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <MainLayout>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 10,
          marginRight: 15,
        }}
      >
        <TertiaryButton
          label={"Login"}
          onPress={() => {
            navigation.navigate("Login");
          }}
          buttonStyle={{ backgroundColor: "#DDC2F9" }}
          textStyle={{ color: "#34276C" }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Image
          source={require("../../assets/images/family.png")}
          resizeMode="cover"
          style={{ height: 220, width: "100%" }}
        />
      </View>
      <View style={{ flex: 1, backgroundColor: "#DDC2F9" }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <MainHeading
                style={{ color: "#342868", fontWeight: "700", fontSize: 28 }}
              >
                Create your account
              </MainHeading>
              <SecondryHeading
                style={{
                  color: "#342868",
                  lineHeight: 20,
                  fontSize: 15,
                  paddingHorizontal: 50,
                  marginTop: 20,
                  textAlign: "center",
                }}
              >
                So that you can invite your household members to the app so they
                can view tasks and join spruces.
              </SecondryHeading>
            </View>

            <View style={{ alignItems: "center", gap: 15, width: "100%" }}>
              <SecondaryButton
                label="Sign up with email"
                onPress={() => {
                  navigation.navigate("Register");
                }}
                textStyle={{ color: "#FFFFFF" }}
                buttonStyle={{ backgroundColor: "#8C50FB" }}
              />
              <SecondaryButton
                label="Sign up with Apple"
                onPress={() => {
                  navigation.goBack();
                }}
                textStyle={{ color: "#34276C" }}
                buttonStyle={{ backgroundColor: "#FFFFFF" }}
              />
              <SubtitleText style={{ color: "#342868", paddingBottom: 10 }}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </SubtitleText>
            </View>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default CreateYourAccountScreen;
