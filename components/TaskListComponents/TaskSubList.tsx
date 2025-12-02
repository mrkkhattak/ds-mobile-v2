import {
  AddTaskToSpruce,
  removeTasksByGlobalId,
  SpruceTaskDetails,
} from "@/app/functions/functions";
import RemoveIcon from "@/assets/images/icons/remove.svg";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddIcon from "@/assets/images/icons/smallAddIcon.svg";

import { UserProfile } from "@/app/types/types";
import { User } from "@supabase/auth-js";
import dayjs from "dayjs";
import Snackbar from "react-native-snackbar";
import LimeIcon from "../../assets/images/icons/Lime.svg";

interface TaskSubListProps {
  selectedSubTab: string;
  setSelectedSubTab: (tab: string) => void;
  myTasks: SpruceTaskDetails[];
  groupData: Record<string, any[]>;
  roomList: {
    label: String;
    value: String;
  }[];
  sortedTasks: any[];
  user: User | null;
  setMyTasks: React.Dispatch<React.SetStateAction<SpruceTaskDetails[]>>;
  profile: UserProfile;
}
const TaskSubList = (props: TaskSubListProps) => {
  const {
    selectedSubTab,
    setSelectedSubTab,
    myTasks,
    groupData,
    roomList,
    sortedTasks,
    user,
    setMyTasks,
    profile,
  } = props;
  return (
    <View style={{ marginTop: 30 }}>
      {/* Sub Tabs */}
      <FlatList
        data={roomList}
        horizontal
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => `${item.value}`}
        contentContainerStyle={styles.subTabContainer}
        renderItem={({ item }) => {
          const isSelected = selectedSubTab === item.value;
          return (
            <TouchableOpacity
              style={[
                styles.subTabButton,
                isSelected && styles.subTabButtonActive,
              ]}
              onPress={() => setSelectedSubTab(`${item.value}`)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabLabel,
                  isSelected && styles.subTabLabelActive,
                ]}
              >
                {item.label.toLocaleUpperCase()}
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
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                              const today = new Date()
                                .toISOString()
                                .split("T")[0];

                              const success = await AddTaskToSpruce(
                                item.id,
                                user.id,
                                today,
                                profile.household_id
                              );
                              if (success) {
                                Snackbar.show({
                                  text: "Task assigned successfully!",
                                  duration: Snackbar.LENGTH_SHORT,
                                  backgroundColor: "green",
                                });
                                // Optionally update myTasks locally
                                const newTask: SpruceTaskDetails = {
                                  id: "", // you can update from returned data if needed
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
                              const success = await removeTasksByGlobalId(
                                item.id
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
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            No tasks found for {selectedSubTab}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TaskSubList;

const styles = StyleSheet.create({
  subTabContainer: {
    paddingHorizontal: 20,
    gap: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingVertical: 2,
  },
  subTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  subTabButtonActive: {
    borderBottomWidth: 5,
    borderColor: "#fff",
  },
  subTabLabel: { color: "#fff", fontSize: 14, fontWeight: "500" },
  subTabLabelActive: { color: "#fff", fontWeight: "700" },
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
