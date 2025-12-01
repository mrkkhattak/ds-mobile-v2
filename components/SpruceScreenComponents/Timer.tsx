import { HomeStackParamList } from "@/app/types/navigator_type";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { TransparetButton } from "../ui/Buttons";
type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "SpruceScreen"
>;
interface TimerProps {
  time: string;
  navigation: NavigationProp;
}
const Timer = (props: TimerProps) => {
  const { time, navigation } = props;
  const [timeLeft, setTimeLeft] = useState(time);
  // convert mm:ss -> seconds
  const convertToSeconds = (t: string) => {
    const [min, sec] = t.split(":").map(Number);
    return min * 60 + sec;
  };

  // convert seconds -> mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let seconds = convertToSeconds(timeLeft);

    if (seconds === 0) {
      navigation.navigate("Home"); // 👈 AUTO NAVIGATE WHEN TIMER ENDS
      return;
    }

    const interval = setInterval(() => {
      seconds -= 1;
      setTimeLeft(formatTime(seconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        margin: 40,
        paddingBottom: 40,
        borderRadius: 30,
        zIndex: 1,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 50,
          marginBottom: -25,

          width: 200,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "inter",
            color: "white",
          }}
        >
          MINUTES
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "inter",
            color: "white",
          }}
        >
          SECONDS
        </Text>
      </View>
      <View
        style={{
          maxWidth: 900,
          justifyContent: "center",
          alignItems: "center",
          width: 400,
        }}
      >
        <Text
          style={{
            fontSize: 90,
            fontWeight: "bold",
            fontFamily: "Poppins",
            color: "white",
          }}
        >
          {timeLeft}
        </Text>
        {/* <Text
          style={{
            fontSize: 90,
            fontWeight: "bold",
            fontFamily: "Poppins",
            color: "white",
          }}
        >
          :
        </Text>
        <Text
          style={{
            fontSize: 90,
            fontWeight: "bold",
            fontFamily: "Poppins",
            color: "white",
          }}
        >
          59
        </Text> */}
      </View>
      <View>
        <TransparetButton
          label={"End Spruce"}
          onPress={() => {
            navigation.navigate("Home");
          }}
          containerStyle={{
            borderColor: "white",
            width: 200,
            height: 40,
            borderRadius: 50,
          }}
          labelStyle={{
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: 20,
          }}
        />
      </View>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
