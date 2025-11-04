// navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CleaningStruggleScreen from "../Screen/CleaningStruggleScreen";
import Login from "../Screen/LoginScreen";
import Register from "../Screen/SingupScreen";

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
}
