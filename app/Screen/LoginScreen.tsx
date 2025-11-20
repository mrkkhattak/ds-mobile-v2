import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";

import EyeIcon from "../../assets/images/icons/eye 1.svg";
import PencilIcon from "../../assets/images/icons/pencil.svg";

import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

import { useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreateYourAccountScreen"
>;
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormValues = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const naviagation = useNavigation<NavigationProp>();
  const [securePassword, setSecurePassword] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        // Check if error is due to unconfirmed email
        if (error.message?.includes("Email not confirmed")) {
          Alert.alert(
            "Email Not Confirmed",
            "Please check your email and click the confirmation link before logging in."
          );
        } else {
          Alert.alert("Login Error", error.message || "Invalid credentials");
        }
        return;
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            gap: 20,
            marginTop: 40,
          }}
        >
          <MainHeading style={{ color: "#342868" }}>
            Welcome Back to Daily Spruce
          </MainHeading>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Your email"
                value={value}
                onChangeText={onChange}
                icon={<PencilIcon />}
                secureTextEntry={false}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Password"
                value={value}
                onChangeText={onChange}
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
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* Forgot Password */}
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginRight: 40 }}
            onPress={() => naviagation.navigate("ForgotPasswordScreen")}
          >
            <Text style={{ color: "#342868", fontSize: 14, fontWeight: "500" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#8C50FB" />
          ) : (
            <SecondaryButton
              label="Login"
              onPress={handleSubmit(onSubmit)}
              textStyle={{ color: "#FFFFFF" }}
              buttonStyle={{ backgroundColor: "#8C50FB" }}
            />
          )}
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        onPress={() => {
          naviagation.navigate("Register");
        }}
      >
        <SubtitleText
          style={{
            color: "#342868",
            paddingBottom: 10,
            marginTop: 10,
            marginHorizontal: 40,
            textAlign: "center",
          }}
        >
          Don’t have an account?{" "}
          <Text style={{ fontWeight: "700" }}>Sign Up</Text>
        </SubtitleText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDC2F9",
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    textAlign: "center",
  },
});
