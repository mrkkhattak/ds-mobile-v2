import MainLayout from "@/components/layout/MainLayout";
import DateLabel from "@/components/ui/DateLabel";
import { useAuthStore } from "@/store/authstore";

import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AddUserTaskToSpruce,
  createTask,
  deleteSpruceTasksByUserTaskId,
  deleteTaskById,
  fetchSpruceTasks,
  getTaskById,
  removeTaskFromSpruce,
  SpruceTaskDetails,
} from "../functions/functions";

import EditBottomSheet from "@/components/BottomSheets/EditBottomSheet";
import CalenderStripComponet from "@/components/CalenderStrip/CalenderStripComponet";
import Header from "@/components/Header/Header";
import HomeTaskList from "@/components/HomeComponents/HomeTaskList";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "../functions/commonFuntions";
import { HomeStackParamList } from "../types/navigator_type";
import { CreateTaskFormValues, WeekRepeat } from "../types/types";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Home">;
const index = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const user = useAuthStore((s) => s.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const [isToday, setIsToday] = useState<Boolean>(false);
  const [groupData, setGroupData] = useState<any>();
  const today = new Date();
  const [loading, setLoading] = useState<boolean>(false);
  const [task, setTask] = useState<CreateTaskFormValues | undefined>(undefined);

  const handleDeleteTask = async (id?: string) => {
    if (!user) return;

    if (!id) {
      Snackbar.show({
        text: "No task selected to delete.",
        duration: 2000,
        backgroundColor: "red",
      });
      return;
    }

    setLoading(true);

    const success = await removeTaskFromSpruce({
      id,
      userId: user.id,
    });

    if (success) {
      // Remove the deleted task from local grouped state
      setGroupData((prev: Record<string, SpruceTaskDetails[]>) => {
        const updated: Record<string, SpruceTaskDetails[]> = {};

        for (const key in prev) {
          const filtered = prev[key].filter((task) => {
            if (id) return task.id !== id;
            return true;
          });

          if (filtered.length > 0) {
            updated[key] = filtered;
          }
        }

        return updated;
      });

      Snackbar.show({
        text: "Task removed successfully!",
        duration: 2000,
        backgroundColor: "green",
      });
    } else {
      Snackbar.show({
        text: "Failed to remove task.",
        duration: 2000,
        backgroundColor: "red",
      });
    }

    setLoading(false);
  };
  const renderLeftActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "flex-start",

          borderRadius: 20,
          paddingLeft: 20,
          marginTop: 10,
        }}
      >
        <EditIcon />
      </Animated.View>
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "flex-end",

          borderRadius: 20,
          paddingRight: 20,
          marginTop: 10,
        }}
      >
        <DeleteIcon />
      </Animated.View>
    );
  };

  const fetchTask = async (taskId: string) => {
    const { data, error } = await getTaskById(taskId);

    if (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      return;
    }

    const weekRepeat: WeekRepeat = {
      day: data?.repeat_weekly.map((w) => w.day) ?? [],
      weekNumber: data?.repeat_weekly[0]?.week_number.toString() || "1",
    };

    setTask({
      id: data?.id,
      name: data?.name ?? "",
      room: data?.room ?? "",
      type: data?.type ?? "",
      repeat: data?.repeat ?? false,
      effort: `${data?.effort}`,
      repeatEvery: data?.repeat_every ?? "DAY",
      days: data?.repeat_days ?? [],
      week: weekRepeat, // use the transformed object
      month: {
        dayNumber: data?.repeat_monthly[0]?.day_number,
        day: data?.repeat_monthly[0]?.day || "",
        month: `${data?.repeat_monthly[0]?.month_number}`,
      },
    });
    bottomSheetRef.current?.expand();
    // setTask(data);
  };

  const fetchTasks = async () => {
    try {
      if (user) {
        const { data, error } = await fetchSpruceTasks(
          user.id,
          selectedDate.toISOString().split("T")[0]
        );

        if (error) {
          Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          console.log("Error loading tasks:", error);
          setLoading(false);
          return;
        }

        if (data && Array.isArray(data)) {
          const grouped = data.reduce((acc, task) => {
            const groupKey =
              task.category || task.user_task_room || "Uncategorized";
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(task);
            return acc;
          }, {} as Record<string, SpruceTaskDetails[]>);

          setGroupData(grouped);
        }

        setLoading(false);
      }
    } catch (err: any) {
      const message = err?.message || "Failed to load tasks";
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      console.log("Error loading tasks:", err);
      setLoading(false);
    }
  };
  const CreateNewTask = async (formData: CreateTaskFormValues) => {
    try {
      setLoading(true);

      let repeatingDates: string[] = [];
      if (formData.repeatEvery === "DAY") {
        repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
          days: formData.days,
        });
      } else if (formData.repeatEvery === "WEEK") {
        repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
          weekDays: formData.week?.day,
          weekInterval: Number(formData.week?.weekNumber),
        });
      } else if (formData.repeatEvery === "MONTH") {
        repeatingDates = generateMonthlyRepeatingDates(
          Number(formData.month?.month),
          `${formData.month?.day}`,
          Number(formData.month?.dayNumber)
        );
      }

      const result = await createTask(formData);

      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        setLoading(false);
        return;
      }

      const taskId = result.data.id;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      // === Insert into spruce_tasks ===
      if (formData.repeat && repeatingDates.length > 0) {
        // Insert each repeating entry with its own scheduled date
        for (const date of repeatingDates) {
          await AddUserTaskToSpruce(taskId, userId, date);
        }

        Snackbar.show({
          text: `Repeating schedule created (${repeatingDates.length} tasks).`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "green",
        });
      } else {
        // Single one-time task (use today as scheduled date)
        const today = new Date().toISOString().split("T")[0];
        await AddUserTaskToSpruce(taskId, userId, today);

        Snackbar.show({
          text: "Task Updated successfully!",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        fetchTasks();
      }

      // navigation.navigate("Library");
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (data: CreateTaskFormValues) => {
    const taskId: string | undefined = task?.id;
    setLoading(true);

    const { success, error } = await deleteSpruceTasksByUserTaskId(
      taskId ?? ""
    );
    if (!success && error) {
      Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
      setLoading(false);
    } else {
      Snackbar.show({
        text: "Task deleted successfully",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "green",
      });

      const { success, error } = await deleteTaskById(taskId ?? "");
      if (!success && error) {
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
        setLoading(false);
      } else {
        Snackbar.show({
          text: "Spruce tasks deleted successfully",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        setGroupData((prev: Record<string, SpruceTaskDetails[]>) => {
          const updated: Record<string, SpruceTaskDetails[]> = {};

          for (const key in prev) {
            const filtered = prev[key].filter((task) => {
              if (task) return task.user_task_id !== taskId;
              return true;
            });

            if (filtered.length > 0) {
              updated[key] = filtered;
            }
          }

          return updated;
        });
        CreateNewTask(data);
      }
    }
    bottomSheetRef.current?.close();
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [user, selectedDate])
  );

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "grey" }}>
      <MainLayout>
        <Header label="SMALL STEPS. BIG IMPACT!" />
        <CalenderStripComponet
          navigation={navigation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={today}
        />
        <View
          style={{
            flex: 2,
            backgroundColor: "white",
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}
        >
          <DateLabel selectedDate={selectedDate} />
          <HomeTaskList
            groupData={groupData}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            fetchTask={fetchTask}
            handleDeleteTask={handleDeleteTask}
          />
        </View>
        <EditBottomSheet
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          task={task}
          handleUpdateTask={handleUpdateTask}
        />
      </MainLayout>
    </GestureHandlerRootView>
  );
};

export default index;
