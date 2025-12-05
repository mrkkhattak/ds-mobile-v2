import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MainHeading, SecondryHeading } from "../ui/Heading";

interface HeaderProps {
  label: string;
  screenName: string;
  icon?: React.JSX.Element;
  navigation?: () => void;
}
const Header = (props: HeaderProps) => {
  const { label, screenName, icon, navigation } = props;
  return (
    <View style={{}}>
      <View style={{ marginTop: 20, paddingHorizontal: 40 }}></View>
      <View>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MainHeading style={{ textAlign: "left" }}>{screenName}</MainHeading>
          {icon && (
            <TouchableOpacity onPress={navigation}>{icon}</TouchableOpacity>
          )}
        </View>
        <SecondryHeading
          style={{
            textAlign: "left",
            color: "white",
            fontWeight: "300",
            fontFamily: "inter",
            fontSize: 14,
            marginHorizontal: 20,

            height: 40,
          }}
        >
          {label}
        </SecondryHeading>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
