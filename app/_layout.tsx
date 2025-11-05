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

// Keep the splash screen visible while fonts load
Splash.preventAutoHideAsync();

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initialize = useAuthStore((s) => s.initialize);

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

  // Initialize auth state
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Hide splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded && !loading) {
      Splash.hideAsync();
    }
  }, [fontsLoaded, loading]);

  // Wait until fonts and auth are loaded
  if (!fontsLoaded || loading) {
    return null;
  }

  // Show appropriate navigator based on auth state
  if (user === null) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
