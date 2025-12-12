import RemoveIcon from "@/assets/images/icons/remove.svg";
import dayjs from "dayjs";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import Snackbar from "react-native-snackbar";

import {
  removeUserTasksById,
  SpruceTaskDetails,
} from "@/app/functions/functions";
import AddIcon from "@/assets/images/icons/smallAddIcon.svg";
import DownArrowIcon from "@/assets/images/icons/Vector (5).svg";
import UpArrowIcon from "@/assets/images/icons/Vector (6).svg";

import { UserProfile } from "@/app/types/types";
import { ScrollView } from "react-native-gesture-handler";
import LimeIcon from "../../assets/images/icons/Lime.svg";
interface RepeatDay {
  id: string;
  day: string;
}

interface RepeatWeek {
  id: string;
  week_number: number;
  day: string;
}

interface RepeatMonth {
  id: string;
  month_number?: number;
  day: string;
}

export interface Task {
  id: string;
  name: string;
  category?: string;
  created_at?: string;
  task_repeat_days?: RepeatDay[];
  task_repeat_weeks?: RepeatWeek[];
  task_repeat_months?: RepeatMonth[];
}

interface Section {
  title: string;
  tasks: Task[];
}

interface Props {
  groupData: Record<string, Task[]>;
  myTasks: SpruceTaskDetails[];
  setMyTasks: React.Dispatch<React.SetStateAction<SpruceTaskDetails[]>>;
  user: { id: string; email?: string } | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  profile: UserProfile;
  hadleRepeatTaskAssign: (item: any, user: any, profile: any) => Promise<void>;
  loading: boolean;
}

const TaskAccordionWithFlatList: React.FC<Props> = ({
  groupData,
  myTasks,
  setMyTasks,
  user,
  setLoading,
  profile,
  loading,
  hadleRepeatTaskAssign,
}) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  // Split tasks into three main sections
  const dailyTasks: Task[] = [];
  const weeklyTasks: Task[] = [];
  const monthlyTasks: Task[] = [];
  console.log("groupData", groupData);
  Object.values(groupData).forEach((tasks) => {
    tasks.forEach((task) => {
      if (task.task_repeat_days?.length) dailyTasks.push(task);
      if (task.task_repeat_weeks?.length) weeklyTasks.push(task);
      if (task.task_repeat_months?.length) monthlyTasks.push(task);
    });
  });

  const sections: Section[] = [
    { title: "Daily Tasks", tasks: dailyTasks },
    { title: "Weekly Tasks", tasks: weeklyTasks },
    { title: "Monthly Tasks", tasks: monthlyTasks },
  ];

  const renderHeader = (section: Section, _: number, isActive: boolean) => (
    <View style={[styles.header, isActive && styles.activeHeader]}>
      <Text style={styles.headerText}>{section.title}</Text>
      {!isActive ? <DownArrowIcon /> : <UpArrowIcon />}
    </View>
  );

  const renderContent = (section: Section) => {
    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 10 }}
        nestedScrollEnabled={true} // allows proper scrolling inside Accordion
      >
        {section.tasks.map((item: any) => {
          const createdAt = dayjs(item.created_at);
          const today = dayjs();
          const diffDays = today.diff(createdAt, "day");
          const isAssigned = myTasks.some(
            (task) => task.user_task_id === item.id
          );

          return (
            <View
              key={item.id}
              style={
                !isAssigned
                  ? styles.taskCard
                  : [
                      styles.taskCard,
                      { backgroundColor: "#1511271C", opacity: 0.9 },
                    ]
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {[...Array(item.effort)].map((_, i) => (
                    <LimeIcon key={i} />
                  ))}
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

                  <>
                    {user && (
                      <TouchableOpacity
                        onPress={() => {
                          hadleRepeatTaskAssign(item, user, profile);
                        }}
                      >
                        <AddIcon />
                      </TouchableOpacity>
                    )}
                  </>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {user && (
                    <TouchableOpacity
                      onPress={async () => {
                        const success = await removeUserTasksById(item.id);
                        if (success) {
                          Snackbar.show({
                            text: "Task removed successfully!",
                            duration: 2000,
                            backgroundColor: "green",
                          });
                          setMyTasks((prev) =>
                            prev.filter((task) => task.user_task_id !== item.id)
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
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <Accordion
      sections={sections}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={setActiveSections}
      underlayColor="transparent"
    />
  );
};

export default TaskAccordionWithFlatList;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeHeader: {
    backgroundColor: "#rgba(255, 255, 255, 0.2)",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "medium",
    color: "#FFFFFF",
    fontFamily: "Poppins",
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,

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
  repeatLabel: {
    fontSize: 12,
    color: "gray",
  },
});
