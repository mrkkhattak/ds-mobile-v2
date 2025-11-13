import MainLayout from "@/components/layout/MainLayout";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import CreateTaskForm from "@/components/Form/CreateTaskForm";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
type NavigationProp = NativeStackNavigationProp<any, "BottomSheerScreen">;

const BottomSheetScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "80%"], []);
  const [loading, setLoading] = useState<Boolean>();

  //FormDataValues

  const [open, setOpen] = useState(false);
  const [openWeek, setOpenWeek] = useState(false);
  const [openDays, setOpenDays] = useState(false);
  const [openWeekDays, setOpenWeekDays] = useState(false);
  const [openMoth, setOpenMoth] = useState(false);

  const [value, setValue] = useState<string | null>(null);
  const [valueWeek, setValueWeek] = useState<string | null>("oneWeek");
  const [valueDays, setValueDays] = useState<string | null>("first");
  const [selectedDay, setselectedDay] = useState<string | null>("monday");
  const [selectedMonth, setselectedMonth] = useState<string | null>(null);

  const [items, setItems] = useState([
    { label: "Living Room", value: "living" },
    { label: "Bedroom", value: "bedroom" },
    { label: "Kitchen", value: "kitchen" },
  ]);
  const [itemsItem, setWeekItems] = useState([
    { label: "1 Week", value: "oneWeek" },
    { label: "2 Week", value: "twoWeek" },
    { label: "3 Week", value: "threeWeek" },
    { label: "4 Week", value: "fourWeek" },
    { label: "5 Week", value: "fiveWeek" },
    { label: "6 Week", value: "sixWeek" },
  ]);
  const [itemsDays, setDayItem] = useState([
    { label: "1", value: "first" },
    { label: "2", value: "second" },
    { label: "3", value: "third" },
    { label: "4", value: "fourth" },
    { label: "5", value: "fifth" },
    { label: "6", value: "sixth" },
    { label: "7", value: "seventh" },
  ]);

  const [weekDays, setWeekDays] = useState([
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ]);

  const [monthsList, setMonthsList] = useState([
    { label: "Every 1 Month", value: "1" },
    { label: "Every 2 Months", value: "2" },
    { label: "Every 3 Months", value: "3" },
    { label: "Every 4 Months", value: "4" },
    { label: "Every 5 Months", value: "5" },
    { label: "Every 6 Months", value: "6" },
    { label: "Every 7 Months", value: "7" },
    { label: "Every 8 Months", value: "8" },
    { label: "Every 9 Months", value: "9" },
    { label: "Every 10 Months", value: "10" },
    { label: "Every 11 Months", value: "11" },
    { label: "Every 12 Months", value: "12" },
  ]);

  const [selected, setSelected] = useState("BOTH");
  const [selectedSegmentValue, setSelectedSegmentValue] = useState("BOTH");

  const [progress, setProgress] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previous) => !previous);
  const days = ["M", "T", "W", "TU", "F", "S", "SU"];
  //
  console.log("selectedSegmentValue", selectedSegmentValue);
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
  if (loading) {
    return (
      <MainLayout>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={"#16C5E0"} />
        </View>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // hidden initially
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
            <CreateTaskForm />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </MainLayout>
  );
};

export default BottomSheetScreen;

const styles = StyleSheet.create({});
