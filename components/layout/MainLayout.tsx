import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StatusBar, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
interface MainLayoutProps {
  children: ReactNode;
  color1?: string;
  color2?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  color1 = "#984BDC",
  color2 = "#6530D0",
}) => {
  return (
    <LinearGradient
      colors={[color1, color2]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default MainLayout;
