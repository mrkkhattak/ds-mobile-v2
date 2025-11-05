// navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CleaningStruggleScreen from "../Screen/CleaningStruggleScreen";
import CreateYourAccountScreen from "../Screen/CreateYourAccountScreen";
import ForgotPasswordScreen from "../Screen/ForgotPasswordScreen";
import { default as LoginScreen } from "../Screen/LoginScreen";
import PickYourTaskScreen from "../Screen/PickYourTaskScreen";
import SettingUpYourRoomScreen from "../Screen/SettingUpYourRoomScreen";
import SetUpYourHomeScreen from "../Screen/SetUpYourHomeScreen";
import Register from "../Screen/SingupScreen";
import { AuthStackParamList } from "../types/navigator_type";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="CleaningStruggleScreen"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />

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
    </Stack.Navigator>
  );
}
