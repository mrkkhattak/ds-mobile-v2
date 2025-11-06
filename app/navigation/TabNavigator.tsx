// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View } from "react-native";
import Settings from "../(tabs)/explore";
import Home from "../(tabs)/index";
import Icon2 from "../../assets/images/icons/Shuffle.svg";

import Icon3 from "../../assets/images/icons/Shuffle (1).svg";

const Tab = createBottomTabNavigator();

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
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",

                width: 200,
              }}
            >
              <Icon3
                width={200}
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
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
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
                width={200}
                height={100}
                fill={focused ? "#8DE016" : "#AAA"}
              />
              <Text
                style={{
                  color: focused ? "#8DE016" : "#575261",
                  fontSize: 15,
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
