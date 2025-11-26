import Header from "@/components/Header/Header";
import HouseHoldContainer from "@/components/HouseHoldComponets/HouseHoldContainer";
import MainLayout from "@/components/layout/MainLayout";
import { CustomButton, TransparetButton } from "@/components/ui/Buttons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";
import CrossIcon from "../../assets/images/icons/Vector (7).svg";
import AddIcon from "../../assets/images/icons/Vector (8).svg";

import { HomeStackParamList } from "../types/navigator_type";
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Settings">;

const Settings = () => {
  const navigation = useNavigation<NavigationProp>();

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
              flexDirection: "row",
              marginHorizontal: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                fontFamily: "Inter",
                marginRight: 10,
              }}
            >
              WHO’S SPRUCING
            </Text>

            <HouseHoldContainer name="MIA" role="ADMIN" />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View style={{ flex: 0.7 }}></View>
            <TransparetButton
              label={"Add member"}
              onPress={() => {
                navigation.navigate("InviteUserScreen");
              }}
              icon={<AddIcon />}
            />
          </View>

          <View style={{ backgroundColor: "red" }}></View>
        </View>
      </View>
    </MainLayout>
  );
};

export default Settings;

const styles = StyleSheet.create({});
