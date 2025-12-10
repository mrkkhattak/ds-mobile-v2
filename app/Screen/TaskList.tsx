import MainLayout from "@/components/layout/MainLayout";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "@/store/authstore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import GoToIcon from "../../assets/images/icons/Go-To (2).svg";
import IdeaIcon from "../../assets/images/icons/Ideas.svg";
import PackIcon from "../../assets/images/icons/Packs.svg";
import RepeatIcon from "../../assets/images/icons/Repeat.svg";
import {
  fetchAndGroupTasks,
  fetchPreMadePacksWithGlobalTasks,
  fetchRooms,
  fetchSpruceTasksByHouseHoldId,
  PreMadePack,
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
import { MainButton, TransparetButton } from "@/components/ui/Buttons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
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

  console.log("====>", selectedEffort);

  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const bottomAddTaskSheetRef = useRef<BottomSheet>(null);
  const bottomFilterTaskSheetRef = useRef<BottomSheet>(null);

  const [selectedTab, setSelectedTab] = useState("Go-To");

  const [groupData, setGroupData] = useState<any>({});
  const [myTasks, setMyTasks] = useState<SpruceTaskDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);
  const gradientColors = ["#16C5E0", "#8DE016"];
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
          // setLoading(true);

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
            }
          );

          if (isActive && result) setGroupData(result);

          if (user && profile) {
            const assignedTasks = await fetchSpruceTasksByHouseHoldId(
              profile.household_id
            );
            if (isActive && assignedTasks) setMyTasks(assignedTasks.data || []);
          }

          if (isActive) setLoading(false);
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
      (async () => {
        const result = await fetchRooms();
        if ("error" in result) {
          Snackbar.show({
            text: result.error,
            duration: 2000,
            backgroundColor: "red",
          });
        } else {
          setRoomList(result);
          setSelectedSubTab(result[0].value);
          console.log("Fetched rooms:", result);
        }
      })();
    }, [profile])
  );
  const formattedData = formatDataForUI(packs);
  const hanldeFilterSheet = () => {
    bottomFilterTaskSheetRef.current?.expand();
  };

  const fetchData = async () => {
    try {
      // setLoading(true);

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
        }
      );

      if (result) {
        setGroupData(result);
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
          />
          <TaskListTab
            hanldeFilterSheet={hanldeFilterSheet}
            navigation={navigation}
            bottomAddTaskSheetRef={bottomAddTaskSheetRef}
            handleShuffle={() => {}}
          />
        </>
      )}
      {selectedTab === "Repeat" && profile && (
        <TaskAccordionWithFlatList
          groupData={groupData}
          myTasks={myTasks}
          setMyTasks={setMyTasks}
          user={user}
          setLoading={setLoading}
          profile={profile}
        />
      )}
      {selectedTab === "Ideas" && profile && (
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
        />
      )}
      {selectedTab === "Packs" && profile && user && (
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
      )}
      <BottomSheet
        ref={bottomFilterTaskSheetRef}
        index={1}
        snapPoints={["60%"]}
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
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.7}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* FILTER TITLE */}
          <ScrollView>
            <View
              style={{
                borderBottomWidth: 0.2,
                paddingBottom: 20,
                borderColor: "rgba(0,0,0,0.5)",
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "300", marginLeft: 20 }}>
                FILTER
              </Text>
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
                {["CHILD", "ADULT", "BOTH"].map((type) =>
                  renderButton(type, selectedType === type, () =>
                    setSelectedType(type)
                  )
                )}
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
});
