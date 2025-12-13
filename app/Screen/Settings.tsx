import Header from "@/components/Header/Header";
import HouseHoldContainer from "@/components/HouseHoldComponets/HouseHoldContainer";
import MainLayout from "@/components/layout/MainLayout";
import {
  CustomButton,
  SecondaryButton,
  TransparetButton,
} from "@/components/ui/Buttons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";
import CrossIcon from "../../assets/images/icons/Vector (7).svg";

import PencilIcon from "@/assets/images/icons/pencil 1.svg";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { SegmentedControl } from "@/components/ui/SegmentContainer";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import Snackbar from "react-native-snackbar";
import AddIcon from "../../assets/images/icons/Vector (8).svg";
import {
  createHouseholdRoom,
  fetchHouseholdById,
  fetchRooms,
  getHouseholdById,
  getProfilesByHousehold,
  Household,
  updateHousehold,
  updateHouseholdRoom,
  updateHouseholdSettings,
} from "../functions/functions";
import { HomeStackParamList } from "../types/navigator_type";
import { Member, UserProfile } from "../types/types";
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Settings">;

const Settings = () => {
  const user = useAuthStore((s) => s.user);

  const navigation = useNavigation<NavigationProp>();
  const { profile, setProfile, updateProfile } = useUserProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMember] = useState<Member[]>([]);
  const [seletedValue, setSelectedValue] = useState<string>();
  const [houseHold, setHouseHold] = useState<Household | null>(null);
  const [roomList, setRoomList] = useState<{ label: String; value: String }[]>(
    []
  );
  const [value, setValue] = useState<string>("");
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState([
    { label: "Room", value: "category" },
    { label: "Person", value: "person" },
  ]);
  const [openGroupDropdown, setOpenGroupDropDown] = useState(false);
  const [groupValue, setGroupValue] = useState<"category" | "person">(
    "category"
  );
  const [weekCategory, setWeekCategory] = useState([
    { label: "Sunday", value: "sunday" },
    { label: "Monday", value: "monday" },
  ]);
  const [openWeekDropdown, setOpenWeekDropDown] = useState(false);

  const [WeekValue, setWeekValue] = useState<"sunday" | "monday">("monday");
  const [house, setHouse] = useState<any>();
  const hanldeSpruceLenght = async (lenght: string) => {
    try {
      if (houseHold && profile) {
        const result = await updateHousehold(houseHold?.id, {
          spruce_time: lenght,
        });
        if (result.data) {
          Snackbar.show({
            text: "Spurce lenght Updated ",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });
          fetchHouseHold(profile);
        }
        if (result.error) {
          Snackbar.show({
            text: result.error,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
        }
      }
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    }
  };
  const fetchHouseHold = async (profile: UserProfile) => {
    try {
      setIsLoading(true);
      const result = await fetchHouseholdById(profile?.household_id);
      if (result.data) {
        setHouseHold(result.data);
        setSelectedValue(`${result.data.spruce_time}`);
        setIsLoading(false);
      }
      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (profile) {
      const result = await updateHouseholdSettings(profile?.household_id, {
        groupbyweek: groupValue,
        weekofstart: WeekValue,
      });

      if (!result.success) {
        Snackbar.show({
          text: `${result.error}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
      } else {
        navigation.navigate("Home");
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let interval: NodeJS.Timeout;

      const fetchProfiles = async () => {
        if (!profile) return;

        try {
          const result = await getProfilesByHousehold(profile.household_id);
          if (!isActive) return;

          if (result.data) {
            setMember(result.data);
          }

          if (result.error) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        } catch (error: any) {
          if (isActive) {
            Snackbar.show({
              text: error.message,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        }
      };

      // Initial call
      fetchProfiles();

      // Poll every 5 seconds
      interval = setInterval(fetchProfiles, 5000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [profile])
  );

  const getRooms = async () => {
    if (profile) {
      const result = await fetchRooms(profile?.household_id);
      if ("error" in result) {
        Snackbar.show({
          text: result.error,
          duration: 2000,
          backgroundColor: "red",
        });
      } else {
        setRoomList(result);
      }
    }
  };

  const handleAddroom = async () => {
    try {
      const result = await createHouseholdRoom({
        householdId: `${profile?.household_id}`,
        name_us: value,
        icon: "bed",
        display_order: 2,
      });
      setValue("");
      getRooms();

      setOpenModal(false);
    } catch (error) {
      console.log(error);
      setOpenModal(false);
    }
  };

  const handleUpdateRoom = async () => {
    const roomId: any = editingRoomId; // the id of the room you want to update

    const result = await updateHouseholdRoom({
      roomId,
      name_us: value, // only pass fields you want to update

      active: true,
    });

    if (result.error) {
      console.error("Failed to update room:", result.error);
    } else {
      setEditingRoomId(null);
      setValue("");
      getRooms();
    }
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (profile) {
        setIsLoading(true);

        fetchHouseHold(profile);
      }

      return () => {
        isActive = false;
      };
    }, [user, profile])
  );

  useFocusEffect(
    useCallback(() => {
      if (profile) {
        (async () => {
          const result = await fetchRooms(profile?.household_id);
          if ("error" in result) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          } else {
            setRoomList(result);
          }
        })();
      }
    }, [profile])
  );

  useFocusEffect(
    useCallback(() => {
      if (profile) {
        (async () => {
          const result = await getHouseholdById(profile?.household_id);
          if ("error" in result) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          } else {
            setHouse(result);
            setWeekValue(result.data.weekofstart);
            setGroupValue(result.data.groupbyweek);
          }
        })();
      }
    }, [profile])
  );
  if (isLoading) {
    return (
      <MainLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#8C50FB" />
        </View>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <Header
        label=""
        screenName="Settings"
        icon={<MenuIcon />}
        navigation={() => {
          navigation.navigate("MainMenu");
        }}
      />
      <ScrollView
        style={{
          flex: 2,
          backgroundColor: "#F7F6FB",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          marginTop: 40,
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            margin: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              marginHorizontal: 20,
            }}
          >
            <CustomButton
              label="Save"
              onPress={handleSave}
              textStyle={{ textAlign: "center" }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <CrossIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Heading */}
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: "Inter",
                marginBottom: 10,
              }}
            >
              WHO’S SPRUCING
            </Text>

            {/* Cards */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,
                // spacing from edges
              }}
            >
              {members.map((member: Member) => (
                <View
                  key={member.id}
                  style={{
                    flexBasis: "34%", // 2 cards per row
                    marginBottom: 10,
                  }}
                >
                  <HouseHoldContainer
                    name={`${member.first_name} `}
                    role={member.family_role.toUpperCase()}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            {/* Heading */}
            <View style={{ flex: 1 }}></View>

            {/* Cards */}
            <View
              style={{
                flex: 2,
                paddingHorizontal: 10,
              }}
            >
              <TransparetButton
                label={"Add Member"}
                icon={<AddIcon />}
                onPress={() => navigation.navigate("InviteUserScreen")}
                containerStyle={{ marginLeft: 10 }}
              />
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {/* Heading */}
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: "Inter",
                flex: 1,
              }}
            >
              SPRUCE LENGTH
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,
                flex: 2,
                // spacing from edges
              }}
            >
              <SegmentedControl
                values={["10:00", "15:00", "20:00", "30:00"]}
                selectedValue={seletedValue ? seletedValue : ""}
                onChange={hanldeSpruceLenght}
                containerStyle={{
                  height: 39,
                  width: "85%",
                  borderColor: "#ccc",
                }}
                textStyle={{
                  fontSize: 12,
                }}
              />
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {/* Heading */}
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: "Inter",
                flex: 1,
              }}
            >
              Rooms
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,

                flex: 2,
                // spacing from edges
              }}
            >
              {roomList.map((room) => (
                <View
                  key={room.value}
                  style={{
                    marginVertical: 5,
                    borderWidth: editingRoomId === room.id ? 1 : 0,
                    padding: 5,
                    borderColor: "rgba(152, 100, 225, 1)",
                  }}
                >
                  {/* Room row */}
                  <View
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      borderRadius: 10,
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                  >
                    {editingRoomId === room.id ? (
                      <CustomTextInput
                        placeholder={`${room.label.toUpperCase()}`}
                        value={value}
                        onChangeText={setValue}
                        containerStyle={{ width: "100%", borderWidth: 0 }}
                        inputStyle={{
                          paddingVertical: 10,
                          textAlign: "left",
                          fontFamily: "inter",
                          fontWeight: "500",
                          fontSize: 12,
                          lineHeight: 18,
                          color: "rgba(157, 157, 157, 1)",
                        }}
                      />
                    ) : (
                      <Text
                        style={{
                          paddingVertical: 10,
                          textAlign: "left",
                          paddingHorizontal: 5,
                          fontFamily: "inter",
                          fontWeight: "500",
                          fontSize: 12,
                          lineHeight: 18,
                          color: "rgba(157, 157, 157, 1)",
                          width: "90%",
                        }}
                      >
                        {room.label.toUpperCase()}
                      </Text>
                    )}

                    <>
                      <TouchableOpacity
                        onPress={() => setEditingRoomId(room.id)}
                      >
                        {room?.id && (
                          <>{editingRoomId !== room.id && <PencilIcon />}</>
                        )}
                      </TouchableOpacity>
                    </>
                  </View>

                  {/* Edit actions only show if this room is being edited */}
                  {editingRoomId === room.id && (
                    <View
                      style={{
                        alignItems: "flex-end",

                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          onPress={() => setEditingRoomId(null)}
                          style={{
                            padding: 10,
                            color: "rgba(157, 157, 157, 1)",
                            fontFamily: "inter",
                            fontWeight: "400",
                            fontSize: 10,
                            lineHeight: 14,
                          }}
                        >
                          Cancel
                        </Text>
                        <Text
                          onPress={handleUpdateRoom}
                          style={{
                            padding: 10,
                            color: "rgba(152, 100, 225, 1)",
                            fontFamily: "inter",
                            fontWeight: "400",
                            fontSize: 10,
                            lineHeight: 14,
                          }}
                        >
                          Save
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          {/* Heading */}
          <View style={{ flex: 1 }}></View>

          {/* Cards */}
          <View
            style={{
              flex: 2,
              paddingHorizontal: 10,
            }}
          >
            <TransparetButton
              label={"Add Room"}
              icon={<AddIcon />}
              onPress={() => setOpenModal(true)}
              containerStyle={{ marginLeft: 10 }}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {/* Heading */}
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: "Inter",
                flex: 1,
              }}
            >
              GROUP TASK BY
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,

                flex: 2,
                // spacing from edges
              }}
            >
              <DropDownPicker
                open={openGroupDropdown}
                value={groupValue}
                items={category}
                setOpen={setOpenGroupDropDown}
                setValue={setGroupValue}
                setItems={setCategory}
                containerStyle={{ width: "100%" }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  borderColor: "rgba(105, 21, 224, 1)",
                }}
                textStyle={{
                  fontSize: 12,
                  color: "rgba(105, 21, 224, 1)",
                }}
              />
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {/* Heading */}
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                fontFamily: "Inter",
                flex: 1,
              }}
            >
              START OF WEEK
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,

                flex: 2,
                // spacing from edges
              }}
            >
              <DropDownPicker
                open={openWeekDropdown}
                value={WeekValue}
                items={weekCategory}
                setOpen={setOpenWeekDropDown}
                setValue={setWeekValue}
                setItems={setCategory}
                containerStyle={{ width: "100%" }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  borderWidth: 0,
                }}
                dropDownContainerStyle={{
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderRadius: 10,
                  borderColor: "rgba(105, 21, 224, 1)",
                }}
                textStyle={{
                  fontSize: 12,
                  color: "rgba(105, 21, 224, 1)",
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
              Add Room
            </Text>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <CustomTextInput
                placeholder="Enter Room Name"
                value={value}
                onChangeText={setValue}
                containerStyle={{ paddingHorizontal: 10 }}
              />
              <SecondaryButton
                label={"Add User"}
                onPress={handleAddroom}
                buttonStyle={{
                  backgroundColor: "#6915E0",

                  borderRadius: 10,
                  width: "70%",
                  marginTop: 10,
                  height: 40,
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </MainLayout>
  );
};

export default Settings;

const styles = StyleSheet.create({});
