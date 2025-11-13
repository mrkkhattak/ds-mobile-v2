import MainLayout from "@/components/layout/MainLayout";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import RemoveIcon from "@/assets/images/icons/remove.svg";
import AddIcon from "@/assets/images/icons/smallAddIcon.svg";
import HomeIcon from "@/assets/images/icons/Vector (3).svg";
import { useAuthStore } from "@/store/authstore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback } from "react";
import Snackbar from "react-native-snackbar";
import GoToIcon from "../../assets/images/icons/Go-To (2).svg";
import GoToSelected from "../../assets/images/icons/Go-To.svg";
import IdeaSelectedIcon from "../../assets/images/icons/Ideas (1).svg";
import IdeaIcon from "../../assets/images/icons/Ideas.svg";
import LimeIcon from "../../assets/images/icons/Lime.svg";
import PackSelectedIcon from "../../assets/images/icons/Packs (1).svg";
import PackIcon from "../../assets/images/icons/Packs.svg";
import RepeatSelectedIcon from "../../assets/images/icons/Repeat (1).svg";
import RepeatIcon from "../../assets/images/icons/Repeat.svg";
import {
  assignTaskToUser,
  fetchAndGroupTasks,
  getAssignedSpruceTasks,
  removeAssignedTask,
  SpruceTaskDetails,
} from "../functions/functions";

import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { HomeStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TaskLibrary"
>;
const TaskList = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((e) => e.user);
  const [selectedTab, setSelectedTab] = useState("Go-To");
  const [selectedSubTab, setSelectedSubTab] = useState("Kitchen");
  const [groupData, setGroupData] = useState<any>({});
  const [myTasks, setMyTasks] = useState<SpruceTaskDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tabList = [
    {
      label: "Go-To",
      selectedIcon: <GoToSelected />,
      unselectedIcon: <GoToIcon />,
    },
    {
      label: "Repeat",
      selectedIcon: <RepeatSelectedIcon />,
      unselectedIcon: <RepeatIcon />,
    },
    {
      label: "Ideas",
      selectedIcon: <IdeaSelectedIcon />,
      unselectedIcon: <IdeaIcon />,
    },
    {
      label: "Packs",
      selectedIcon: <PackSelectedIcon />,
      unselectedIcon: <PackIcon />,
    },
  ];

  const subTabList = [
    "Kitchen",
    "Bedroom",
    "LivingRoom",
    "BathRoom",
    "General Cleaning",
    "Outdoor",
  ];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          setLoading(true);

          // 1️⃣ Fetch grouped tasks
          const result = await fetchAndGroupTasks();
          if (isActive && result) {
            setGroupData(result);
          }

          // 2️⃣ Fetch assigned tasks (if user exists)
          if (user) {
            const assignedTasks = await getAssignedSpruceTasks(user.id);
            if (isActive && assignedTasks) {
              setMyTasks(assignedTasks);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching grouped or assigned tasks:", error);
          setLoading(false);
        }
      };

      fetchData();

      // Cleanup on unmount or when screen loses focus
      return () => {
        isActive = false;
      };
    }, [user])
  );

  // get the list of tasks for selected subTab
  const currentTasks = groupData[selectedSubTab] || [];

  const sortedTasks = [...currentTasks].sort((a, b) => {
    const aAssigned = myTasks.some((task) => task.task_id === a.id);
    const bAssigned = myTasks.some((task) => task.task_id === b.id);

    if (aAssigned === bAssigned) return 0; // same status, keep order
    if (aAssigned) return 1; // a is assigned, move down
    return -1; // a is unassigned, stay on top
  });

  if (loading) {
    return (
      <MainLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={"#16C5E0"} />
        </View>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <View style={{ marginTop: 60 }}>
        <View style={{ marginHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MainHeading style={{ textAlign: "left" }}>
              Task Library
            </MainHeading>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <HomeIcon />
            </TouchableOpacity>
          </View>
          <SecondryHeading
            style={{
              textAlign: "left",
              color: "white",
              fontWeight: "300",
              fontFamily: "inter",
              fontSize: 14,
              marginTop: 5,
            }}
          >
            SELECT TASKS TO ADD TO TODAY’S SPRUCE
          </SecondryHeading>
        </View>

        {/* Horizontal Main Tabs */}
        <View style={{ marginTop: 30 }}>
          <FlatList
            data={tabList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.label}
            contentContainerStyle={styles.tabContainer}
            renderItem={({ item }) => {
              const isSelected = selectedTab === item.label;
              return (
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={() => setSelectedTab(item.label)}
                  activeOpacity={0.7}
                >
                  <View style={{ alignItems: "center" }}>
                    {isSelected ? item.selectedIcon : item.unselectedIcon}
                    <Text
                      style={[
                        styles.tabLabel,
                        isSelected && styles.tabLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {selectedTab === "Go-To" && (
          <View style={{ marginTop: 30 }}>
            {/* Sub Tabs */}
            <FlatList
              data={subTabList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.subTabContainer}
              renderItem={({ item }) => {
                const isSelected = selectedSubTab === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.subTabButton,
                      isSelected && styles.subTabButtonActive,
                    ]}
                    onPress={() => setSelectedSubTab(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.subTabLabel,
                        isSelected && styles.subTabLabelActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <View
              style={{
                marginTop: 30,
                paddingHorizontal: 20,
                height: 400,
              }}
            >
              {sortedTasks.length > 0 ? (
                <FlatList
                  data={sortedTasks}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingBottom: 120 }}
                  renderItem={({ item }) => {
                    const createdAt = dayjs(item.created_at);
                    const today = dayjs();
                    const diffDays = today.diff(createdAt, "day"); // difference in days
                    const isAssigned = myTasks.some(
                      (task) => task.task_id === item.id
                    );
                    return (
                      <View
                        style={
                          !isAssigned
                            ? [styles.taskCard]
                            : [
                                styles.taskCard,
                                {
                                  backgroundColor: "#1511271C",
                                  opacity: 0.9,
                                },
                              ]
                        }
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View></View>
                          <Text
                            style={
                              !isAssigned
                                ? styles.taskName
                                : [styles.taskName, { color: "white" }]
                            }
                          >
                            {item.name}
                          </Text>
                        </View>

                        {!isAssigned ? (
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <View style={{ flexDirection: "row" }}>
                                  <LimeIcon />
                                  <LimeIcon />
                                  <LimeIcon />
                                </View>
                                <Text
                                  style={{
                                    color: "#5D0FD5",
                                    fontWeight: "200",
                                    fontSize: 10,
                                    marginTop: 5,
                                    fontFamily: "inter",
                                  }}
                                >
                                  {diffDays} days ago
                                </Text>
                              </View>
                              {user && (
                                <TouchableOpacity
                                  onPress={async () => {
                                    const success = await assignTaskToUser(
                                      item.id,
                                      user.id
                                    );
                                    if (success) {
                                      Snackbar.show({
                                        text: "Task assigned successfully!",
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: "green",
                                      });
                                      // Optionally update myTasks locally
                                      const newTask: SpruceTaskDetails = {
                                        assignment_id: "", // you can update from returned data if needed
                                        assigned_at: new Date().toISOString(),
                                        updated_at: new Date().toISOString(),
                                        assign_user_id: user.id,
                                        assign_user_email: user.email || null,
                                        owner_user_id: user.id,
                                        owner_user_email: user.email || null,
                                        task_id: item.id,
                                        task_name: item.name,
                                        description_us: item.description_us,
                                        description_uk: item.description_uk,
                                        description_row: item.description_row,
                                        icon_name: item.icon_name,
                                        child_friendly: item.child_friendly,
                                        estimated_effort: item.estimated_effort,
                                        points: item.points,
                                        room: item.room,
                                        category: item.category,
                                        keywords: null,
                                        display_names: null,
                                        unique_completions: 0,
                                        total_completions: 0,
                                        effort_level: null,
                                      };
                                      setMyTasks((prev) => [...prev, newTask]);
                                    } else {
                                      Snackbar.show({
                                        text: "Failed to assign task.",
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: "red",
                                      });
                                    }
                                  }}
                                >
                                  <AddIcon />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ) : (
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {user && (
                                <TouchableOpacity
                                  onPress={async () => {
                                    const success = await removeAssignedTask(
                                      item.id,
                                      user.id
                                    );
                                    if (success) {
                                      Snackbar.show({
                                        text: "Task removed successfully!",
                                        duration: 2000,
                                        backgroundColor: "green",
                                      });

                                      // Update local state to remove the task instantly
                                      setMyTasks((prev) =>
                                        prev.filter(
                                          (task) => task.task_id !== item.id
                                        )
                                      );
                                    } else {
                                      Snackbar.show({
                                        text: "Failed to remove task.",
                                        duration: 2000,
                                        backgroundColor: "red",
                                      });
                                    }
                                  }}
                                >
                                  <RemoveIcon />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  }}
                />
              ) : (
                <Text
                  style={{ color: "white", fontSize: 16, textAlign: "center" }}
                >
                  No tasks found for {selectedSubTab}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  tabContainer: { paddingHorizontal: 7, gap: 2 },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabLabel: { color: "#FFFFFF", fontSize: 12, marginTop: 6, fontWeight: "500" },
  tabLabelActive: { color: "#FFFFFF", fontWeight: "700" },
  subTabContainer: { paddingHorizontal: 20, gap: 15 },
  subTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  subTabButtonActive: { backgroundColor: "#fff" },
  subTabLabel: { color: "#fff", fontSize: 14, fontWeight: "500" },
  subTabLabelActive: { color: "#6915E0", fontWeight: "700" },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    color: "#362B32",
    fontSize: 14,
    fontWeight: "300",
    fontFamily: "inter",
  },
  taskDesc: { color: "#444", fontSize: 14, marginTop: 4 },
  taskPoints: { color: "#888", fontSize: 12, marginTop: 6 },
});
