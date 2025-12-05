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

import {
  AddTaskToSpruce,
  PreMadePack,
  removeTasksByGlobalId,
  SpruceTaskDetails,
} from "@/app/functions/functions";
import { UserProfile } from "@/app/types/types";
import AddIcon from "@/assets/images/icons/smallAddIcon.svg";
import { User } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import Snackbar from "react-native-snackbar";
import LimeIcon from "../../assets/images/icons/Lime.svg";
interface PackListProps {
  formattedData: any;
  selectedPack: PreMadePack | undefined;
  setSelectedPack: React.Dispatch<
    React.SetStateAction<PreMadePack | undefined>
  >;
  gradientColors: string[];
  setMyTasks: React.Dispatch<React.SetStateAction<SpruceTaskDetails[]>>;
  myTasks: SpruceTaskDetails[];
  user: User;
  profile: UserProfile;
}
const PacksList = (props: PackListProps) => {
  const {
    formattedData,
    selectedPack,
    setSelectedPack,
    gradientColors,
    setMyTasks,
    myTasks,
    user,
    profile,
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [listWidth, setListWidth] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const indicatorHeight = screenHeight * (screenHeight / contentHeight);

  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0); // default to 1 to avoid divide by 0

  const indicatorWidth = screenWidth * (screenWidth / contentWidth);
  return (
    <View style={{ marginHorizontal: 10 }}>
      <>
        {/* <View
          style={{
            height: 4,
            backgroundColor: "rgba(193, 191, 196, 0.3)",
            marginTop: 8,
            borderRadius: 2,
          }}
        >
          <Animated.View
            style={{
              height: 4,
              backgroundColor: "rgba(193, 191, 196, 0.5)",
              width: indicatorWidth,
              borderRadius: 2,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, Math.max(contentWidth - screenWidth, 0)],
                    outputRange: [0, Math.max(screenWidth - indicatorWidth, 0)],
                    extrapolate: "clamp", // prevent wrap-around
                  }),
                },
              ],
            }}
          />
        </View> */}
        <FlatList
          horizontal
          data={formattedData}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          onContentSizeChange={(w) => setContentWidth(w)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          style={{ marginTop: 10 }}
          scrollEventThrottle={16}
          //   style={{ marginTop: 5 }}
          renderItem={({ item }) => {
            if (item.type === "big") {
              const selected = selectedPack?.id === item.item.id;

              return (
                <TouchableOpacity
                  onPress={() => setSelectedPack(item.item)}
                  style={{
                    overflow: "hidden",
                    maxHeight: 200,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  {selected ? (
                    <LinearGradient
                      colors={gradientColors}
                      style={{
                        flex: 1,
                        width: 200,

                        marginRight: 10,
                        padding: 10,
                        borderRadius: 22,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#fff",
                        }}
                      >
                        {item.item.name_us}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        width: 200,
                        borderWidth: 1,
                        borderColor: "#fff",
                        borderRadius: 22,
                        marginRight: 10,
                        backgroundColor: "#9864E1",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#fff",
                        }}
                      >
                        {item.item.name_us}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }

            return (
              <View
                style={{
                  marginRight: 16,
                  justifyContent: "space-between",
                  height: 150,
                }}
              >
                {item.items.map((pack: any, index: any) => {
                  const selected = pack.id === selectedPack?.id;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedPack(pack)}
                      style={{
                        width: 140,
                        height: 70,

                        overflow: "hidden",
                        marginBottom: index === 0 ? 10 : 0,
                        shadowColor: "#000",
                        shadowOpacity: 0.12,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      {selected ? (
                        <LinearGradient
                          colors={gradientColors}
                          style={{
                            flex: 1,
                            borderRadius: 16,
                            justifyContent: "center",
                            paddingLeft: 12,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: "#fff",
                            }}
                          >
                            {pack.name_us}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            paddingLeft: 12,
                            backgroundColor: "#9864E1",
                            borderWidth: 1,
                            borderRadius: 16,
                            borderColor: "#fff",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: "#fff",
                            }}
                          >
                            {pack.name_us}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          }}
        />
      </>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FlatList
          data={selectedPack?.tasks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingLeft: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
          }}
          style={{ marginBottom: 100, marginTop: 10, height: 500 }}
          initialNumToRender={10}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onContentSizeChange={(w, h) => setContentHeight(h)}
          extraData={myTasks} // ensures FlatList updates when myTasks changes
          renderItem={({ item }) => {
            const createdAt = dayjs(item.created_at);
            const today = dayjs();
            const diffDays = today.diff(createdAt, "day"); // difference in days
            const isAssigned = myTasks.some((task) => task.task_id === item.id);
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                        <View style={{ flexDirection: "row" }}>
                          <LimeIcon />
                          <LimeIcon />
                          <LimeIcon />
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
                          onPress={async () => {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];

                            const success = await AddTaskToSpruce(
                              item.id,
                              user.id,
                              today,
                              profile.household_id
                            );
                            if (success) {
                              Snackbar.show({
                                text: "Task assigned successfully!",
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: "green",
                              });
                              // Optionally update myTasks locally
                              const newTask: any = {
                                id: "", // you can update from returned data if needed
                                assigned_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                assign_user_id: user.id,
                                assign_user_email: user.email || null,
                                owner_user_id: user.id,
                                owner_user_email: user.email || null,
                                task_id: item.id,
                                task_name: item.name,
                                description_us: item.description_us,
                                description_uk: item.description_uk,
                                description_row: item.description_row,
                                icon_name: item.icon_name,
                                child_friendly: item.child_friendly,
                                estimated_effort: item.estimated_effort,
                                points: item.points,
                                room: item.room,
                                category: item.category,
                                keywords: null,
                                display_names: null,
                                unique_completions: 0,
                                total_completions: 0,
                                effort_level: null,
                              };
                              setMyTasks((prev) => [...prev, newTask]);
                            } else {
                              Snackbar.show({
                                text: "Failed to assign task.",
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: "red",
                              });
                            }
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
                          onPress={async () => {
                            const success = await removeTasksByGlobalId(
                              item.id
                            );
                            if (success) {
                              Snackbar.show({
                                text: "Task removed successfully!",
                                duration: 2000,
                                backgroundColor: "green",
                              });

                              // Update local state to remove the task instantly
                              setMyTasks((prev) =>
                                prev.filter((task) => task.task_id !== item.id)
                              );
                            } else {
                              Snackbar.show({
                                text: "Failed to remove task.",
                                duration: 2000,
                                backgroundColor: "red",
                              });
                            }
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

            height: 600,
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
                    inputRange: [0, Math.max(contentHeight - screenHeight, 0)],
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
    </View>
  );
};

export default PacksList;

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
    marginBottom: 15,
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
