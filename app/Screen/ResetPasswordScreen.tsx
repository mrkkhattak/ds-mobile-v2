import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authstore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as yup from "yup";
import EyeIcon from "../../assets/images/icons/eye 1.svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ResetPasswordScreen"
>;

const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

type FormValues = {
  newPassword: string;
  confirmNewPassword: string;
};

const ResetPasswordScreen = () => {
  const [securePassword, setSecurePassword] = React.useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] =
    React.useState(true);

  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = React.useState(false);
  const setIsPasswordRecovery = useAuthStore((s) => s.setIsPasswordRecovery);
  const signOut = useAuthStore((s) => s.signOut);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        Alert.alert("Error", error.message || "Failed to update password");
        return;
      }

      // Clear recovery flag and sign out
      setIsPasswordRecovery(false);
      await signOut();

      Alert.alert(
        "Success",
        "Password updated successfully! You can now login with your new password.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.content}>
        <MainHeading style={{ color: "#342868" }}>Reset Password</MainHeading>

        <SubtitleText
          style={{
            color: "#342868",
            textAlign: "center",
            marginTop: 10,
            marginHorizontal: 40,
          }}
        >
          Enter your new password below
        </SubtitleText>

        {/* New Password Field */}
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              placeholder="New Password"
              onChangeText={onChange}
              value={value}
              icon={
                <TouchableOpacity
                  onPress={() => setSecurePassword(!securePassword)}
                >
                  <EyeIcon />
                </TouchableOpacity>
              }
              secureTextEntry={securePassword}
            />
          )}
        />

        {errors.newPassword && (
          <SubtitleText style={{ color: "red", marginTop: 5 }}>
            {errors.newPassword.message}
          </SubtitleText>
        )}

        {/* Confirm New Password Field */}
        <Controller
          control={control}
          name="confirmNewPassword"
          render={({ field: { value, onChange } }) => (
            <CustomInput
              placeholder="Confirm New Password"
              onChangeText={onChange}
              value={value}
              icon={
                <TouchableOpacity
                  onPress={() =>
                    setSecureConfirmPassword(!secureConfirmPassword)
                  }
                >
                  <EyeIcon />
                </TouchableOpacity>
              }
              secureTextEntry={secureConfirmPassword}
            />
          )}
        />

        {errors.confirmNewPassword && (
          <SubtitleText style={{ color: "red", marginTop: 5 }}>
            {errors.confirmNewPassword.message}
          </SubtitleText>
        )}

        {/* Submit Button */}
        <View style={{ marginTop: 30 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#8C50FB" />
          ) : (
            <SecondaryButton
              label="Update Password"
              onPress={handleSubmit(onSubmit)}
              buttonStyle={{ backgroundColor: "#8C50FB" }}
              textStyle={{ color: "#FFFFFF" }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
