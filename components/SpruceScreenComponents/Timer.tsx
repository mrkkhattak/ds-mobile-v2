import { HomeStackParamList } from "@/app/types/navigator_type";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Sound from "react-native-sound";
import { TransparetButton } from "../ui/Buttons";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "SpruceScreen"
>;

interface TimerProps {
  time: string;
  navigation: NavigationProp;
  bottomAddTaskSheetRef: React.RefObject<BottomSheetMethods | null>;
}

const Timer = ({ time, navigation, bottomAddTaskSheetRef }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [isFinished, setIsFinished] = useState(false);
  const [isEnded, setIsEnded] = useState(false); // user pressed End or Dismiss
  const soundRef = useRef<Sound | null>(null);
  const repeatCountRef = useRef(0);

  const convertToSeconds = (t: string) => {
    const [min, sec] = t.split(":").map(Number);
    return min * 60 + sec;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Setup playback category for iOS
  Sound.setCategory("Playback");

  const playLoop = () => {
    if (!soundRef.current) return;

    soundRef.current.play((success) => {
      repeatCountRef.current += 1;
      if (success && repeatCountRef.current < 22 && !isEnded) {
        playLoop(); // repeat 22 times or until user ends
      }
    });
  };

  const startSound = () => {
    if (soundRef.current || isEnded) return; // already started or ended

    soundRef.current = new Sound(
      "whoosh.mp3", // your file name in main bundle
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("Failed to load the sound", error);
          return;
        }
        soundRef.current?.setVolume(0.5);
        repeatCountRef.current = 0;
        playLoop();
      }
    );
  };

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
    }
  };

  const handleEnd = () => {
    setIsEnded(true);
    stopSound();
    bottomAddTaskSheetRef.current?.expand();
  };

  const handleDismiss = () => {
    setIsEnded(true);
    stopSound();
  };

  // Timer effect
  useEffect(() => {
    let seconds = convertToSeconds(timeLeft);

    if (seconds === 0) {
      setIsFinished(true);
      if (!isEnded) startSound();
      return;
    }

    const interval = setInterval(() => {
      seconds -= 1;
      setTimeLeft(formatTime(seconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isEnded]);

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
      {isFinished ? (
        <View style={{ alignItems: "center", paddingVertical: 60 }}>
          <Text
            style={{
              fontSize: 60,
              fontWeight: "bold",
              fontFamily: "Poppins",
              color: "white",
              marginBottom: 30,
            }}
          >
            TIME'S UP!
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TransparetButton
              label="DISMISS"
              onPress={handleDismiss}
              containerStyle={{
                borderColor: "white",
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

            <TransparetButton
              label="END"
              onPress={handleEnd}
              containerStyle={{
                borderColor: "white",
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
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 50,
              marginBottom: -25,
              width: 200,
            }}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter", color: "white" }}>
              MINUTES
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "inter", color: "white" }}>
              SECONDS
            </Text>
          </View>

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

          <TransparetButton
            label="End Spruce"
            onPress={handleEnd}
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
        </>
      )}
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
