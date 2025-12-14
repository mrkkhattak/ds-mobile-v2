import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import index from "../(tabs)";
import BottomSheetScreen from "../Screen/BottomSheetScreen";
import CreateHouseholdScreen from "../Screen/CreateHouseHoldScreen";
import CreateNewPasswordScreen from "../Screen/CreateNewPasswordScreen";
import FeedBack from "../Screen/FeedBack";
import FlashbackScreen from "../Screen/FlashbackScreen";
import InviteUserScreen from "../Screen/InviteUserScreen";
import MainMenu from "../Screen/MainMenu";
import ProfileScreen from "../Screen/ProfileScreen";
import Settings from "../Screen/Settings";
import SpruceScreen from "../Screen/SpruceScreen";
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

      <Stack.Screen name="FlashBack" component={FlashbackScreen} />
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
      <Stack.Screen name="SpruceScreen" component={SpruceScreen} />
      <Stack.Screen name="BottomSheetScreen" component={BottomSheetScreen} />

      <Stack.Screen name="FeedBackScreen" component={FeedBack} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
