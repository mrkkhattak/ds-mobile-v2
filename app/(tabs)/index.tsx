import { useAuthStore } from "@/store/authstore";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const index = () => {
  const { signOut } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  console.log("user", user);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => {
          signOut();
        }}
      >
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
