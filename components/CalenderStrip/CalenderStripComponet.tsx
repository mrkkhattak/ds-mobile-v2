import { getAllSweeps } from "@/app/functions/functions";
import { useAuthStore } from "@/store/authstore";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";

interface CalenderStripComponetProps {
  navigation: any;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  today: Date;
}

const CalenderStripComponet = (props: CalenderStripComponetProps) => {
  const { navigation, selectedDate, setSelectedDate, today } = props;
  const [sweeps, setSweep] = useState<any>([]);
  const user = useAuthStore((s) => s.user);

  const customDatesStyles: any[] = [];
  const startDate = moment().subtract(30, "days"); // past 30 days
  const totalDays = 60; // 30 past + 30 future

  useFocusEffect(
    useCallback(() => {
      if (user) {
        (async () => {
          const result = await getAllSweeps(user.id);
          if ("error" in result) {
            Snackbar.show({
              text: result.error,
              duration: 2000,
              backgroundColor: "red",
            });
          } else {
            // setHouse(result);
            // setWeekValue(result.data.weekofstart);
            //  setGroupValue(result.data.groupbyweek)
            // ;

            setSweep(result.sweeps);
          }
        })();
      }
    }, [selectedDate])
  );
  // 1️⃣ Add all sweep dates with score 100
  sweeps?.forEach((s) => {
    if (s.spruce_score === 100) {
      customDatesStyles.push({
        startDate: moment(s.sweep_date, "YYYY/MM/DD"),
        dateContainerStyle: {
          backgroundColor: "rgba(141, 224, 22, 1)",
          borderRadius: 50,
          height: 40,
          width: 40,
        },
        dateNumberStyle: {
          color: "#FFFFFF",
        },
        dateNameStyle: {
          color: "#FFFFFF",
        },
      });
    }
  });

  // 2️⃣ Optionally style other dates (e.g., borders)
  for (let i = 0; i < totalDays; i++) {
    const date = startDate.clone().add(i, "days");

    // Skip if already styled in sweeps
    if (
      sweeps?.some((s) =>
        moment(s.sweep_date, "YYYY/MM/DD").isSame(date, "day")
      )
    )
      continue;

    customDatesStyles.push({
      startDate: date,
      dateContainerStyle: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        height: 40,
        width: 40,
      },
      dateNumberStyle: styles.dateNumberStyle,
      dateNameStyle: styles.dateNameStyle,
    });
  }

  return (
    <View style={{ justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
      <CalendarStrip
        key={1212}
        style={[
          Platform.OS === "android"
            ? { ...styles.calendarStrip, width: 340 }
            : styles.calendarStrip,
        ]}
        calendarHeaderStyle={styles.calendarHeaderStyle}
        dateNumberStyle={styles.dateNumberStyle}
        dateNameStyle={styles.dateNameStyle}
        highlightDateNumberStyle={{
          ...styles.highlightDateNumberStyle,
          color: "rgba(97, 15, 224, 1)",
        }}
        highlightDateNameStyle={{
          ...styles.highlightDateNameStyle,
          color: "rgba(97, 15, 224, 1)",
        }}
        highlightDateContainerStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 50,
        }}
        customDatesStyles={customDatesStyles}
        selectedDate={selectedDate ? selectedDate : today}
        onDateSelected={(date: any) => setSelectedDate(new Date(date))}
        calendarColor={"#E0CFF3"}
        iconLeft={require("../../assets/rightArrow.png")}
        iconRight={require("../../assets/Arrow_right.png")}
      />
    </View>
  );
};

export default CalenderStripComponet;

const styles = StyleSheet.create({
  calendarStrip: {
    height: 60,
    width: 370,
    borderRadius: 20,
    backgroundColor: "rgba(224, 207, 243, 0.5)",
  },
  calendarHeaderStyle: {
    color: "#610FE0",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 30,
    width: "100%",
    fontSize: 16,
    display: "none",
  },
  dateNumberStyle: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
  },
  dateNameStyle: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
  },
  highlightDateNumberStyle: {
    fontSize: 10,
    lineHeight: 12,
  },
  highlightDateNameStyle: {
    fontSize: 10,
    lineHeight: 12,
  },
  highlightDateContainerStyle: {
    borderRadius: 50,
    fontSize: 16,
  },
});
