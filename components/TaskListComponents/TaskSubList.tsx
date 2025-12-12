import { SpruceTaskDetails } from "@/app/functions/functions";
import RemoveIcon from "@/assets/images/icons/remove.svg";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddIcon from "@/assets/images/icons/smallAddIcon.svg";

import { UserProfile } from "@/app/types/types";
import { User } from "@supabase/auth-js";
import dayjs from "dayjs";
import LimeIcon from "../../assets/images/icons/Lime.svg";

interface TaskSubListProps {
  selectedSubTab: string;
  setSelectedSubTab: (tab: string) => void;
  myTasks: SpruceTaskDetails[];
  groupData: Record<string, any[]>;
  roomList: {
    label: String;
    value: String;
  }[];
  sortedTasks: any[];
  user: User | null;
  setMyTasks: React.Dispatch<React.SetStateAction<SpruceTaskDetails[]>>;
  profile: UserProfile;
  display?: string;
  handleGotoTaskAssign: (item: any, user: any, profile: any) => Promise<void>;
  handleRemoveGotoTask: (item: any) => Promise<void>;
  type?: string;
}
const TaskSubList = (props: TaskSubListProps) => {
  const {
    selectedSubTab,
    setSelectedSubTab,
    myTasks,
    groupData,
    roomList,
    sortedTasks,
    user,
    setMyTasks,
    profile,
    handleGotoTaskAssign,
    handleRemoveGotoTask,
    type = "goto",
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Screen and indicator sizes
  const screenHeight = Dimensions.get("window").height;
  const [contentHeight, setContentHeight] = useState(0);
  const indicatorHeight = screenHeight * (screenHeight / contentHeight);
  return (
    <View style={{ marginTop: 30 }}>
      {/* Sub Tabs */}
      <FlatList
        data={roomList}
        horizontal
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        keyExtractor={(item) => `${item.value}`}
        contentContainerStyle={styles.subTabContainer}
        renderItem={({ item }) => {
          const isSelected = selectedSubTab === item.value;

          return (
            <TouchableOpacity
              style={[
                styles.subTabButton,
                isSelected && styles.subTabButtonActive,
              ]}
              onPress={() => setSelectedSubTab(`${item.value}`)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabLabel,
                  isSelected && styles.subTabLabelActive,
                ]}
              >
                {item.label.toLocaleUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View
        style={{
          marginTop: 30,
          paddingHorizontal: 20,
          height: screenHeight - 400,
        }}
      >
        {sortedTasks.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <FlatList
              data={sortedTasks}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onContentSizeChange={(w, h) => setContentHeight(h)}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => {
                const createdAt = dayjs(item.created_at);
                const today = dayjs();
                const diffDays = today.diff(createdAt, "day"); // difference in days
                let isAssigned = false;
                if (type === "goto") {
                  isAssigned = myTasks.some(
                    (task) => task.user_task_id === item.id
                  );
                } else {
                  isAssigned = myTasks.some((task) => task.task_id === item.id);
                }

                return (
                  <View
                    style={
                      !isAssigned
                        ? [styles.taskCard]
                        : [
                            styles.taskCard,
                            {
                              backgroundColor: "#1511271C",
                              opacity: 0.9,
                            },
                          ]
                    }
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View></View>
                      <Text
                        style={
                          !isAssigned
                            ? styles.taskName
                            : [styles.taskName, { color: "white" }]
                        }
                      >
                        {item.name}
                      </Text>
                    </View>

                    {!isAssigned ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {[...Array(item.effort)].map((_, i) => (
                                <LimeIcon key={i} />
                              ))}
                            </View>
                            <Text
                              style={{
                                color: "#5D0FD5",
                                fontWeight: "200",
                                fontSize: 10,
                                marginTop: 5,
                                fontFamily: "inter",
                              }}
                            >
                              {diffDays} days ago
                            </Text>
                          </View>
                          {user && (
                            <TouchableOpacity
                              onPress={() => {
                                handleGotoTaskAssign(item, user, profile);
                              }}
                            >
                              <AddIcon />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {user && (
                            <TouchableOpacity
                              onPress={() => {
                                handleRemoveGotoTask(item);
                              }}
                            >
                              <RemoveIcon />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
            />
            <View
              style={{
                width: 7,
                backgroundColor: "rgba(193, 191, 196, 0.3)",
                borderRadius: 2,
                marginTop: 2,
                height: screenHeight - 400,
              }}
            >
              <Animated.View
                style={{
                  width: 7,
                  height: 123,
                  backgroundColor: "rgba(193, 191, 196, 0.5)",
                  borderRadius: 2,

                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [
                          0,
                          Math.max(contentHeight - screenHeight, 0),
                        ],
                        outputRange: [
                          0,
                          Math.max(screenHeight - indicatorHeight, 0),
                        ],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                }}
              />
            </View>
          </View>
        ) : (
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            No tasks found
          </Text>
        )}
      </View>
    </View>
  );
};

export default TaskSubList;

const styles = StyleSheet.create({
  subTabContainer: {
    paddingHorizontal: 20,
    gap: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingVertical: 2,
  },
  subTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  subTabButtonActive: {
    borderBottomWidth: 5,
    borderColor: "#fff",
  },
  subTabLabel: { color: "#fff", fontSize: 14, fontWeight: "500" },
  subTabLabelActive: { color: "#fff", fontWeight: "700" },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    color: "#362B32",
    fontSize: 14,
    fontWeight: "300",
    fontFamily: "inter",
  },
  taskDesc: { color: "#444", fontSize: 14, marginTop: 4 },
  taskPoints: { color: "#888", fontSize: 12, marginTop: 6 },
});
