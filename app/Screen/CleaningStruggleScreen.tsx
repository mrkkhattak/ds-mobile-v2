import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { useCleaningStruggleStore } from "@/store/cleaningStrugglesStore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import CalanderIcon from "../../assets/images/icons/calendarIcon.svg";
import CleaningIcon from "../../assets/images/icons/cleaningIcon.svg";
import SadIcon from "../../assets/images/icons/icon (2).svg";
import Icon3 from "../../assets/images/icons/icon (3).svg";
import Icon4 from "../../assets/images/icons/icon (4).svg";
import Icon5 from "../../assets/images/icons/icon (5).svg";
import WireIcon from "../../assets/images/icons/wired-lineal-1706-duster-hover-pinch 1.svg";
import RefreshIcon from "../../assets/images/icons/wired-lineal-233-arrow-22-hover-cycle 1.svg";
import { AuthStackParamList } from "../types/navigator_type";
type FormValues = {
  struggles: string[];
  otherText: string;
};

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CleaningStruggleScreen"
>;
const schema = yup.object().shape({
  struggles: yup
    .array()
    .of(yup.string())
    .test(
      "one-required",
      "Please select at least one option or provide your own reason.",
      function (value) {
        const { otherText } = this.parent;
        return (
          (value && value.length > 0) || (otherText && otherText.trim() !== "")
        );
      }
    ),
  otherText: yup.string().optional(),
});

const OPTIONS = [
  { icon: <CleaningIcon />, Label: "All the cleaning falls to me" },
  { icon: <CalanderIcon />, Label: "I’m wasting my weekends cleaning" },
  { icon: <RefreshIcon />, Label: "Cleaning feels endless" },
  { icon: <SadIcon />, Label: "It’s hard to get started" },
  { icon: <Icon3 />, Label: "I feel like I don’t have time" },
  { icon: <Icon4 />, Label: "I want to stay on top of things" },
  { icon: <WireIcon />, Label: "I want it to feel easier" },
  { icon: <Icon5 />, Label: "Honestly, I’m just overwhelmed" },
  { icon: undefined, Label: "Other" },
];

const CleaningStruggleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const progress = 0.3;
  const { setStruggles, setOtherText } = useCleaningStruggleStore();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: { struggles: [], otherText: "" },
  });

  const selected = watch("struggles");
  const otherSelected = selected.includes("Other");

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setValue(
        "struggles",
        selected.filter((i) => i !== option)
      );
    } else {
      setValue("struggles", [...selected, option]);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Saved to store:", data);
    setStruggles(data.struggles);
    setOtherText(data.otherText || "");
    console.log("Saved to store:", data);
    navigation.navigate("SetUpYourHomeScreen");
  };
  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <GradientProgressBar
            progress={progress}
            width={Platform.OS === "ios" ? 300 : 285}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Headings */}
        <View style={{ marginTop: 32 }}>
          <MainHeading>What’s your cleaning struggle?</MainHeading>
          <SubtitleText>(you can select multiple options)</SubtitleText>
        </View>

        {/* Option Cards */}
        <Controller
          control={control}
          name="struggles"
          render={() => (
            <View style={styles.grid}>
              {OPTIONS.map((option, idx) => {
                const isSelected = selected.includes(option.Label);

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleOption(option.Label)}
                    activeOpacity={0.85}
                    style={{ width: "45%" }}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={["#16C5E0", "#8DE016"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardSelected}
                      >
                        <View style={styles.gradientOverlay} />
                        {option.icon}
                        <Text style={[styles.cardText, { color: "white" }]}>
                          {option.Label}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.card}>
                        {option.icon}
                        <Text style={[styles.cardText, { color: "#42404E" }]}>
                          {option.Label}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {/* Other Text Input (only visible if “Other” selected) */}
        {otherSelected && (
          <Controller
            control={control}
            name="otherText"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginTop: 20, width: "90%" }}>
                <Text style={styles.otherLabel}>Please specify</Text>
                <TextInput
                  placeholder="Type your reason..."
                  placeholderTextColor="#AAA"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              </View>
            )}
          />
        )}

        {/* Validation Error */}
        {errors.struggles && (
          <Text style={styles.errorText}>{errors.struggles.message}</Text>
        )}

        {/* NEXT Button */}

        <MainButton onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </MainLayout>
  );
};

export default CleaningStruggleScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF30",
  },

  cardSelected: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
  },

  cardText: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.5,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 10,
    marginTop: 12,
  },
  otherLabel: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF40",
    borderRadius: 12,
    padding: 10,
    color: "#fff",
  },
  errorText: {
    color: "#FF7F7F",
    fontSize: 13,
    marginTop: 8,
  },
  nextButton: {
    width: "90%",
    marginTop: 40,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#16C5E0",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
});
