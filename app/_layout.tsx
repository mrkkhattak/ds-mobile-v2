// app/layout.tsx
import { useEffect } from "react";
import { useAuthStore } from "../store/authstore";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";
import SplashScreen from "./Screen/SpalshScreen";

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // simulate async restore (if needed)
  useEffect(() => {
    // example: check token or API
    setTimeout(() => {
      setUser(null);
      // change this logic accordingly
    }, 5000);
  }, []);
  console.log(user);
  if (user === undefined) {
    return <SplashScreen />;
  }

  if (user === null) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
