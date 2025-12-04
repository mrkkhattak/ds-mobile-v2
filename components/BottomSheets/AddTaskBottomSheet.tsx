import { GlobalTask } from "@/app/functions/functions";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TransparetButton } from "../ui/Buttons";
import { CustomTextInput } from "../ui/CustomTextInput";

interface Task {
  id: number | string;
  name: string;
  assign_user_id?: number | null;
}

interface AddTaskSheetProps {
  bottomAddTaskSheetRef: React.RefObject<any>;
  navigation: any;
  filteredTasks: GlobalTask[];
  selected: GlobalTask | null;
  setSelected: (task: GlobalTask) => void;
  value: String | null;
  setValue: (text: string) => void;
  handleAddTask: (value: String) => Promise<void>;
}

const AddTaskBottomSheet: React.FC<AddTaskSheetProps> = ({
  bottomAddTaskSheetRef,
  navigation,
  filteredTasks,
  selected,
  setSelected,
  value,
  setValue,
  handleAddTask,
}) => {
  return (
    <BottomSheet
      ref={bottomAddTaskSheetRef}
      index={-1} // hidden initially
      snapPoints={["20%"]}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.7}
          pressBehavior="close"
          onPress={() => navigation.navigate("Home")}
        />
      )}
    >
      <BottomSheetView>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            style={{ height: 300 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selected?.id === item.id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item);
                    setValue(item.name);
                  }}
                  style={[
                    styles.taskItem,
                    {
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? "#A77BFF" : "transparent",
                    },
                  ]}
                >
                  <Text style={styles.taskText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.inputRow}>
            <CustomTextInput
              value={value ?? ""}
              onChangeText={setValue}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <TransparetButton
              label="ADD"
              onPress={() => handleAddTask(`${value}`)}
              containerStyle={styles.addButton}
              labelStyle={styles.addButtonText}
            />
          </View>
        </KeyboardAwareScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddTaskBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#8E2DE2",
  },
  scrollContent: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
  taskItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginVertical: 8,
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  taskText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  inputContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
  },
  inputText: {
    paddingHorizontal: 20,
    color: "rgba(54, 43, 50, 1)",
    fontSize: 15,
    fontWeight: "300",
  },
  addButton: {
    backgroundColor: "rgba(152, 100, 225, 1)",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    marginLeft: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    paddingVertical: 10,
  },
});
