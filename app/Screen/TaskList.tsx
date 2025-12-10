import MainLayout from "@/components/layout/MainLayout";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

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
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";
type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TaskLibrary"
>;
const TaskList = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((e) => e.user);
  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const bottomAddTaskSheetRef = useRef<BottomSheet>(null);
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
  // const subTabList = [
  //   "Kitchen",
  //   "Bedroom",
  //   "Living Room",
  //   "Bathroom",
  //   "General Cleaning",
  //   "Outdoor",
  // ];
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
      let interval: NodeJS.Timeout;

      const fetchData = async () => {
        try {
          // setLoading(true);

          // 1️⃣ Fetch grouped tasks
          const result = await fetchAndGroupTasks(
            selectedTab === "Go-To"
              ? "goto"
              : selectedTab === "Repeat"
              ? "repeat"
              : selectedTab === "Ideas"
              ? "ideas"
              : "pack"
          );
          console.log("result", result);
          if (isActive && result) {
            setGroupData(result);
          }

          // 2️⃣ Fetch assigned tasks
          if (user && profile) {
            const assignedTasks = await fetchSpruceTasksByHouseHoldId(
              profile?.household_id
            );
            if (isActive && assignedTasks) {
              setMyTasks(assignedTasks.data || []);
            }
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
      interval = setInterval(fetchData, 5000);

      return () => {
        isActive = false;
        clearInterval(interval); // stop polling on unmount
      };
    }, [user, selectedTab, profile, selectedSubTab])
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
  // const taskList = useMemo(() => {
  //   return (
  //     <FlatList
  //       data={selectedPack?.tasks}
  //       keyExtractor={(item) => item.id.toString()}
  //       contentContainerStyle={{
  //         paddingBottom: 100,
  //         backgroundColor: "red",
  //       }}
  //       style={{ flexGrow: 0 }}
  //       initialNumToRender={10}
  //       removeClippedSubviews={false}

  //     />
  //   );
  // }, [selectedPack?.tasks, myTasks]);
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
        <View style={{ marginBottom: 40 }}>
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
            navigation={navigation}
            bottomAddTaskSheetRef={bottomAddTaskSheetRef}
            handleShuffle={() => {}}
          />
        </View>
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
