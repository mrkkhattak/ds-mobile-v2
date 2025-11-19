import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import LibrarIcon from "../../assets/images/icons/Group 1.svg";
import { MainHeading, SecondryHeading } from "../ui/Heading";

import Snackbar from "react-native-snackbar";
import LimeIcon from "../../assets/images/icons/Lime.svg";

interface HomeTaskListProps {
  groupData: Record<string, any[]>;
  renderLeftActions: (progress: any, dragX: any) => React.ReactNode;
  renderRightActions: (progress: any, dragX: any) => React.ReactNode;
  fetchTask: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
}
const HomeTaskList = (props: HomeTaskListProps) => {
  const {
    groupData,
    renderLeftActions,
    renderRightActions,
    fetchTask,
    handleDeleteTask,
  } = props;
  return (
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
                      } else {
                        Snackbar.show({
                          text: "You can only edit your own tasks.",
                          duration: Snackbar.LENGTH_LONG,
                          backgroundColor: "red",
                        });
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
                          length: Math.min(3, Math.ceil(task.points / 30)),
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
            Open your Task Library to create your list in seconds and start
            sprucing without overthinking
          </SecondryHeading>
        </>
      )}

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <LibrarIcon />
      </View>
    </View>
  );
};

export default HomeTaskList;

const styles = StyleSheet.create({});
