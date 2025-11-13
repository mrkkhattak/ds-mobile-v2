import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type CustomInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
};

export const CustomInput: React.FC<CustomInputProps> = ({
  containerStyle,
  placeholder,
  icon,
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#42404E"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
};

interface CustomTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  inputStyle,
}) => {
  return (
    <View
      style={[
        {
          width: 217,
          height: 39,
          borderRadius: 10,
          borderWidth: 1,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          opacity: 1,
        },
        containerStyle,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={[
          {
            flex: 1,
            color: "#000",
          },
          inputStyle,
        ]}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 333,
    height: 46.66,
    borderRadius: 5,
    borderWidth: 0.2,
    borderColor: "#42404E",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    opacity: 1,
  },
  input: {
    flex: 1,
    color: "#42404E",
    fontSize: 14,
  },
  iconContainer: {
    marginLeft: 8,
  },
});
