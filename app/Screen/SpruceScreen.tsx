import HomeTaskList from "@/components/HomeComponents/HomeTaskList";
import MainLayout from "@/components/layout/MainLayout";
import FamiyImageLayer from "@/components/SpruceScreenComponents/FamiyImageLayer";
import Timer from "@/components/SpruceScreenComponents/Timer";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { MainButton } from "@/components/ui/Buttons";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import {
  assignUserToTask,
  completeSpruceTask,
  endSpruceAndMovePendingTasks,
  fetchHouseholdById,
  fetchSpruceTasksByHouseHoldId,
  getHouseholdById,
  getProfilesByHousehold,
  getTaskById,
  getUserProfile,
  Household,
  removeTaskFromSpruce,
  SpruceTaskDetails,
  updateSweepById,
} from "../functions/functions";
import { HomeStackParamList } from "../types/navigator_type";
import {
  CreateTaskFormValues,
  Member,
  UserProfile,
  WeekRepeat,
} from "../types/types";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "SpruceScreen"
>;
type SpruceScreenRouteProp = RouteProp<HomeStackParamList, "SpruceScreen">;
type GroupByOption = "category" | "person";
const SpruceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SpruceScreenRouteProp>();
  const { signOut } = useAuthStore();
  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<any>();
  const [members, setMember] = useState<Member[]>([]);
  const [task, setTask] = useState<CreateTaskFormValues | undefined>(undefined);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [houseHold, setHouseHold] = useState<Household | null>(null);
  // const [groupBy, setGroupBy] = useState("person");
  const bottomAddTaskSheetRef = useRef<BottomSheet>(null);
  const user = useAuthStore((s) => s.user);
  const [openGroupDropdown, setOpenGroupDropDown] = useState(false);
  const [groupValue, setGroupValue] = useState<"category" | "person">(
    "category"
  );
  const [category, setCategory] = useState([
    { label: "Room", value: "category" },
    { label: "Person", value: "person" },
  ]);
  const [totalDone, setTotalDone] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [finalTimeLeft, setFinalTimeLeft] = useState(undefined);

  const [openSpruceModal, setOpenSpruceModal] = useState(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [loadingCountdown, setLoadingCountdown] = useState(true); // true during countdown
  const effortPoints = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
  };
  const calculateGroupedTaskPoints = (groupedTasks: any) => {
    let total = 0;

    Object.keys(groupedTasks).forEach((category) => {
      groupedTasks[category].forEach((task: any) => {
        if (task.task_status === "completed") {
          total +=
            effortPoints[
              task.effort_level ? task.effort_level : task.user_task_effort
            ] || 0;
        }
      });
    });

    return total;
  };
  useEffect(() => {
    if (loadingCountdown) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoadingCountdown(false); // countdown finished
            // fetchInitialData(); // start loading tasks and household
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loadingCountdown]);

  // const fetchInitialData = async () => {
  //   if (!profile) return;
  //   setLoading(true);

  //   await fetchHouseHold(profile); // fetch household
  //   await fetchTasks(); // fetch tasks

  //   setLoading(false);
  // };
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
      if (user && profile) {
        const selectedDate = new Date();
        const { data, error } = await fetchSpruceTasksByHouseHoldId(
          profile?.household_id,
          route.params.selectedData
        );
        console.log(
          "         route.params.selectedData",
          route.params.selectedData
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
          const grouped = groupTasks(data, groupValue);

          console.log("groupData", grouped);
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

  const groupTasks = (tasks, groupBy) => {
    const grouped = {};

    tasks.forEach((task) => {
      const isCompleted = task.task_status === "completed";

      let groupKey;

      // 1️⃣ Completed group
      if (isCompleted) {
        groupKey = "Completed";
      }

      // 2️⃣ Group by person
      else if (groupBy === "person") {
        const first = task.assign_user_profile?.first_name || "";
        const last = task.assign_user_profile?.last_name || "";
        const full = `${first} ${last}`.trim();

        groupKey = full.length > 0 ? full : "Unassigned";
      }

      // 3️⃣ Group by category
      else if (groupBy === "category") {
        groupKey = task.category || task.room || "Uncategorized";
      }

      // 4️⃣ Default group
      else {
        groupKey = "Other";
      }

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(task);
    });

    return grouped;
  };
  const fetchHouseHold = async (profile: UserProfile) => {
    try {
      setLoading(true);
      const result = await fetchHouseholdById(profile?.household_id);
      if (result.data) {
        setHouseHold(result.data);
        setLoading(false);
      }
      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
      }
      setLoading(false);
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    }
    setLoading(false);
  };
  const handleAssingTaskToUser = async (taskId: string, userId: string) => {
    try {
      // setLoading(true);
      const result = await assignUserToTask(taskId, userId);

      if (result) {
        if (result.data) {
          // Local update of groupData
          // setGroupData((prevGroupData: any) => {
          //   const updatedGroupData: Record<string, SpruceTaskDetails[]> = {};

          //   Object.keys(prevGroupData).forEach((groupKey) => {
          //     updatedGroupData[groupKey] = prevGroupData[groupKey].map(
          //       (task: any) =>
          //         task.id === taskId
          //           ? { ...task, assign_user_id: userId } // update assign_user_id
          //           : task
          //     );
          //   });

          //   return updatedGroupData;
          // });

          Snackbar.show({
            text: "Task assigned to user",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });
          fetchTasks();
          setSelectedMember(null);
          setOpenModal(false);
          setLoading(false);
        }

        if (result.error) {
          Snackbar.show({
            text: result.error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          setLoading(false);
        }
      }
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string) => {
    try {
      // setLoading(true);
      const result = await completeSpruceTask(taskId);

      if (result) {
        if (result.success === true) {
          // Local update of groupData
          setGroupData((prevGroupData: any) => {
            const updatedGroupData: Record<string, SpruceTaskDetails[]> = {};

            Object.keys(prevGroupData).forEach((groupKey) => {
              updatedGroupData[groupKey] = prevGroupData[groupKey].map(
                (task: any) =>
                  task.id === taskId
                    ? { ...task, task_status: "completed" } // update assign_user_id
                    : task
              );
            });
            const totalPoints = calculateGroupedTaskPoints(groupData);
            setTotalPoints(totalPoints);
            return updatedGroupData;
          });

          Snackbar.show({
            text: "Task Completed",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });
          fetchTasks();
          setSelectedMember(null);
          setOpenModal(false);
          setLoading(false);
        }

        if (result.error) {
          Snackbar.show({
            text: result.error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          setLoading(false);
        }
      }
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      setLoading(false);
    }
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

    // setLoading(true);

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

  const showError = (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: "red",
    });
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      // setLoading(true);

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [user, profile, groupValue])
  );

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return signOut();

      const { data: profile, error } = await getUserProfile(user.id);

      if (error) {
        console.log(error);
        Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        return;
      }

      if (!profile) {
        navigation.navigate("ProfileScreen");
      } else if (!profile.household_id) {
        navigation.navigate("CreateHouseholdScreen");
      }
      setProfile(profile);
    };

    const checkFirstLogin = async () => {
      setTimeout(() => {
        navigation.navigate("ResetPasswordScreen");
      }, 2000);
    };

    if (user) {
      if (user.user_metadata.firstLogin === true) {
        checkFirstLogin();
      } else {
        checkProfile();
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      // let interval: NodeJS.Timeout;

      const fetchProfiles = async () => {
        if (!profile) return;

        try {
          const result = await getProfilesByHousehold(profile.household_id);
          if (!isActive) return;

          if (result.data) {
            setMember(result.data);
          }

          if (result.error) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        } catch (error: any) {
          if (isActive) {
            Snackbar.show({
              text: error.message,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        }
      };

      // Initial call
      fetchProfiles();

      // Poll every 5 seconds
      // interval = setInterval(fetchProfiles, 5000);

      return () => {
        isActive = false;
        // clearInterval(interval);
      };
    }, [profile])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (profile) {
        setLoading(true);

        fetchHouseHold(profile);
      }

      return () => {
        isActive = false;
      };
    }, [user, profile])
  );

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
      const temptotalTasks = Object.values(groupData).reduce(
        (sum, tasks) => sum + tasks.length,
        0
      );
      const totalPoints = calculateGroupedTaskPoints(groupData);
      setTotalPoints(totalPoints);
      setTotalDone(completedCount);
      setTotalTasks(temptotalTasks);
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
  const handleendSprucing = async () => {
    try {
      if (route.params.sweepId) {
        const result = await updateSweepById(route.params.sweepId, {
          spruce_score: (totalDone / totalTasks) * 100,
          time: finalTimeLeft,
        });
        if (result.error) {
          showError(result.error);
        }
        if (result.success) {
          bottomAddTaskSheetRef.current?.close();
          setOpenSpruceModal(true);
        }
      }
    } catch (error: any) {
      showError(error?.message);
    }
  };

  const handleEndSpureAndMoveTask = async () => {
    try {
      if (profile) {
        const result = await endSpruceAndMovePendingTasks(
          profile?.household_id,
          route.params.selectedData
        );
        if (result.error) {
          showError(result.error);
        }
        if (result.success) {
          Snackbar.show({
            text: `${result.movedCount} tasks moved to tomorrow`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });
          handleendSprucing();
        }
      }
    } catch (error: any) {
      showError(error.message);
    }
  };

  const getSpruceMessage = (percentage: any) => {
    let heading = "";
    let subheading = "";
    if (percentage === 100) {
      heading = "Perfect Spruce";
      subheading = "You swept through those tasks like a pro";
    } else if (percentage >= 70) {
      heading = "Smart Spruce";
      subheading = "You’ve made strong progress and your space is thanking you";
    } else if (percentage >= 40) {
      heading = "Nice Spruce";
      subheading = "You’ve tackled a good share and it’s making a difference";
    } else {
      heading = "Great Start";
      subheading = "You've set things in motion and every bit counts";
    }

    return { heading, subheading };
  };

  const { heading, subheading } = getSpruceMessage(
    (totalDone / totalTasks) * 100
  );

  if (loadingCountdown) {
    return (
      <MainLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 250,
              fontWeight: "bold",
              fontFamily: "Poppins",
              color: "white",
            }}
          >
            {countdown > 0 ? countdown : "Go!"}
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout color1="rgba(22, 197, 224, 1)" color2="rgba(141, 224, 22, 1)">
      {houseHold && groupData && (
        <View style={{ flex: 1, position: "relative" }}>
          <View style={{ flex: 1, position: "relative", zIndex: 0 }}>
            <View style={{ zIndex: 0 }}>
              <Timer
                time={`${houseHold.spruce_time}`}
                navigation={navigation}
                bottomAddTaskSheetRef={bottomAddTaskSheetRef}
                setFinalTimeLeft={setFinalTimeLeft}
                finalTimeLeft={finalTimeLeft}
              />

              <FamiyImageLayer
                groupData={groupData}
                open={openGroupDropdown}
                value={groupValue}
                items={category}
                setOpen={setOpenGroupDropDown}
                setValue={setGroupValue}
                setItems={setCategory}
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
                backgroundColor: "transparent",
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",

                    marginHorizontal: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      borderWidth: 0.5,
                      borderRadius: 20,
                      paddingLeft: 20,

                      height: 30,
                      width: 180,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontFamily: "Inter",
                        fontSize: 12,
                        lineHeight: 30,
                        color: "rgba(86, 123, 32, 1)",
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
                      containerStyle={{
                        maxWidth: 120,
                        maxHeight: 50,
                        paddingRight: 10,
                      }}
                      style={{
                        backgroundColor: "trasnparent",
                        borderWidth: 0,
                      }}
                      dropDownContainerStyle={{
                        backgroundColor: "trasnparent",
                      }}
                      textStyle={{
                        fontSize: 12,
                        color: "rgba(86, 123, 32, 1)",
                      }}
                    />
                  </View>

                  {groupData && totalTasks > 0 && (
                    <Text
                      style={{
                        paddingTop: 10,
                        fontWeight: "400",
                        fontFamily: "Inter",
                        fontSize: 20,
                        lineHeight: 30,
                        color: "rgba(86, 123, 32, 1)",
                      }}
                    >
                      {totalDone}/{totalTasks} Done
                    </Text>
                  )}
                </View>
                <View
                  style={{ flex: 1, justifyContent: "flex-end", zIndex: 0 }}
                >
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
                    handleUpdateTaskStatus={handleUpdateTaskStatus}
                    setTaskId={setTaskId}
                    taskId={taskId}
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                    lableStyle={{
                      color: "#567B20",
                      fontWeight: "700",
                      fontSize: 12,
                      marginVertical: 5,
                    }}
                    height={900}
                    icon={
                      <Image
                        source={require("../../assets/images/RectangleIcon.png")}
                      />
                    }
                    handleSaveTask={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                    handleOneOff={function (
                      task: SpruceTaskDetails
                    ): Promise<"error" | "success"> {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </View>
              </BottomSheetView>
            </BottomSheet>
          </View>

          <Modal
            visible={openSpruceModal}
            transparent
            animationType="fade"
            onRequestClose={() => setOpenSpruceModal(false)}
          >
            {/* Background press closes modal */}
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setOpenSpruceModal(false)}
            >
              {/* Inner area should NOT close modal */}
              <Pressable
                style={{
                  width: "80%",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  padding: 20,
                  borderRadius: 12,
                }}
                onPress={(e) => e.stopPropagation()}
              >
                <Image
                  source={require("../../assets/images/broom.png")}
                  resizeMode="contain"
                  style={{}}
                />
                <MainHeading
                  style={{
                    color: "rgba(142, 45, 226, 1)",
                    fontWeight: "700",
                    fontSize: 40,
                    lineHeight: 66,
                    fontFamily: "Poppins",
                  }}
                >
                  {heading}
                </MainHeading>
                <SecondryHeading
                  style={{
                    color: "rgba(142, 45, 226, 1)",
                    lineHeight: 20,
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "700",
                    fontFamily: "Inter",
                  }}
                >
                  {subheading}
                </SecondryHeading>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <MainButton
                    label={`${totalDone} tasks completed`}
                    onPress={() => {
                      setOpenSpruceModal(false);
                      navigation.navigate("Home");
                    }}
                    color1={"rgba(142, 45, 226, 1)"}
                    color2={"rgba(74, 0, 224, 1)"}
                    style={{
                      marginVertical: 5,
                      width: "60%",
                      borderRadius: 10,
                    }}
                    textStyle={{
                      paddingHorizontal: 20,
                      fontSize: 12,
                      fontWeight: "400",
                      fontFamily: "inter",
                    }}
                    gradentStyle={{ borderRadius: 15 }}
                  />
                  <MainButton
                    label={`${totalPoints} points collected`}
                    onPress={() => {
                      setOpenSpruceModal(false);
                      navigation.navigate("Home");
                    }}
                    color1={"rgba(142, 45, 226, 1)"}
                    color2={"rgba(74, 0, 224, 1)"}
                    style={{
                      marginVertical: 5,
                      width: "60%",
                      borderRadius: 10,
                    }}
                    textStyle={{
                      paddingHorizontal: 20,
                      fontSize: 12,
                      fontWeight: "400",
                      fontFamily: "inter",
                    }}
                    gradentStyle={{ borderRadius: 15 }}
                  />
                </View>
              </Pressable>
            </Pressable>
          </Modal>

          <BottomSheet
            ref={bottomAddTaskSheetRef}
            index={-1} // hidden initially
            snapPoints={["20%"]}
            enablePanDownToClose
            backgroundStyle={styles.bottomSheetBackground}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.7}
                pressBehavior="close"
              />
            )}
          >
            <BottomSheetView>
              <View>
                <SecondryHeading
                  style={{
                    color: "rgba(142, 45, 226, 1)",
                    lineHeight: 25,
                    fontSize: 20,
                    paddingHorizontal: 50,
                    marginTop: 20,
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  Looks like you have some tasks left
                </SecondryHeading>
                <SecondryHeading
                  style={{
                    color: "rgba(66, 64, 78, 1)",
                    lineHeight: 20,
                    fontSize: 14,
                    paddingHorizontal: 50,
                    marginTop: 20,
                    textAlign: "center",
                    fontWeight: "300",
                  }}
                >
                  Looks like you have some tasks left
                </SecondryHeading>
                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MainButton
                    label={"Keep sprucing"}
                    onPress={() => {
                      bottomAddTaskSheetRef.current?.close();
                    }}
                    color1={"rgba(142, 45, 226, 1)"}
                    color2={"rgba(74, 0, 224, 1)"}
                    style={{
                      marginVertical: 5,
                      width: "60%",
                      borderRadius: 10,
                    }}
                    textStyle={{
                      paddingHorizontal: 20,
                      fontSize: 12,
                      fontWeight: "400",
                      fontFamily: "inter",
                    }}
                    gradentStyle={{ borderRadius: 15 }}
                  />
                  <MainButton
                    label={"End spruce & move remaining tasks to tomorrow"}
                    onPress={handleEndSpureAndMoveTask}
                    color1={"rgba(142, 45, 226, 1)"}
                    color2={"rgba(74, 0, 224, 1)"}
                    style={{
                      marginVertical: 5,
                      width: "60%",
                      borderRadius: 10,
                    }}
                    textStyle={{
                      paddingHorizontal: 20,
                      fontSize: 12,
                      fontWeight: "400",
                      fontFamily: "inter",
                    }}
                    gradentStyle={{ borderRadius: 15 }}
                  />
                  <MainButton
                    label={"End spruce"}
                    onPress={handleendSprucing}
                    color1={"rgba(142, 45, 226, 1)"}
                    color2={"rgba(74, 0, 224, 1)"}
                    style={{
                      marginVertical: 5,
                      width: "60%",
                      borderRadius: 10,
                    }}
                    textStyle={{
                      paddingHorizontal: 20,
                      fontSize: 12,
                      fontWeight: "400",
                      fontFamily: "inter",
                    }}
                    gradentStyle={{ borderRadius: 15 }}
                  />
                </View>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      )}
    </MainLayout>
  );
};

export default SpruceScreen;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

    backgroundColor: "rgba(246, 245, 247, 1)",
  },
});
