import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { RoomSelector } from "@/components/ui/RoomComponent";
import { useRoomSelectionStore } from "@/store/roomSelectionStore";
import { yupResolver } from "@hookform/resolvers/yup"; // Import yupResolver
import { useNavigation } from "@react-navigation/native";
import { Controller, Resolver, useForm } from "react-hook-form"; // Import necessary hooks
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as yup from "yup"; // Import yup for validation
import HomeIcon from "../../assets/images/icons/home.svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SetUpYourHomeScreen"
>;
const ALL_ROOMS = [
  "LIVING ROOM",
  "KITCHEN",
  "DINING",
  "BATHROOM / ENSUITE",
  "LAUNDRY",
  "HALLWAY / ENTRY",
  "OFFICE / STUDY",
  "PLAYROOM",
  "MULTI-PURPOSE ROOM",
  "GARAGE",
  "OUTDOOR AREA",
];

type FormData = {
  selectedRooms: string[];
};
const defaultValues = {
  selectedRooms: [],
};

const validationSchema = yup.object().shape({
  selectedRooms: yup
    .array()
    .min(1, "Please select at least one room to continue.")
    .required("Room selection is required."),
});

const SetUpYourHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const progress = 0.6;
  const { setSelectedRooms } = useRoomSelectionStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<FormData>,
    mode: "onChange",
  });

  const selectedRooms = watch("selectedRooms");

  const handleToggleRoom = (room: any) => {
    const currentRooms = selectedRooms;
    if (currentRooms.includes(room)) {
      setValue(
        "selectedRooms",
        currentRooms.filter((r) => r !== room),
        { shouldValidate: true }
      );
    } else {
      setValue("selectedRooms", [...currentRooms, room], {
        shouldValidate: true,
      });
    }
  };
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data.selectedRooms);
    setSelectedRooms(data.selectedRooms); // ✅ save to global store
    console.log("Form Data:", data.selectedRooms);
    navigation.navigate("PickYourTaskScreen");
  };

  return (
    <MainLayout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 24,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "90%" }}
        >
          <GradientProgressBar
            progress={progress}
            width={Platform.OS === "ios" ? 300 : 285}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <View style={{ marginTop: 32, alignItems: "center" }}>
          <MainHeading>Set up your home</MainHeading>
          <SubtitleText style={{ maxWidth: 200, textAlign: "center" }}>
            We’ll suggest & assign tasks based on your home
          </SubtitleText>
        </View>
        <View style={styles.roomSectionWrapper}>
          <View style={styles.homeIconContainer}>
            <HomeIcon />
          </View>
          <Controller
            control={control}
            name="selectedRooms"
            render={({ field: { value } }) => (
              <RoomSelector
                selectedRooms={value}
                ALL_ROOMS={ALL_ROOMS}
                onToggleRoom={(room: any) => handleToggleRoom(room)}
              />
            )}
          />
        </View>

        {errors.selectedRooms && (
          <Text
            style={{
              color: "red",
              marginTop: 5,
              fontSize: 14,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {errors.selectedRooms.message}
          </Text>
        )}

        <MainButton
          onPress={handleSubmit(onSubmit)} // Use handleSubmit from RHF
          label="NEXT"
          style={{ marginTop: 30 }}
        />
        <MainButton
          onPress={() => {
            navigation.goBack();
          }}
          style={{ marginTop: 10, backgroundColor: "transparent" }} // Make BACK button visually less prominent
          label={"BACK"}
        />
      </ScrollView>
    </MainLayout>
  );
};

export default SetUpYourHomeScreen;

const styles = StyleSheet.create({
  scroll: {},
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
  houseIconPlaceholder: {
    // Placeholder for the house icon image above the room card
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white", // Placeholder color
    position: "absolute",
    top: 60,
    zIndex: 1,
  },

  cardTitle: {
    color: "#42404E",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    color: "#42404E",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },

  // Tags Section Styles
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  roomTag: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderWidth: 1,
  },
  roomTagSelected: {
    backgroundColor: "#9B59B6", // Selected color (vibrant purple)
    borderColor: "#9B59B6",
  },
  roomTagUnselected: {
    backgroundColor: "#D9D9D9A6", // Unselected color (matching card background)
    borderColor: "#D9D9D9A6", // Light border
  },
  roomTagText: {
    color: "#42404E",
    fontWeight: "600",
    fontSize: 14,
  },

  // Crew Section Specific Styles
  crewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  crewIconPlaceholder: {
    // Placeholder for the person icon
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 10,
  },
  addMemberButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  addMemberButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Validation Error Text
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  roomSectionWrapper: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginTop: 20,
  },
  homeIconContainer: {
    position: "absolute",
    top: -10,
    zIndex: 10,
  },
});
