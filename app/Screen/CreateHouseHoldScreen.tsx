import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Snackbar from "react-native-snackbar";
import * as yup from "yup";

import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authstore";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { HomeStackParamList } from "../types/navigator_type";

// ✅ Validation
const schema = yup.object({
  name: yup
    .string()
    .required("Household name is required")
    .matches(/^[A-Za-z0-9 ]+$/, "Name can only contain letters and numbers"),
});

type FormValues = {
  name: string;
};

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "CreateHouseholdScreen"
>;

const CreateHouseholdScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      if (!user) {
        Snackbar.show({ text: "No logged-in user", backgroundColor: "red" });
        return;
      }

      // 1️⃣ Get current profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        Snackbar.show({
          text: profileError?.message || "Profile not found",
          backgroundColor: "red",
        });
        return;
      }

      // 2️⃣ Create household
      const { data: household, error: householdError } = await supabase
        .from("households")
        .insert({
          name: data.name,
          owner_profile_id: profile.id,
        })
        .select()
        .maybeSingle();

      if (householdError || !household) {
        Snackbar.show({
          text: householdError?.message || "Failed to create household",
          backgroundColor: "red",
        });
        return;
      }

      // 3️⃣ Update user's profile with household_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ household_id: household.id, family_role: "admin" })
        .eq("id", profile.id);

      if (updateError) {
        Snackbar.show({
          text: updateError.message || "Failed to link household",
          backgroundColor: "red",
        });
        return;
      }

      Snackbar.show({
        text: "Household created successfully!",
        backgroundColor: "#4BB543",
      });

      // 4️⃣ Navigate to main app
      navigation.navigate("Home");
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        backgroundColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, alignItems: "center", gap: 20, marginTop: 40 }}>
          <Text style={styles.heading}>Create Your Household</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Household Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
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
            <SecondaryButton
              label="Create Household"
              onPress={handleSubmit(onSubmit)}
              textStyle={{ color: "#FFFFFF" }}
              buttonStyle={{ backgroundColor: "#8C50FB", width: 300 }}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateHouseholdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDC2F9",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#342868",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    textAlign: "center",
  },
});
