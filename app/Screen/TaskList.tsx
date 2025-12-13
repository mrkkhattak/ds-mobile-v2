import MainLayout from "@/components/layout/MainLayout";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuthStore } from "@/store/authstore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import GoToIcon from "../../assets/images/icons/Go-To (2).svg";
import IdeaIcon from "../../assets/images/icons/Ideas.svg";
import PackIcon from "../../assets/images/icons/Packs.svg";
import RepeatIcon from "../../assets/images/icons/Repeat.svg";
import CrossIcon from "../../assets/images/icons/Vector (7).svg";
import {
  AddTaskToSpruce,
  AddUserTaskToSpruce,
  fetchAndGlobalGroupTasks,
  fetchAndGroupGlobalSearchTasks,
  fetchAndGroupSearchTasks,
  fetchAndGroupTasks,
  fetchPreMadePacksWithGlobalTasks,
  fetchRooms,
  fetchSpruceTasksByHouseHoldId,
  PreMadePack,
  removeTasksByGlobalId,
  removeUserTasksById,
  SpruceTaskDetails,
} from "../functions/functions";

import TaskAccordionWithFlatList from "@/components/collapsibleComponent/TaskAccordionWithFlatList";
import Header from "@/components/Header/Header";
import TaskSubList from "@/components/TaskListComponents/TaskSubList";
import TaskTypeTabing from "@/components/TaskListComponents/TaskTypeTabing";
import { useUserProfileStore } from "@/store/userProfileStore";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import HomeIcon from "../../assets/images/icons/Vector (3).svg";

import Snackbar from "react-native-snackbar";
import { HomeStackParamList } from "../types/navigator_type";
import { TablisntType } from "../types/types";

import TaskListTab from "@/components/BottomTab/TaskListTab";
import PacksList from "@/components/TaskListComponents/PacksList";
import SearchTaskList from "@/components/TaskListComponents/SearchTaskList";
import { MainButton, TransparetButton } from "@/components/ui/Buttons";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "../functions/commonFuntions";
type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TaskLibrary"
>;

const TaskList = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((e) => e.user);
  const [selectedType, setSelectedType] = useState<string | null | any>(null);
  const [selectedEffort, setSelectedEffort] = useState<number[]>([]);
  const [selectedDaysSort, setSelectedDaysSort] = useState<string | null | any>(
    null
  );
  const [selectedEffortSort, setSelectedEffortSort] = useState<
    string | null | any
  >(null);
  const [selectedNameSort, setSelectedNameSort] = useState<string | null | any>(
    null
  );

  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const bottomAddTaskSheetRef = useRef<BottomSheet>(null);
  const bottomFilterTaskSheetRef = useRef<BottomSheet>(null);
  const bottomSearchIdeasTaskSheetRef = useRef<BottomSheet>(null);

  const bottomSearchGotoTaskSheetRef = useRef<BottomSheet>(null);

  const [selectedTab, setSelectedTab] = useState("Go-To");

  const [groupData, setGroupData] = useState<any>({});
  const [groupDataIdeas, setGroupIdeasData] = useState<any>({});

  const [myTasks, setMyTasks] = useState<SpruceTaskDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);
  const gradientColors = ["#182527ff", "#8DE016"];
  const [value, setValue] = useState<string>("");
  const [searchTasks, setSearchTasks] = useState([]);
  const [searchGlobalTasks, setGlobalSearchTasks] = useState([]);
  const tabList: TablisntType[] = [
    {
      label: "Go-To",
      selectedIcon: (
        <Image
          source={require("../../assets/images/Go-To.png")}
          resizeMode="contain"
          style={{ width: 90, height: 90 }}
        />
      ),
      unselectedIcon: <GoToIcon />,
    },

    {
      label: "Repeat",
      selectedIcon: (
        <Image
          source={require("../../assets/images/Selected_Repeat.png")}
          resizeMode="contain"
          style={{ width: 90, height: 90 }}
        />
      ),
      unselectedIcon: <RepeatIcon />,
    },
    {
      label: "Ideas",
      selectedIcon: (
        <Image
          source={require("../../assets/images/Selected_Ideas.png")}
          resizeMode="contain"
          style={{ width: 90, height: 90 }}
        />
      ),
      unselectedIcon: <IdeaIcon />,
    },
    {
      label: "Packs",
      selectedIcon: (
        <Image
          source={require("../../assets/images/Selected_Packs.png")}
          resizeMode="contain"
          style={{ width: 90, height: 90 }}
        />
      ),
      unselectedIcon: <PackIcon />,
    },
  ];
  const [packs, setPacks] = useState<PreMadePack[]>();
  const [selectedPack, setSelectedPack] = useState<PreMadePack>();

  const [roomList, setRoomList] = useState<{ label: String; value: String }[]>(
    []
  );
  const [selectedSubTab, setSelectedSubTab] = useState("Kitchen");
  const currentTasks = groupData[selectedSubTab] || [];

  const sortedTasks = [...currentTasks].sort((a, b) => {
    const aAssigned = myTasks.some((task) => task.task_id === a.id);
    const bAssigned = myTasks.some((task) => task.task_id === b.id);

    if (aAssigned === bAssigned) return 0; // same status, keep order
    if (aAssigned) return 1; // a is assigned, move down
    return -1; // a is unassigned, stay on top
  });

  const currentIdeasTasks = groupDataIdeas[selectedSubTab] || [];

  const sortedIdeasTasks = [...currentIdeasTasks].sort((a, b) => {
    const aAssigned = myTasks.some((task) => task.task_id === a.id);
    const bAssigned = myTasks.some((task) => task.task_id === b.id);

    if (aAssigned === bAssigned) return 0; // same status, keep order
    if (aAssigned) return 1; // a is assigned, move down
    return -1; // a is unassigned, stay on top
  });

  const formatDataForUI = (data: any) => {
    if (!data?.length) return [];

    const formatted: any[] = [];

    // First item (big card)
    formatted.push({ type: "big", item: data[0] });

    // Remaining grouped by 2
    for (let i = 1; i < data.length; i += 2) {
      formatted.push({
        type: "pair",
        items: [data[i], data[i + 1]].filter(Boolean),
      });
    }

    return formatted;
  };

  const navigationToHome = () => {
    navigation.navigate("Home");
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      // let interval: NodeJS.Timeout;

      const fetchData = async () => {
        try {
          if (profile) {
            // setLoading(true);
            if (selectedTab === "Ideas") {
              const taskTypeMap: Record<string, string> = {
                "Go-To": "goto",
                Repeat: "repeat",
                Ideas: "ideas",
                Pack: "pack",
              };
              const taskType = taskTypeMap[selectedTab] || "pack";

              const result = await fetchAndGlobalGroupTasks(
                "ideas",
                {
                  days: selectedDaysSort, // "old-new" | "new-old"
                  effort: selectedEffortSort, // "low-high" | "high-low"
                  name: selectedNameSort,
                  // "a-z" | "z-a"
                },
                {
                  effort: selectedEffort,
                  type: selectedType,
                }
              );

              if (isActive && result) setGroupIdeasData(result);

              if (user && profile) {
                const assignedTasks = await fetchSpruceTasksByHouseHoldId(
                  profile.household_id
                );
                if (isActive && assignedTasks)
                  setMyTasks(assignedTasks.data || []);
              }

              if (isActive) setLoading(false);
            } else {
              const taskTypeMap: Record<string, string> = {
                "Go-To": "goto",
                Repeat: "repeat",
                Ideas: "ideas",
                Pack: "pack",
              };
              const taskType = taskTypeMap[selectedTab] || "pack";

              const result = await fetchAndGroupTasks(
                taskType,
                {
                  days: selectedDaysSort, // "old-new" | "new-old"
                  effort: selectedEffortSort, // "low-high" | "high-low"
                  name: selectedNameSort,
                  // "a-z" | "z-a"
                },
                {
                  effort: selectedEffort,
                  type: selectedType,
                },
                profile?.household_id
              );

              if (isActive && result) setGroupData(result);

              if (user && profile) {
                const assignedTasks = await fetchSpruceTasksByHouseHoldId(
                  profile.household_id
                );
                if (isActive && assignedTasks)
                  setMyTasks(assignedTasks.data || []);
              }

              if (isActive) setLoading(false);
            }
          }
        } catch (error) {
          console.error("Error fetching grouped or assigned tasks:", error);
          if (isActive) setLoading(false);
        }
      };

      // Initial fetch
      fetchData();

      // Poll every 5 seconds
      // interval = setInterval(fetchData, 5000);

      return () => {
        isActive = false;
        // clearInterval(interval); // stop polling on unmount
      };
    }, [
      user,
      selectedTab,
      profile,
      selectedSubTab,
      selectedType,
      selectedEffort,
      selectedDaysSort,
      selectedEffortSort,
      selectedNameSort,
    ])
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const { data, error } = await fetchPreMadePacksWithGlobalTasks();
        if (error) {
          Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          setLoading(false);
        }
        if (data) {
          setPacks(data);

          setSelectedPack(data[0]);
        }

        setLoading(false);
      })();
    }, [user, selectedTab, profile])
  );
  useFocusEffect(
    useCallback(() => {
      if (profile) {
        (async () => {
          const result = await fetchRooms(profile?.household_id);
          if ("error" in result) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          } else {
            setRoomList(result);
            setSelectedSubTab(result[0].value);
          }
        })();
      }
    }, [profile])
  );
  const formattedData = formatDataForUI(packs);
  const hanldeFilterSheet = () => {
    bottomFilterTaskSheetRef.current?.expand();
  };

  const fetchData = async () => {
    try {
      const taskTypeMap: Record<string, string> = {
        "Go-To": "goto",
        Repeat: "repeat",
        Ideas: "ideas",
        Pack: "pack",
      };
      const taskType = taskTypeMap[selectedTab] || "goto";

      // ---- Fetch user tasks ----
      const result = await fetchAndGroupTasks(
        taskType,
        {
          days: selectedDaysSort,
          effort: selectedEffortSort,
          name: selectedNameSort,
        },
        {
          effort: selectedEffort,
          type: selectedType,
        },
        profile?.household_id
      );

      // ---- Fetch global tasks ----
      const globalResult = await fetchAndGlobalGroupTasks(
        taskType,
        {
          days: selectedDaysSort,
          effort: selectedEffortSort,
          name: selectedNameSort,
        },
        {
          effort: selectedEffort,
          type: selectedType,
        }
      );

      if (result) {
        setGroupData(result);
        bottomFilterTaskSheetRef.current?.close();
      }
      if (globalResult) {
        setGroupIdeasData(globalResult);
        bottomFilterTaskSheetRef.current?.close();
      }

      if (user && profile) {
        const assignedTasks = await fetchSpruceTasksByHouseHoldId(
          profile.household_id
        );
        if (assignedTasks) setMyTasks(assignedTasks.data || []);
      }
    } catch (error) {
      console.error("Error fetching grouped or assigned tasks:", error);
    }
  };

  const handleSearch = async () => {
    try {
      // setLoading(true);

      const taskTypeMap: Record<string, string> = {
        "Go-To": "goto",
        Repeat: "repeat",
        Ideas: "ideas",
        Pack: "pack",
      };
      const taskType = taskTypeMap[selectedTab] || "goto";

      const result = await fetchAndGroupSearchTasks(
        value,
        profile?.household_id
      );
      if (result) {
        setSearchTasks(result);
        bottomFilterTaskSheetRef.current?.close();
      }

      if (user && profile) {
        const assignedTasks = await fetchSpruceTasksByHouseHoldId(
          profile.household_id
        );
        if (assignedTasks) setMyTasks(assignedTasks.data || []);
      }
    } catch (error) {
      console.error("Error fetching grouped or assigned tasks:", error);
    }
  };

  const handleIdeasSearch = async () => {
    try {
      // setLoading(true);

      const taskTypeMap: Record<string, string> = {
        "Go-To": "goto",
        Repeat: "repeat",
        Ideas: "ideas",
        Pack: "pack",
      };
      const taskType = taskTypeMap[selectedTab] || "goto";

      const result = await fetchAndGroupGlobalSearchTasks(value);
      if (result) {
        setGlobalSearchTasks(result);
        bottomFilterTaskSheetRef.current?.close();
      }

      if (user && profile) {
        const assignedTasks = await fetchSpruceTasksByHouseHoldId(
          profile.household_id
        );
        if (assignedTasks) setMyTasks(assignedTasks.data || []);
      }
    } catch (error) {
      console.error("Error fetching grouped or assigned tasks:", error);
    }
  };

  const handleGotoTaskAssign = async (item: any, user: any, profile: any) => {
    const today = new Date().toISOString().split("T")[0];

    const success = await AddUserTaskToSpruce(
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
      fetchData();
      // Optionally update myTasks locally
    } else {
      Snackbar.show({
        text: "Failed to assign task.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };
  const hadleRepeatTaskAssign = async (item: any, user: any, profile: any) => {
    try {
      let repeatingDates: string[] = [];
      if (item.task_repeat_days?.length > 0) {
        const daysArray = item.task_repeat_days.map(({ day }: any) => day);
        repeatingDates = generateRepeatingDatesUnified("DAY", {
          days: daysArray,
        });
      } else if (item.task_repeat_weeks?.length > 0) {
        const transformed = {
          days: item.task_repeat_weeks.map((task: any) => task.day),
          weekNumber: item.task_repeat_weeks[0]?.week_number ?? 1,
        };
        repeatingDates = generateRepeatingDatesUnified("WEEK", {
          weekDays: transformed.days,
          weekInterval: Number(transformed.weekNumber),
        });
      } else if (item.task_repeat_months?.length > 0) {
        repeatingDates = generateMonthlyRepeatingDates(
          Number(item.task_repeat_months.month_number),
          item.task_repeat_months.day,
          Number(item.task_repeat_months.dayNumber)
        );
      }

      if (!repeatingDates || repeatingDates.length === 0) return;

      // 2️⃣ Execute the tasks
      (async () => {
        setLoading(true);
        for (const date of repeatingDates) {
          await AddUserTaskToSpruce(
            item.id,
            user.id,
            date,
            profile?.household_id
          );
        }
        setLoading(false);
        console.log(
          `Repeating schedule created (${repeatingDates.length} tasks)`
        );
      })();
      Snackbar.show({
        text: `Repeating schedule created (${repeatingDates.length} tasks).`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "green",
      });

      fetchData();
    } catch (error) {
      console.error("Error creating repeating tasks:", error);
      Snackbar.show({
        text: "Failed to create repeating tasks.",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    } finally {
      // setLoading(false);
    }
  };

  const handleRemoveGotoTask = async (item: any) => {
    const success = await removeUserTasksById(item.id);
    if (success) {
      Snackbar.show({
        text: "Task removed successfully!",
        duration: 2000,
        backgroundColor: "green",
      });

      // Update local state to remove the task instantly
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
  };

  const handleGlobalTaskAssign = async (item: any, user: any, profile: any) => {
    const today = new Date().toISOString().split("T")[0];

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
      fetchData();
      // Optionally update myTasks locally
    } else {
      Snackbar.show({
        text: "Failed to assign task.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };
  const handleRemoveGlobalTask = async (item: any) => {
    const success = await removeTasksByGlobalId(item.id);
    if (success) {
      Snackbar.show({
        text: "Task removed successfully!",
        duration: 2000,
        backgroundColor: "green",
      });

      // Update local state to remove the task instantly
      fetchData();
    } else {
      Snackbar.show({
        text: "Failed to remove task.",
        duration: 2000,
        backgroundColor: "red",
      });
    }
  };
  const renderButton = (
    label: string,
    selected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginLeft: 20,
        width: 80,
        paddingVertical: 10,
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 10,
        backgroundColor: selected
          ? "rgba(152, 100, 225, 1)"
          : "rgba(227, 227, 227, 1)",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: selected ? "white" : "black",
          fontWeight: "400",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <MainLayout>
      <Header
        screenName="Task Library"
        label="SELECT TASKS TO ADD TO TODAY’S SPRUCE
"
        navigation={navigationToHome}
        icon={<HomeIcon />}
      />
      <TaskTypeTabing
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "Go-To" && profile && (
        <>
          <TaskSubList
            selectedSubTab={selectedSubTab}
            setSelectedSubTab={setSelectedSubTab}
            myTasks={myTasks}
            groupData={groupData}
            roomList={roomList}
            sortedTasks={sortedTasks}
            user={user}
            setMyTasks={setMyTasks}
            profile={profile}
            handleGotoTaskAssign={handleGotoTaskAssign}
            handleRemoveGotoTask={handleRemoveGotoTask}
          />
          <TaskListTab
            hanldeFilterSheet={hanldeFilterSheet}
            navigation={navigation}
            bottomAddTaskSheetRef={bottomAddTaskSheetRef}
            handleShuffle={() => {
              bottomSearchGotoTaskSheetRef.current?.expand();
            }}
          />
        </>
      )}
      {selectedTab === "Repeat" && profile && (
        <>
          <TaskAccordionWithFlatList
            groupData={groupData}
            myTasks={myTasks}
            setMyTasks={setMyTasks}
            user={user}
            setLoading={setLoading}
            profile={profile}
            hadleRepeatTaskAssign={hadleRepeatTaskAssign}
            loading={loading}
          />
          <TaskListTab
            hanldeFilterSheet={hanldeFilterSheet}
            navigation={navigation}
            bottomAddTaskSheetRef={bottomAddTaskSheetRef}
            handleShuffle={() => {
              bottomSearchGotoTaskSheetRef.current?.expand();
            }}
          />
        </>
      )}
      {selectedTab === "Ideas" && profile && (
        <>
          <TaskSubList
            selectedSubTab={selectedSubTab}
            setSelectedSubTab={setSelectedSubTab}
            myTasks={myTasks}
            groupData={groupDataIdeas}
            roomList={roomList}
            sortedTasks={sortedIdeasTasks}
            user={user}
            setMyTasks={setMyTasks}
            profile={profile}
            handleGotoTaskAssign={handleGlobalTaskAssign}
            handleRemoveGotoTask={handleRemoveGlobalTask}
            type="Ideas"
          />
          <TaskListTab
            hanldeFilterSheet={hanldeFilterSheet}
            navigation={navigation}
            bottomAddTaskSheetRef={bottomAddTaskSheetRef}
            handleShuffle={() => {
              bottomSearchIdeasTaskSheetRef.current?.expand();
            }}
          />
        </>
      )}
      {selectedTab === "Packs" && profile && user && (
        <>
          <PacksList
            formattedData={formattedData}
            selectedPack={selectedPack}
            setSelectedPack={setSelectedPack}
            gradientColors={gradientColors}
            setMyTasks={setMyTasks}
            myTasks={myTasks}
            user={user}
            profile={profile}
          />
        </>
      )}

      <BottomSheet
        ref={bottomFilterTaskSheetRef}
        index={-1}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
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
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.7}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* FILTER TITLE */}
          <ScrollView style={{ marginHorizontal: 2 }}>
            <View
              style={{
                borderBottomWidth: 0.2,
                paddingBottom: 20,
                borderColor: "rgba(0,0,0,0.5)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "300", marginLeft: 20 }}>
                FILTER
              </Text>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                  bottomFilterTaskSheetRef.current?.close();
                }}
              >
                <CrossIcon />
              </TouchableOpacity>
            </View>

            {/* TYPE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}
                >
                  TYPE
                </Text>
              </View>
              <View style={{ flexDirection: "row", flex: 2 }}>
                <ScrollView horizontal>
                  {["CHILD", "ADULT", "BOTH"].map((type) =>
                    renderButton(type, selectedType === type, () =>
                      setSelectedType(type)
                    )
                  )}
                </ScrollView>
              </View>
            </View>

            {/* EFFORT FILTER */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}
                >
                  EFFORT
                </Text>
              </View>
              <View style={{ flexDirection: "row", flex: 2 }}>
                <ScrollView horizontal>
                  {[1, 2, 3, 4].map((level) =>
                    renderButton(
                      level === 1
                        ? "LOW"
                        : level === 2
                        ? "MED"
                        : level === 3
                        ? "HIGH"
                        : "VERY HIGH",
                      selectedEffort.includes(level), // check in array
                      () => {
                        if (selectedEffort.includes(level)) {
                          setSelectedEffort(
                            selectedEffort.filter((l) => l !== level)
                          );
                        } else {
                          setSelectedEffort([...selectedEffort, level]);
                        }
                      }
                    )
                  )}
                </ScrollView>
              </View>
            </View>

            {/* SORT */}
            <View
              style={{
                borderBottomWidth: 0.2,
                paddingBottom: 20,
                borderColor: "rgba(0,0,0,0.5)",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "300", marginLeft: 20 }}>
                SORT
              </Text>
            </View>

            {/* DAYS SORT */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}
                >
                  DAYS
                </Text>
              </View>
              <View style={{ flexDirection: "row", flex: 2 }}>
                {[
                  { label: "OLD - NEW", value: "old-new" },
                  { label: "NEW - OLD", value: "new-old" },
                ].map((d) =>
                  renderButton(d.label, selectedDaysSort === d.value, () =>
                    setSelectedDaysSort(d.value)
                  )
                )}
              </View>
            </View>

            {/* EFFORT SORT */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}
                >
                  EFFORT
                </Text>
              </View>
              <View style={{ flexDirection: "row", flex: 2 }}>
                {[
                  { label: "LOW - HIGH", value: "low-high" },
                  { label: "HIGH - LOW", value: "high-low" },
                ].map((e) =>
                  renderButton(e.label, selectedEffortSort === e.value, () =>
                    setSelectedEffortSort(e.value)
                  )
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "400", marginLeft: 20 }}
                >
                  NAME
                </Text>
              </View>
              <View style={{ flexDirection: "row", flex: 2 }}>
                {[
                  { label: "A - Z", value: "a-z" },
                  { label: "Z - A", value: "z-a" },
                ].map((n) =>
                  renderButton(n.label, selectedNameSort === n.value, () =>
                    setSelectedNameSort(n.value)
                  )
                )}
              </View>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <MainButton
                label={"SHOW TASKS"}
                onPress={fetchData}
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
                gradentStyle={{ borderRadius: 15, height: 30 }}
              />
              <TransparetButton
                label={"Clear All"}
                containerStyle={{ width: "60%" }}
                onPress={() => {
                  setSelectedType(null);
                  setSelectedEffort([]);
                  setSelectedDaysSort(null);
                  setSelectedEffortSort(null);
                  setSelectedNameSort(null);
                }}
              />
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSearchGotoTaskSheetRef}
        index={-1}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
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
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.7}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* FILTER TITLE */}
          <KeyboardAwareScrollView>
            <SearchTaskList
              myTasks={myTasks}
              sortedTasks={searchTasks}
              user={user}
              setMyTasks={setMyTasks}
              profile={profile}
            />
            <View style={styles.inputRow}>
              <CustomTextInput
                value={value ?? ""}
                onChangeText={setValue}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
              />

              <TransparetButton
                label="Search"
                onPress={handleSearch}
                containerStyle={styles.addButton}
                labelStyle={styles.addButtonText}
              />
            </View>
          </KeyboardAwareScrollView>
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        ref={bottomSearchIdeasTaskSheetRef}
        index={-1}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
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
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.7}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* FILTER TITLE */}
          <KeyboardAwareScrollView>
            <SearchTaskList
              myTasks={myTasks}
              sortedTasks={searchGlobalTasks}
              user={user}
              setMyTasks={setMyTasks}
              profile={profile}
            />
            <View style={styles.inputRow}>
              <CustomTextInput
                value={value ?? ""}
                onChangeText={setValue}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
              />

              <TransparetButton
                label="Search"
                onPress={handleIdeasSearch}
                containerStyle={styles.addButton}
                labelStyle={styles.addButtonText}
              />
            </View>
          </KeyboardAwareScrollView>
        </BottomSheetView>
      </BottomSheet>
    </MainLayout>
  );
};

export default TaskList;

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
  addButton: {
    backgroundColor: "rgba(152, 100, 225, 1)",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    marginLeft: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    paddingVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  inputContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
  },
  inputText: {
    paddingHorizontal: 20,
    color: "rgba(54, 43, 50, 1)",
    fontSize: 15,
    fontWeight: "300",
  },
});
