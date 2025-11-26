import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
interface HouseHoldProps {
  name: string;
  role: string;
}
const HouseHoldContainer = (props: HouseHoldProps) => {
  const { name, role } = props;
  return (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: 200,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
      }}
    >
      <View
        style={{
          marginLeft: 10,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Avatar.Text size={44} label="MA" />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontFamily: "inter",
              fontWeight: "500",
              fontSize: 14,
              lineHeight: 18,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: "inter",
              fontWeight: "700",
              fontSize: 10,
              lineHeight: 18,
              color: "rgba(105, 21, 224, 1)",
            }}
          >
            {role}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HouseHoldContainer;

const styles = StyleSheet.create({});
