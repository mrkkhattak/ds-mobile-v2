import MainLayout from "@/components/layout/MainLayout";
import React, { useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

import { useAuthStore } from "@/store/authstore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import GoToIcon from "../../assets/images/icons/Go-To (2).svg";
import IdeaIcon from "../../assets/images/icons/Ideas.svg";
import PackIcon from "../../assets/images/icons/Packs.svg";
import RepeatIcon from "../../assets/images/icons/Repeat.svg";
import {
  fetchAndGroupTasks,
  fetchSpruceTasks,
  SpruceTaskDetails,
} from "../functions/functions";

import TaskAccordionWithFlatList from "@/components/collapsibleComponent/TaskAccordionWithFlatList";
import Header from "@/components/Header/Header";
import TaskSubList from "@/components/TaskListComponents/TaskSubList";
import TaskTypeTabing from "@/components/TaskListComponents/TaskTypeTabing";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import HomeIcon from "../../assets/images/icons/Vector (3).svg";
import { HomeStackParamList } from "../types/navigator_type";
import { TablisntType } from "../types/types";
type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "TaskLibrary"
>;
const TaskList = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((e) => e.user);
  const [selectedTab, setSelectedTab] = useState("Go-To");
  const [selectedSubTab, setSelectedSubTab] = useState("Kitchen");
  const [groupData, setGroupData] = useState<any>({});
  const [myTasks, setMyTasks] = useState<SpruceTaskDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(true);
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

  const subTabList = [
    "Kitchen",
    "Bedroom",
    "Living Room",
    "BathRoom",
    "General Cleaning",
    "Outdoor",
  ];
  const currentTasks = groupData[selectedSubTab] || [];

  const sortedTasks = [...currentTasks].sort((a, b) => {
    const aAssigned = myTasks.some((task) => task.task_id === a.id);
    const bAssigned = myTasks.some((task) => task.task_id === b.id);

    if (aAssigned === bAssigned) return 0; // same status, keep order
    if (aAssigned) return 1; // a is assigned, move down
    return -1; // a is unassigned, stay on top
  });

  const navigationToHome = () => {
    navigation.navigate("Home");
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          setLoading(true);

          // 1️⃣ Fetch grouped tasks

          const result = await fetchAndGroupTasks(
            selectedTab === "Go-To"
              ? "goto"
              : selectedTab === "Repeat"
              ? "repeat"
              : selectedTab === "Ideas"
              ? "idea"
              : "pack"
          );
          if (isActive && result) {
            setGroupData(result);
          }
          // 2️⃣ Fetch assigned tasks (if user exists)
          if (user) {
            const assignedTasks = await fetchSpruceTasks(user.id);
            if (isActive && assignedTasks) {
              setMyTasks(assignedTasks.data || []);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching grouped or assigned tasks:", error);
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [user, selectedTab])
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
      <View>
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
        {selectedTab === "Go-To" && (
          <TaskSubList
            selectedSubTab={selectedSubTab}
            setSelectedSubTab={setSelectedSubTab}
            myTasks={myTasks}
            groupData={groupData}
            subTabList={subTabList}
            sortedTasks={sortedTasks}
            user={user}
            setMyTasks={setMyTasks}
          />
        )}
        {selectedTab === "Repeat" && (
          <TaskAccordionWithFlatList
            groupData={groupData}
            myTasks={myTasks}
            setMyTasks={setMyTasks}
            user={user}
            setLoading={setLoading}
          />
        )}
      </View>
    </MainLayout>
  );
};

export default TaskList;
