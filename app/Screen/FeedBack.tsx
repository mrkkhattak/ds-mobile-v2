import Header from "@/components/Header/Header";
import MainLayout from "@/components/layout/MainLayout";
import { CustomButton } from "@/components/ui/Buttons";
import { CustomInput } from "@/components/ui/CustomTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";
import CrossIcon from "../../assets/images/icons/Vector (7).svg";
import { feedbackSchema } from "../Schema/Schema";

type FeedbackForm = {
  name: string;
  feedback: string;
  email: string;
};

const FeedBack = () => {
  const navigation = useNavigation<any>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      name: "",
      feedback: "",
      email: "",
    },
  });

  const onSubmit = (data: FeedbackForm) => {
    const subject = "Feedback";
    const body = `
Name: ${data.name}
Email: ${data.email}

Feedback:
${data.feedback}
  `;

    const mailto = `mailto:kmuizz319@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailto);
  };

  return (
    <MainLayout>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingVertical: 20 }}>
          <Header
            label=""
            screenName="FeedBack"
            icon={<MenuIcon />}
            navigation={() => navigation.navigate("MainMenu")}
          />
        </View>

        <View style={styles.container}>
          <View style={styles.topActions}>
            <CustomButton
              label="SUBMIT"
              onPress={handleSubmit(onSubmit)}
              viewStyle={{ width: 100 }}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <CrossIcon />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* NAME */}
            <Text style={styles.label}>YOUR NAME*</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <CustomInput value={value} onChangeText={onChange} />
              )}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}

            {/* FEEDBACK */}
            <Text style={[styles.label, { marginTop: 20 }]}>FEEDBACK*</Text>
            <Controller
              control={control}
              name="feedback"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={6}
                  containerStyle={{
                    height: 300,

                    alignItems: "flex-start",
                  }}
                />
              )}
            />
            {errors.feedback && (
              <Text style={styles.error}>{errors.feedback.message}</Text>
            )}

            {/* EMAIL */}
            <Text style={[styles.label, { marginTop: 20 }]}>
              EMAIL ADDRESS*
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <CustomInput value={value} onChangeText={onChange} />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </MainLayout>
  );
};

export default FeedBack;

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    margin: 20,
  },
  label: {
    fontSize: 14,
    color: "rgba(66, 64, 78, 1)",
    marginBottom: 5,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
