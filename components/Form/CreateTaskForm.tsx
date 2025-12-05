import { fetchRooms, getProfilesByHousehold } from "@/app/functions/functions";
import { schema } from "@/app/Schema/Schema";
import { CreateTaskFormValues, Member, UserProfile } from "@/app/types/types";
import StartIcon from "@/assets/images/icons/Group_3.svg";
import {
  CustomButton,
  SecondaryButton,
  SmallButton,
} from "@/components/ui/Buttons";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import ProgressTrackerCard from "@/components/ui/ProgressTrackerCard";
import { SegmentedControl } from "@/components/ui/SegmentContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Avatar } from "react-native-paper";
import Snackbar from "react-native-snackbar";
import Memberlist from "../HomeComponents/Memberlist";

interface CreateTaskFormProps {
  onSubmit: (
    formData: CreateTaskFormValues,
    household_id: string
  ) => Promise<"success" | "error">;
  profile: UserProfile;
  onSuccess?: () => void;
  taskName?: String | undefined;
  handleClose: () => Promise<void>;
}

const CreateTaskForm = (props: CreateTaskFormProps) => {
  const { onSubmit, profile, onSuccess, taskName, handleClose } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [openWeek, setOpenWeek] = useState(false);
  const [openDayNumber, setOpenDayNumber] = useState(false);
  const [openWeekDay, setOpenWeekDay] = useState(false);
  const [openMonthList, setOpenMonthList] = useState(false);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [members, setMember] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | undefined>(
    undefined
  );
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<CreateTaskFormValues>,
    defaultValues: {
      name: `${taskName}`,
      room: undefined,
      type: "BOTH",
      effort: "",
      repeat: false,
      repeatEvery: "DAY",
      days: [],
      week: { day: [], weekNumber: "" },
      month: { dayNumber: undefined, day: undefined, month: undefined },
    },
  });

  const daysShort = ["M", "TU", "W", "TH", "F", "S", "SU"];
  const weekNumberItems = [
    { label: "1 weeks", value: "1" },
    { label: "2 weeks", value: "2" },
    { label: "3 weeks", value: "3" },
    { label: "4 weeks", value: "4" },
  ];
  // const dayNumberItems = Array.from({ length: 7 }, (_, i) => ({
  //   label: String(i + 1),
  //   value: i + 1,
  // }));
  const dayNumberItems = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },
    { label: "Sixth", value: 6 },
    { label: "Seventh", value: 7 },
  ];
  const weekDays = [
    { label: "M", value: "monday" },
    { label: "TU", value: "tuesday" },
    { label: "W", value: "wednesday" },
    { label: "TH", value: "thursday" },
    { label: "F", value: "friday" },
    { label: "S", value: "saturday" },
    { label: "SU", value: "sunday" },
  ];

  const weekDaysList = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];
  const monthsList = [
    { label: "Every 1 Month", value: "1" },
    { label: "Every 2 Months", value: "2" },
    { label: "Every 3 Months", value: "3" },
    { label: "Every 4 Months", value: "4" },
    { label: "Every 6 Months", value: "6" },
    { label: "Every 12 Months", value: "12" },
  ];

  const repeatEveryField = watch("repeatEvery");

  useEffect(() => {
    if (repeatEveryField === "DAY") {
      setValue("week", { day: [], weekNumber: "" });
      setValue("month", { dayNumber: undefined, day: "", month: "" });
    } else if (repeatEveryField === "WEEK") {
      setValue("days", []);
      setValue("month", { dayNumber: undefined, day: "", month: "" });
    } else if (repeatEveryField === "MONTH") {
      setValue("days", []);
      setValue("week", { day: [], weekNumber: "" });
    }
  }, [repeatEveryField]);

  const handleInternalSubmit = async (
    data: CreateTaskFormValues,
    household_id: string
  ) => {
    const result = await onSubmit(data, household_id);
    console.log("result", result);
    if (result === "success") {
      reset({
        name: "",
        room: watch("room"),
        type: "BOTH",
        effort: watch("effort"),
        repeat: watch("repeat"),
        repeatEvery: watch("repeatEvery"),
        days: watch("days"),
        month: watch("month"),
        week: watch("week"),
        assign: watch("assign"),
      });
      onSuccess?.();
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let interval: NodeJS.Timeout;
      setSelectedMember(null);
      setCurrentMember(undefined);
      const fetchProfiles = async () => {
        if (!profile) return;

        try {
          const result = await getProfilesByHousehold(profile.household_id);
          if (!isActive) return;

          if (result.data) {
            setMember(result.data);
          }

          if (result.error) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        } catch (error: any) {
          if (isActive) {
            Snackbar.show({
              text: error.message,
              duration: 2000,
              backgroundColor: "red",
            });
          }
        }
      };

      // Initial call
      fetchProfiles();

      // Poll every 5 seconds
      interval = setInterval(fetchProfiles, 5000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [profile])
  );

  useEffect(() => {
    const selectedMemberObj = members.find(
      (member) => member.user_id === watch("assign")
    );
    setCurrentMember(selectedMemberObj);
  }, [watch("assign")]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const result = await fetchRooms();
        if ("error" in result) {
          Snackbar.show({
            text: result.error,
            duration: 2000,
            backgroundColor: "red",
          });
        } else {
          setItems(result);
        }
      })();
    }, [profile])
  );

  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 15,
            borderBottomWidth: 0.2,
            marginHorizontal: 5,
            borderColor: "#000000",
          }}
        >
          <Text
            style={{
              fontFamily: "inter",
              fontWeight: "300",
              fontSize: 20,
              lineHeight: 26,
              paddingLeft: 30,
            }}
          >
            New Task
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomButton
              label="Save"
              onPress={handleSubmit((data) => {
                handleInternalSubmit(data, profile.household_id);
              })}
            />
            <CustomButton
              label="Close"
              onPress={handleClose}
              viewStyle={{ marginLeft: 5 }}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 16,
          }}
        >
          {/* Row 1: Name + Input */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "300",
                fontSize: 20,
                lineHeight: 22,
                width: 80, // fixed width to align with other labels
              }}
            >
              NAME
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Controller
                control={control}
                name="name"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={{ flex: 1 }}>
                    <CustomTextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter task name"
                      containerStyle={{
                        borderColor: error ? "red" : "#ccc",
                        backgroundColor: "#fff",
                        flex: 1,
                        height: 49,
                        borderRadius: 10,
                        paddingHorizontal: 16,
                      }}
                      inputStyle={{
                        fontSize: 16,
                        color: "#333",
                      }}
                    />
                    {error && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: "Inter",
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <StartIcon style={{ marginLeft: 10 }} />
            </View>
          </View>

          {/* Row 2: ROOM + Dropdown */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              zIndex: 100,
            }}
          >
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "300",
                fontSize: 20,
                lineHeight: 22,
                width: 80,
              }}
            >
              ROOM
            </Text>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="room"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View style={{ zIndex: 3000 }}>
                    <DropDownPicker
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={(callbackOrValue) => {
                        const newVal =
                          typeof callbackOrValue === "function"
                            ? callbackOrValue(value)
                            : callbackOrValue;
                        onChange(newVal);
                      }}
                      setItems={setItems}
                      placeholder="Select Room"
                      style={{
                        borderColor: error ? "red" : "#ccc",
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        height: 39,
                        paddingHorizontal: 16,
                      }}
                      dropDownContainerStyle={{
                        borderColor: "#ccc",
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        position: "absolute",
                        top: 45,
                        zIndex: 1000,
                      }}
                      textStyle={{
                        fontSize: 12,
                        color: "#333",
                        fontFamily: "Inter",
                      }}
                      zIndex={3000}
                      zIndexInverse={1000}
                    />

                    {error && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 10,
                          fontFamily: "Inter",
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Row 3: TYPE + Segmented Control */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "300",
                fontSize: 20,
                lineHeight: 22,
                width: 80,
              }}
            >
              TYPE
            </Text>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="type"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <View style={{ width: "100%" }}>
                    <SegmentedControl
                      values={["ADULT", "CHILD", "BOTH"]}
                      selectedValue={value}
                      onChange={onChange}
                      containerStyle={{
                        height: 39,
                        width: "100%",
                        borderColor: error ? "red" : "#ccc",
                      }}
                      textStyle={{
                        fontSize: 12,
                      }}
                    />

                    {error && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: "Inter",
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "300",
                fontSize: 20,
                lineHeight: 22,
                width: 80,
              }}
            >
              EFFORT
            </Text>

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="effort"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <View>
                    <ProgressTrackerCard
                      progress={Number(value)}
                      onProgressChange={onChange}
                    />

                    {error && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: "Inter",
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="repeat"
            render={({
              field: { value: repeatFieldValue, onChange: onChangeRepeat },
            }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={styles.label}>REPEAT</Text>

                <View style={styles.repeatBox}>
                  <Switch
                    trackColor={{ false: "#ccc", true: "#4f46e5" }}
                    thumbColor={repeatFieldValue ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#ccc"
                    onValueChange={onChangeRepeat}
                    value={repeatFieldValue}
                  />

                  {repeatFieldValue && (
                    <>
                      <Controller
                        control={control}
                        name="repeatEvery"
                        render={({
                          field: {
                            value: repeatEveryField,
                            onChange: onChangeRepeatEvery,
                          },
                        }) => (
                          <View style={{ padding: 10 }}>
                            <Text style={styles.repeatTitle}>REPEAT EVERY</Text>

                            <SegmentedControl
                              values={["DAY", "WEEK", "MONTH"]}
                              selectedValue={repeatEveryField || "DAY"}
                              onChange={(v) =>
                                onChangeRepeatEvery(
                                  v as "DAY" | "WEEK" | "MONTH"
                                )
                              }
                              containerStyle={{
                                width: "100%",
                                marginVertical: 10,
                              }}
                              textStyle={{ fontSize: 12 }}
                            />

                            {/* === DAY Mode === */}
                            {repeatEveryField === "DAY" && (
                              <Controller
                                control={control}
                                name="days"
                                render={() => {
                                  const selectedDays = watch("days") || [];
                                  return (
                                    <>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          gap: 8,
                                          justifyContent: "center",
                                        }}
                                      >
                                        {daysShort.map((d) => (
                                          <SmallButton
                                            key={d}
                                            label={d}
                                            selected={selectedDays.includes(d)}
                                            onPress={() => {
                                              const current =
                                                watch("days") || [];
                                              setValue(
                                                "days",
                                                current.includes(d)
                                                  ? current.filter(
                                                      (x) => x !== d
                                                    )
                                                  : [...current, d],
                                                {
                                                  shouldValidate: true,
                                                  shouldDirty: true,
                                                }
                                              );
                                            }}
                                          />
                                        ))}
                                      </View>
                                      {errors.days && (
                                        <Text style={styles.error}>
                                          {(errors.days as any)?.message}
                                        </Text>
                                      )}
                                    </>
                                  );
                                }}
                              />
                            )}

                            {/* === WEEK Mode === */}
                            {repeatEveryField === "WEEK" && (
                              <Controller
                                control={control}
                                name="week"
                                render={({
                                  field: {
                                    value: weekValue = {
                                      day: [],
                                      weekNumber: "",
                                    },
                                    onChange: onChangeWeek,
                                  },
                                }) => (
                                  <>
                                    {/* Day Buttons */}
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        gap: 8,
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {weekDays.map((d) => {
                                        const isSelected =
                                          weekValue?.day?.includes(d.value);
                                        return (
                                          <SmallButton
                                            key={d.value}
                                            label={d.label}
                                            selected={
                                              weekValue?.day?.includes(
                                                d.value
                                              ) ?? false
                                            } // ✅ always boolean
                                            onPress={() => {
                                              const updatedDays =
                                                weekValue?.day?.includes(
                                                  d.value
                                                )
                                                  ? weekValue.day.filter(
                                                      (day) => day !== d.value
                                                    )
                                                  : [
                                                      ...(weekValue?.day || []),
                                                      d.value,
                                                    ];

                                              onChangeWeek({
                                                ...weekValue,
                                                day: updatedDays,
                                              });
                                            }}
                                          />
                                        );
                                      })}
                                    </View>

                                    {/* Week Number Dropdown */}
                                    <View style={{ marginTop: 10 }}>
                                      <DropDownPicker
                                        open={openWeek}
                                        value={weekValue?.weekNumber ?? null}
                                        items={weekNumberItems}
                                        setOpen={setOpenWeek}
                                        setValue={(callbackOrValue) => {
                                          const newVal =
                                            typeof callbackOrValue ===
                                            "function"
                                              ? callbackOrValue(
                                                  weekValue?.weekNumber
                                                )
                                              : callbackOrValue;
                                          onChangeWeek({
                                            ...weekValue,
                                            weekNumber: newVal as string,
                                          });
                                        }}
                                        setItems={() => {}}
                                        placeholder="Select Week"
                                        dropDownDirection="TOP"
                                        listMode="SCROLLVIEW"
                                        style={{
                                          borderColor: "#ccc",
                                          backgroundColor: "#fff",
                                          borderRadius: 10,
                                          height: 40,
                                          paddingHorizontal: 16,
                                          width: 200,
                                          marginTop: 10,
                                        }}
                                        dropDownContainerStyle={{
                                          borderColor: "#ccc",
                                          backgroundColor: "#fff",
                                          borderRadius: 10,
                                        }}
                                        textStyle={{
                                          fontSize: 12,
                                          fontWeight: "semibold",
                                          color: "#9864E1",
                                          fontFamily: "Inter",
                                        }}
                                        zIndex={3000}
                                        zIndexInverse={1000}
                                      />
                                    </View>

                                    {/* Validation Error */}
                                    <View
                                      style={{
                                        marginLeft: 5,
                                        marginTop: 10,
                                      }}
                                    >
                                      {(errors.week as any)?.day && (
                                        <Text style={styles.error}>
                                          {(errors.week as any)?.day?.message}
                                        </Text>
                                      )}
                                      {(errors.week as any)?.weekNumber && (
                                        <Text style={styles.error}>
                                          {
                                            (errors.week as any)?.weekNumber
                                              ?.message
                                          }
                                        </Text>
                                      )}
                                    </View>
                                  </>
                                )}
                              />
                            )}

                            {/* === MONTH Mode === */}
                            {repeatEveryField === "MONTH" && (
                              <Controller
                                control={control}
                                name="month"
                                render={({
                                  field: {
                                    value: monthValue = {
                                      dayNumber: 1,
                                      day: "",
                                      month: "",
                                    },
                                    onChange: onChangeMonth,
                                  },
                                }) => (
                                  <View style={{ zIndex: 3000 }}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      {/* dayNumber */}
                                      <View style={{ flex: 1, zIndex: 3000 }}>
                                        <DropDownPicker
                                          open={openDayNumber}
                                          value={monthValue?.dayNumber ?? null}
                                          items={dayNumberItems}
                                          setOpen={setOpenDayNumber}
                                          setValue={(callbackOrValue) => {
                                            const newVal =
                                              typeof callbackOrValue ===
                                              "function"
                                                ? callbackOrValue(
                                                    monthValue?.dayNumber
                                                  )
                                                : callbackOrValue;
                                            onChangeMonth({
                                              ...monthValue,
                                              dayNumber: Number(newVal),
                                            });
                                          }}
                                          setItems={() => {}}
                                          placeholder="Day"
                                          dropDownDirection="TOP"
                                          listMode="SCROLLVIEW"
                                          style={{
                                            borderColor: "#ccc",
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            height: 40,
                                            paddingHorizontal: 16,
                                            width: 100,
                                          }}
                                          dropDownContainerStyle={{
                                            borderColor: "#ccc",
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            position: "absolute",
                                            bottom: 45,
                                            width: 110,
                                          }}
                                          textStyle={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: "#9864E1",
                                            fontFamily: "Inter",
                                          }}
                                          zIndex={4000}
                                          zIndexInverse={1000}
                                        />
                                      </View>

                                      {/* weekday */}
                                      <View
                                        style={{
                                          flex: 2,
                                          marginLeft: 40,
                                          zIndex: 3000,
                                        }}
                                      >
                                        <DropDownPicker
                                          open={openWeekDay}
                                          value={monthValue?.day ?? null}
                                          items={weekDaysList}
                                          setOpen={setOpenWeekDay}
                                          setValue={(callbackOrValue) => {
                                            const newVal =
                                              typeof callbackOrValue ===
                                              "function"
                                                ? callbackOrValue(
                                                    monthValue?.day
                                                  )
                                                : callbackOrValue;
                                            onChangeMonth({
                                              ...monthValue,
                                              day: String(newVal),
                                            });
                                          }}
                                          setItems={() => {}}
                                          placeholder="Select Weekday"
                                          dropDownDirection="TOP"
                                          listMode="SCROLLVIEW"
                                          style={{
                                            borderColor: "#ccc",
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            height: 40,
                                            paddingHorizontal: 16,
                                            marginHorizontal: 10,
                                          }}
                                          dropDownContainerStyle={{
                                            borderColor: "#ccc",
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            position: "absolute",
                                            bottom: 45,
                                            width: "100%",
                                          }}
                                          textStyle={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: "#9864E1",
                                            fontFamily: "Inter",
                                          }}
                                          zIndex={3000}
                                          zIndexInverse={1000}
                                        />
                                      </View>
                                    </View>

                                    {/* month frequency */}
                                    <View
                                      style={{ marginTop: 15, zIndex: 3000 }}
                                    >
                                      <DropDownPicker
                                        open={openMonthList}
                                        value={monthValue?.month ?? null}
                                        items={monthsList}
                                        setOpen={setOpenMonthList}
                                        setValue={(callbackOrValue) => {
                                          const newVal =
                                            typeof callbackOrValue ===
                                            "function"
                                              ? callbackOrValue(
                                                  monthValue?.month
                                                )
                                              : callbackOrValue;
                                          onChangeMonth({
                                            ...monthValue,
                                            month: String(newVal),
                                          });
                                        }}
                                        setItems={() => {}}
                                        placeholder="Select Month"
                                        dropDownDirection="TOP"
                                        listMode="SCROLLVIEW"
                                        style={{
                                          borderColor: "#ccc",
                                          backgroundColor: "#fff",
                                          borderRadius: 10,
                                          height: 40,
                                          paddingHorizontal: 16,
                                        }}
                                        dropDownContainerStyle={{
                                          borderColor: "#ccc",
                                          backgroundColor: "#fff",
                                          borderRadius: 10,
                                          position: "absolute",
                                          bottom: 45,
                                          width: "100%",
                                        }}
                                        textStyle={{
                                          fontSize: 12,
                                          fontWeight: "600",
                                          color: "#9864E1",
                                          fontFamily: "Inter",
                                        }}
                                        zIndex={2000}
                                        zIndexInverse={1000}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        marginLeft: 5,
                                        marginTop: 10,
                                      }}
                                    >
                                      {errors.month && (
                                        <Text style={styles.error}>
                                          {errors.month.dayNumber?.message}
                                        </Text>
                                      )}
                                    </View>
                                    <View
                                      style={{
                                        marginLeft: 5,
                                        marginTop: 10,
                                      }}
                                    >
                                      {errors.month && (
                                        <Text style={styles.error}>
                                          {errors.month.day?.message}
                                        </Text>
                                      )}
                                    </View>

                                    <View
                                      style={{
                                        marginLeft: 5,
                                        marginTop: 10,
                                      }}
                                    >
                                      {errors.month && (
                                        <Text style={styles.error}>
                                          {errors.month.month?.message}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                )}
                              />
                            )}
                          </View>
                        )}
                      />
                    </>
                  )}
                </View>
              </View>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "inter",
                fontWeight: "300",
                fontSize: 20,
                lineHeight: 22,
                width: 80,
              }}
            >
              ASSIGN
            </Text>
            {watch("assign") && currentMember ? (
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                }}
              >
                <Avatar.Text
                  size={44}
                  label={`${currentMember?.first_name} ${currentMember?.last_name}`
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                  style={{
                    backgroundColor: "#6915E0",
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                }}
              >
                <Image
                  source={require("../../assets/images/addUser.png")}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 17,
                    marginLeft: 4,
                  }}
                />
              </TouchableOpacity>
            )}

            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="assign"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <View>
                    <Modal
                      visible={openModal}
                      transparent
                      animationType="fade"
                      onRequestClose={() => setOpenModal(false)}
                    >
                      {/* Background press closes modal */}
                      <Pressable
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(0,0,0,0.4)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => setOpenModal(false)}
                      >
                        {/* Inner area should NOT close modal */}
                        <Pressable
                          style={{
                            width: "80%",
                            backgroundColor: "#F7F6FB",
                            padding: 20,
                            borderRadius: 12,
                          }}
                          onPress={(e) => e.stopPropagation()}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "600",
                              marginBottom: 16,
                            }}
                          >
                            Add User
                          </Text>

                          <ScrollView
                            style={{ paddingBottom: 20, maxHeight: 200 }}
                          >
                            {members?.map((member: Member) => {
                              const selected =
                                selectedMember === member.user_id;
                              const name = `${member.first_name} ${member.last_name}`;
                              const role = member.family_role;
                              return (
                                <Memberlist
                                  member={member}
                                  setSelectedMember={setSelectedMember}
                                  selected={selected}
                                  name={name}
                                  role={role}
                                />
                              );
                            })}
                          </ScrollView>
                          {selectedMember && (
                            <SecondaryButton
                              label={"Add User"}
                              onPress={() => {
                                onChange(selectedMember);
                                setOpenModal(false);
                              }}
                              buttonStyle={{
                                backgroundColor: "#6915E0",
                                paddingVertical: 12,
                                borderRadius: 10,
                                width: "100%",
                              }}
                            />
                          )}
                        </Pressable>
                      </Pressable>
                    </Modal>

                    {error && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 4,
                          fontFamily: "Inter",
                        }}
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default CreateTaskForm;

const styles = StyleSheet.create({
  label: {
    fontFamily: "inter",
    fontWeight: "300",
    fontSize: 20,
    lineHeight: 22,
    width: 80,
  },
  repeatBox: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",

    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: "#42404E",
    padding: 10,
  },
  repeatTitle: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },
  dropdown: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 16,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  error: {
    color: "red",
    marginTop: 6,
    textAlign: "left",
  },
});
