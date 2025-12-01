import HomeTaskList from "@/components/HomeComponents/HomeTaskList";
import MainLayout from "@/components/layout/MainLayout";
import FamiyImageLayer from "@/components/SpruceScreenComponents/FamiyImageLayer";
import Timer from "@/components/SpruceScreenComponents/Timer";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import {
  assignUserToTask,
  completeSpruceTask,
  fetchHouseholdById,
  fetchSpruceTasksByHouseHoldId,
  getProfilesByHousehold,
  getTaskById,
  getUserProfile,
  Household,
  removeTaskFromSpruce,
  SpruceTaskDetails,
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

const SpruceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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

  const user = useAuthStore((s) => s.user);
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
      setLoading(true);
      const result = await assignUserToTask(taskId, userId);

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
      setLoading(true);
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
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [user, profile])
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
      console.log("firstLogin");
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
      let interval: NodeJS.Timeout;

      const fetchProfiles = async () => {
        if (!profile) return;

        try {
          const result = await getProfilesByHousehold(profile.household_id);
          console.log("test");
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
      interval = setInterval(fetchProfiles, 5000);

      return () => {
        isActive = false;
        clearInterval(interval);
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
  return (
    <MainLayout color1="rgba(22, 197, 224, 1)" color2="rgba(141, 224, 22, 1)">
      {houseHold && (
        <>
          <Timer time={`${houseHold?.spruce_time}`} navigation={navigation} />
          <FamiyImageLayer />
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#8C50FB" />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
                icon={
                  <Image
                    source={require("../../assets/images/RectangleIcon.png")}
                  />
                }
              />
            </View>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default SpruceScreen;

const styles = StyleSheet.create({});
