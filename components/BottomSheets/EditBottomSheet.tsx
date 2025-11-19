import { CreateTaskFormValues } from "@/app/types/types";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import EditTaskForm from "../Form/EditTaskFrom";

interface EditBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  snapPoints: string[];
  task: any;
  handleUpdateTask: (data: CreateTaskFormValues) => void;
}
const EditBottomSheet = (props: EditBottomSheetProps) => {
  const { bottomSheetRef, snapPoints, task, handleUpdateTask } = props;
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // hidden initially
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        flex: 1,
      }}
      onChange={(index) => {
        // when index === -1 → bottom sheet is closed
        if (index === -1) {
        }
      }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 200 }}>
          <EditTaskForm onSubmit={handleUpdateTask} defalutValues={task} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default EditBottomSheet;

const styles = StyleSheet.create({});
