import MainLayout from "@/components/layout/MainLayout";
import { SlideButton } from "@/components/ui/Buttons";
import DateLabel from "@/components/ui/DateLabel";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
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
  deleteSpruceTasksByUserTaskId,
  deleteTaskById,
  fetchSpruceTasks,
  getTaskById,
  removeTaskFromSpruce,
  SpruceTaskDetails,
} from "../functions/functions";

import EditTaskForm from "@/components/Form/EditTaskFrom";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import DeleteIcon from "../../assets/images/icons/Delete task.svg";
import EditIcon from "../../assets/images/icons/Edit task.svg";
import { HomeStackParamList } from "../types/navigator_type";
import { CreateTaskFormValues, WeekRepeat } from "../types/types";

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
  const [task, setTask] = useState<CreateTaskFormValues | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      const fetchTasks = async () => {
        try {
          if (user) {
            const { data, error } = await fetchSpruceTasks(
              user.id,
              selectedDate.toISOString().split("T")[0]
            );
            console.log("data", data);
            if (!isActive) return;

            if (error) {
              Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: "red",
              });
              console.log("Error loading tasks:", error);
              setLoading(false);
              return;
            }

            if (data && Array.isArray(data)) {
              const grouped = data.reduce((acc, task) => {
                const groupKey =
                  task.category || task.user_task_room || "Uncategorized";
                if (!acc[groupKey]) acc[groupKey] = [];
                acc[groupKey].push(task);
                return acc;
              }, {} as Record<string, SpruceTaskDetails[]>);

              setGroupData(grouped);
            }

            setLoading(false);
          }
        } catch (err: any) {
          const message = err?.message || "Failed to load tasks";
          Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
          console.log("Error loading tasks:", err);
          setLoading(false);
        }
      };

      fetchTasks();

      return () => {
        isActive = false;
      };
    }, [user, selectedDate])
  );

  const handleDeleteTask = async (id?: string) => {
    if (!user) return;

    if (!id) {
      Snackbar.show({
        text: "No task selected to delete.",
        duration: 2000,
        backgroundColor: "red",
      });
      return;
    }

    setLoading(true);

    const success = await removeTaskFromSpruce({
      id,
      userId: user.id,
    });

    if (success) {
      // Remove the deleted task from local grouped state
      setGroupData((prev: Record<string, SpruceTaskDetails[]>) => {
        const updated: Record<string, SpruceTaskDetails[]> = {};

        for (const key in prev) {
          const filtered = prev[key].filter((task) => {
            if (id) return task.id !== id;
            return true;
          });

          if (filtered.length > 0) {
            updated[key] = filtered;
          }
        }

        return updated;
      });

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

  const fetchTask = async (taskId: string) => {
    const { data, error } = await getTaskById(taskId);

    if (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      return;
    }

    const weekRepeat: WeekRepeat = {
      day: data?.repeat_weekly.map((w) => w.day) ?? [],
      weekNumber: data?.repeat_weekly[0]?.week_number.toString() || "1",
    };

    console.log("DATA IN FETCH TASK", data);
    setTask({
      id: data?.id,
      name: data?.name ?? "",
      room: data?.room ?? "",
      type: data?.type ?? "",
      repeat: data?.repeat ?? false,
      effort: `${data?.effort}`,
      repeatEvery: data?.repeat_every ?? "DAY",
      days: data?.repeat_days ?? [],
      week: weekRepeat, // use the transformed object
      month: {
        dayNumber: data?.repeat_monthly[0]?.day_number,
        day: data?.repeat_monthly[0]?.day || "",
        month: `${data?.repeat_monthly[0]?.month_number}`,
      },
    });
    bottomSheetRef.current?.expand();
    // setTask(data);
  };

  const handleUpdateTask = async (
    taskId: string,
    data: CreateTaskFormValues
  ) => {
    console.log("taskId", taskId);
    console.log("data", data);
    const { success, error } = await deleteSpruceTasksByUserTaskId(taskId);
    if (!success && error) {
      Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
    } else {
      Snackbar.show({
        text: "Task deleted successfully",
        duration: Snackbar.LENGTH_SHORT,
      });
      const { success, error } = await deleteTaskById(taskId);
      if (!success && error) {
        Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT });
      } else {
        Snackbar.show({
          text: "Spruce tasks deleted successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
        setGroupData((prev: Record<string, SpruceTaskDetails[]>) => {
          const updated: Record<string, SpruceTaskDetails[]> = {};

          for (const key in prev) {
            const filtered = prev[key].filter((task) => {
              if (task) return task.user_task_id !== taskId;
              return true;
            });

            if (filtered.length > 0) {
              updated[key] = filtered;
            }
          }

          return updated;
        });
      }
    }
    bottomSheetRef.current?.close();
  };

  console.log("GroupData", groupData);
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
                      keyExtractor={(task) => task.id}
                      scrollEnabled={false}
                      renderItem={({ item: task }) => (
                        <Swipeable
                          renderLeftActions={renderLeftActions}
                          renderRightActions={renderRightActions}
                          onSwipeableLeftOpen={() => {
                            if (task.owner_user_id === task.user_task_user_id) {
                              fetchTask(task.user_task_id);
                              //
                            }
                          }}
                          onSwipeableRightOpen={() => {
                            handleDeleteTask(task.id);
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
                                {task.task_name
                                  ? task.task_name
                                  : task.user_task_name}
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
        <BottomSheet
          ref={bottomSheetRef}
          index={-1} // hidden initially
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            flex: 1,
          }}
          onChange={(index) => {
            // when index === -1 → bottom sheet is closed
            console.log(index);
            if (index === -1) {
              // console.log("first");
            }
          }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 200 }}>
              <EditTaskForm
                onSubmit={() => {
                  handleUpdateTask(task?.id, task);
                }}
                defalutValues={task}
              />
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
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
