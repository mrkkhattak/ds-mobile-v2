import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import GradientProgressBar from "@/components/ui/GradentProgress";
import { MainHeading, SubtitleText } from "@/components/ui/Heading";
import { useTaskStore } from "@/store/taskStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as yup from "yup";
import EliplseIcon from "../../assets/images/icons/Ellipse 5.svg";
import TidyIcon from "../../assets/images/icons/fi_8515821.svg";
import GroupStartIcon from "../../assets/images/icons/Group_3.svg";
import RightIcon from "../../assets/images/icons/right (1).svg";
import VacuumIcon from "../../assets/images/icons/vacuum-cleaner 1.svg";
import CleanIcon from "../../assets/images/icons/Vector (1).svg";
import FurnitureIcon from "../../assets/images/icons/Vector (2).svg";
import { AuthStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SetUpYourHomeScreen"
>;
// Task type
type Task = {
  label: string;
  icon: JSX.Element;
};

// Form values type
type FormValues = {
  tasks: string[];
};

// Yup validation: at least one task selected
const schema = yup.object({
  tasks: yup.array().min(1, "Please select at least one task").required(),
});

const PickYourTaskScreen: React.FC = () => {
  const [isChecked, setChecked] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { setSelectedTask } = useTaskStore();
  const progress = 0.9;

  const taskList: Task[] = [
    { icon: <GroupStartIcon />, label: "Declutter surfaces" },
    { icon: <VacuumIcon />, label: "Vacuum floors" },
    { icon: <CleanIcon />, label: "Clean windows and mirrors" },
    { icon: <TidyIcon />, label: "Tidy cushions" },
    { icon: <FurnitureIcon />, label: "Clean under furniture" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { tasks: [] },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Selected tasks:", data.tasks);
    setSelectedTask(data.tasks);
    navigation.navigate("SettingUpYourRoomScreen");
    // Navigate to next screen
  };

  return (
    <MainLayout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: 24,
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.progressRow}>
          <GradientProgressBar
            progress={progress}
            width={Platform.OS === "ios" ? 300 : 285}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Headings */}
        <View style={{ marginTop: 32 }}>
          <MainHeading>Pick your tasks</MainHeading>
          <SubtitleText style={{ maxWidth: 300 }}>
            We’ve done the thinking — just pick what fits your space, and we’ll
            add them to your library!
          </SubtitleText>
        </View>
        <FlatList
          contentContainerStyle={styles.scroll}
          data={taskList}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <Controller
              control={control}
              name="tasks"
              render={({ field: { value, onChange } }) => {
                const isSelected = value.includes(item.label);

                const toggleTask = () => {
                  if (isSelected) {
                    onChange(value.filter((v) => v !== item.label));
                  } else {
                    onChange([...value, item.label]);
                  }
                };

                return (
                  <TouchableOpacity
                    onPress={toggleTask}
                    style={{
                      width: "100%",
                      marginTop: 24,
                    }}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={["#16C5E0", "#8DE016"]}
                        start={{ x: 0.08, y: 0 }}
                        end={{ x: 0.97, y: 1 }}
                        style={styles.taskRow}
                      >
                        <View style={styles.taskLeft}>
                          {item.icon}
                          <Text style={[styles.taskLabel, { color: "#fff" }]}>
                            {item.label}
                          </Text>
                        </View>
                        <RightIcon />
                      </LinearGradient>
                    ) : (
                      <View style={styles.taskRow}>
                        <View style={styles.taskLeft}>
                          {item.icon}
                          <Text style={styles.taskLabel}>{item.label}</Text>
                        </View>
                        <EliplseIcon />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        />

        {/* ✅ Select All Checkbox */}
        <Controller
          control={control}
          name="tasks"
          render={({ field: { value, onChange } }) => (
            <View
              style={{
                marginLeft: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Checkbox
                style={{ borderRadius: 50 }}
                value={isChecked}
                onValueChange={(checked) => {
                  setChecked(checked);
                  if (checked) {
                    // Select all
                    onChange(taskList.map((t) => t.label));
                  } else {
                    // Deselect all
                    onChange([]);
                  }
                }}
                color={isChecked ? "#00C048" : undefined}
              />
              <Text
                style={{
                  fontFamily: "inter",
                  fontWeight: "500",
                  fontSize: 13,
                  lineHeight: 18,
                  color: "#FFFFFF",
                }}
              >
                Select all tasks in this room
              </Text>
            </View>
          )}
        />
        <MainButton
          onPress={handleSubmit(onSubmit)}
          label="NEXT"
          style={{ marginBottom: 10 }}
        />
        <MainButton
          onPress={() => {
            navigation.goBack();
          }}
          label="BACK"
          style={{ marginBottom: 30 }}
        />
      </ScrollView>
    </MainLayout>
  );
};

export default PickYourTaskScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 24,

    alignItems: "center",
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
  taskRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,

    width: "90%",
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskLabel: {
    fontSize: 16,
    color: "#000",
  },
});
