import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import MainLayout from "@/components/layout/MainLayout";
import { SecondaryButton, TertiaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authstore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import * as yup from "yup";
import { getUserProfile } from "../functions/functions";
import { HomeStackParamList } from "../types/navigator_type";

// ✅ Validation Schema
const InviteSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Only letters allowed")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Only letters allowed")
    .required("Last name is required"),
  gender: yup.string().required("Gender is required"),
  familyRole: yup.string().required("Role is required"),
});

export type InviteFormValues = yup.InferType<typeof InviteSchema>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Home">;

const InviteUserScreen = () => {
  const user = useAuthStore((s) => s.user);

  const navigation = useNavigation<NavigationProp>();

  const [isLoading, setIsLoading] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState<string | null>(null);
  const [genderItems, setGenderItems] = useState<ItemType<string>[]>([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState<string | null>(null);
  const [roleItems, setRoleItems] = useState<ItemType<string>[]>([
    { label: "Father", value: "father" },
    { label: "Mother", value: "mother" },
    { label: "Child", value: "child" },
    { label: "Admin", value: "admin" },
    { label: "Guest", value: "guest" },
    { label: "Brother", value: "brother" },
  ]);
  const [houseHoldId, setHouseHoldId] = useState<string | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: yupResolver(
      InviteSchema
    ) as unknown as Resolver<InviteFormValues>,
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsLoading(true);
    try {
      console.log("__DEV__", __DEV__);
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        familyRole: data.familyRole,
        houseHoldId, // make sure this variable is defined in your component
        redirectTo: __DEV__
          ? "exp://192.168.100.24:8081/--/Screen/ConfirmEmail"
          : "dailyspruce://Screen/ConfirmEmail",
      };

      const { data: inviteData, error } = await supabase.functions.invoke(
        "inviteUser",
        { body: payload }
      );

      if (error) {
        console.log(error);
        Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        return;
      }

      Snackbar.show({
        text: `Invite email sent successfully to ${data.email}!`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "green",
      });
      navigation.navigate("Settings");
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data: profile, error } = await getUserProfile(user.id);

        if (error) {
          console.log(error);
          Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          return;
        }
        console.log("profile", profile);
        setHouseHoldId(profile.household_id);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
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
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={{ flex: 1, alignItems: "center", gap: 20, marginTop: 40 }}>
          <MainHeading style={{ color: "#342868" }}>
            Invite a New User
          </MainHeading>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* First Name */}
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="First Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName.message}</Text>
          )}

          {/* Last Name */}
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Last Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName.message}</Text>
          )}

          {/* Gender Dropdown */}
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange } }) => (
              <DropDownPicker
                open={genderOpen}
                value={genderValue}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={(val: any) => {
                  const v = val() as string;
                  setGenderValue(v);
                  onChange(v);
                }}
                setItems={setGenderItems}
                placeholder="Select Gender"
                style={{
                  width: 330,
                  borderColor: "#342868",
                  marginTop: 10,
                }}
                textStyle={{ color: "#342868" }}
                zIndex={3000}
              />
            )}
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
          )}

          <Controller
            control={control}
            name="familyRole"
            render={({ field: { onChange } }) => (
              <DropDownPicker
                open={roleOpen}
                value={roleValue}
                items={roleItems}
                setOpen={setRoleOpen}
                setValue={(val: any) => {
                  const v = val() as string;
                  setRoleValue(v);
                  onChange(v);
                }}
                setItems={setRoleItems}
                placeholder="Select Role"
                style={{
                  width: 330,
                  borderColor: "#342868",
                  marginTop: 10,
                }}
                textStyle={{ color: "#342868" }}
                zIndex={1000}
              />
            )}
          />
          {errors.familyRole && (
            <Text style={styles.errorText}>{errors.familyRole.message}</Text>
          )}
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#8C50FB" />
          ) : (
            <>
              <SecondaryButton
                label="Send Invite"
                onPress={handleSubmit(onSubmit)}
                textStyle={{ color: "#FFFFFF" }}
                buttonStyle={{ backgroundColor: "#8C50FB", width: 300 }}
              />
              <TertiaryButton
                label="Back"
                onPress={() => navigation.goBack()}
                textStyle={{ color: "#8C50FB" }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  width: 300,
                  borderWidth: 1,
                  borderColor: "#8C50FB",
                  marginTop: 10,
                }}
              />
            </>
          )}
        </View>
      </KeyboardAwareScrollView>

      <SubtitleText
        style={{
          color: "#342868",
          paddingBottom: 10,
          marginTop: 10,
          marginHorizontal: 40,
        }}
      >
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </SubtitleText>
    </SafeAreaView>
  );
};

export default InviteUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDC2F9",
    paddingVertical: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    textAlign: "center",
  },
});
