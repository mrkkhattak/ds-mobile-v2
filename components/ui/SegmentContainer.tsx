import React from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
interface SegmentedControlProps {
  values: string[]; // e.g., ["LEFT", "MIDDLE", "RIGHT"]
  selectedValue: string;
  onChange: (value: string) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  selectedBgColor?: string;
  unselectedBgColor?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  values,
  selectedValue,
  onChange,
  containerStyle,
  textStyle,
  selectedTextStyle,
  selectedBgColor = "#9864E1",
  unselectedBgColor = "#fff",
}) => {
  return (
    <View
      style={[
        {
          width: 259,
          height: 39,
          flexDirection: "row",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 4,
          backgroundColor: unselectedBgColor,
          justifyContent: "space-between",
        },
        containerStyle,
      ]}
    >
      {values.map((value) => {
        const isSelected = selectedValue === value;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onChange(value)}
            style={{
              flex: 1,
              height: 30.57,
              borderRadius: 10,
              backgroundColor: isSelected ? selectedBgColor : unselectedBgColor,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: 12,
                lineHeight: 14,

                textAlign: "center",
                textTransform: "uppercase",
                color: isSelected ? "#FFFFFF" : "#A09FA6",
                ...textStyle,
                ...(isSelected ? selectedTextStyle : {}),
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
