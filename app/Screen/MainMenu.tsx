import MainLayout from "@/components/layout/MainLayout";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
const MainMenu = () => {
  const naviagtion = useNavigation<any>();
  const list = [
    { label: "Home", value: "Home" },
    { label: "Task Library", value: "TaskLibrary" },
    { label: "Flash Back", value: "FlashBack" },
    { label: "Settings", value: "Settings" },
    { label: "FeedBack", value: "FeedBack" },
  ];
  const renderItem = ({ item }: { item: (typeof list)[0] }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => naviagtion.navigate(item.value)}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <MainLayout>
      <FlatList
        data={list}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </MainLayout>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#342868", // example background
  },
  heading: {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 30,
    color: "white",
    marginTop: 20,
  },
  itemContainer: {
    paddingVertical: 15,
  },
  itemText: {
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 30,
    color: "white",
  },
});
