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
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../store/authstore";
import { supabase } from "../lib/supabase";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";

// Keep the splash screen visible while fonts load
Splash.preventAutoHideAsync();

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const isPasswordRecovery = useAuthStore((s) => s.isPasswordRecovery);
  const initialize = useAuthStore((s) => s.initialize);
  const setIsPasswordRecovery = useAuthStore((s) => s.setIsPasswordRecovery);

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

  // Handle deep linking for email confirmation and password reset
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;

      if (!url) return;

      // Extract the URL query parameters
      const urlObj = new URL(url);
      const accessToken = urlObj.searchParams.get("access_token");
      const refreshToken = urlObj.searchParams.get("refresh_token");
      const type = urlObj.searchParams.get("type");

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          Alert.alert("Error", "Failed to verify link. Please try again.");
          return;
        }

        if (data?.session) {
          if (type === "signup") {
            Alert.alert(
              "Success",
              "Email confirmed successfully! You can now use the app."
            );
          } else if (type === "recovery") {
            // Set flag to show ResetPasswordScreen
            setIsPasswordRecovery(true);
          }
        }
      }
    };

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Handle URL when app is already open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, [setIsPasswordRecovery]);

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
  if (user === null || isPasswordRecovery) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
