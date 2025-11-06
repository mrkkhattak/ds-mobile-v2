import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import { MainHeading, SecondryHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";
import React from "react";
import { StyleSheet, View } from "react-native";
import LibrarIcon from "../../assets/images/icons/Group 1.svg";
import StreakIcon from "../../assets/images/icons/Streak.svg";

const index = () => {
  const { signOut } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  console.log("user", user);
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
        }}
      >
        <SecondryHeading style={{ marginLeft: 40, textAlign: "left" }}>
          Today
        </SecondryHeading>
        <View
          style={{
            paddingHorizontal: 40,
            marginTop: 20,
          }}
        >
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
            <LibrarIcon />
          </View>
          {/* <MainButton
            onPress={() => {
              signOut();
            }}
            label="LOGOUT"
          /> */}
        </View>
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

export default index;

const styles = StyleSheet.create({});
