import React from "react";
import { StyleSheet, View } from "react-native";
import { MainHeading, SecondryHeading } from "../ui/Heading";

interface HeaderProps {
  label: string;
}
const Header = (props: HeaderProps) => {
  const { label } = props;
  return (
    <View style={{}}>
      <View style={{ marginTop: 60, paddingHorizontal: 40 }}></View>
      <View style={{}}>
        <View style={{ marginHorizontal: 20, marginTop: 40 }}>
          <MainHeading style={{ textAlign: "left" }}>Daily Spruce</MainHeading>
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
