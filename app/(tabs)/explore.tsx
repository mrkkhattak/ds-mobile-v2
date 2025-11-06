import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";
import React from "react";
import { StyleSheet, View } from "react-native";
import StreakIcon from "../../assets/images/icons/Streak.svg";

const explore = () => {
  const { signOut } = useAuthStore();

  return (
    <MainLayout>
      <View style={{ flexGrow: 1 }}>
        <View style={{ marginTop: 60, paddingHorizontal: 40 }}></View>
        <View
          style={{
            flex: 1,
          }}
        >
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
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 10,
            }}
          >
            <StreakIcon />
            <MainButton
              onPress={() => {}}
              label="Slide to start sprucing"
              style={{ width: "90%", marginBottom: 10 }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: "white",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainHeading
          style={{
            color: "black",
            fontWeight: "700",
            fontSize: 40,
            lineHeight: 66,
            fontFamily: "inter",
          }}
        >
          Coming Soon ....
        </MainHeading>
        <MainButton
          onPress={() => {
            signOut();
          }}
          label="Logout"
          style={{ width: "90%", marginTop: 30 }}
        />
        {/* <TouchableOpacity
          onPress={() => {
            signOut();
          }}
        >
          <Text>LOGOUT</Text>
        </TouchableOpacity> */}
      </View>
    </MainLayout>
  );
};

export default explore;

const styles = StyleSheet.create({});
