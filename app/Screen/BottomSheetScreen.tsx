import CreateTaskForm from "@/components/Form/CreateTaskForm";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/authstore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "../functions/commonFuntions";
import { AddUserTaskToSpruce, createTask } from "../functions/functions";
import { CreateTaskFormValues } from "../types/types";

type NavigationProp = NativeStackNavigationProp<any, "BottomSheerScreen">;

const BottomSheetScreen = () => {
  const user = useAuthStore((s) => s.user);

  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const [loading, setLoading] = useState<Boolean>(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      bottomSheetRef.current?.expand();
      setLoading(false);

      return () => {
        isActive = false;
      };
    }, [])
  );

  console.log("loading", loading);

  const onSubmit = async (formData: CreateTaskFormValues) => {
    try {
      setLoading(true);

      let repeatingDates: string[] = [];
      if (formData.repeatEvery === "DAY") {
        repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
          days: formData.days,
        });
      } else if (formData.repeatEvery === "WEEK") {
        repeatingDates = generateRepeatingDatesUnified(formData.repeatEvery, {
          weekDays: formData.week?.day,
          weekInterval: Number(formData.week?.weekNumber),
        });
      } else if (formData.repeatEvery === "MONTH") {
        repeatingDates = generateMonthlyRepeatingDates(
          Number(formData.month?.month),
          `${formData.month?.day}`,
          Number(formData.month?.dayNumber)
        );
      }

      console.log("repeatingDates", repeatingDates);

      const result = await createTask(formData);

      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        setLoading(false);
        return;
      }

      const taskId = result.data.id;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      // === Insert into spruce_tasks ===
      if (formData.repeat && repeatingDates.length > 0) {
        // Insert each repeating entry with its own scheduled date
        for (const date of repeatingDates) {
          await AddUserTaskToSpruce(taskId, userId, date);
        }

        Snackbar.show({
          text: `Repeating schedule created (${repeatingDates.length} tasks).`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "green",
        });
      } else {
        // Single one-time task (use today as scheduled date)
        const today = new Date().toISOString().split("T")[0];
        await AddUserTaskToSpruce(taskId, userId, today);

        Snackbar.show({
          text: "Task created successfully!",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
      }

      navigation.navigate("Library");
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={"#16C5E0"} />
      </View>
    );
  }
  return (
    <MainLayout>
      <BottomSheet
        ref={bottomSheetRef}
        index={1} // hidden initially
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(index) => {
          // when index === -1 → bottom sheet is closed
          if (index === -1) {
            navigation.navigate("Library");
          }
        }}
        backgroundStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          flex: 1,
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 200 }}>
            <CreateTaskForm onSubmit={onSubmit} />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </MainLayout>
  );
};

export default BottomSheetScreen;

const styles = StyleSheet.create({});
