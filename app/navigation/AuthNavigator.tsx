// navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CleaningStruggleScreen from "../Screen/CleaningStruggleScreen";
import Login from "../Screen/LoginScreen";
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
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="CleaningStruggleScreen"
        component={CleaningStruggleScreen}
      />
      <Stack.Screen
        name="SetUpYourHomeScreen"
        component={SetUpYourHomeScreen}
      />
    </Stack.Navigator>
  );
}
