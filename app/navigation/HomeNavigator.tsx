import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import index from "../(tabs)";
import TaskList from "../Screen/TaskList";
import { HomeStackParamList } from "../types/navigator_type";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"Home"}
    >
      <Stack.Screen name="Home" component={index} />

      <Stack.Screen name="TaskLibrary" component={TaskList} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
