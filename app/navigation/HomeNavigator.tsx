import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import index from "../(tabs)";
import CreateHouseholdScreen from "../Screen/CreateHouseHoldScreen";
import CreateNewPasswordScreen from "../Screen/CreateNewPasswordScreen";
import InviteUserScreen from "../Screen/InviteUserScreen";
import MainMenu from "../Screen/MainMenu";
import ProfileScreen from "../Screen/ProfileScreen";
import Settings from "../Screen/Settings";
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
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="CreateHouseholdScreen"
        component={CreateHouseholdScreen}
      />
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="InviteUserScreen" component={InviteUserScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={CreateNewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
