import React, { useRef } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { MainHeading, SecondryHeading } from "../ui/Heading";

import { Member } from "@/app/types/types";
import { useUserProfileStore } from "@/store/userProfileStore";
import { Avatar } from "react-native-paper";
import Snackbar from "react-native-snackbar";
import CheckIcon from "../../assets/images/icons/check.svg";
import LimeIcon from "../../assets/images/icons/Lime.svg";
import { SecondaryButton } from "../ui/Buttons";
import Memberlist from "./Memberlist";

interface HomeTaskListProps {
  groupData: Record<string, any[]>;
  renderLeftActions: (progress: any, dragX: any) => React.ReactNode;
  renderRightActions: (progress: any, dragX: any) => React.ReactNode;
  fetchTask: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  setSelectedMember: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMember: string | null;
  members: Member[];
  handleAssingTaskToUser: (taskId: string, userId: string) => Promise<void>;
  setTaskId: React.Dispatch<React.SetStateAction<string | undefined>>;
  taskId: string | undefined;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  lableStyle?: TextStyle;
  icon?: React.ReactNode;
  handleUpdateTaskStatus?: (taskId: string) => Promise<void>;
}
const HomeTaskList = (props: HomeTaskListProps) => {
  const {
    groupData,
    renderLeftActions,
    renderRightActions,
    fetchTask,
    handleDeleteTask,
    members,
    selectedMember,
    setSelectedMember,
    handleAssingTaskToUser,
    setTaskId,
    taskId,
    setOpenModal,
    openModal,
    lableStyle,
    icon,
    handleUpdateTaskStatus,
  } = props;
  const swipeableRef = useRef<Swipeable>(null);
  const { profile, setProfile, updateProfile } = useUserProfileStore();

  return (
    <View
      style={{
        paddingHorizontal: 40,
        marginTop: 20,
        height: 400,
      }}
    >
      {groupData && Object.keys(groupData).length > 0 ? (
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
                  fontSize: 12,
                  marginBottom: 10,
                  ...lableStyle,
                }}
              >
                {item === "completed_task"
                  ? "completed task".toUpperCase()
                  : item.toUpperCase()}
              </Text>

              <FlatList
                data={groupData[item]}
                keyExtractor={(task) => task.id}
                scrollEnabled={false}
                style={{
                  borderRadius: 30,
                  backgroundColor: "#FFFFFF",
                  opacity: item === "completed_task" ? 0.5 : 1,
                }}
                renderItem={({ item: task }) => {
                  const selectedMemberObj = members.find(
                    (member) => member.user_id === task.assign_user_id
                  );
                  const name = `${selectedMemberObj?.first_name} ${selectedMemberObj?.last_name}`;

                  return (
                    <View
                      style={{
                        borderBottomWidth: 2,
                        borderColor: "#AAAAAA26",
                        borderRadius: 60,
                      }}
                    >
                      <Swipeable
                        renderLeftActions={renderLeftActions}
                        renderRightActions={renderRightActions}
                        onSwipeableLeftOpen={() => {
                          if (task.owner_user_id === task.user_task_user_id) {
                            fetchTask(task.user_task_id);
                            //
                            swipeableRef.current?.close();
                          } else {
                            Snackbar.show({
                              text: "You can only edit your own tasks.",
                              duration: Snackbar.LENGTH_LONG,
                              backgroundColor: "red",
                            });
                            swipeableRef.current?.close();
                          }
                        }}
                        onSwipeableRightOpen={() => {
                          handleDeleteTask(task.id);
                          swipeableRef.current?.close();
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",

                            padding: 16,
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
                              justifyContent: "space-between",
                            }}
                          >
                            {Array.from({
                              length: Math.min(3, Math.ceil(task.points / 30)),
                            }).map((_, i) => (
                              <LimeIcon key={i} />
                            ))}
                            {selectedMemberObj ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setOpenModal(true);
                                  setTaskId(task.id);
                                }}
                                disabled={
                                  item === "completed_task" ? true : false
                                }
                              >
                                <Avatar.Text
                                  size={44}
                                  label={name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                  style={{
                                    backgroundColor: "#6915E0",
                                  }}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  setOpenModal(true);
                                  setTaskId(task.id);
                                }}
                              >
                                <Image
                                  source={require("../../assets/images/addUser.png")}
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 17,
                                    marginLeft: 4,
                                  }}
                                />
                              </TouchableOpacity>
                            )}
                            {icon &&
                              handleUpdateTaskStatus &&
                              task.assign_user_id && (
                                <TouchableOpacity
                                  style={{ marginLeft: 10, marginTop: 5 }}
                                  onPress={() => {
                                    handleUpdateTaskStatus(task.id);
                                  }}
                                  disabled={
                                    item === "completed_task" ? true : false
                                  }
                                >
                                  {task.task_status === "pending" ? (
                                    icon
                                  ) : (
                                    <CheckIcon height={44} width={44} />
                                  )}
                                </TouchableOpacity>
                              )}
                          </View>
                        </View>
                      </Swipeable>
                    </View>
                  );
                }}
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
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("../../assets/images/btn.png")}
              resizeMode="contain"
              style={{ height: 220, width: "100%" }}
            />
          </View>
        </>
      )}

      <Modal
        visible={openModal}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenModal(false)}
      >
        {/* Background press closes modal */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setOpenModal(false)}
        >
          {/* Inner area should NOT close modal */}
          <Pressable
            style={{
              width: "80%",
              backgroundColor: "#F7F6FB",
              padding: 20,
              borderRadius: 12,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
              Add User
            </Text>
            <ScrollView style={{ paddingBottom: 20, maxHeight: 200 }}>
              {members?.map((member: Member) => {
                const selected = selectedMember === member.user_id;
                const name = `${member.first_name} ${member.last_name}`;
                const role = member.family_role;
                return (
                  <Memberlist
                    member={member}
                    setSelectedMember={setSelectedMember}
                    selected={selected}
                    name={name}
                    role={role}
                  />
                );
              })}
            </ScrollView>
            {taskId && selectedMember && (
              <SecondaryButton
                label={"Add User"}
                onPress={() => handleAssingTaskToUser(taskId, selectedMember)}
                buttonStyle={{
                  backgroundColor: "#6915E0",
                  paddingVertical: 12,
                  borderRadius: 10,
                  width: "100%",
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default HomeTaskList;

const styles = StyleSheet.create({});
