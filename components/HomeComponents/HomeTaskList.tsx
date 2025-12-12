import { AddUserTaskToSpruce, createTask, SpruceTaskDetails } from "@/app/functions/functions";
import { Member } from "@/app/types/types";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from "react-native";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import Snackbar from "react-native-snackbar";
import CheckIcon from "../../assets/images/icons/check.svg";
import LimeIcon from "../../assets/images/icons/Lime.svg";
import { SecondaryButton } from "../ui/Buttons";
import { MainHeading, SecondryHeading } from "../ui/Heading";
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
  height?: number;
  handleUpdateTaskStatus?: (taskId: string) => Promise<void>;
  handleSaveTask:()=>void
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
    height = "100%",handleSaveTask
  } = props;
  const swipeableRef = useRef<Swipeable>(null);
  const { profile, setProfile, updateProfile } = useUserProfileStore();
  console.log("grouptdata", groupData)
   const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState<Boolean>(true);
  const handleOneOff = async (task:SpruceTaskDetails) => {
  console.log("task",task)
    try {
      console.log("task",task)
      setLoading(true);
const extracted = {
  id: task.id ?? undefined,                      // null → undefined
  name: task.user_task_name || task.task_name ||"",   // pick whichever exists
  room: task.user_task_room || task.room ||"",
  type: task.user_task_type  || "",  // fallback empty string
  repeat: task.user_task_repeat ?? false,
  effort: task.user_task_effort ?? 1,
  repeatEvery:"None",category:task.category
};
      // let repeatingDates: string[] = [];
      // if (task?.user_task_repeat_type === "DAY") {
      //   repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
      //     days: formData.days,
      //   });
      // } else if (task.user_task_repeat_type === "WEEK") {
      //   repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
      //     weekDays: formData.week?.day,
      //     weekInterval: Number(formData.week?.weekNumber),
      //   });
      // } else if (formData.repeatEvery === "MONTH") {
      //   repeatingDates = generateMonthlyRepeatingDates(
      //     Number(formData.month?.month),
      //     `${formData.month?.day}`,
      //     Number(formData.month?.dayNumber)
      //   );
      // }

      const result = await createTask(extracted);
console.log("result",result)
      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        setLoading(false);
        return "error";
      }
      console.log("taskid=====>",result.data.id,user?.id,profile?.household_id)
      const taskId = result.data.id;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return "error";
      }

              const today = new Date().toISOString().split("T")[0];
        await AddUserTaskToSpruce(
          taskId,
          userId,
          today,
         profile?.household_id ||"",
          task.assign_user_id||""
        );

        Snackbar.show({
          text: "Task created successfully!",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        return "success";

//       if (formData.repeat && repeatingDates.length > 0) {
//         (async () => {
//           for (const date of repeatingDates) {
//             await AddUserTaskToSpruce(
//               taskId,
//               userId,
//               date,
//               household_id,
//               formData.assign
//             );
//           }
//           console.log(
//             `Repeating schedule created (${repeatingDates.length} tasks)`
//           );
//         })();

//         Snackbar.show({
//           text: `Repeating schedule created (${repeatingDates.length} tasks).`,
//           duration: Snackbar.LENGTH_LONG,
//           backgroundColor: "green",
//         });
//         return "success";
//       } else {
//         const today = new Date().toISOString().split("T")[0];
//         await AddUserTaskToSpruce(
//           taskId,
//           userId,
//           today,
//           household_id,
//           formData.assign
//         );

//         Snackbar.show({
//           text: "Task created successfully!",
//           duration: Snackbar.LENGTH_SHORT,
//           backgroundColor: "green",
//         });
//         return "success";
//       }
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      return "error";
    } finally {
      setLoading(false);
      return "success";
    }
  
  }
  return (
    <View
      style={{
        paddingHorizontal: 40,
        marginTop: 20,
        height: height,
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
                  : item.replace(/-/g, " ").toUpperCase()}
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
                          if (task.user_task_id) {
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
                            >      {task?.category !== "Misc" ?
                              <View   style={{
                                flexDirection: "row",
                                alignItems: "center",
                               gap:2
                              }}>
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
                                </View>:null}
                      {task?.category === "Misc" ? (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={() => handleOneOff(task)}>
      <Text style={styles.buttonText}>One-Off</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
      <Text style={styles.buttonText}>Save Task</Text>
    </TouchableOpacity>
  </View>
) : null}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // place buttons in a row
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button: {
   
    backgroundColor: "#D9D9D933", // your requested bg color
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:5
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
});

