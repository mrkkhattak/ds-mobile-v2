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
    setLoading(true);

    // 1️⃣ Create the main task
    const result = await createTask(formData);

    if (result.error) {
      Snackbar.show({
        text: result.error,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      console.log(result.error);
      setLoading(false);
      return;
    }

    // 2️⃣ If task created, add to spruce_tasks
    const taskId = result.data.id; // user_task id
    const userId = user?.id;
    console.log("taskId", taskId);
    if (userId) {
      const spruceResult = await AddUserTaskToSpruce(taskId, userId);
      if (!spruceResult.success) {
        Snackbar.show({
          text: spruceResult.error || "Failed to add task to spruce",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        console.log(spruceResult.error);
      } else {
        Snackbar.show({
          text: "Task added to spruce successfully!",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
      }
    }

    setLoading(false);
    navigation.navigate("Library");
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
