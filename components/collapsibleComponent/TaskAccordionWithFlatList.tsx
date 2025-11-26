import RemoveIcon from "@/assets/images/icons/remove.svg";
import dayjs from "dayjs";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import Snackbar from "react-native-snackbar";

import {
  AddTaskToSpruce,
  removeSpecificTaskFromSpruce,
  SpruceTaskDetails,
} from "@/app/functions/functions";
import AddIcon from "@/assets/images/icons/smallAddIcon.svg";
import DownArrowIcon from "@/assets/images/icons/Vector (5).svg";
import UpArrowIcon from "@/assets/images/icons/Vector (6).svg";

import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "@/app/functions/commonFuntions";
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
}

const TaskAccordionWithFlatList: React.FC<Props> = ({
  groupData,
  myTasks,
  setMyTasks,
  user,
  setLoading,
}) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  // Split tasks into three main sections
  const dailyTasks: Task[] = [];
  const weeklyTasks: Task[] = [];
  const monthlyTasks: Task[] = [];

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
          const isAssigned = myTasks.some((task) => task.task_id === item.id);

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
                  <View style={{ flexDirection: "row", marginRight: 10 }}>
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

                  {user && (
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          let repeatingDates: string[] = [];
                          if (item.task_repeat_days?.length > 0) {
                            const daysArray = item.task_repeat_days.map(
                              ({ day }: any) => day
                            );
                            repeatingDates = generateRepeatingDatesUnified(
                              "DAY",
                              { days: daysArray }
                            );
                          } else if (item.task_repeat_weeks?.length > 0) {
                            const transformed = {
                              days: item.task_repeat_weeks.map(
                                (task: any) => task.day
                              ),
                              weekNumber:
                                item.task_repeat_weeks[0]?.week_number ?? 1,
                            };
                            repeatingDates = generateRepeatingDatesUnified(
                              "WEEK",
                              {
                                weekDays: transformed.days,
                                weekInterval: Number(transformed.weekNumber),
                              }
                            );
                          } else if (item.task_repeat_months?.length > 0) {
                            repeatingDates = generateMonthlyRepeatingDates(
                              Number(item.task_repeat_months.month_number),
                              item.task_repeat_months.day,
                              Number(item.task_repeat_months.dayNumber)
                            );
                          }

                          if (!repeatingDates || repeatingDates.length === 0)
                            return;

                          // 2️⃣ Execute the tasks
                          setLoading(true);
                          for (const date of repeatingDates) {
                            await AddTaskToSpruce(item.id, user.id, date);
                          }
                          Snackbar.show({
                            text: `Repeating schedule created (${repeatingDates.length} tasks).`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: "green",
                          });
                        } catch (error) {
                          console.error(
                            "Error creating repeating tasks:",
                            error
                          );
                          Snackbar.show({
                            text: "Failed to create repeating tasks.",
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: "red",
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <AddIcon />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {user && (
                    <TouchableOpacity
                      onPress={async () => {
                        const success = await removeSpecificTaskFromSpruce({
                          globalTaskId: item.id,
                          userId: user.id,
                        });
                        if (success) {
                          Snackbar.show({
                            text: "Task removed successfully!",
                            duration: 2000,
                            backgroundColor: "green",
                          });
                          setMyTasks((prev) =>
                            prev.filter((task) => task.task_id !== item.id)
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
