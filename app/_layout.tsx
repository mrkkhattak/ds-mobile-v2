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
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authstore";
import AuthNavigator from "./navigation/AuthNavigator";
import TabNavigator from "./navigation/TabNavigator";
import { supabase } from "../lib/supabase";
import SpalshScreen from "./Screen/SpalshScreen";

// Keep the splash screen visible while fonts load
Splash.preventAutoHideAsync();

export default function RootLayout() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const isPasswordRecovery = useAuthStore((s) => s.isPasswordRecovery);
  const initialize = useAuthStore((s) => s.initialize);
  const setIsPasswordRecovery = useAuthStore((s) => s.setIsPasswordRecovery);
  const [showSplash, setShowSplash] = useState(true);

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

      // Parse URL manually to handle all formats
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.hash.replace('#', '?'));

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      // Check if this is an auth callback with tokens
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error) {
          console.log('Session set successfully, type:', type);
          // Check if this is a password recovery
          if (type === 'recovery') {
            setIsPasswordRecovery(true);
          }
          // For email confirmation (type === 'signup' or 'email_change'),
          // the user state will update automatically and show TabNavigator
        } else {
          console.error('Error setting session:', error);
        }
      }
    };

    // Check for initial URL when app opens from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink(url);
      }
    });

    // Listen for URL changes when app is already open
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('URL event:', event.url);
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, [setIsPasswordRecovery]);


  // Hide native splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      Splash.hideAsync();
    }
  }, [fontsLoaded]);

  // Show custom splash screen for minimum duration
  useEffect(() => {
    if (fontsLoaded && !loading) {
      // Show splash for at least 2 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, loading]);

  // Wait until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  // Show custom splash screen
  if (showSplash || loading) {
    return <SpalshScreen />;
  }

  // Show appropriate navigator based on auth state
  if (user === null || isPasswordRecovery) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
