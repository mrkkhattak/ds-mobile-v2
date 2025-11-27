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
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        marginLeft: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,

        // fills parent width
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar.Text
          size={24}
          label={name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontFamily: "inter",
              fontWeight: "500",
              fontSize: 12,
              lineHeight: 18,
              maxWidth: 100,
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
