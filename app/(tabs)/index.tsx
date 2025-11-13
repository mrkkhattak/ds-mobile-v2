import MainLayout from "@/components/layout/MainLayout";
import { SlideButton } from "@/components/ui/Buttons";
import DateLabel from "@/components/ui/DateLabel";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";

import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import LibrarIcon from "../../assets/images/icons/Group 1.svg";
import LimeIcon from "../../assets/images/icons/Lime.svg";
import SlideIcon from "../../assets/images/icons/arrow.svg";
import {
  getAssignedSpruceTasks,
  removeAssignedTask,
  SpruceTaskDetails,
} from "../functions/functions";

import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import { HomeStackParamList } from "../types/navigator_type";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Home">;
const index = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const user = useAuthStore((s) => s.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const [isToday, setIsToday] = useState<Boolean>(false);
  const [groupData, setGroupData] = useState<any>();
  const today = new Date();
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      const fetchTasks = async () => {
        try {
          if (user) {
            const result = await getAssignedSpruceTasks(user.id);

            if (isActive && Array.isArray(result)) {
              const grouped = result.reduce((acc, task) => {
                const category = task.category || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(task);
                return acc;
              }, {} as Record<string, SpruceTaskDetails[]>);
              setGroupData(grouped);
              setLoading(false);
            }
          }
        } catch (err) {
          console.log("Error loading tasks:", err);
          setLoading(false);
        }
      };

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [user])
  );

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    setLoading(true);
    const success = await removeAssignedTask(taskId, user.id);

    if (success) {
      // Remove the deleted task from local grouped state
      setGroupData((prev: any) => {
        const updated = { ...prev };

        for (const category in updated) {
          updated[category] = updated[category].filter(
            (task: { task_id: string }) => task.task_id !== taskId
          );

          // Remove empty categories if desired
          if (updated[category].length === 0) {
            delete updated[category];
          }
        }

        return updated;
      });

      console.log("Task removed locally:", taskId);
      Snackbar.show({
        text: "Task removed successfully!",
        duration: 2000,
        backgroundColor: "green",
      });
    } else {
      Snackbar.show({
        text: "Failed to remove task.",
        duration: 2000,
        backgroundColor: "red",
      });
    }

    setLoading(false);
  };
  const renderLeftActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "flex-start",

          borderRadius: 20,
          paddingLeft: 20,
          marginTop: 10,
        }}
      >
        <EditIcon />
      </Animated.View>
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "flex-end",

          borderRadius: 20,
          paddingRight: 20,
          marginTop: 10,
        }}
      >
        <DeleteIcon />
      </Animated.View>
    );
  };
  if (loading) {
    return (
      <MainLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={"#16C5E0"} />
        </View>
      </MainLayout>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "grey" }}>
      <MainLayout>
        <View style={{}}>
          <View style={{ marginTop: 60, paddingHorizontal: 40 }}></View>
          <View style={{}}>
            <View style={{ marginHorizontal: 20, marginTop: 40 }}>
              <MainHeading style={{ textAlign: "left" }}>
                Daily Spruce
              </MainHeading>
            </View>
            <SecondryHeading
              style={{
                textAlign: "left",
                color: "white",
                fontWeight: "300",
                fontFamily: "inter",
                fontSize: 14,
                marginHorizontal: 20,
              }}
            >
              SMALL STEPS. BIG IMPACT!
            </SecondryHeading>
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
            flex: 1,
          }}
        >
          <CalendarStrip
            key={1212}
            style={styles.calendarStrip}
            calendarHeaderStyle={styles.calendarHeaderStyle}
            dateNumberStyle={styles.dateNumberStyle}
            dateNameStyle={styles.dateNameStyle}
            highlightDateNumberStyle={styles.highlightDateNumberStyle}
            highlightDateNameStyle={styles.highlightDateNameStyle}
            highlightDateContainerStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: 50,
            }}
            selectedDate={selectedDate ? selectedDate : today}
            onDateSelected={(date: any) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset to midnight for accurate comparison
              const selected = new Date(date);

              if (selected < today) {
                setSelectedDate(date);
                return; // Prevent selecting past dates
              }

              setSelectedDate(date);
            }}
            calendarColor={"#E0CFF3"}
            iconLeft={require("../../assets/rightArrow.png")} // Left arrow icon
            iconRight={require("../../assets/Arrow_right.png")} // Right arrow icon
          />

          <SlideButton
            label="Slide to start sprucing"
            icon={<SlideIcon />}
            onSlideComplete={() => {
              console.log("Slide complete!");
              navigation.navigate("TaskLibrary");
            }}
            viewStyle={{ marginVertical: 20 }}
            textStyle={{
              fontSize: 16,
              fontWeight: "700",
              textAlign: "center",
            }}
          />
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: "white",
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}
        >
          <DateLabel selectedDate={selectedDate} />
          <View
            style={{
              paddingHorizontal: 40,
              marginTop: 20,
            }}
          >
            {groupData ? (
              <FlatList
                data={Object.keys(groupData)}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 20 }}>
                    {/* Category Title */}
                    <Text
                      style={{
                        color: "#610FE0",
                        fontWeight: "700",
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      {item.toUpperCase()}
                    </Text>

                    {/* Render each task inside the category */}

                    <FlatList
                      data={groupData[item]}
                      keyExtractor={(task) => task.task_id}
                      scrollEnabled={false}
                      renderItem={({ item: task }) => (
                        <Swipeable
                          renderLeftActions={renderLeftActions}
                          renderRightActions={renderRightActions}
                          onSwipeableLeftOpen={() =>
                            console.log("Edit task:", task)
                          }
                          onSwipeableRightOpen={() => {
                            handleDeleteTask(task.task_id);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: "#F7F6FB",
                              borderRadius: 20,
                              padding: 16,
                              marginTop: 10,
                            }}
                          >
                            {/* Left side: icon + name */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#E6E0F8",
                                  width: 40,
                                  height: 40,
                                  borderRadius: 12,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text>🍽️</Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: "#000",
                                  fontWeight: "500",
                                }}
                              >
                                {task.task_name}
                              </Text>
                            </View>

                            {/* Right side: effort icons + avatar */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              {Array.from({
                                length: Math.min(
                                  3,
                                  Math.ceil(task.points / 30)
                                ),
                              }).map((_, i) => (
                                <LimeIcon key={i} />
                              ))}
                              <Image
                                source={{
                                  uri: "https://randomuser.me/api/portraits/women/44.jpg",
                                }}
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 17,
                                  marginLeft: 4,
                                }}
                              />
                            </View>
                          </View>
                        </Swipeable>
                      )}
                    />
                  </View>
                )}
              />
            ) : (
              <>
                <MainHeading
                  style={{
                    color: "#6915E0",
                    fontWeight: "700",
                    fontSize: 20,
                    lineHeight: 36,
                    fontFamily: "inter",
                  }}
                >
                  Need a head start?
                </MainHeading>
                <SecondryHeading
                  style={{
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: "300",
                    fontFamily: "inter",
                  }}
                >
                  Open your Task Library to create your list in seconds and
                  start sprucing without overthinking
                </SecondryHeading>
              </>
            )}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <LibrarIcon />
            </View>
            {/* <MainButton
            onPress={() => {
              signOut();
            }}
            label="LOGOUT"
          /> */}
          </View>
        </View>
      </MainLayout>
    </GestureHandlerRootView>
  );
};

export default index;

const styles = StyleSheet.create({
  calendarStrip: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    width: 380,
    borderRadius: 30,
    opacity: 6,
  },
  calendarHeaderStyle: {
    color: "#610FE0",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 30,
    width: "100%",
    fontSize: 16,
  },
  dateNumberStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 17,
  },
  dateNameStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateNumberStyle: {
    color: "#610FE0",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateNameStyle: {
    color: "#610FE0",
    fontSize: 14,
    lineHeight: 17,
  },
  highlightDateContainerStyle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    fontSize: 16,
  },
  disabledDateContainerStyle: {
    backgroundColor: "red", // Remove background for past dates
    borderWidth: 0, // Remove any outline
  },
});
