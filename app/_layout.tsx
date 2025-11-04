import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import * as Splash from "expo-splash-screen";
import React, { useEffect } from "react";
import { useAuthStore } from "../store/authstore";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";
import SplashScreen from "./Screen/SpalshScreen";

// Keep the splash screen visible while fonts load
Splash.preventAutoHideAsync();

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    "Inter-Light": Inter_300Light,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
  });

  // Simulate async auth restore (example)
  useEffect(() => {
    setTimeout(() => {
      setUser(null); // Example: user not logged in
    }, 2000);
  }, []);

  // Hide splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded) Splash.hideAsync();
  }, [fontsLoaded]);

  // Wait until fonts are loaded
  if (!fontsLoaded) return null;

  // Normal logic continues
  if (user === undefined) {
    return <SplashScreen />;
  }

  if (user === null) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
