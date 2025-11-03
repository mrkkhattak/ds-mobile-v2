// app/layout.tsx
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/authstore";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // simulate async restore (if needed)
  useEffect(() => {
    // example: check token or API
    setTimeout(() => {
      console.log("set user : null");
      setUser(null); // change this logic accordingly
    }, 1000);
  }, []);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={"red"} />
      </View>
    );
  }

  if (user === null) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
