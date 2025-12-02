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
  const hiddenRoutes: any[] = [
    "ProfileScreen",
    "CreateHouseholdScreen",
    "Settings",
    "MainMenu",
    "InviteUserScreen",
    "ResetPasswordScreen",
    "SpruceScreen",
  ];

  // Get the active route name for nested navigators
  const activeRoute: any = getFocusedRouteNameFromRoute(route);
  const result = hiddenRoutes.includes(activeRoute);
  return result;
};
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
          marginBottom: 20,

          display: shouldHideTabBar(route) === true ? "none" : "flex",
        },
        tabBarShowLabel: false, // we'll use a custom label
      })}
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
                alignItems: "flex-end",

                width: 160,
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
                  marginRight: 20,
                }}
              >
                Library
              </Text>
            </View>
          ),
        }}
        // options={({ route }) => {
        //   console.log(route);
        //   return {
        //     tabBarIcon: ({ focused }) => (
        //       <View
        //         style={{
        //           alignItems: "center",

        //           width: 200,
        //         }}
        //       >
        //         <Icon3
        //           width={100}
        //           height={60}
        //           fill={focused ? "#4A00E0" : "#AAA"}
        //         />
        //         <Text
        //           style={{
        //             color: focused ? "#4A00E0" : "#AAA",
        //             fontSize: 15,
        //             marginTop: 4,
        //             fontWeight: "600",
        //           }}
        //         >
        //           Library
        //         </Text>
        //       </View>
        //     ),
        //     tabBarStyle: {
        //       display: shouldHideTabBar(route) ? "none" : "flex", // Dynamically hide or show
        //       backgroundColor: "#F7F6FB",
        //     },
        //   };
        // }}
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
                alignItems: "flex-start",
                width: 160,
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
                  marginLeft: 20,
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
