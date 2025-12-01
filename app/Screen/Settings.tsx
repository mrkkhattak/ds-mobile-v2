import Header from "@/components/Header/Header";
import HouseHoldContainer from "@/components/HouseHoldComponets/HouseHoldContainer";
import MainLayout from "@/components/layout/MainLayout";
import { CustomButton, TransparetButton } from "@/components/ui/Buttons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";
import CrossIcon from "../../assets/images/icons/Vector (7).svg";

import { SegmentedControl } from "@/components/ui/SegmentContainer";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import Snackbar from "react-native-snackbar";
import {
  fetchHouseholdById,
  getProfilesByHousehold,
  Household,
  updateHousehold,
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

  const hanldeSpruceLenght = async (lenght: string) => {
    try {
      if (houseHold && profile) {
        console.log("seletedValue", seletedValue);
        const result = await updateHousehold(houseHold?.id, {
          spruce_time: lenght,
        });
        if (result.data) {
          console.log("result", result);
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
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let interval: NodeJS.Timeout;

      const fetchProfiles = async () => {
        if (!profile) return;

        try {
          const result = await getProfilesByHousehold(profile.household_id);
          console.log("test");
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
      <View
        style={{
          flex: 2.5,
          backgroundColor: "#F7F6FB",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          marginTop: 40,
        }}
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
              marginHorizontal: 10,
            }}
          >
            <CustomButton
              label="Save"
              onPress={() => {}}
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
                    name={`${member.first_name} ${member.last_name}`}
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
                flex: 1,
                // spacing from edges
              }}
            >
              <TransparetButton
                label={"Add Member"}
                onPress={() => navigation.navigate("InviteUserScreen")}
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
                marginBottom: 10,
              }}
            >
              SPRUCE LENGTH
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 10,
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
      </View>
    </MainLayout>
  );
};

export default Settings;

const styles = StyleSheet.create({});
