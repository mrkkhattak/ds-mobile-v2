import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MainHeading, SecondryHeading } from "../ui/Heading";

interface HeaderProps {
  label: string;
  screenName: string;
  icon?: React.JSX.Element;
  navigationToHome?: () => void;
}
const Header = (props: HeaderProps) => {
  const { label, screenName, icon, navigationToHome } = props;
  return (
    <View>
      <View style={{ marginTop: 60, paddingHorizontal: 40 }}></View>
      <View>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MainHeading style={{ textAlign: "left" }}>{screenName}</MainHeading>
          {icon && (
            <TouchableOpacity onPress={navigationToHome}>
              {icon}
            </TouchableOpacity>
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
