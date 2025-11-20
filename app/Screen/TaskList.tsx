import MainLayout from "@/components/layout/MainLayout";
import React, { useState } from "react";
import { View } from "react-native";

import { useAuthStore } from "@/store/authstore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import GoToIcon from "../../assets/images/icons/Go-To (2).svg";
import GoToSelected from "../../assets/images/icons/Go-To.svg";
import IdeaSelectedIcon from "../../assets/images/icons/Ideas (1).svg";
import IdeaIcon from "../../assets/images/icons/Ideas.svg";
import PackSelectedIcon from "../../assets/images/icons/Packs (1).svg";
import PackIcon from "../../assets/images/icons/Packs.svg";
import RepeatSelectedIcon from "../../assets/images/icons/Repeat (1).svg";
import RepeatIcon from "../../assets/images/icons/Repeat.svg";
import {
  fetchAndGroupTasks,
  fetchSpruceTasks,
  SpruceTaskDetails,
} from "../functions/functions";

import Header from "@/components/Header/Header";
import TaskSubList from "@/components/TaskListComponents/TaskSubList";
import TaskTypeTabing from "@/components/TaskListComponents/TaskTypeTabing";
import LottieView from "lottie-react-native";
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
  const tabList: TablisntType[] = [
    {
      label: "Go-To",
      selectedIcon: <GoToSelected />,
      unselectedIcon: <GoToIcon />,
    },
    {
      label: "Repeat",
      selectedIcon: <RepeatSelectedIcon />,
      unselectedIcon: <RepeatIcon />,
    },
    {
      label: "Ideas",
      selectedIcon: <IdeaSelectedIcon />,
      unselectedIcon: <IdeaIcon />,
    },
    {
      label: "Packs",
      selectedIcon: <PackSelectedIcon />,
      unselectedIcon: <PackIcon />,
    },
  ];

  const subTabList = [
    "Kitchen",
    "Bedroom",
    "LivingRoom",
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
          const result = await fetchAndGroupTasks();
          if (isActive && result) {
            setGroupData(result);
          }

          // 2️⃣ Fetch assigned tasks (if user exists)
          if (user) {
            const assignedTasks = await fetchSpruceTasks(user.id);
            console.log("assignedTasks", assignedTasks);
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
    }, [user])
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
          <LottieView
            source={require("../../assets/animations/3001-Broom-animation.json")}
            autoPlay
            loop
            style={{ width: 400, height: 400 }}
          />
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
        {/* Horizontal Main Tabs */}
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
      </View>
    </MainLayout>
  );
};

export default TaskList;
