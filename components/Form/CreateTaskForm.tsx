import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { CustomButton, SmallButton } from "@/components/ui/Buttons";

import { CustomTextInput } from "@/components/ui/CustomTextInput";

import StartIcon from "@/assets/images/icons/Group_3.svg";
import ProgressTrackerCard from "@/components/ui/ProgressTrackerCard";
import { SegmentedControl } from "@/components/ui/SegmentContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import * as yup from "yup";
/** --- Types --- */
type WeekRepeat = {
  day: string[];
  weekNumber: string;
};

type MonthRepeat = {
  dayNumber: number | undefined;
  day: string;
  month: string;
};

export type CreateTaskFormValues = {
  name: string;
  room: string;
  type: string;
  repeat: boolean;
  effort: string;
  repeatEvery?: "DAY" | "WEEK" | "MONTH";
  days?: string[]; // e.g. ["M","T"]
  week?: WeekRepeat | null;
  month?: MonthRepeat | null;
};

export const schema = yup.object({
  name: yup.string().required("Name is required"),
  room: yup.string().nullable(),
  type: yup.string().oneOf(["BOTH", "ADULT", "CHILD"]).required(),
  effort: yup.string().required("Effort is required"),
  repeat: yup.boolean().required(),
  repeatEvery: yup.string().oneOf(["DAY", "WEEK", "MONTH"]).required(),

  // DAY mode
  days: yup
    .array()
    .of(yup.string())
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "DAY",
      then: (schema) =>
        schema.min(1, "Select at least one day").required("Select days"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),

  // WEEK mode
  week: yup
    .object({
      day: yup
        .array()
        .of(yup.string())
        .min(1, "Select at least one day") // <-- require at least one day
        .required("Select days"), // <-- ensure the field exists
      weekNumber: yup.string().required("Select week number"),
    })
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "WEEK",
      then: (schema) => schema.required("Week selection required"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),
  month: yup
    .object({
      dayNumber: yup.string().required("Select day number").nullable(false),
      day: yup.string().required("Select day").nullable(false),
      month: yup.string().required("Select month").nullable(false),
    })
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "MONTH",
      then: (schema) => schema.required("Month selection required"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),
});
const CreateTaskForm = () => {
  const [open, setOpen] = useState(false);
  const [openWeek, setOpenWeek] = useState(false);
  const [openDayNumber, setOpenDayNumber] = useState(false);
  const [openWeekDay, setOpenWeekDay] = useState(false);
  const [openMonthList, setOpenMonthList] = useState(false);
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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<CreateTaskFormValues>,
    defaultValues: {
      name: "",
      room: "living",
      type: "BOTH",
      effort: "",
      repeat: false,
      repeatEvery: "DAY",
      days: [],
      week: { day: [], weekNumber: "" },
      month: { dayNumber: undefined, day: undefined, month: undefined },
    },
  });
  console.log("error", errors);
  const daysShort = ["M", "TU", "W", "TH", "F", "S", "SU"];
  const weekNumberItems = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];
  const dayNumberItems = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  }));
  const weekDays = [
    { label: "M", value: "monday" },
    { label: "TU", value: "tuesday" },
    { label: "W", value: "wednesday" },
    { label: "TH", value: "thursday" },
    { label: "F", value: "friday" },
    { label: "S", value: "saturday" },
    { label: "SU", value: "sunday" },
  ];
  const monthsList = [
    { label: "Every 1 Month", value: "1" },
    { label: "Every 2 Months", value: "2" },
    { label: "Every 3 Months", value: "3" },
    { label: "Every 4 Months", value: "4" },
    { label: "Every 6 Months", value: "6" },
    { label: "Every 12 Months", value: "12" },
  ];

  const onSubmit = (formData: CreateTaskFormValues) => {
    console.log("formData====>", formData);
  };
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
  return (
    <>
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
        <View>
          <CustomButton label="Save" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
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
            Name
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
                      height: 39,
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
            zIndex: 100, // for dropdown
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
                      fontSize: 16,
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
                    textStyle={{ fontSize: 12, paddingBottom: 15 }}
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
                              onChangeRepeatEvery(v as "DAY" | "WEEK" | "MONTH")
                            }
                            containerStyle={{
                              height: 39,
                              width: "100%",
                              marginVertical: 10,
                            }}
                            textStyle={{ fontSize: 12, paddingBottom: 15 }}
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
                                            const current = watch("days") || [];
                                            setValue(
                                              "days",
                                              current.includes(d)
                                                ? current.filter((x) => x !== d)
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
                                            weekValue?.day?.includes(d.value) ??
                                            false
                                          } // ✅ always boolean
                                          onPress={() => {
                                            const updatedDays =
                                              weekValue?.day?.includes(d.value)
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
                                          typeof callbackOrValue === "function"
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
                                        fontSize: 16,
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
                                        placeholder="Select Day"
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
                                          fontSize: 16,
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
                                        marginLeft: 10,
                                        zIndex: 3000,
                                      }}
                                    >
                                      <DropDownPicker
                                        open={openWeekDay}
                                        value={monthValue?.day ?? null}
                                        items={weekDays}
                                        setOpen={setOpenWeekDay}
                                        setValue={(callbackOrValue) => {
                                          const newVal =
                                            typeof callbackOrValue ===
                                            "function"
                                              ? callbackOrValue(monthValue?.day)
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
                                          fontSize: 16,
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
                                  <View style={{ marginTop: 15, zIndex: 3000 }}>
                                    <DropDownPicker
                                      open={openMonthList}
                                      value={monthValue?.month ?? null}
                                      items={monthsList}
                                      setOpen={setOpenMonthList}
                                      setValue={(callbackOrValue) => {
                                        const newVal =
                                          typeof callbackOrValue === "function"
                                            ? callbackOrValue(monthValue?.month)
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
                                        fontSize: 16,
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
      </View>
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
    backgroundColor: "white",
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
