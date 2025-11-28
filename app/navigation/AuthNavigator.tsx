// navigation/AuthNavigator.tsx
import { useAuthStore } from "@/store/authstore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CleaningStruggleScreen from "../Screen/CleaningStruggleScreen";
import ConfirmEmail from "../Screen/ConfirmEmail";
import CreateYourAccountScreen from "../Screen/CreateYourAccountScreen";
import ForgotPasswordScreen from "../Screen/ForgotPasswordScreen";
import HereWhatWaitingForYouScreen from "../Screen/HereWhatWaitingForYouScreen";
import { default as LoginScreen } from "../Screen/LoginScreen";
import PaymentScreen from "../Screen/PaymentScreen";
import PickYourTaskScreen from "../Screen/PickYourTaskScreen";
import ResetPasswordScreen from "../Screen/ResetPasswordScreen";
import SettingUpYourRoomScreen from "../Screen/SettingUpYourRoomScreen";
import SetUpYourHomeScreen from "../Screen/SetUpYourHomeScreen";
import Register from "../Screen/SingupScreen";
import YouAreInRightSpaceScreen from "../Screen/YouAreInRightSpaceScreen";
import { AuthStackParamList } from "../types/navigator_type";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const isPasswordRecovery = useAuthStore((s) => s.isPasswordRecovery);
  const [initialRoute, setInitialRoute] = useState<string | null | any>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        console.log("value", value);
        if (isPasswordRecovery) {
          setInitialRoute("ResetPasswordScreen");
        } else if (value === "true") {
          setInitialRoute("CreateYourAccountScreen");
        } else {
          setInitialRoute("CleaningStruggleScreen"); // first onboarding screen
        }
      } catch (error) {
        setInitialRoute("CleaningStruggleScreen");
      }
    };
    checkOnboarding();
  }, [isPasswordRecovery]);
  if (!initialRoute) {
    // optional loading screen
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8C50FB" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />

      <Stack.Screen
        name="CleaningStruggleScreen"
        component={CleaningStruggleScreen}
      />
      <Stack.Screen
        name="SetUpYourHomeScreen"
        component={SetUpYourHomeScreen}
      />
      <Stack.Screen name="PickYourTaskScreen" component={PickYourTaskScreen} />
      <Stack.Screen
        name="SettingUpYourRoomScreen"
        component={SettingUpYourRoomScreen}
      />
      <Stack.Screen
        name="CreateYourAccountScreen"
        component={CreateYourAccountScreen}
      />
      <Stack.Screen
        name="YouAreInRightSpaceScreen"
        component={YouAreInRightSpaceScreen}
      />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen
        name="HereWhatWaitingForYouScreen"
        component={HereWhatWaitingForYouScreen}
      />
    </Stack.Navigator>
  );
}
