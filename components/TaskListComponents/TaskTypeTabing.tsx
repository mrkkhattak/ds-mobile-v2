import { TablisntType } from "@/app/types/types";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TaskTypeTabingProps {
  tabList: TablisntType[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}
const TaskTypeTabing = (props: TaskTypeTabingProps) => {
  const { tabList, selectedTab, setSelectedTab } = props;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlatList
        data={tabList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.tabContainer}
        renderItem={({ item }) => {
          const isSelected = selectedTab === item.label;
          return (
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setSelectedTab(item.label)}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: "center" }}>
                {isSelected ? item.selectedIcon : item.unselectedIcon}
                <Text
                  style={[styles.tabLabel, isSelected && styles.tabLabelActive]}
                >
                  {item.label.toLocaleUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TaskTypeTabing;

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 7,
    gap: 2,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { color: "#FFFFFF", fontSize: 12, marginTop: 6, fontWeight: "500" },
  tabLabelActive: { color: "#FFFFFF", fontWeight: "700" },
});
