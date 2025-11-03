// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Settings from "../(tabs)/explore";
import Home from "../(tabs)/index";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
