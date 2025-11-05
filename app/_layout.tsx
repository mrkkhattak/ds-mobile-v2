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
import { useAuthStore } from "../store/authstore";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";
import { supabase } from "../lib/supabase";

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

  // Handle deep links for authentication
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log('Deep link received:', url);
      const { path, queryParams } = Linking.parse(url);

      // Check if this is an auth callback
      if (queryParams?.access_token && queryParams?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: queryParams.access_token as string,
          refresh_token: queryParams.refresh_token as string,
        });

        if (!error) {
          // Check if this is a password recovery or email confirmation
          const type = queryParams.type as string;
          if (type === 'recovery') {
            setIsPasswordRecovery(true);
          }
          // For email confirmation (type === 'signup'), the user state will update automatically
        }
      }
    };

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for URL changes
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

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
