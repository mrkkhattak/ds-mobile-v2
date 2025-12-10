import CalenderStripComponet from "@/components/CalenderStrip/CalenderStripComponet";
import CreateTaskForm from "@/components/Form/CreateTaskForm";
import Header from "@/components/Header/Header";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/authstore";
import { useUserProfileStore } from "@/store/userProfileStore";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Snackbar from "react-native-snackbar";
import MenuIcon from "../../assets/images/icons/Vector (4).svg";
import {
  generateMonthlyRepeatingDates,
  generateRepeatingDatesUnified,
} from "../functions/commonFuntions";
import { AddUserTaskToSpruce, createTask } from "../functions/functions";
import { HomeStackParamList } from "../types/navigator_type";
import { CreateTaskFormValues } from "../types/types";
type NavigationProp = NativeStackNavigationProp<any, "BottomSheerScreen">;
type BottomSheetScreenRouteProp = RouteProp<
  HomeStackParamList,
  "BottomSheetScreen"
>;
const BottomSheetScreen = () => {
  const user = useAuthStore((s) => s.user);
  const route = useRoute<BottomSheetScreenRouteProp>();
  const visible = true;
  const { profile, setProfile, updateProfile } = useUserProfileStore();

  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%"], []);
  const [loading, setLoading] = useState<Boolean>(true);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 250 });
    translateY.value = withTiming(visible ? 0 : 50, { duration: 250 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    pointerEvents: visible ? "auto" : "none",
  }));
  const [selectedDate, setSelectedDate] = useState<Date | undefined | any>(
    new Date()
  );
  const today = new Date();

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

  const onSubmit = async (
    formData: CreateTaskFormValues,
    household_id: string
  ): Promise<"success" | "error"> => {
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

      const result = await createTask(formData);

      if (result.error) {
        Snackbar.show({
          text: result.error,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
        setLoading(false);
        return "error";
      }

      const taskId = result.data.id;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return "error";
      }

      if (formData.repeat && repeatingDates.length > 0) {
        (async () => {
          for (const date of repeatingDates) {
            await AddUserTaskToSpruce(
              taskId,
              userId,
              date,
              household_id,
              formData.assign
            );
          }
          console.log(
            `Repeating schedule created (${repeatingDates.length} tasks)`
          );
        })();

        Snackbar.show({
          text: `Repeating schedule created (${repeatingDates.length} tasks).`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "green",
        });
        return "success";
      } else {
        const today = new Date().toISOString().split("T")[0];
        await AddUserTaskToSpruce(
          taskId,
          userId,
          today,
          household_id,
          formData.assign
        );

        Snackbar.show({
          text: "Task created successfully!",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "green",
        });
        return "success";
      }
    } catch (err: any) {
      Snackbar.show({
        text: err.message || "Something went wrong",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "red",
      });
      return "error";
    } finally {
      setLoading(false);
      return "success";
    }
  };

  const handleClose = async () => {
    await navigation.navigate("Home");
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="#8C50FB" />
  //     </View>
  //   );
  // }
  return (
    <MainLayout>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Header
          label="SMALL STEPS. BIG IMPACT!"
          screenName="Daily Spruce"
          icon={<MenuIcon />}
          navigation={() => {}}
        />
        <CalenderStripComponet
          navigation={navigation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          today={today}
        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={1} // hidden initially
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(index) => {
          // when index === -1 → bottom sheet is closed
          if (index === -1) {
            navigation.navigate("Home");
          }
        }}
        backgroundStyle={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          flex: 2.5,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            opacity={0.7}
            disappearsOnIndex={-1}
            pressBehavior="close"
            onPress={() => {
              navigation.navigate("Home");
            }}
          />
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flex: 1, paddingBottom: 100 }}>
            {profile && (
              <CreateTaskForm
                onSubmit={onSubmit}
                taskName={route.params ? route.params.taskName : ""}
                profile={profile}
                onSuccess={() => console.log("FORM RESET")}
                handleClose={handleClose}
              />
            )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </MainLayout>
  );
};

export default BottomSheetScreen;

const styles = StyleSheet.create({});
