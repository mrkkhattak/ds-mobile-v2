import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon2 from "../../assets/images/icons/Group 38.svg";

import AddIcon from "../../assets/images/icons/Add.svg";

import Icon3 from "../../assets/images/icons/Group 37.svg";
interface TabProps {
  navigation: any;
  bottomAddTaskSheetRef: React.RefObject<any>;
  handleShuffle: () => void;
  hanldeFilterSheet: () => void;
}

const TaskListTab = (props: TabProps) => {
  const {
    navigation,
    bottomAddTaskSheetRef,
    handleShuffle,
    hanldeFilterSheet,
  } = props;
  return (
    <View
      style={{
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={hanldeFilterSheet}
        >
          <Icon3 />
          <Text
            style={{
              color: "#AAA",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={() => bottomAddTaskSheetRef.current?.expand()}
        >
          <AddIcon />
          <Text
            style={{
              color: "#AAA",
              fontSize: 15,

              fontWeight: "600",
            }}
          >
            Add
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center" }}
          onPress={handleShuffle}
        >
          <Icon2 />
          <Text
            style={{
              color: "#AAA",
              fontSize: 15,

              fontWeight: "600",
            }}
          >
            Shuffle
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskListTab;
