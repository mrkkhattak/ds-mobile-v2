import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as yup from "yup";
import EyeIcon from "../../assets/images/icons/eye 1.svg";
import PencilIcon from "../../assets/images/icons/pencil.svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CreateYourAccountScreen"
>;
// ✅ Validation Schema
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?\":{}|<>]/,
      "Must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [securePassword, setSecurePassword] = React.useState(true);
  const [secureConfirm, setSecureConfirm] = React.useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
          Create your Daily Spruce account
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

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              placeholder="Confirm Password"
              value={value}
              onChangeText={onChange}
              icon={
                <TouchableOpacity
                  onPress={() => setSecureConfirm(!secureConfirm)}
                >
                  <EyeIcon />
                </TouchableOpacity>
              }
              secureTextEntry={secureConfirm}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
      >
        <SecondaryButton
          label="Next"
          onPress={handleSubmit(onSubmit)}
          textStyle={{ color: "#FFFFFF" }}
          buttonStyle={{ backgroundColor: "#8C50FB" }}
        />
        <SecondaryButton
          label="Back"
          onPress={() => {
            navigation.goBack();
          }}
          textStyle={{ color: "#34276C" }}
          buttonStyle={{ backgroundColor: "#FFFFFF", marginTop: 10 }}
        />
      </View>

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

export default SignupScreen;

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
