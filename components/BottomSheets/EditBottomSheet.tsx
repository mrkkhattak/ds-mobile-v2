import { CreateTaskFormValues } from "@/app/types/types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
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
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.7}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close" // 👈 THIS enables closing on outside tap
        />
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 100 }}>
          <EditTaskForm onSubmit={handleUpdateTask} defalutValues={task} />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default EditBottomSheet;

const styles = StyleSheet.create({});
