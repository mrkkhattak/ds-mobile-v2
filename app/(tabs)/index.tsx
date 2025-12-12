import MainLayout from "@/components/layout/MainLayout";
import DateLabel from "@/components/ui/DateLabel";
import { useAuthStore } from "@/store/authstore";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AddTaskToSpruce,
  AddUserTaskToSpruce,
  assignUserToTask,
  createTask,
  deleteSpruceTasksByUserTaskId,
  deleteTaskById,
  fetchSpruceTasksByHouseHoldId,
  getGlobalTasks,
  getHouseholdById,
  getProfilesByHousehold,
  getTaskById,
  getUserProfile,
  GlobalTask,
  removeTaskFromSpruce,
  SpruceTaskDetails,
} from "../functions/functions";

import EditBottomSheet from "@/components/BottomSheets/EditBottomSheet";
import CalenderStripComponet from "@/components/CalenderStrip/CalenderStripComponet";
import Header from "@/components/Header/Header";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";

import AddTaskBottomSheet from "@/components/BottomSheets/AddTaskBottomSheet";
import Tab from "@/components/BottomTab/Tab";
import HomeTaskList from "@/components/HomeComponents/HomeTaskList";
import { SlideButton } from "@/components/ui/Buttons";
import { useUserProfileStore } from "@/store/userProfileStore";
import { ActivityIndicator } from "react-native-paper";
import SlideIcon from "../../assets/images/icons/arrow.svg";
import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "../functions/commonFuntions";
import { HomeStackParamList } from "../types/navigator_type";
import { CreateTaskFormValues, Member, WeekRepeat } from "../types/types";

type GroupByOption = "category" | "person";
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Home">;
const index = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useAuthStore();
  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const bottomAddTaskSheetRef = useRef<BottomSheet>(null);
  const snapAddTaskPoints = useMemo(() => ["20%"], []);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const user = useAuthStore((s) => s.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const [isToday, setIsToday] = useState<Boolean>(false);
  const [groupData, setGroupData] = useState<any>();
  const today = new Date();
  const [loading, setLoading] = useState<boolean>(true);
  const [editTaskloading, setEditTaskLoading] = useState<boolean>(false);

  const [task, setTask] = useState<CreateTaskFormValues | undefined>(undefined);
  const [members, setMember] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [tasks, setTasks] = useState<GlobalTask[]>([]);
  const [selected, setSelected] = useState<GlobalTask | null>(null);
  const [value, setValue] = useState<String>("");
  const [category, setCategory] = useState([
    { label: "Room", value: "category" },
    { label: "Person", value: "person" },
  ]);
  const [openGroupDropdown, setOpenGroupDropDown] = useState(false);
  const [groupValue, setGroupValue] = useState<"category" | "person">(
    "category"
  );

  const [totalDone, setTotalDone] = useState<number>(0);
  const fetchTasks = async () => {
    try {
      if (user && profile) {
        const { data, error } = await fetchSpruceTasksByHouseHoldId(
          profile?.household_id,
          selectedDate.toISOString().split("T")[0]
        );
        console.log("data====>", data);
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
          const grouped = groupTasks(data, groupValue);
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

  const groupTasks = (tasks: SpruceTaskDetails[], groupBy: GroupByOption) => {
    return tasks.reduce((acc, task) => {
      let groupKey: any;

      if (groupBy === "category") {
        // Fallback: category → room → Uncategorized
        groupKey = task.category || task.user_task_category || "Uncategorized";
      } else if (groupBy === "person") {
        const profile = task.assign_user_profile;
        groupKey = profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            "Unassigned"
          : "Unassigned";
      }

      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(task);
      return acc;
    }, {} as Record<string, SpruceTaskDetails[]>);
  };
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

    const success = await removeTaskFromSpruce({ id });

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
      iconName:data?.icon_name
    });
    bottomSheetRef.current?.expand();
    // setTask(data);
  };

  // const fetchTasks = async () => {
  //   try {
  //     if (!user || !profile) return;

  //     const { data, error } = await fetchSpruceTasksByHouseHoldId(
  //       profile.household_id,
  //       selectedDate.toISOString().split("T")[0]
  //     );

  //     if (error) {
  //       Snackbar.show({
  //         text: error,
  //         duration: Snackbar.LENGTH_LONG,
  //         backgroundColor: "red",
  //       });
  //       console.log("Error loading tasks:", error);
  //       return;
  //     }

  //     if (Array.isArray(data)) {
  //       const grouped = data.reduce((acc: any, task: any) => {
  //         const groupKey: any =
  //           task.category || task.user_task_room || "Uncategorized";
  //         if (!acc[groupKey]) acc[groupKey] = [];
  //         acc[groupKey].push(task);
  //         return acc;
  //       }, {});
  //       setGroupData(grouped);
  //     }
  //   } catch (err: any) {
  //     console.log("err", err);
  //     Snackbar.show({
  //       text: err.message || "Failed to load tasks",
  //       duration: Snackbar.LENGTH_LONG,
  //       backgroundColor: "red",
  //     });
  //     console.log("Error loading tasks:", err);
  //   }
  // };
  const CreateNewTask = async (
    formData: CreateTaskFormValues,
    household_id: string
  ) => {
    try {
      // setLoading(true);
      if (profile) {
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

        const result = await createTask(formData, profile?.household_id);

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
          (async () => {
            for (const date of repeatingDates) {
              await AddUserTaskToSpruce(
                taskId,
                userId,
                date,
                household_id,
                formData.assign
              );
            }
            console.log(
              `Repeating schedule created (${repeatingDates.length} tasks)`
            );
          })();

          Snackbar.show({
            text: `Repeating schedule created (${repeatingDates.length} tasks).`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });
        } else {
          // Single one-time task (use today as scheduled date)
          const today = new Date().toISOString().split("T")[0];
          await AddUserTaskToSpruce(taskId, userId, today, household_id);

          Snackbar.show({
            text: "Task Updated successfully!",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "green",
          });
          // await fetchTasks();
        }
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

  const handleUpdateTask = async (
    data: CreateTaskFormValues,
    household_id: string
  ) => {
    const taskId: string | undefined = task?.id;
    setEditTaskLoading(true);
    console.log(data);

    const { success, error } = await deleteSpruceTasksByUserTaskId(
      taskId ?? ""
    );
    if (!success && error) {
      Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
      setEditTaskLoading(false);
    } else {
      // Snackbar.show({
      //   text: "Task deleted successfully",
      //   duration: Snackbar.LENGTH_SHORT,
      //   backgroundColor: "green",
      // });

      const { success, error } = await deleteTaskById(taskId ?? "");
      if (!success && error) {
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
        setEditTaskLoading(false);
      } else {
        // Snackbar.show({
        //   text: "Spruce tasks deleted successfully",
        //   duration: Snackbar.LENGTH_SHORT,
        //   backgroundColor: "green",
        // });
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

        await CreateNewTask(data, household_id);
        await fetchTasks();
        setEditTaskLoading(false);
      }
    }
    bottomSheetRef.current?.close();
    setEditTaskLoading(false);
  };

  const handleAssingTaskToUser = async (taskId: string, userId: string) => {
    try {
      // setLoading(true);
      const result = await assignUserToTask(taskId, userId);
      console.log("taskId", taskId);
      console.log("userId", userId);

      if (result) {
        if (result.data) {
          // Local update of groupData
          setGroupData((prevGroupData: any) => {
            const updatedGroupData: Record<string, SpruceTaskDetails[]> = {};

            Object.keys(prevGroupData).forEach((groupKey) => {
              updatedGroupData[groupKey] = prevGroupData[groupKey].map(
                (task: any) =>
                  task.id === taskId
                    ? { ...task, assign_user_id: userId } // update assign_user_id
                    : task
              );
            });

            return updatedGroupData;
          });

          Snackbar.show({
            text: "Task assigned to user",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });

          setSelectedMember(null);
          setOpenModal(false);
          setLoading(false);
        }

        if (result.error) {
          console.log(result);
          Snackbar.show({
            text: result.error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.log(error);
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!value.trim()) return tasks;
    return tasks.filter((t) =>
      t.name.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, tasks]);

  const handleAddTask = async (value: String) => {
    if (!value.trim()) return;
    if (!user) return;
    if (!profile) return;
    // check if a task already exists
    const exists = selected?.name.toLowerCase() === value.toLowerCase();

    if (exists) {
      const today = new Date().toISOString().split("T")[0];
      const success = await AddTaskToSpruce(
        selected.id,
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
        fetchTasks();
        bottomAddTaskSheetRef.current?.close();
        setValue("");
      }
    } else {
      const nullFields = [
        "id",
        "assigned_at",
        "updated_at",
        "scheduled_date",
        "task_id",
        "icon_name",
        "owner_user_id",
        "owner_user_email",
        "assign_user_id",
        "assign_user_email",
        "assign_user_profile",
        "points",
        "effort_level",
        "estimated_effort",
        "total_completions",
        "unique_completions",
        "child_friendly",
        "keywords",
        "display_names",
        "description_row",
        "description_uk",
        "description_us",
        "user_task_id",
        "user_task_created_at",
        "user_task_updated_at",
        "user_task_user_id",
        "user_task_type",
        "user_task_effort",
        "user_task_repeat_every",
      ];

      // create an object with all null fields
      const nullObj = nullFields.reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {});

      // create your temp task
      const tempTask = {
        task_name: value,
        user_task_name: value,
        category: "Misc",
        room: "Misc",
        user_task_room: "Misc",
        task_status: "pending",
        user_task_repeat: false,
        ...nullObj,
      };

      // append inside groupData state
      setGroupData((prev) => {
        // If "Misc" group exists, append the task; otherwise create it
        return {
          ...prev,
          Misc: prev.Misc ? [...prev.Misc, tempTask] : [tempTask],
        };
      });
      // otherwise add the new task
      // console.log("Task added:", value);
      // navigation.navigate("BottomSheetScreen", {
      //   taskName: value,
      // });
    }
    bottomAddTaskSheetRef.current?.close();
  };
  const handleSaveTask = () => {
    console.log("value", value);
    navigation.navigate("BottomSheetScreen", {
      taskName: value,
    });
  };
  const handleShuffle = () => {
    if (!groupData) return;
    if (members.length === 0) return;

    // flatten all tasks
    const allTasks = Object.values(groupData).flat();

    // assign each task to a random member
    allTasks.forEach((task: any) => {
      const randomUser = members[Math.floor(Math.random() * members.length)];
      handleAssingTaskToUser(task.id, randomUser.user_id);
    });
  };

  const handleOneOff = async (task: SpruceTaskDetails) => {
    try {
      console.log("task", task);

      // setLoading(true);
      const extracted = {
        id: task.id ?? undefined, // null → undefined
        name: task.user_task_name || task.task_name || "", // pick whichever exists
        room: task.user_task_room || task.room || "",
        type: task.user_task_type || "", // fallback empty string
        repeat: task.user_task_repeat ?? false,
        effort: 1,
        repeatEvery: "DAY",
        category: task.category,
      };
      // let repeatingDates: string[] = [];
      // if (task?.user_task_repeat_type === "DAY") {
      //   repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
      //     days: formData.days,
      //   });
      // } else if (task.user_task_repeat_type === "WEEK") {
      //   repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
      //     weekDays: formData.week?.day,
      //     weekInterval: Number(formData.week?.weekNumber),
      //   });
      // } else if (formData.repeatEvery === "MONTH") {
      //   repeatingDates = generateMonthlyRepeatingDates(
      //     Number(formData.month?.month),
      //     `${formData.month?.day}`,
      //     Number(formData.month?.dayNumber)
      //   );
      // }

      const result = await createTask(extracted, profile?.household_id);
      console.log("result", result);
      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        setLoading(false);
        return "error";
      }
      console.log(
        "taskid=====>",
        result.data.id,
        user?.id,
        profile?.household_id
      );
      const taskId = result.data.id;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return "error";
      }

      const today = new Date().toISOString().split("T")[0];
      const result3 = await AddUserTaskToSpruce(
        taskId,
        userId,
        today,
        profile?.household_id
      );
      console.log("result3", result3);
      Snackbar.show({
        text: "Task created successfully!",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "green",
      });
      fetchTasks();

      return "success";
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      return "error";
    } finally {
      setLoading(false);
      return "success";
    }
  };
  const showError = (message: string) => {
    console.log(message);
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
    });
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return signOut();

      // First login logic
      if (user.user_metadata.firstLogin === true) {
        setTimeout(() => navigation.navigate("ResetPasswordScreen"), 2000);
        return;
      }

      // Fetch profile
      const { data: profileData, error } = await getUserProfile(user.id);

      if (error) return showError(error.message);
      if (!profileData) return navigation.navigate("ProfileScreen");
      if (!profileData.household_id)
        return navigation.navigate("CreateHouseholdScreen");

      setProfile(profileData);
    };

    init().finally(() => setLoading(false));
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!profile) return;

      let isActive = true;
      let interval: NodeJS.Timeout;

      const loadHomeScreenData = async () => {
        try {
          const memberRes = await getProfilesByHousehold(profile.household_id);
          if (isActive) {
            if (memberRes.data) setMember(memberRes.data);
            if (memberRes.error) showError(memberRes.error);
          }

          const taskRes = await getGlobalTasks(profile.household_id);
          if (isActive && taskRes) setTasks(taskRes);

          await fetchTasks(); // NO more double-calls
        } catch (err: any) {
          if (isActive) showError(err.message);
        }
      };

      // initial load
      loadHomeScreenData();

      // polling
      // interval = setInterval(loadHomeScreenData, 5000);

      return () => {
        isActive = false;
        // clearInterval(interval);
      };
    }, [profile, selectedDate, groupValue])
  );
  console.log("new value", value);
  useEffect(() => {
    if (groupData) {
      let completedCount = 0;
      Object.values(groupData).forEach((roomTasks: any) => {
        roomTasks.forEach((task: any) => {
          if (task.task_status === "completed") {
            completedCount++;
          }
        });
      });
      setTotalDone(completedCount);
    }
  }, [groupData]);

  useFocusEffect(
    useCallback(() => {
      if (profile) {
        (async () => {
          const result = await getHouseholdById(profile?.household_id);
          if ("error" in result) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          } else {
            // setHouse(result);
            // setWeekValue(result.data.weekofstart);
            setGroupValue(result.data.groupbyweek);

            console.log("Fetched rooms:", result);
          }
        })();
      }
    }, [profile])
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
          <ActivityIndicator size="large" color="#8C50FB" />
        </View>
      </MainLayout>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "grey" }}>
      <MainLayout>
        <View style={{}}>
          <Header
            label="SMALL STEPS. BIG IMPACT!"
            screenName="Daily Spruce"
            icon={<MenuIcon />}
            navigation={() => {
              navigation.navigate("MainMenu");
            }}
          />
          <CalenderStripComponet
            navigation={navigation}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            today={today}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <SlideButton
            label="Slide to start sprucing"
            icon={<SlideIcon />}
            onSlideComplete={() => navigation.navigate("SpruceScreen")}
            width={Platform.OS === "android" ? 340 : 370}
            textStyle={{
              fontSize: 16,
              fontWeight: "700",
              textAlign: "center",
            }}
          />
        </View>
        <BottomSheet
          ref={bottomAddTaskSheetRef}
          index={1}
          snapPoints={["50%", "60%", "80%", "90%"]}
          enablePanDownToClose={false}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          backgroundStyle={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            backgroundColor: "white",
          }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              opacity={0}
            />
          )}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
              }}
            >
              <View style={{ flex: 1 }}>
                {/* HEADER */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <DateLabel selectedDate={selectedDate} />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 0.5,
                      borderRadius: 20,
                      borderColor: "rgba(105, 21, 224, 1)",
                      paddingHorizontal: 10,
                      height: 30,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontFamily: "Inter",
                        fontSize: 12,
                        color: "rgba(105, 21, 224, 1)",
                      }}
                    >
                      Group:
                    </Text>

                    <DropDownPicker
                      open={openGroupDropdown}
                      value={groupValue}
                      items={category}
                      setOpen={setOpenGroupDropDown}
                      setValue={setGroupValue}
                      setItems={setCategory}
                      containerStyle={{ width: 90 }}
                      style={{
                        backgroundColor: "transparent",
                        borderWidth: 0,
                      }}
                      dropDownContainerStyle={{
                        borderWidth: 1,
                        backgroundColor: "white",
                        borderRadius: 10,
                        borderColor: "rgba(105, 21, 224, 1)",
                      }}
                      textStyle={{
                        fontSize: 12,
                        color: "rgba(105, 21, 224, 1)",
                      }}
                    />
                  </View>
                </View>

                {/* SCROLLABLE TASK LIST */}
                <View style={{ flex: 1 }}>
                  <HomeTaskList
                    groupData={groupData}
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                    fetchTask={fetchTask}
                    handleDeleteTask={handleDeleteTask}
                    members={members}
                    setSelectedMember={setSelectedMember}
                    selectedMember={selectedMember}
                    handleAssingTaskToUser={handleAssingTaskToUser}
                    setTaskId={setTaskId}
                    taskId={taskId}
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                    height={550}
                    handleSaveTask={handleSaveTask}
                    handleOneOff={handleOneOff}
                  />
                </View>
              </View>

              {/* FIXED TAB AT BOTTOM */}
              <View style={{ height: 90 }}>
                <Tab
                  navigation={navigation}
                  bottomAddTaskSheetRef={bottomAddTaskSheetRef}
                  handleShuffle={handleShuffle}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>

        {profile && (
          <EditBottomSheet
            bottomSheetRef={bottomSheetRef}
            snapPoints={snapPoints}
            task={task}
            profile={profile}
            handleUpdateTask={handleUpdateTask}
            editTaskloading={editTaskloading}
          />
        )}
        <AddTaskBottomSheet
          bottomAddTaskSheetRef={bottomAddTaskSheetRef}
          navigation={navigation}
          filteredTasks={filteredTasks}
          selected={selected}
          setSelected={setSelected}
          value={value}
          setValue={setValue}
          handleAddTask={handleAddTask}
        />
      </MainLayout>
    </GestureHandlerRootView>
  );
};

export default index;
