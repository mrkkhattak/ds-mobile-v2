import CalenderStripComponet from "@/components/CalenderStrip/CalenderStripComponet";
import Header from "@/components/Header/Header";
import MainLayout from "@/components/layout/MainLayout";
import { MainButton } from "@/components/ui/Buttons";
import { MainHeading } from "@/components/ui/Heading";
import { useAuthStore } from "@/store/authstore";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";

const explore = () => {
  const { signOut } = useAuthStore();
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const today = new Date();
  return (
    <MainLayout>
      <View style={{ flex: 1 }}>
        <Header
          label="SMALL STEPS. BIG IMPACT!"
          screenName="Daily Spruce"
          icon={<MenuIcon />}
          navigation={() => {}}
        />
        <CalenderStripComponet
          navigation={navigation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={today}
        />
      </View>
      <View
        style={{
          flex: 2.5,
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
