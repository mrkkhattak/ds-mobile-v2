import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ItemType } from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileSchema } from "@/app/Schema/Schema";
import { UpdateProfileFormValues } from "@/app/types/types";
import { SecondaryButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";

// ✅ Validation Schema

interface ProfileScreenForm {
  onSubmit: (data: UpdateProfileFormValues) => Promise<void>;
}

const ProfileFormScreen = (props: ProfileScreenForm) => {
  const { onSubmit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState<string | null>(null);
  const [genderItems, setGenderItems] = useState<ItemType<string>[]>([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(
      ProfileSchema
    ) as unknown as Resolver<UpdateProfileFormValues>,
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

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
            Create Your Profile
          </MainHeading>

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
          {/* <Controller
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
                style={{ width: 330, borderColor: "#342868", marginTop: 10 }}
                textStyle={{ color: "#342868" }}
              />
            )}
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender.message}</Text>
          )} */}
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
              label="Submit"
              onPress={handleSubmit(onSubmit)}
              textStyle={{ color: "#FFFFFF" }}
              buttonStyle={{ backgroundColor: "#8C50FB", width: 300 }}
            />
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

export default ProfileFormScreen;

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
