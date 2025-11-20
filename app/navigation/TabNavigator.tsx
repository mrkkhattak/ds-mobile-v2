// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View } from "react-native";
import Settings from "../(tabs)/explore";
import Icon2 from "../../assets/images/icons/Group 38.svg";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AddIcon from "../../assets/images/icons/Add.svg";
import Icon3 from "../../assets/images/icons/Group 37.svg";
import BottomSheetScreen from "../Screen/BottomSheetScreen";
import HomeNavigator from "./HomeNavigator";

const Tab = createBottomTabNavigator();

const shouldHideTabBar = (route: any) => {
  const hiddenRoutes = [
    "updateEmail",
    "otpVerification",
    "genderScreen",
    "ageScreen",
    "weightAndHeightScreen",
    "fitnessLevelScreen",
    "fitnessGoalScreen",
    "equimentsScreen",
    "privacyPolicy",
    "updatePasswordScreen",
    "deleteAccountScreen",
    "addMembersToGroup",
    "creategroupscreeen",
    "chatlist",
    "chatProfileNavigator",
    "locationScreen",
    "watchVideo",
    "imageView",
    "groupChatList",
    "timeClockScreen",
    "paymentScreen",
    "paymentCardScreen",
    "userGymlocationScreen",
    "userWorkoutlocationScreen",
    "profileLocationScreen",
  ];

  // Get the active route name for nested navigators
  const activeRoute: any = getFocusedRouteNameFromRoute(route);
  console.log("activeRoute", activeRoute);
  return hiddenRoutes.includes(activeRoute);
};
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
          marginBottom: 20,
        },
        tabBarShowLabel: false, // we'll use a custom label below
      }}
    >
      <Tab.Screen
        name="Library"
        component={HomeNavigator}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Library", {
              screen: "TaskLibrary",
            });
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",

                width: 200,
              }}
            >
              <Icon3
                width={100}
                height={60}
                fill={focused ? "#4A00E0" : "#AAA"}
              />
              <Text
                style={{
                  color: focused ? "#4A00E0" : "#AAA",
                  fontSize: 15,
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                Library
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={BottomSheetScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",

                width: 200,
              }}
            >
              <AddIcon
                width={100}
                height={100}
                fill={focused ? "#8DE016" : "#AAA"}
              />
              <Text
                style={{
                  color: focused ? "#8DE016" : "#AAA",
                  fontSize: 15,
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                Add
              </Text>
            </View>
          ),
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen
        name="Shuffle"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                width: 200,
              }}
            >
              <Icon2
                width={100}
                height={60}
                fill={focused ? "#4A00E0" : "#AAA"}
              />
              <Text
                style={{
                  color: focused ? "#4A00E0" : "#AAA",
                  fontSize: 15,
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                Shuffle
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
