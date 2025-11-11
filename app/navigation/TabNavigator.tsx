// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View } from "react-native";
import Settings from "../(tabs)/explore";
import Home from "../(tabs)/index";
import Icon2 from "../../assets/images/icons/Group 38.svg";

import AddIcon from "../../assets/images/icons/Add.svg";
import Icon3 from "../../assets/images/icons/Group 37.svg";

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
        name="Library"
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
        component={Home}
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
                  color: focused ? "#4A00E0" : "#575261",
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
