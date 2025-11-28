import { Member } from "@/app/types/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
interface MemberListProp {
  member: Member;
  setSelectedMember: (value: React.SetStateAction<string | null>) => void;
  selected: boolean;
  name: string;
  role: string;
}
const Memberlist = (props: MemberListProp) => {
  const { member, selected, setSelectedMember, name, role } = props;
  return (
    <TouchableOpacity
      key={member.id}
      style={{ marginTop: 10 }}
      onPress={() => setSelectedMember(member.user_id)}
    >
      <View
        style={{
          backgroundColor: selected ? "#F3E8FF" : "white",
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          marginLeft: 5,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: selected ? 2 : 0,
          borderColor: selected ? "#6915E0" : "transparent",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar.Text
            size={28}
            label={name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
            style={{
              backgroundColor: selected ? "#6915E0" : "#ddd",
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "500",
                fontSize: 12,
                lineHeight: 18,
                maxWidth: 120,
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
                color: selected ? "#6915E0" : "rgba(105, 21, 224, 1)",
              }}
            >
              {role}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Memberlist;

const styles = StyleSheet.create({});
