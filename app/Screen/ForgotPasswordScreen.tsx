import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as yup from "yup";
import PencilIcon from "../../assets/images/icons/pencil.svg";

import { useNavigation } from "expo-router";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreateYourAccountScreen"
>;
// ✅ Validation Schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormValues = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const naviagation = useNavigation<NavigationProp>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    // try {
    //   const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    //     redirectTo: "https://yourapp.supabase.co/auth/v1/callback", // change to your redirect URL
    //   });
    //   if (error) throw error;
    //   Alert.alert(
    //     "Reset Link Sent",
    //     "If an account exists with this email, you'll receive a reset link shortly."
    //   );
    // } catch (error: any) {
    //   Alert.alert("Error", error.message || "Something went wrong");
    // }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.content}>
        <MainHeading style={{ color: "#342868" }}>
          Forgot your password?
        </MainHeading>

        <SubtitleText
          style={{
            color: "#342868",
            textAlign: "center",
            marginTop: 10,
            marginHorizontal: 40,
          }}
        >
          Enter your registered email and we’ll send you a link to reset your
          password.
        </SubtitleText>

        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              placeholder="Your email"
              onChangeText={onChange}
              value={value}
              icon={<PencilIcon />}
              secureTextEntry={false}
            />
          )}
        />

        {errors.email && (
          <SubtitleText style={{ color: "red", marginTop: 5 }}>
            {errors.email.message}
          </SubtitleText>
        )}

        {/* Submit Button */}
        <View style={{ marginTop: 30 }}>
          <SecondaryButton
            label={isSubmitting ? "Sending..." : "Send Reset Link"}
            onPress={handleSubmit(onSubmit)}
            buttonStyle={{ backgroundColor: "#8C50FB" }}
            textStyle={{ color: "#FFFFFF" }}
          />
          <SecondaryButton
            label="Back"
            onPress={() => {
              naviagation.goBack();
            }}
            textStyle={{ color: "#34276C" }}
            buttonStyle={{ backgroundColor: "#FFFFFF", marginTop: 10 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDC2F9",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});
