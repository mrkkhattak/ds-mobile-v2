import ProfileFormScreen from "@/components/Form/ProfileForm";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/authstore";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import { createUserProfile } from "../functions/functions";
import { HomeStackParamList } from "../types/navigator_type";
import { UpdateProfileFormValues } from "../types/types";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "ProfileScreen"
>;
const ProfileScreen = () => {
  const naviagation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const [laoding, setIsLoading] = useState(false);

  const onSubmit = async (data: UpdateProfileFormValues) => {
    console.log(data);
    setIsLoading(true);
    try {
      if (!user) {
        Snackbar.show({
          text: "No logged-in user found",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        return;
      }
      console.log("user.id====>", user.id);
      const { data: profileData, error } = await createUserProfile(
        user.id,
        data.firstName,
        data.lastName,
        data.gender
      );

      if (error) {
        Snackbar.show({
          text: error.message || "Failed to create profile",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        return;
      }
      Snackbar.show({
        text: "Profile created successfully!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#4BB543", // green
      });
      // Navigate to main app screen
      naviagation.navigate("Home");
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (laoding) {
    return (
      <MainLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#8C50FB" />
        </View>
      </MainLayout>
    );
  }
  return <ProfileFormScreen onSubmit={onSubmit} />;
};

export default ProfileScreen;

const styles = StyleSheet.create({});
